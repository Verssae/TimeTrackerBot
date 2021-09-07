const fs = require('fs')
const { SlashCommandBuilder } = require('@discordjs/builders');


const dataBuffer = fs.readFileSync('db.json')
const dataJSON = dataBuffer.toString()
const data = JSON.parse(dataJSON)

module.exports = {
	data: new SlashCommandBuilder()
    .setName('설정')
    .setDescription('오늘 공부를 정산합니다.'),
	async execute(interaction) {

        console.log(interaction)
	},
};