const { REST, Routes } = require('discord.js');
const configPath = path.join(__dirname, '..', 'config.json');
const { clientId, guildId, token }  = require(configPath);

const rest = new REST().setToken(token);

const commandId = 'commandId';

// for guild-based commands
rest.delete(Routes.applicationGuildCommand(clientId, guildId, commandId))
	.then(() => console.log('Successfully deleted guild command'))
	.catch(console.error);

// for global commands
rest.delete(Routes.applicationCommand(clientId, commandId))
	.then(() => console.log('Successfully deleted application command'))
	.catch(console.error);