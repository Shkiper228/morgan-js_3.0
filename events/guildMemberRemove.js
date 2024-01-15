const { Events } = require('discord.js');
const {MessageEmbed} = require('discord.js');

function formatCurrentTime() {
    const time = new Date().toLocaleTimeString('uk-UA', { timeZone: 'Europe/Kiev' })

    const seconds = Number(time.split(':')[2]) < 10 ? `0${Number(time.split(':')[2])}` : `${Number(time.split(':')[2])}`;
    const minutes = Number(time.split(':')[1]) < 10 ? `0${Number(time.split(':')[1])}` : `${Number(time.split(':')[1])}`;
    const hours = Number(time.split(':')[0]) < 10 ? `0${Number(time.split(':')[0])}` : `${Number(time.split(':')[0])}`;

    return `${hours}:${minutes}:${seconds}`;
}

const guildMemberRemove = {
    name: Events.GuildMemberRemove,
    execute: async (client, member) => {
        if(client.GuildUsers){
            client.GuildUsers.send({embeds: [{
                description: `${member} під іменем ${member.user.tag} покинув сервер о ${formatCurrentTime()}\n`,
                color: 0xaa0000
            }]});
        } else {
            client.send({embeds: [{
                description: `**На сервер доєднався новий учасник, але на сервері не визначено каналу для відображення входу/виходу користувачів\nАби це виправити скористайтесь командою \`/setchannel users\`**`,
                color: 0xFF033E
            }]})
        }
        
    }
}


module.exports = guildMemberRemove;