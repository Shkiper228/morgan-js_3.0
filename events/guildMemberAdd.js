const { Events } = require('discord.js');
const {MessageEmbed} = require('discord.js');

const guildMemberAdd = {
    name: Events.GuildMemberAdd,
    execute: async (client, member) => {
        const embed = new MessageEmbed()
        .setImage(member.displayAvatarURL())
        .setDescription(`Ласкаво просимо на сервері, ${member}! Новачок під іменем ${member.user.tag} уже ${member.guild.memberCount}-й\n`)
        .setColor(0x00aa00)
    
        await client.GuildUsers.send({embeds: [embed]});
    
        /*client.connection.query(`SELECT 1 FROM member WHERE id = ${member.id}`, (err, rows) => {
            if(rows && !rows[0] && !member.user.bot) {
                client.connection.query(`INSERT INTO members (id) VALUES(${member.id})`, err => {
                    if(err) log(err, 'error')
                })
            }
        })
    
        const roles = member.roles;
        await roles.add('704691487857704980', 'Верифікувався'); //замінити*/
    }
}


module.exports = guildMemberAdd;