const { Events } = require('discord.js');
const {MessageEmbed} = require('discord.js');

const guildMemberAdd = {
    name: Events.GuildMemberAdd,
    execute: async (client, member) => {
    
        if(client.GuildUsers) {
            await client.GuildUsers.send({embeds: [{
                description: `Ласкаво просимо на сервері, ${member}! Новачок під іменем ${member.user.tag} уже ${member.guild.memberCount}-й\n`,
                color: 0x00aa00,
                image: {
                    url: member.displayAvatarURL()
                }
            }]});
        } else {
            client.owner.send({embeds: [{
                description: `**На сервер доєднався новий учасник, але на сервері не визначено каналу для відображення входу/виходу користувачів\nАби це виправити скористайтесь командою \`/setchannel users\`**`,
                color: 0xFF033E
            }]})
        }
        
    
        client.connection.query(`SELECT 1 FROM member WHERE id = ${member.id}`, (err, rows) => {
            if(rows && !rows[0] && !member.user.bot) {
                client.connection.query(`INSERT INTO members (id) VALUES(${member.id})`, err => {
                    if(err) console.error(err)
                })
            }
        })
    
        const roles = member.roles;
        await roles.add('704691487857704980', 'Верифікувався'); //замінити*/
    }
}


module.exports = guildMemberAdd;