const { REST, Routes } = require('discord.js');
const Discord = require('discord.js')
const mysql = require('mysql');
const path = require('path')
const fs = require('fs') 
const { groundChannel, createOrFindMessage } = require('../utils/channelsUtils.js');
const InfoBook = require('../classes/books/InfoBook.js');
const CommandBook = require('../classes/books/CommandBook.js')
const { GatewayIntentBits, ChannelType  } = require('discord.js')
const Timer = require('../classes/Timer.js');
const { inherits } = require('util')

class Morgan extends Discord.Client {
    constructor(){
        super({
            intents: [
                GatewayIntentBits.Guilds,
				GatewayIntentBits.GuildMembers,
				GatewayIntentBits.GuildMessages,
				GatewayIntentBits.GuildMessageReactions,
				GatewayIntentBits.GuildVoiceStates,
				GatewayIntentBits.DirectMessages,
				GatewayIntentBits.GuildScheduledEvents,
			],
			allowedMentions: {
				parse: ["users"]
            }
        })

        this.config = require('../config.json').general;

        this.InfoBook = [];
		this.privat_voices = [];
		this.arithmeticExpression;
    }

    async init() {
		this.guild = await this.guilds.fetch(this.config.guild);
		console.log(`Кількість емодзі: ${this.guild.emojis.cache.size}`)
		this.owner = await this.guild.members.fetch(this.config.owner);
		
		await this.dbConnection();
		
		this.connection.query(`CREATE TABLE IF NOT EXISTS key_channels ( 
			id VARCHAR(20) NOT NULL ,
			type VARCHAR(50) ,
			PRIMARY KEY (ID)
			)`
		)


		
		await this.loadCommands();
		await this.loadEvents();
		await this.initPrimaryChannels();
        await this.slashCommands_reload()
		//await this.loadInfoBooks();
		
		//await this.regTimers();
		//await this.regChannels();

		//key channels table init
		

		let in_voice_counter = setInterval(async () => {
			const channels = await this.guild.channels.fetch();
			channels.forEach(channel => {
				if(channel != null && channel.isVoiceBased()) {
					channel.members.forEach(member => {
						this.connection.query(`UPDATE members SET in_voice = in_voice + 1 WHERE id = ${member.id}`)
					})
				}
			})
		}, 1000*60)
	}

    async initPrimaryChannels() {

		this.connection.query('SELECT * FROM key_channels', (error, rows) => {
			if(error) {console.error(error); return}
			if(!rows) return
			rows.forEach(async e => {
				console.log(e)
				this[e.type] = await this.guild.channels.fetch(e.id)
			})
		})

		//welcome
		/*this.begin_channel = await groundChannel(this, '✅верифікація');
		await this.begin_channel.permissionOverwrites.create(this.guild.roles.everyone, {
			'VIEW_CHANNEL': true,
			'SEND_MESSAGES': false,
			'ADD_REACTIONS': false
		})
		const begin_message = await createOrFindMessage(this, this.begin_channel, {embeds: [{
			title: 'Верифікація',
			description: 'Ласкаво просимо на сервері! \nВи новачок, тож не верифіковані і не можете повноцінно перебувати на сервері.\nЩоб верифікуватись прочитайте правила <#704384154925662280>\nТа деяку загальну інформацію <#842853700237656135>\nНажміть реакцію для верифікації',
			color: '#004B4B'
		}]})

		const begin_book = new CommandBook(this, this.begin_channel, begin_message, 'Верифікація', 'Ласкаво просимо на сервері! \nВи новачок, тож не верифіковані і не можете повноцінно перебувати на сервері.\nЩоб верифікуватись прочитайте правила <#704384154925662280>\nТа деяку загальну інформацію <#842853700237656135>\nНажміть реакцію для верифікації', '#004B4B')
		begin_book.functions.push(async (user) => {
			const member = await begin_book.message.guild.members.fetch(user.id);
        	const roles = member.roles;
        	await roles.add('704691487857704980', 'Верифікувався'); //замінити
		})

		begin_book.emojis = ['✅'];
		begin_book.start();

		const autoRole_message = await createOrFindMessage(this, this.begin_channel, {embeds: [{
			title: 'Автороль',
			description: 'Бажаєте отримати роль @minecraft ?\nНажміть реакцію щоб отримати її',
			color: '#004B4B'
		}]})

		const autoRole_book = new CommandBook(this, this.begin_channel, autoRole_message, 'Автороль', 'Бажаєте отримати роль @minecraft ?\nНажміть реакцію щоб отримати її', '#77B255')
		autoRole_book.functions.push(async (user) => {
			const member = await begin_book.message.guild.members.fetch(user.id);
        	const roles = member.roles;
        	await roles.add('723441701884133397', 'Автороль майнкрафт'); //замінити
		})

		autoRole_book.functions.push(async (user) => {
			const member = await begin_book.message.guild.members.fetch(user.id);
        	const roles = member.roles;
        	await roles.remove('723441701884133397', 'Автороль майнкрафт'); //замінити
		})

		autoRole_book.emojis = ['⛏️', '❌'];
		autoRole_book.start();*/
		//await begin_message.reactions.removeAll();
		//await begin_message.react('✅');

		//creatende privat voice
		//this.creatende_privat_voice = await groundChannel(this, '┆➕ створити войс', {type: ChannelType.GuildVoiceStates})
	}

    async loadCommands() {
        this.commands = []

        const commandPath = path.join(__dirname, '../commands')
        console.log(`Намагаюсь взяти команди із ${commandPath}`)
        const commandFiles = fs.readdirSync(commandPath).filter(file => file.endsWith('.js'))

        for(const file of commandFiles) {
            const filePath = path.join(commandPath, file)
            const command = require(filePath)

            if('data' in command && 'execute' in command) {
                console.log(`\tКоманду ${command.data.name} успішно завантажено!`)
                this.commands.push({
                    data: command.data.toJSON(),
                    execute: command.execute
                })
            } else {
                console.log(`\t[УВАГА] Команда ${filePath} визначена неповністю. У ній відсутні або \"data\" або \"execute\"`)
            }
        }
    }

    async loadEvents () {
        this.events = [];

        const eventsPath = path.join(__dirname, '../events');
        console.log(`Намагаюсь взяти події із ${eventsPath}`)
        const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

        for (const file of eventFiles) {
            
        	const filePath = path.join(eventsPath, file);
        	const event = require(filePath);
        	if (event.once) {
        		this.once(event.name, (...args) => event.execute(this, ...args));
        	} else {
        		this.on(event.name, (...args) => event.execute(this, ...args));
        	}
            console.log(`\tПодію ${file.toLowerCase().substring(0, file.length-3)} завантажено`);
        }

        console.log(`Установлено ${eventFiles.length} подій`)
	}

    async loadInfoBooks () {
		this.infoBooks = [];
		const channels = this.guild.channels.cache;
		const infoBooksPath = path.join(__dirname, '../books/infoBooks')

		//console.log(`map_channel --> ${this.map_channel}`)

		fs.readdirSync(infoBooksPath).forEach(folder => {
			const book = new InfoBook({
				client: this,
				folder_path: `infoBooks/${folder.toString()}`,
				channel: this.GuildInfo,
			})

			book.start();
		})
	}

    async slashCommands_reload(){
        let token
        try {
			token = require('../secret.json').token;
		} catch {
			token = process.env.token;
		}

        const rest = new REST({version: '10'}).setToken(token);

        await (async (client) => {
        	try {
        		console.log(`Розпочато оновлення ${client.commands.length} слеш-команд.`);
                const restBody = []
                client.commands.forEach(e => {
                    restBody.push(e.data)
                })

        		const data = await rest.put(
        			Routes.applicationCommands(client.user.id),
        			{ body: restBody},
        		);
                
        		console.log(`Успішно перезавантажено ${data.length} слеш-команд.`);
        	} catch (error) {
        		// And of course, make sure you catch and log any errors!
        		console.error(error);
        	}
        })(this);
    }




    async dbConnection () {

		this.connection = await mysql.createPool({
			host: process.env.DB_HOST != undefined ? process.env.DB_HOST : require('../secret.json').DB_HOST,
			port: process.env.DB_PORT != undefined ? process.env.DB_PORT : require('../secret.json').DB_PORT,
			user: process.env.DB_USERNAME != undefined ? process.env.DB_USERNAME : require('../secret.json').DB_USERNAME,
			password: process.env.DB_PASSWORD != undefined ? process.env.DB_PASSWORD : require('../secret.json').DB_PASSWORD,
			database: process.env.DB_DATABASE != undefined ? process.env.DB_DATABASE : require('../secret.json').DB_DATABASE,
			connectionLimit: 10
		})
		
		/*await this.connection.connect(async (err) => {
			if (err) {
				console.error(`Підключення неуспішне ${err}`)
			} else {
				console.log('Підключення успішне')
				//await this.regMembers()
				setInterval (() => {
					this.connection.query('SELECT 1')
				}, 10000)
			}
		});*/
	}

	async regMembers () {
		this.connection.query(`CREATE TABLE IF NOT EXISTS members ( 
			id BIGINT NOT NULL ,
			messages INT NOT NULL DEFAULT 0 ,
			experience INT NOT NULL DEFAULT 0 ,
			level INT NOT NULL DEFAULT 0 ,
			in_voice INT NOT NULL DEFAULT 0,
			PRIMARY KEY (ID)
			)`
			)/*money INT NOT NULL DEFAULT 0,*/
		const members = await this.guild.members.fetch();
		members.forEach(member => {
			if(!member.user.bot) {
				this.connection.query(`SELECT * FROM members WHERE id = ${member.id}`, (error, rows) => {
					if(rows) return;
					this.connection.query(`INSERT INTO members (id) VALUES(${member.id})`, err => {
						if(err) {
							console.error('Трапилась помилка під час запису мембера до бази даних')
						}
					})
				})
			}
		})
	}
	
	/*async regTimers () {
		function getTimeOfDaysMonthYears(days, currentM, month, currentY, year) {
			let time = days * 24 * 60 * 60;
			const x = [
				() => {return 31},
				() => {return currentY % 4 == 0 ? 29 : 28},
				() => {return 31},
				() => {return 30},
				() => {return 31},
				() => {return 30},
				() => {return 31},
				() => {return 31},
				() => {return 30},
				() => {return 31},
				() => {return 30},
				() => {return 31}
			]
			
			let y = month > 0 ? 1 : -1;
			let m = 0;
			//month = Math.abs(month);
			for (; month != 0; month -= y) {
				if (currentM + 1 > 12) {
					currentM = 0;
					currentY++;
					year--;
				}
				time += x[currentM]() * 24 * 60 * 60 * y;
				m++;
				currentM++;
			}

			y = year > 0 ? 1 : -1;
			let ye = 0;
			for(; year != 0; year -= y) {
				time += (currentY % 4 == 0 ? 366 : 365) * 24 * 60 * 60 * y;
				ye++;
				currentY += y;
			}
			return time;
		}

		this.connection.query(`CREATE TABLE IF NOT EXISTS timers ( 
			id INT NOT NULL AUTO_INCREMENT ,
			date_time VARCHAR(19) NOT NULL ,
            channel VARCHAR(20) NOT NULL ,
            title VARCHAR(255),
            description VARCHAR(255) ,
            sender VARCHAR(23) ,
            color VARCHAR(6) ,
			PRIMARY KEY (id)
			)`
		)

		this.connection.query('SELECT * FROM timers', (error, rows) => {
			if(error) return;
			
			rows.forEach((timer) => {
				
				const current = new Date().toLocaleString('uk-UA', { timeZone: 'Europe/Kiev' });
				const 	currentDate = current.split(', ')[0],
						currentTime = current.split(', ')[1]
				
				const 	currentYear = currentDate.split('.')[2],
						currentMonth = currentDate.split('.')[1],
						currentDay = currentDate.split('.')[0],
						currentHour = currentTime.split(':')[0],
						currentMinute = currentTime.split(':')[1],
						currentSecond = currentTime.split(':')[2]
				
				
				const date_time = `${timer.date_time}`;
				const 	timerDate = date_time.split(' ')[0],
						timerTime = date_time.split(' ')[1]

				const 	timerYear = timerDate.split('.')[0],
						timerMonth = timerDate.split('.')[1],
						timerDay = timerDate.split('.')[2],
						timerHour = timerTime.split(':')[0],
						timerMinute = timerTime.split(':')[1],
						timerSecond = timerTime.split(':')[2]

				
				const second = timerSecond - currentSecond;
				const minute = timerMinute - currentMinute;
				const hour = timerHour - currentHour;
				
				const day = timerDay - currentDay;
				const month = timerMonth - currentMonth;
				const year = timerYear - currentYear;
				
				
				//log(`Seconds: ${second}\n Minutes: ${minute}\nHours: ${hour}\nMonth: ${month}\nYears: ${year}`, 'warning')
				const time = second + minute * 60 + hour * 60 * 60 + getTimeOfDaysMonthYears(day, Number(currentMonth), month, Number(currentYear), year);



				console.log(`Через ${time} спрацює таймер\nУ днях це ${time / 60 / 60 / 24}\nУ годинах ${time / 60 / 60}\nУ хвилинах ${time / 60}`);
				new Timer(this, time, timer.channel, timer.title, timer.description, timer.sender, timer.color, timer.id, true);
			})
		})
	}*/

	async regChannels () {
		this.connection.query(`CREATE TABLE IF NOT EXISTS privat_channels ( 
			id VARCHAR(20) NOT NULL ,
			owner VARCHAR(23),
			PRIMARY KEY (ID)
			)`
		)

		this.connection.query('SELECT * FROM privat_channels', (err, rows) => {
			if(rows && rows[0]) {
				//console.log(rows);
				rows.forEach(async (channel) => {
					try {
						const voice = await this.guild.channels.fetch(channel.id)
						if(voice.members.size != 0) {
							this.privat_voices.push({channel: voice, owner: channel.owner});
						} else {
							this.connection.query(`DELETE FROM privat_channels WHERE id = ${channel.id}`)
							voice.delete();
						}
					} catch {
						this.connection.query(`DELETE FROM privat_channels WHERE id = ${channel.id}`)
					}
				})
			}
			
		})
	}


    login () {
		try {
			const tokenLocal = require('../secret.json').token;
			super.login(tokenLocal)
		} catch {
			super.login(process.env.token);
		}
	}
}

module.exports = Morgan