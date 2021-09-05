const { SlashCommandBuilder } = require('@discordjs/builders');
const wait = require('util').promisify(setTimeout)
module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!')
        .addStringOption(option => option.setName('input').setDescription('Enter a string'))
        .addIntegerOption(option => option.setName('int').setDescription('Enter an integer'))
        .addNumberOption(option => option.setName('num').setDescription('Enter a number'))
        .addBooleanOption(option => option.setName('choice').setDescription('Select a boolean'))
        .addUserOption(option => option.setName('target').setDescription('Select a user'))
        .addChannelOption(option => option.setName('destination').setDescription('Select a channel'))
        .addRoleOption(option => option.setName('muted').setDescription('Select a role'))
        .addMentionableOption(option => option.setName('mentionable').setDescription('Mention something')),
	async execute(interaction) {
		await interaction.reply('Pong!')
        await wait(2000)
        await interaction.editReply('Pong again!')
        await interaction.followUp({content: 'You can pong', ephemeral: true})
	},
};