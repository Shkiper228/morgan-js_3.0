const {MessageEmbed} = require('discord.js');
const fs = require('fs');
const Book = require('./Book.js');


class CommandBook extends Book {
    constructor (client, channel, message, name, text, color = '#202225') {
        super(client, channel.id);
        this.channel = channel;
        this.message = message;
        this.name = name;
        this.description = text;
        this.functions = [];
        this.temp = {};
        this.color = color;

        if(!client.commandBooks) client.commandBooks = [];
        this.index = client.commandBooks.length;
        client.commandBooks.push(this);
    }

    async start () {
        if(!this.message){
            this.message = await this.channel.send({embeds: [{
                title: this.name,
                description: this.description,
                color: this.color    
            }]})
        } else {
            this.message = await this.message.edit({embeds: [{
                title: this.name,
                description: this.description,
                color: this.color
            }]})
        }
        

        await this.message.reactions.removeAll();
        for(let i = 0; i < this.functions.length; i++) {
            this.message.react(this.emojis[i]);
        }
    }

    async delete(options = { message: true }) {
        await this.message.reactions.removeAll();
        if(options.message) await this.message.delete();
        this.client.commandBooks.splice(this.index, this.index);
    }
}

module.exports = CommandBook;