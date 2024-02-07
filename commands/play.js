const { SlashCommandBuilder } = require("discord.js");
const { useMainPlayer } = require('discord-player');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .addStringOption(option => option.setName('запит').setDescription('Запит на пісню').setRequired(true))
        .setDescription('команда для додавання пісні в чергу'),
    async execute(client, interaction) {
        const player = useMainPlayer()
        const channel = interaction.member.voice.channel
        const query = interaction.options.getString('запит')
        if(!channel) return interaction.reply({embeds: [{
                description: `Для того аби викликати плеєр, потрібно бути в голосовому`,
                color: 0xFF033E
            }], ephemeral: true})


        await interaction.deferReply()

        try {
            const { track } = await player.play(channel, query, {
                nodeOptions: {
                    metadata: interaction
                }
            })

            return interaction.followUp(`\`${track.title}\` закинуто в чергу`)
        } catch (e) {
            await interaction.followUp({embeds: [{
                description: `**Халепа, щось пішло не так \nПомилка:**\n${e}`,
                color: 0xFF033E
            }], ephemeral: true})
        }
    }
}