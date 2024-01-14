const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Перша команда...'),
    async execute(client, interaction) {
        await interaction.reply('Понг!')
    }

}