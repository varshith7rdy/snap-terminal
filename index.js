import pty from "node-pty"
import os from "os"
import chalk from "chalk";
import fs from "node:fs"
import { log } from "node:console";
import path from "path"
import { fileURLToPath } from "url"
import { setContext } from "./setContext.js"
import { retrieveCmds } from "./retrieveCmds.js"
import { getHistory } from "./bash_history.js"


const shell = os.platform() === 'win32' ? 'powershell.exe' : 'bash';
let __filename = fileURLToPath(import.meta.url)
let __dirname = path.dirname(__filename);
let lastPath = process.cwd();
let context = ""
let ghostTimeout = null;
let ghostText = ""; 
let parsedCommands = []
let historyCmds = ["npm init", ]
// for auto-completion
let inputBuffer = ""


// Pseudo terminal
let ptyProcess = pty.spawn(shell, [], {
  name: 'xterm-256color',
  cols: process.stdout.columns || 80,
  rows: process.stdout.rows || 24,
  cwd: process.cwd(),
  env: { ...process.env, PS1: '\x1b[32mSnap-Shell:\x1b[34m\\w\x1b[0m$ ' }
});


// Initialize
context = setContext(process.cwd());
parsedCommands = retrieveCmds(context)
historyCmds = getHistory()
for(let i of historyCmds) parsedCommands.push(i);
console.log(parsedCommands)
console.log(typeof parsedCommands);


ptyProcess.onData((data) => {
  
  // native OSC 7 path for context change
  const osc7Match = data.match(/\x1b\]7;file:\/\/[^\/]+(\/[^\x1b\x07\\]+)/);
  
  if (osc7Match) {
    
    const newPath = path.normalize(decodeURI(osc7Match[1]).trim());

    if (newPath !== lastPath) {
      lastPath = newPath;
      // update the new context
      context = setContext(newPath);
      parsedCommands = retrieveCmds(context) + historyCmds

    }
  }
  process.stdout.write(data);
});


// Raw Mode Input
process.stdin.setRawMode(true);
process.stdin.resume();
process.stdin.setEncoding('utf8');


process.stdin.on('data', (key) => {
  
    if (key === '\u0003') { 
      // ctrl + c
      console.log("\n--- Closing Snap-Term ---");
      process.exit(); 
    }
    
    // handling the tab
    if(key == '\t'){
      if(ghostText.length > 0){
        inputBuffer += ghostText
        ptyProcess.write(ghostText)
        
        ghostText = ""
      }
      return; 
    }
    // if pressed any other key should be cleared
    
    if (key === '\r') {
      // When Entered
      inputBuffer = ""; 
    } else if (key === '\u007f') { 
      // handle backspace
      inputBuffer = inputBuffer.slice(0, -1); // remove last char
      ghostText = ""
      process.stdout.write('\x1b[K'); 
    } else if (key.startsWith('\x1b')) {
      // arrow up
      inputBuffer = "";
    } else {
      inputBuffer += key;
    }
    
    ghostText = "";
    ptyProcess.write(key);
    
    // here should handle the pause and ghost the text
    ghostTimeout = clearTimeout();
    ghostTimeout = setTimeout(()=>{

      // to clear the gray after each key
      process.stdout.write('\x1b[K'); 
      // autocompletion
      /* 
         1. Find local commands
         2. If not found any call AI API
         */
     
      if(inputBuffer.length > 0) {
        
        // loop through the cmds
        let match = ""
        // match = parsedCommands.find(cmd => cmd.startsWith(inputBuffer));
        // inputBuffer = inputBuffer.trim()
        for (let i of parsedCommands) {
            if(i.startsWith(inputBuffer)) { match = i; break; }
        }
        // console.log(match);
        
        if (match) {
          
          ghostText = match.slice(inputBuffer.length);
          
          if (ghostText.length > 0) {
            // Print to the screen, visibilty less
            process.stdout.write(`\x1b[s\x1b[90m${ghostText}\x1b[0m\x1b[u`);
          }
        }
        // if not found any match should call the api
      }
  },
  50); // 50ms
  
});


ptyProcess.onExit(() => {
  console.log("Shell exited.");
  process.exit();
});

// Terminal Window Resize
process.stdout.on('resize', () => {
  ptyProcess.resize(process.stdout.columns, process.stdout.rows);
});
