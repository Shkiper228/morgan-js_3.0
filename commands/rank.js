const { SlashCommandBuilder, AttachmentBuilder } = require("discord.js");
const { createCanvas, loadImage } = require('canvas');
const { fillRectRadius } = require('../utils/canvasUtils.js');
const { cutNum } = require('../utils/stringAndNumsFormat.js');

async function formatRankCard(client, canvas, member, interaction) {
    //initialization
    const context = canvas.getContext('2d');
    const padding = 10;
    

    //background
    context.fillStyle = "rgb(30,40,73)";1E2849
    context.fillRect(0, 0, canvas.width, canvas.height);

    //rounded rect
    context.fillStyle = "rgb(32,78,166)";
    fillRectRadius(context, padding, padding, canvas.width - padding * 2, canvas.height - padding * 2, 8);

    //place and rounding avatar
    const avatar = await loadImage(member.displayAvatarURL({ extension: 'jpg' }));
    context.drawImage(avatar, padding * 2 + 5, padding * 2 + 5);

    //progress bar
    let expForNextLvl = 0, expForLastLvl = 0, expForNextLvlSimple = 0, exp = 0, expSimple = 0;
    client.connection.query(`SELECT * FROM members ORDER BY experience DESC`, async (error, rows) => {
        let indexAuthor;

        const sortedArr = [];

        rows.forEach((row, index) => {
            sortedArr.push(row);
            if(row.id == member.id) indexAuthor = index
        })

        expForNextLvl = (5 * Math.pow(sortedArr[indexAuthor].level, 2)) + (50 * (sortedArr[indexAuthor].level)) + 100;
        for(let i = 0; i < sortedArr[indexAuthor].level; i++){
            expForLastLvl += (5 * Math.pow(i, 2)) + (50 * i) + 100;
        }

        exp = sortedArr[indexAuthor].experience;
        expSimple = exp - expForLastLvl;
            
        context.fillStyle = "rgb(80, 200, 120)";
        for(let i = 0; i < 18; i++) {
            if((expForNextLvl / 18) * i > expSimple) context.fillStyle = "rgb(37,37,37)";
            context.fillRect(padding * 2 + i * 25, canvas.height - 38, 20, 20);
        }

        context.font = '25px sans-serif';
        context.fillStyle = "rgb(200,200,200)";
        context.fillText(`${cutNum(expSimple)}/${cutNum(expForNextLvl)}`, canvas.width - padding * 2 - 145, canvas.height - padding * 2 - 5);
        context.fillStyle = "rgb(255,255,255)";
        context.font = '28px sans-serif';
        context.fillText(`${member.displayName}`, padding * 2 + 5, padding * 2 + avatar.height + 40);
        context.fillStyle = "rgb(200,200,200)";
        context.font = '27px sans-serif';
        context.fillText('Ваш рейтинг:', padding * 2 + 5 + avatar.width + 15, padding * 2 + 28);
        context.fillStyle = "rgb(255,255,255)";
        context.font = '36px sans-serif';
        context.fillText(`#${cutNum(indexAuthor + 1)}`, padding * 2 + 5 + avatar.width + 212, padding * 2 + 26);

        context.fillStyle = "rgb(200,200,200)";
        context.font = '27px sans-serif';
        context.fillText('Рівень: ', padding * 2 + 5 + avatar.width + 300, padding * 2 + 28)
        context.fillStyle = "rgb(255,255,255)";
        context.font = '36px sans-serif';
        context.fillText(`${cutNum(sortedArr[indexAuthor].level)}`, padding * 2 + 5 + avatar.width + 405, padding * 2 + 26)

        context.fillStyle = "rgb(200,200,200)";
        context.font = '23px sans-serif';
        context.fillText(`Досвід: ${cutNum(sortedArr[indexAuthor].experience)}`, padding * 2 + 5 + avatar.width + 15, padding * 2 + 75)
        context.fillText(`Повідомлення: ${cutNum(sortedArr[indexAuthor].messages)}`, padding * 2 + 5 + avatar.width + 200, padding * 2 + 80)
        context.fillText(`В голосових: ${cutNum(sortedArr[indexAuthor].in_voice)} хв.`, padding * 2 + 5 + avatar.width + 150, padding * 2 + 130)

        //format message
        const attachment = new AttachmentBuilder(canvas.toBuffer(), 'profile-image.png');
        await interaction.reply({files: [attachment]})
    })
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rank')
        .setDescription('Генерує особисту інформаційну картку')
        .addUserOption(option => option.setName('учасник').setDescription('Учасник, інформаційну картку якого ви хочете згенерувати')),
    async execute(client, interaction) {
        if(interaction.options.getUser('учасник') && interaction.options.getUser('учасник').bot) {
            interaction.reply({embeds: [{
                description: `Обраний вами учасник - бот. А в бездушних машин немає рівнів...`,
                color: 0xFF033E
            }], ephemeral: true})
            return
        }
        let member;
        if (interaction.options.getUser('учасник')) {
            member = interaction.options.getUser('учасник');
        } else {
            
            member = interaction.member
        }
        const canvas = createCanvas(640, 240)
        formatRankCard(client, canvas, member, interaction);
    }
}