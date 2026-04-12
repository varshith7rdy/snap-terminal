import { log } from "node:console";
import fs from "node:fs"
import { type } from "node:os";

let list = []

// const data = fs.readFileSync("CONTEXT.md", "utf-8")

export function retrieveCmds(data){
    for(let i = 0; i < data.length; i++){
        if(data[i] == '@' && i + 1 < data.length && data[i + 1] == 'c'){
            // in the commands section
            let cmd = "";
            for(let j = i + 10; ; j++){
                
                if(data[j] == '@') {
                    // list.push(cmd)
                    break;
                }
                if(data[j] == '\n') {
                    list.push(cmd)
                    cmd = ""
                    continue
                }
                cmd += data[j];
            }
            break;
        }
    }
    
    // console.log(list, "from rc.js");
    return list
}