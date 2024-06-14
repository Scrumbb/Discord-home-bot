const { SlashCommandBuilder } = require('discord.js');
const { executeRemoteCommand } = require('../../functions/sshExecutor');
const { responseFormater } = require('../../functions/responseFormater');
const path = require('path');

const servers = require('../../config.json');

const privateKeyPath = path.join(__dirname, '..', '..', 'id_rsa');

module.exports = {
    cooldown: 5,
    data: new SlashCommandBuilder()
        .setName('stop')
        .setDescription('Stops a specified docker container on the specified server')
        .addStringOption(option =>
            option
                .setName('name')
                .setDescription('The container name')
                .setRequired(true))
        .addStringOption(option =>
            option
                .setName('server')
                .setDescription('The Server to execute the command on')
                .addChoices(
                    { name: 'pi5', value: 'pi5' },
                    { name: 'ubuntu', value: 'ubuntu' })
                .setRequired(true)),

    async execute(interaction) {
        const name = interaction.options.getString('name');
        const server = interaction.options.getString('server');

		let response = '\`\`\`';

		if (server === 'pi5') {

			await interaction.reply(`\`\`\`Stoping docker container ${name} on Raspberry Pi 5\`\`\``);

			await executeRemoteCommand(servers.pi5Ip, servers.pi5Port, servers.pi5Username, privateKeyPath, `docker stop ${name}`)
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

			await interaction.reply(`\`\`\`Stoping docker container ${name} on Ubuntu VM\`\`\``);

			await executeRemoteCommand(servers.ubuntuIp, servers.ubuntuPort, servers.ubuntuUsername, privateKeyPath, `docker stop ${name}`)
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

		}
    },
};
