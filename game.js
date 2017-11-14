'use strict';

const readline = require('readline')
const ifengine = require('./ifengine')
const chalk  = require ('chalk')
const game  = new ifengine()
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

main()

function main()
{
    console.log("Main function")
    game.createGame().then((reply)=>{
        console.log(reply)
        ask()
    }).catch((error)=>{
      console.log(chalk.red(error))
    })
}

function ask() {
    rl.question("You: ",  (message) => {
      //  console.log(chalk.bold.blue(message))
        game.processInput(message).then((reply)=>{
            console.log(reply)
            ask()
        }).catch((error)=>{
          console.log(chalk.red(error))
        })
    });
}
