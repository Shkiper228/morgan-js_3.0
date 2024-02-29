const { SlashCommandBuilder } = require("discord.js");
const seedrandom = require("seedrandom")

const chance = percentage =>  {return percentage >= Math.random()*100 ? true : false}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('div')
        .setDescription('Гадання на магічній кулі')
        .addStringOption(option => option
            .setName('текст')
            .setDescription('Текст для гадання')
            .setRequired(true)),
    async execute(client, interaction) {
        const str = interaction.options.getString('текст')
        const rand = seedrandom(str)
        await interaction.reply({embeds: [{
            title: `***${str}***`,
            description: `:crystal_ball:**Куля думає...**:\n||Хммм||`
        }]})
        
        setTimeout(async() => {
            if(chance(1)){
                await interaction.editReply({embeds: [{
                    title: `***${str}***`,
                    description: `:crystal_ball:**Куля відповідає...**:\nБлін, щось я збилась, повтори ще раз`
                }]})
            } else {
                await interaction.editReply({embeds: [{
                    title: `***${str}***`,
                    description: `:crystal_ball:**Куля відповідає...**:\n||${client.fun.divinations[Math.floor(rand()*(client.fun.divinations.length-1))]}||`
                }]})
            }
        }, 10000)
        
        


    }

}