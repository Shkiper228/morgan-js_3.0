const log = require('../classes/Logger.js');

class Command {
    constructor(client ,{
        name = '',
        description = '',
        syntax = `${client.config.prefix}${name}`,
        ownerOnly = false,
        adminOnly = false,
        enable = true
    }, run) 
    
    {
        this.name = name;
        this.description = description;
        this.syntax = syntax;
        this.ownerOnly = ownerOnly;
        this.adminOnly = adminOnly;
        if (enable) {
            this.run = run;
        } else {
            this.run = (client, message, args) => {
                log('Була спроба викликати вимкнену команду', 'warning')
                //message.channel.send(`Команду \`${this.name}\` вимкнено`)
            }
        }
        
    }
}

module.exports = Command;