const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('random')
        .setDescription('Видає випадкове ціле число')
        .addIntegerOption(option => option.setName('найменше').setDescription('Найменше число').setRequired(true))
        .addIntegerOption(option => option.setName('найбільше').setDescription('Найбільше число').setRequired(true)),
    async execute(client, interaction) {
        await interaction.reply('Тест!')
    }

}