'use strict';

const apiai = require('apiai');
const chalk = require('chalk');
const bot = apiai("8ff23abd12394008a78b77f1c218dae3");
const winston = require('winston');


class ifengine {

	createGame() {
		return new Promise((resolve, reject) => {
			this.ask_num = 0
			this.curr_mess = ""
			this.game = require('./gamedata/main.json')
			this.game_data = {
				current_room: {},
				inventory: []
			};

			this.logger = winston.createLogger({
				level: 'info',
				format: winston.format.json(),
				transports: [
					new winston.transports.Console({
						name: 'ifenginejs',
						level: 'debug',
						colorize: 'all',
						timestamp: new Date().toLocaleTimeString()
					}),
					new winston.transports.File({
						filename: 'error.log',
						level: 'error'
					}),
					new winston.transports.File({
						filename: 'combined.log'
					})
				]
			});
			this.enterRoom(this.game.start_room)
			this.logger.debug("New game engine created")
			resolve(this.curr_mess)
		})
	}

	actionGoto(exit_name) {
		var found = false
		this.logger.info("exit_name:" + exit_name)
		for (var ex of this.game_data.current_room.exits) {
			if (ex.name == exit_name) {
				found = true
				this.enterRoom(ex.goto)
			}
		}
		if (!found) {
			this.curr_mess = this.curr_mess + "\n Questa opzione non � diponibile"
		}
	}

	enterRoom(roomname) {
		this.logger.info(`Loading new room : ${roomname}`)
		this.game_data.current_room = require('./gamedata/rooms/' + roomname + '.json')
		this.curr_mess = this.curr_mess + "\n" + this.game_data.current_room.title + "\n" + this.game_data.current_room.description
	}


	actionTake(object_name) {
		var found = false
		this.logger.info("object_name:" + object_name)
		for (var ex of this.game_data.current_room.items) {
			if (ex.name.toLowerCase() == object_name) {
				found = true
				this.takeobject(ex)
			}
		}
		if (!found) {
			this.curr_mess = this.curr_mess + "\n Questa opzione non � diponibile"
		}
	}

	actionInventory() {
		this.logger.debug(this.game_data.inventory)
		for (var obj of this.game_data.inventory) {
			this.curr_mess = this.curr_mess + "\n" + obj.name + "\n"
		}
	}

	takeobject(object) {
		if (object.takable) {
			this.game_data.inventory.push(object)
			this.logger.debug(this.game_data.inventory)
		}
		this.curr_mess = this.curr_mess + "\n" + object.take_text
	}

	processInput(input) {
		return new Promise((resolve, reject) => {
			this.curr_mess = ""
			switch (input) {
				case "inventory":
					this.actionInventory()
					resolve(this.curr_mess)
					break
				case "":
					resolve(this.curr_mess)
					break
				case "exit":
					process.exit()
					break
				default:
					var request = bot.textRequest(input, {
						sessionId: this.ask_num
					});
					request.on('response', (response) => {
						this.curr_mess = this.curr_mess + "\n" + response.result.fulfillment.speech
						if (!response.result.actionIncomplete) {
							this.ask_num++
								switch (response.result.action) {
									case 'goto':
										const room_name = response.result.parameters.room_name
										this.logger.info("goto action => " + room_name)
										this.actionGoto(room_name)
										break
									case 'take':
										const object_name = response.result.parameters.object_name
										this.logger.info("take action => " + object_name)
										this.actionTake(object_name)
										break
									case 'inspect':
										break
									default:
										break
								}
						}
						this.logger.debug("Newmess: " + this.curr_mess)
						resolve(this.curr_mess)
					});
					request.on('error', function(error) {
						reject(error)
					});
					request.end();
			} // End switch input
		}) //End promise
	}

}

module.exports = ifengine
