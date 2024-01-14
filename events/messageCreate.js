const { Events } = require('discord.js');

const messageCreate = {
    name: Events.MessageCreate,
    execute: async (client, message) => {
        if(!message.guild || !message.guild.emojis.cache || message.author.bot) return;

        
        if(chance(50)){
            try {
                const guildEmojis = await message.guild.emojis.fetch()
                await message.react(guildEmojis.random())
            } catch (error) {
                console.warn(error)
            }
            
        }
    }
}

const chance = percentage =>  {return percentage >= Math.random()*100 ? true : false}

module.exports = messageCreate;