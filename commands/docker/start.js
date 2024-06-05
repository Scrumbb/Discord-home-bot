const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    cooldown: 5,
    data: new SlashCommandBuilder()
        .setName('start')
        .setDescription('Starts a specified docker container on the specified server')
        .addStringOption(option =>
            option
                .setName('name')
                .setDescription('The container name')
                .setRequired(true))
        .addStringOption(option =>
            option
                .setName('server')
                .setDescription('The Server to list')
                .addChoices(
                    { name: 'pi5', value: 'pi5' },
                    { name: 'ubuntu', value: 'ubuntu' })
                .setRequired(true)),
    async execute(interaction) {
        const name = interaction.options.getString('name');
        const server = interaction.options.getString('server');

        if (server === 'pi5') {
            await interaction.reply(`Docker container ${name} on Raspberry Pi 5`);
        } else if (server === 'ubuntu') {
            await interaction.reply(`Docker container ${name} on Ubuntu Vm`);
        }
    },
};
