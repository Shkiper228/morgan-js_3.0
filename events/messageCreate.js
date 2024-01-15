const { Events } = require('discord.js');
const ArithmeticExpressions = require('../classes/ArithmeticExpressions.js');
const Timer = require('../classes/Timer.js');

const chance = percentage =>  {return percentage >= Math.random()*100 ? true : false}

async function bump_check(client, message) {
    if(message.author.id === '315926021457051650' && message.embeds[0].description.indexOf('Server bumped by') != -1){
        const bumper = await client.guild.members.fetch(message.embeds[0].description.slice(message.embeds[0].description.indexOf('<@') + 2, message.embeds[0].description.indexOf('<@') + 20))


        await message.channel.send({embeds:[{
            description: `${bumper} бамп успішний. Таймер запущено`,
            color: 0x43B582
        }]})

        new Timer(client, 4*60, message.channelId, 'Пора бампити!', `Час для наступного бампу пройшов\nПопросіть кого-небудь зробити бамп сервера`, `${bumper}`, 0x43B582, id = -1, isReg = false, func = async () => {
            const guild = message.guild
            const administrators = [];

            const leader = await guild.roles.fetch(client.config.leader)
            const admin = await guild.roles.fetch(client.config.admin)
            const support = await guild.roles.fetch(client.config.support)

            administrators.push(leader)
            administrators.push(admin)
            administrators.push(support)
            

            administrators.forEach(async role => {
                role.forEach(async member => {
                    if(bumper.id != member.id) {
                        const message = await member.send({embeds: [{
                            title: 'Пора бампити!',
                            description: 'Час для наступного бампу пройшов\nПопросіть кого-небудь зробити бамп сервера'
                        }]}).catch (e => log(`Не вийшло написати --> ${member.nickname}`, 'error'))
    
                        setTimeout(async () => {
                            await message.delete()
                        }, 60000)
                    }
                })
            })      
        });
    }
}

async function updateXP(client, message, member) {
    client.connection.query(`SELECT * FROM members WHERE id = ${message.author.id}`, async (error, rows) => {
        if(rows[0]) {
            let expForNextLvl = 0;
            for(let i = 1; i < rows[0].level + 1; i++){
                expForNextLvl += (5 * Math.pow(i, 2)) + (50 * i) + 100;
            }
            const exp = rows[0].experience;
            if(exp >= expForNextLvl) {
                rows[0].level++;
                const console = await client.guild.channels.fetch('704660113750884433');
                await console.send({
                    content: `${member}`,
                    embeds: [{
                        description: `Ви досягнули ${rows[0].level} рівень! Вітаєм!`,
                        color: 0x2D7144
                    }]
                })
            };
            client.connection.query(`UPDATE members SET experience = ${exp + Math.floor(Math.random() * 10) + 15}, 
            level = ${rows[0].level}, messages = ${rows[0].messages + 1} WHERE id = ${message.author.id}`)
        }
    })
    
}

async function random_emojis (client, message) {
    if(!message.guild.emojis.cache) {
        console.warn('На сервері немає жодного власного емодзі')
        return
    }
    
    if(client.GuildGeneral && message.channel.id == client.GuildGeneral.id && chance(5)){
        try {
            const guildEmojis = await message.guild.emojis.fetch()
            await message.react(guildEmojis.random())
        } catch (error) {
            console.warn(error)
        }
        
    }
}

async function random_arithmetic_expression (client, message) {
    if(client.GuildGeneral && message.channel.id == client.GuildGeneral.id && chance(3)) {
        const AE = new ArithmeticExpressions(message.channel);
        client.arithmeticExpression = AE
    }
}

async function arithmeticExpressionsCheck(client, message, member) {
    if(client.arithmeticExpression){ 
        console.log(client.arithmeticExpression)
        if(message.content.split('').filter(e => e.trim().length).join('') == client.arithmeticExpression.answer.toString()) {
            client.arithmeticExpression.isResolved = true
            message.channel.send({embeds: [{
                description: `${member} перший відповів(-ла) правильно! За це він(вона) отримає \`100\` досвіду!`,
                color: 0x00ff00
            }]})
            client.connection.query(`UPDATE members SET experience = experience + 100 WHERE id = ${message.author.id}`)
            client.arithmeticExpression = undefined
        }
    }
}

const messageCreate = {
    name: Events.MessageCreate,
    execute: async (client, message) => {
        if(message.author.bot || !message.guild) return

        const member = await client.guild.members.fetch(message.author.id)

        await bump_check(client, message)

        await updateXP(client, message, member)

        await random_emojis(client, message)

        await random_arithmetic_expression(client, message)

        await arithmeticExpressionsCheck(client, message, member)

    }
}

module.exports = messageCreate;