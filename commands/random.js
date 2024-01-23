const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('random')
        .setDescription('Видає випадкове ціле число')
        .addIntegerOption(option => option.setName('найменше').setDescription('Найменше число').setRequired(true))
        .addIntegerOption(option => option.setName('найбільше').setDescription('Найбільше число').setRequired(true)),
    async execute(client, interaction) {
        const min = interaction.options.getInteger('найменше')
        const max = interaction.options.getInteger('найбільше')

        if(min >= max) {
            interaction.reply({embeds: [{
                description: `**Найбільше число повинно бути більше аніж найменше:**`,
                color: 0xFF033E
            }], ephemeral: true})
            return
        }
        await interaction.reply(`${min + (Math.round((Math.random() * (max - min))))}`)
    }
}