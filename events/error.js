const { Events } = require('discord.js');

const error = {
    name: Events.Error,
    execute: async (client, error) => {
        console.error('WebSocket виявив помилку:')
        console.log(error)
    }
}

module.exports = error;