const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('test')
        .setDescription('Тестова команда. Доступно тільки адміністраторам')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(client, interaction) {
        const message = await interaction.channel.messages.fetch('1128803880201879642')


        await message.edit({embeds: [{
            title: 'Правила',
            color: 0x004B4B,
            fields: [{
                name: 'ㅤ\t**-=КОНТЕНТ=-**',
                value: `\`1)\` Заборонено контент 18+ відео, зображення, сексуального характеру та різний треш по типу трупів людей, тварин, суїциду. 
                *Покарання: перманентний бан.*

\`2)\` Заборонений флуд та спам у будь-якому вигляді, включаючи гіфки, картинки і так далі. 
*Покарання: мут на 30 хв.*

\`3)\` Заборонено розповсюдження конфіденційної та чутливої інформації інших людей без їх дозволу. 
*Покарання: першого разу - попередження, другого разу - мут на 1 день, третього разу - перманентний бан.*

\`4)\` Заборонено поширювати потенційно шкідливі та небезпечні програми (віруси), чіти для ігор і підозрілі файли. 
*Покарання: перманентний бан.*

\`5)\` Заборонені непристойні чи провокативні нікнейми та/або опис в профілі (гітлер, сталін і т.д.). 
*Покарання: першого разу - попередження, другого разу - мут, якщо людина не хоче міняти нік та опис - бан.*`},{name:'',value:`\`6)\` На цьому сервері є тематичні текстові канали. Потрібно відправляти повідомлення у відповідні канали в залежності від вмісту повідомлення. А також обов'язково створювати гілки, якщо відповідей на повідомлення буде більше ніж чотири. Назва і опис кожного текстового каналу однозначно вказує для якого вмісту він створений.
*Покарання: попередження і прохання видалити нерелевантне повідомлення, якщо людина не перестала - мут на 30 хв. *

\`7)\` У нас присутній текстовий канал <#1185202857989914705> у якому ви можете запропонувати свою ідею або поставити питання щодо сервера. Недопустимі заявки з неадекватним змістом. 
*Покарання: мут від 30 хв до 1 дня.*
            
                
                ㅤ`
            },{
                name: 'ㅤ\t**-=ТОКСИЧНІСТЬ=-**',
                value: `\`1)\` Не принижуйте інших учасників без вагомої причини і без належного обґрунтування. 
                *Якщо ви не повелися на провокацію, провокатор отримає мут від 30 хв до 1 дня в залежності від самої провокації. При особливо злісному порушенні - бан.*
                
                \`2)\` Заборонено дискримінувати кого-небудь на основі будь-якої різниці особистостей (раса, стать і так далі.) (окрім росіян. Їх треба булити). 
                *Покарання: першого разу - попередження, другого разу - мут на 1 день, третього разу - перманентний бан.*


                ㅤ`
            },{
                name: 'ㅤ\t**-=НЕАДЕКВАТНА ПОВЕДІНКА=-**',
                value: `\`1)\` Поведінка в текстових каналах. Заборонені загострені обговорення та агресивні висловлювання без будь якої адекватної аргументованої причини. *Приклад: Ти деган тому, що просто або ти дебіл тому, що я так хочу.* 
*Покарання: першого разу - попередження, якщо учасник не зупиняється і далі поводитися неадекватно - мут від 5хв до 3 днів.*`},{ name: '', value:`\`2)\` Поведінка в голосових каналах. Заборонені вигукування без підстав, увімкнення музики з телефону, якщо тебе не просили, неадекватна поведінка перед вебкамерою або вчинки, які можуть негативно вплинути на інших учасників в голосовому каналі.
*Покарання: першого разу - попередження, якщо учасник не слухається та не зупиняється видається мут від 5 хв. до 3 днів.*
**Увага! Якщо вам не подобається поведінка учасника сервера, напишіть скаргу в текстовий канал <#1185202857989914705> і, якщо на цього учасника буде більше ніж 9 аргументованих скарг, адміністрація сервера розбереться з ним. Якщо учасник після попередження продовжує поводити себе неадекватно йому видається мут від 30 хв до 3 днів в залежності від того, що він сказав.**


ㅤ`
            },{
                name: 'ㅤ\t**-=ПОЛІТИКА=-**',
                value: `\`1)\` Заборонена підтримка РФ. 
*Покарання: перманентний бан*

\`2)\` Не визнання агресії РФ у бік України та окупація українських земель. 
*Покарання: перманентний бан.*

\`3)\` Поширення злісних російських пропагандистських тезисів. 
*Покарання: попередження, бан.*

**Якщо хтось займається будь-якою діяльністю, такою як розмова/слухання/гра, що напряму пов'язана з росією, вам необхідно перестати цим займатись, в іншому разі протягом 24 годин вам надійде сповіщення про припинення цієї діяльності, якщо адміністрація не помітить ніякої реакції, видається перманентний бан.**


                ㅤ`
            },{
                name: 'ㅤ\t**-=РЕКЛАМА=-**',
                value: `\`1)\` Заборонено розповсюджувати рекламу без дозволу <@&704385440391626782> чи <@&704384928451919884>. Рекламою вважається посилання на інші спільноти будь-яких соціальних мереж, блогів, діскорд серверів, телеграм каналів і тд. 
                *Покарання: перманентний бан автоматично видається ботом одразу після того, як ви скинете рекламу.*
                
                \`2)\` Винятком є YouTube контент, пов'язаний із популяризацією культури, історії, політики чи науки українською. Такий контент можна поширювати в каналі <#704388054928064652> чи <#704387452453781524>
                **Якщо ви бажаєте запропонувати рекламу - використайте заявку і через певний період часу адміністрація сервера тобто: <@&704384928451919884> <@&704385440391626782> <@&883975383370850364> зв'яжеться з вами і обговорить усі моменти.
                Ми ні в якому разі не співпрацюємо з русньою і ніколи не будемо!**`
            }]
        }]})
    }

}