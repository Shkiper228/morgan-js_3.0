//const log = require('../classes/Logger.js');

class Timer {
    constructor(client, {time, channelId, title, description, sender, color, id = -1, isReg = false, func = () => {}}) {
        this.client = client;
        this.time = time; //хвилин
        this.channelId = channelId;
        this.title = title;
        this.description = description;
        this.sender = sender;
        this.color = color;
        this.id = id;
        this.isReg = isReg;
        this.func = func;

        this.init();
    }

    async init () {
        this.client.connection.query(`CREATE TABLE IF NOT EXISTS timers ( 
			id INT NOT NULL AUTO_INCREMENT ,
			timestamp VARCHAR(19) NOT NULL ,
            channel VARCHAR(20) NOT NULL ,
            title VARCHAR(255),
            description VARCHAR(255) ,
            sender VARCHAR(23) ,
            color INT(12) ,
			PRIMARY KEY (id)
			)`
		)
            this.currentTimeStamp = Date.now()
            this.targetTimeStamp = this.currentTimeStamp + this.time * 60 * 1000
            this.targetDateTimeStr = new Date(this.targetTimeStamp).toLocaleString('uk-UA', { timeZone: 'Europe/Kiev' })

            //console.log(`Таймстемп на даний момент --> ${this.currentTimeStamp}`)
            //console.log(`Таймстемп таймеру --> ${this.targetTimeStamp}`)
            //console.log(`Таймер спрацює: ${this.targetDateTimeStr}`)

        if(!this.isReg) {
            const sql = `INSERT INTO timers (timestamp, channel, title, description, sender, color) VALUES(\"${this.targetTimeStamp}\", \"${this.channelId}\", \"${this.title}\", \"${this.description}\", \"${this.sender}\", ${this.color})`;
            this.client.connection.query(sql, (error, rows, fields) => {
                if(error) {
                    console.log(`Трапилась помилка під час запису таймеру до бази даних: \n${error}`, 'error');
                } else {this.id = rows.insertId;}
            })
        }

        this.channel = await this.client.guild.channels.fetch(this.channelId);
        setTimeout(async () => {
            this.channel.send({
                content: this.sender,
                embeds: [{
                    title: this.title,
                    description: this.description,
                    color: this.color
                }]})
            this.func()
            this.remove();
        }, this.time * 60 * 1000)


    }

    remove () {
        this.client.connection.query(`DELETE FROM timers WHERE id = ${this.id}`);
    }
}

module.exports = Timer;