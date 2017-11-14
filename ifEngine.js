'use strict';

const apiai = require('apiai');
const chalk = require('chalk');
const winston = require('winston')
const bot = apiai("8ff23abd12394008a78b77f1c218dae3");






class IfEngine {


    constructor() {
        this.ask_num = 0
        this.curr_mess = ""
        this.game = require('./gamedata/main.json')
        this game_data = {
            current_room: {}
        };

        this.logger = winston.createLogger({
            transports: [
                new (winston.transports.Console)({
                    colorize: true,
                    level: 'debug'
                })
            ]
        });
    }
    

    enterRoom(roomname) {

        game_data.current_room = require('./gamedata/rooms/' + roomname + '.json')

        curr_mess = curr_mess + "\n" + game_data.current_room.title + "\n" + game_data.current_room.description
    }



    processInput(input) {

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


    action_goto(exit_name) {
        var found = false
        logger.debug("exit_name:" + exit_name)

        for (var ex of game_data.current_room.exits) {
            if (ex.name == exit_name) {
                found = true
                enterRoom(ex.goto)
            }
        }


        if (!found) {
            curr_mess = curr_mess + "\n Questa opzione non è diponibile"
        }
    }

    reply() {
        console.log(curr_mess)
        curr_mess = ""
    }
}

module.exports.Engine
