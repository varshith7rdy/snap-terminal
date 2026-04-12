import path from "path"
import fs from "node:fs"
import chalk from "chalk";


export function setContext(dir, context) {

    const filePath = path.join(dir, "CONTEXT.md");

    try {
        
        const data = fs.readFileSync(filePath, "utf8");
        context = data;
        console.log(context);
        process.stdout.write(`\n${chalk.blue.bold(" Context Loaded:")} ${filePath}\n`);
    } catch (err) {

        console.log(err);
        
        const template = `# Project Context\n\nBe efficient.`;
        
        try {

            fs.writeFileSync(filePath, template, "utf-8");
            context = template;
            process.stdout.write(`\n${chalk.yellow("Initialized context at:")} ${filePath}\n`);

        } catch (writeErr) {
          console.log(writeErr);
          process.stdout.write(`\n${chalk.red("Could not create context in this directory.")}\n`);
        }
    }
    return context
}
