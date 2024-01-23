const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const Timer = require('../classes/Timer.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('timer')
        .setDescription('Генерує новий таймер')
        .addIntegerOption(option => option.setName('час').setDescription('Час таймеру(хв)').setRequired(true)),
    async execute(client, interaction) {
        const time = interaction.options.getInteger('час')

        if(time >= (Math.pow(2, 31) - 1) / 60000) {
            interaction.reply({embeds: [{
                description: `${interaction.member.author} введіть менше число. Максимальна кількість хвилин для таймеру - ${Math.floor((Math.pow(2, 31) - 2) / 60000)}`,
                color: 0xFF033E
            }], ephemeral: true})
            return;
        }
        
        const timer = new Timer(client, {
            time: time, 
            channelId: interaction.channel.id, 
            title: 'Таймер', 
            description: `Твій таймер на ${time} хвилин спрацював`, 
            sender: `${interaction.user}`, 
            color: 0x553344
        });
        
        await interaction.reply({
            embeds: [{
                description: `${interaction.user} твій таймер на ${time} хвилин запущено\nВін спрацює о: \`${timer.targetDateTimeStr}\``,
                color: 0x553344
            }]
        })
    }

}