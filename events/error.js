const { Events } = require('discord.js');

const error = {
    name: Events.Error,
    execute: async (client, member) => {
        console.error('WebSocket виявив помилку:', error)
    }
}

module.exports = error;