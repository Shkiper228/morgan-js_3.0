const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Для видалення великої кількості повідомлень')
        .addIntegerOption(option => option
            .setName('amount')
            .setDescription('Кількість повідомлень')
            .setRequired(true)),
    async execute(client, interaction) {
        await interaction.reply('Понг!')

        const amount =  interaction.options.getInteger('amount')

        await interaction.message.channel.bulkDelete(amount)
    }
}