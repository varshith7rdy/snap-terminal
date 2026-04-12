import fs from "fs"
import os from "node:os"
import path from "path";

let historyCmds = []


export function getHistory(){

    const PATH = path.join(os.homedir(), ".bash_history");

    try{

        const data = fs.readFileSync(PATH, "utf-8")
        historyCmds = data.split("\n").map(cmd => cmd.trim())
    }
    catch(err){
        console.log("Error occured while loading history");
        return []
    }
    // should return only unique
    historyCmds = [...new Set(historyCmds)]
    return historyCmds.slice(0, 20) // send last 20 cmds
}