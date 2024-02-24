const { Events } = require('discord.js');

const messageReactionAdd = {
    name: Events.MessageReactionAdd,
    execute: async (client, messageReaction, user) => {
        if(user.bot) return;
        console.log(`<${messageReaction.message.channel.name}> ${user} поставив реакцію ${messageReaction.emoji}`);

        if(client.infoBook) {
            
            if(client.infoBook.message.channel.id == messageReaction.message.channel.id && client.infoBook.message.id == messageReaction.message.id) {
                const index = client.infoBook.emojis.findIndex(element => {
                    if(element == messageReaction.emoji.toString()) {
                        return true;
                    }
                })
                messageReaction.users.remove(user);
                client.infoBook.changePage(index);

                return;
            }
        }

        if(!client.commandBooks) client.commandBooks = [];
        client.commandBooks.forEach(book => {
            if(book.channel_id == messageReaction.message.channel.id && book.message.id == messageReaction.message.id) {
                const index = book.emojis.findIndex(element => {
                    if(element == messageReaction.emoji.toString()) {
                        return true;
                    }
                })
                messageReaction.users.remove(user);
                book.functions[index](user);

                return;
            }
        })
    }  
};

module.exports = messageReactionAdd;