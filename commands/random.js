const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('random')
        .setDescription('Видає випадкове ціле число')
        .addIntegerOption(option => option.setName('int').setDescription('Найменше число')),
    async execute(client, interaction) {
        await interaction.reply('Тест!')
    }

}