const { Events } = require('discord.js');

const guildMemberRemove = {
    name: Events.GuildMemberRemove,
    execute: async (client, member) => {
        console.error('WebSocket виявив помилку:', error)
    }
}

module.exports = guildMemberRemove;