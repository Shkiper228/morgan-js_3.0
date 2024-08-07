const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('money')
        .setDescription('Показує ваш фінансовий стан'),
    async execute(client, interaction) {
        await interaction.deferReply({ ephemeral: false });
        client.connection.query(`SELECT money FROM members WHERE id = ${interaction.member.user.id}`, async (error, rows) => {
            const money = rows[0].money
            console.log(interaction.member.user.avatarURL({ extension: 'png' }))

            await interaction.editReply({embeds: [{
                author: {
                    name: interaction.member.user.username
                },
                title: '\`Ваш фінансовий стан:\`',
                fields: [
                    {
                        name: 'Бюджет',
                        value: `*${money}$*`
                    }
                ],
                color: 0x008000,
                image: {
                    url: 'https://cdn.discordapp.com/attachments/865265959950614538/1268668610524479580/1eb29640f5f5a5f432c959cff720df45_1.jpg?ex=66ad4337&is=66abf1b7&hm=d5d9f0d6f581d2400afa078a4a7a61afe11f692138b661235f8e14c21a8514ec&'
                },
                thumbnail: {
                    url: interaction.member.user.avatarURL({ extension: 'png' })
                }
            }]})
        })
    }
}