const {GatewayIntentBits, Events} = require('discord.js');
const Morgan = require('./classes/Morgan.js')

const client = new Morgan({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });

client.on('ready', () => {
    client.init()
    console.log(`${client.user.tag} готовий до роботи!`);
});

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.find(element => {return element.data.name == interaction.commandName ? true : false})
	
	if (!command.data) {
		console.error(`Команди ${interaction.commandName} не знайшлось.`);
		return;
	}

	try {
		await command.execute(client, interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
}) 

client.login()