const { SlashCommandBuilder, AttachmentBuilder } = require("discord.js");
const { createCanvas, loadImage } = require('canvas');
const { cutNum } = require('../utils/stringAndNumsFormat.js');

async function formatRankCard(client, canvas, member, interaction) {
    


    //progress bar
    let expForNextLvl = 0, expForLastLvl = 0, expForNextLvlSimple = 0, exp = 0, expSimple = 0;
    client.connection.query(`SELECT * FROM members ORDER BY experience DESC`, async (error, rows) => {
        await interaction.deferReply({ ephemeral: false });

        //initialization
        const context = canvas.getContext('2d');

        //background
        const background = await loadImage("./assets/images/rank_card_background.png")
        context.drawImage(background, 0, 0);
        let indexAuthor;

        const sortedArr = [];

        rows.forEach((row, index) => {
            sortedArr.push(row);
            if(row.id == member.id) {
                indexAuthor = index
            }
        })

        expForNextLvl = (5 * Math.pow(sortedArr[indexAuthor].level, 2)) + (50 * (sortedArr[indexAuthor].level)) + 100;
        for(let i = 0; i < sortedArr[indexAuthor].level; i++){
            expForLastLvl += (5 * Math.pow(i, 2)) + (50 * i) + 100;
        }

        exp = sortedArr[indexAuthor].experience;
        expSimple = exp - expForLastLvl;

        const circle = {
            x: canvas.height*0.75*0.5 + canvas.height / 20,
            y: canvas.height*0.75*0.5 + canvas.height / 20,
            radius: canvas.height*0.75*0.5,
        }
        context.fillStyle = "rgb(227,212,44)";
        context.font = '68px sans-serif';
        context.fillText(`${member.displayName}`, circle.x * 2, 78);
        
        context.fillStyle = "rgb(227,212,44)";
        context.font = '66px sans-serif';
        context.fillText(`Рівень: ${cutNum(sortedArr[indexAuthor].level)}`, circle.x * 2, 78 + 71)
        context.fillText(`Рейтинг: #${cutNum(indexAuthor + 1)}`, circle.x * 2, 78 + 71 * 2);
        context.fillText(`Повідомлень: ${cutNum(sortedArr[indexAuthor].messages)}`, circle.x * 2, 78 + 71 * 3)
        context.fillText(`В голосових: ${cutNum(sortedArr[indexAuthor].in_voice)} хв.`, circle.x * 2, 78 + 71 * 4)

        context.font = '44px sans-serif';
        context.fillText(`${cutNum(expSimple)}/${cutNum(expForNextLvl)}`, canvas.width - 300, 78 + 71 * 4);

        context.fillStyle = "rgb(78,68,136)";
        context.fillRect(canvas.width/30, circle.x * 2 + 10, canvas.width - 2*canvas.width/30, (canvas.height - (circle.x + circle.radius))*0.3)
        context.fillStyle = "rgb(227,212,44)";
        context.fillRect(canvas.width/30, circle.x * 2 + 10, (canvas.width - 2*canvas.width/30) * (expSimple/expForNextLvl), (canvas.height - (circle.x + circle.radius))*0.3)
        
        
        
        
        context.fillStyle = "rgb(227,212,44)";
        context.font = '92px sans-serif';
        //context.fillText(`#${cutNum(indexAuthor + 1)}`, padding * 2 + 5 + circle.radius * 2 + 212, padding * 2 + 26);

        
        

        context.fillStyle = "rgb(227,212,44)";
        context.font = '64px sans-serif';
        //context.fillText(`Досвід: ${cutNum(sortedArr[indexAuthor].experience)}`, padding * 2 + 5 + circle.radius * 2 + 15, padding * 2 + 75)

        //place and rounding avatar
        context.beginPath();
        context.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2, true);
        context.closePath();
        context.clip();

        const avatar = await loadImage(member.displayAvatarURL({ extension: 'jpg' }));


        // Compute aspectration
        const aspect = avatar.height / avatar.width;
        // Math.max is ued to have cover effect use Math.min for contain
        const hsx = circle.radius * Math.max(1.0 / aspect, 1.0);
        const hsy = circle.radius * Math.max(aspect, 1.0);
        // x - hsl and y - hsy centers the image
        context.drawImage(avatar,circle.x - hsx,circle.y - hsy,hsx * 2,hsy * 2);

        //format message
        const attachment = new AttachmentBuilder(canvas.toBuffer(), 'profile-image.png');
        await interaction.editReply({files: [attachment]})
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
        const canvas = createCanvas(1639, 457)
        formatRankCard(client, canvas, member, interaction);
    }
}