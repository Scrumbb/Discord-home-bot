
const { SlashCommandBuilder } = require('discord.js');

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
		
		if (category === 'pi5') {
			await interaction.reply(`Docker containers on Raspberry Pi 5`);
		} else if (category === 'ubuntu') {
			await interaction.reply(`Docker containers on Ubuntu Vm`);
		} else {
			await interaction.reply(`Docker containers on all servers`);
		}
	},
};
