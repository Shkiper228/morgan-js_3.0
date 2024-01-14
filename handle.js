const { REST, Routes } = require('discord.js');

const rest = new REST().setToken('OTY4MTk0OTY5MDExNjE3ODQy.G1WcF5.iD9mlfdkpRcq7uyevWBJslRQqL9IlkZKG6x_uQ');

// for global commands
rest.delete(Routes.applicationCommand(/*clientId*/'968194969011617842', /*commandId*/'1193677260264317049'))
	.then(() => console.log('Successfully deleted application command'))
	.catch(console.error);