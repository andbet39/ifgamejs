'use strict';

const readline = require('readline');
const apiai = require('apiai');
const chalk = require('chalk');
const winston = require('winston')

const logger = winston.createLogger({
    transports: [
        new (winston.transports.Console)({
            colorize: true,
            level: 'debug'
        })
    ]
});

logger.level = 'debug';

const bot = apiai("8ff23abd12394008a78b77f1c218dae3");

var ask_num = 0;
var curr_mess = "";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const game_data = {
    current_room: {}
};

const game = require('./gamedata/main.json')

enterRoom('MineEntrance')
reply();
ask();



function ask()
{
    rl.question("You: ", function (message) {
        logger.debug(message)
        processInput(message)
        
    });
}

function enterRoom(roomname) {

    game_data.current_room = require('./gamedata/rooms/' + roomname + '.json')

    curr_mess = curr_mess + "\n" +  game_data.current_room.title + "\n" + game_data.current_room.description 
}



function processInput(input) {

    var request = bot.textRequest(input, {
        sessionId: ask_num
    });

    
    request.on('response', function (response) {

        curr_mess = curr_mess + "\n" + response.result.fulfillment.speech 

        if (!response.result.actionIncomplete) {
      
            ask_num++
            switch (response.result.action) {
                case 'goto':
                    const room_name = response.result.parameters.room_name
                    action_goto(room_name)
                    break
                case 'inspect':

                    break
                default:
                    break
            }
        }

        reply()
        ask()
    
    });

    request.on('error', function (error) {
        console.log(error);
    });

    request.end();
}


function action_goto(exit_name)
{
    var found = false
    logger.debug("exit_name:" + exit_name)

    for (var ex of game_data.current_room.exits)
    {
        if (ex.name == exit_name) {
            found = true
            enterRoom(ex.goto)
        }
    }
        

    if (!found) {
        curr_mess = curr_mess + "\n Questa opzione non è diponibile"
    }
}

function reply() {
    console.log(curr_mess)
    curr_mess=""
}