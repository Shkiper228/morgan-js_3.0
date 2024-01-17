const { SlashCommandBuilder } = require("discord.js");
const Timer = require('../classes/Timer.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('timer')
        .setDescription('Генерує новий таймер')
        .addIntegerOption(option => option.setName('час').setDescription('Час таймеру(хв)')),
    async execute(client, interaction) {
        const time = interaction.options.getInteger('час')

        if(time >= (Math.pow(2, 31) - 1) / 60000) {
            interaction.reply({embeds: [{
                description: `${message.author} введіть менше число. Максимальна кількість хвилин для таймеру - ${Math.floor((Math.pow(2, 31) - 2) / 60000)}`,
                color: 0xFF033E
            }], ephemeral: true})
            return;
        }
        const timer = new Timer(client, time, interaction.message.channel.id, 'Таймер', `Твій таймер на ${time} хвилин спрацював`, `${interaction.message.author}`, 0x553344);
    
        await message.channel.send({
            embeds: [{
                description: `${interaction.message.author} твій таймер на ${time} хвилин запущено\nВін спрацює о: \`${timer.formedDateTime}\``
            }]
        })
    }

}