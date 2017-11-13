'use strict';

const readline = require('readline');
const apiai = require('apiai');
const chalk = require('chalk');

const bot = apiai("8ff23abd12394008a78b77f1c218dae3");


const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const game_data = {
    current_room: {}
};

const game = require('./gamedata/main.json')

enterRoom('MineEntrance')
ask();


function ask()
{
    rl.question("You: ", function (message) {
        console.log(message)
        processInput(message)
    });
}

function enterRoom(roomname) {

    game_data.current_room = require('./gamedata/rooms/' + game.start_room + '.json')
    console.log(game_data.current_room.title)
    console.log(game_data.current_room.description)

}

function action_goto(exit_name) {
    var found = false
    console.log("exit_name:" + exit_name)
    game_data.current_room.exits.each((ex) => {
        if (ex.name == exit_name) {
            found=true
            enterRoom(ex.goto)
            break
        }
    })

    if (!found) {
        console.log("Questa opzione non è diponibile")
    }


}

function processInput(input) {
    console.log(input)
    var request = bot.textRequest(input, {
        sessionId: '11234543'
    });

    request.on('response', function (response) {

        console.log(chalk.red.bold('Bot: ' + response.result.fulfillment.speech))
        if (response.result.actionIncomplete) {
            ask()
        } else {
            switch (response.result.action) {
                case 'goto':
                    action_goto(response.result.parameters.room_name)
                    break
                default:
                    break
            }
            ask()                
        }
    });

    request.on('error', function (error) {
        console.log(error);
        ask()
    });

    request.end();
}