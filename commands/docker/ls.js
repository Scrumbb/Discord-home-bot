
const { SlashCommandBuilder } = require('discord.js');
const { executeRemoteCommand } = require('../../functions/sshExecutor');
const { responseFormater } = require('../../functions/responseFormater');
const path = require('path');

const configPath = path.join(__dirname, '..', '..', 'config.json');
const servers  = require(configPath);

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

		const server = interaction.options.getString('server');

		let response = '\`\`\`\n';

		if (server === 'pi5') {

			await interaction.reply(`\`\`\`Runnig docker ls on Raspberry Pi 5\`\`\``);

			await executeRemoteCommand(servers.pi5Ip, servers.pi5Port, servers.pi5Username, privateKeyPath, `docker container ls -a --format "table {{.ID}}\t{{.Names}}\t{{.Image}}\t{{.Status}}"`)
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

		} else if (server === 'ubuntu') {

			await interaction.reply(`\`\`\`Runnig docker ls on Ubuntu VM\`\`\``);

			await executeRemoteCommand(servers.ubuntuIp, servers.ubuntuPort, servers.ubuntuUsername, privateKeyPath, `docker container ls -a --format "table {{.ID}}\t{{.Names}}\t{{.Image}}\t{{.Status}}"`)
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

			await interaction.reply(`\`\`\`Runnig docker ls on all Servers\`\`\``);

			await executeRemoteCommand(servers.pi5Ip, servers.pi5Port, servers.pi5Username, privateKeyPath, `docker container ls -a --format "table {{.ID}}\t{{.Names}}\t{{.Image}}\t{{.Status}}"`)
				.then(output => {
					response += output;
				})
				.catch(err => {
					console.error('Error:', err.message);
					response += 'Error: ';
					response += err.message;
				});
			response += '\v\v\v';

			await executeRemoteCommand(servers.ubuntuIp, servers.ubuntuPort, servers.ubuntuUsername, privateKeyPath, `docker container ls -a --format "table {{.ID}}\t{{.Names}}\t{{.Image}}\t{{.Status}}"`)
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
