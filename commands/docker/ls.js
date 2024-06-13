
const { SlashCommandBuilder } = require('discord.js');
const { executeRemoteCommand } = require('../../functions/sshExecutor');
const { responseFormater } = require('../../functions/responseFormater');
const fs = require('fs');
const path = require('path');

const privateKeyPath = path.join(__dirname, '..', '..', 'id_rsa');

module.exports = {
	cooldown: 5,
	data: new SlashCommandBuilder()
		.setName('ls')
		.setDescription('Lists the docker containers on the servers')
		.addStringOption(option =>
			option
				.setName('server')
				.setDescription('The Server to list')
				.addChoices(
					{ name: 'pi5', value: 'pi5' },
					{ name: 'ubuntu', value: 'ubuntu' })),

	async execute(interaction) {

		const category = interaction.options.getString('server');

		let response = '```';

		if (category === 'pi5') {

			await interaction.reply('```Runnig docker ls on Raspberry Pi 5```');

			await executeRemoteCommand('10.0.0.184', 22, 'bot', privateKeyPath, `docker container ls -a --format "table {{.ID}}\t{{.Names}}\t{{.Image}}\t{{.Status}}"`)
				.then(output => {
					response += output;
				})
				.catch(err => {
					console.error('Error:', err.message);
					response += 'Error: ';
					response += err.message;
				});

			try {
				const responseArray = responseFormater(response, false);
				responseArray.forEach((message) => {
					interaction.followUp(`${message}`);
				});
			} catch (error) {
				console.error('Error:', error.message);
			}

		} else if (category === 'ubuntu') {

			await interaction.reply('```Runnig docker ls on Ubuntu VM```');

			await executeRemoteCommand('10.0.0.150', 22, 'bot', privateKeyPath, `docker container ls -a --format "table {{.ID}}\t{{.Names}}\t{{.Image}}\t{{.Status}}"`)
				.then(output => {
					response += output;
				})
				.catch(err => {
					console.error('Error:', err.message);
					response += 'Error: ';
					response += err;
				});

			try {
				const responseArray = responseFormater(response, false);
				responseArray.forEach((message) => {
					interaction.followUp(`${message}`);
				});
			} catch (error) {
				console.error('Error:', error.message);
			}

		} else {

			await interaction.reply('```Runnig docker ls on all Servers```');

			await executeRemoteCommand('10.0.0.184', 22, 'bot', privateKeyPath, `docker container ls -a --format "table {{.ID}}\t{{.Names}}\t{{.Image}}\t{{.Status}}"`)
				.then(output => {
					response += output;
				})
				.catch(err => {
					console.error('Error:', err.message);
					response += 'Error: ';
					response += err.message;
				});
			response += '\v\v\v';

			await executeRemoteCommand('10.0.0.150', 22, 'bot', privateKeyPath, `docker container ls -a --format "table {{.ID}}\t{{.Names}}\t{{.Image}}\t{{.Status}}"`)
				.then(output => {
					response += output;
				})
				.catch(err => {
					console.error('Error:', err.message);
					response += 'Error: ';
					response += err.message;
				});

			try {
				const responseArray = responseFormater(response, true);
				responseArray.forEach((message) => {
					interaction.followUp(`${message}`);
				});
			} catch (error) {
				console.error('Error:', error.message);
			}
		}
	},
};
