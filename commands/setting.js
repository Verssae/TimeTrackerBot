const fs = require('fs')
const { Permissions } = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders');


module.exports = {
	data: new SlashCommandBuilder()
    .setName('설정')
    .setDescription("봇 설정")
    .addSubcommand(subcommand => subcommand
        .setName("공부방")
        .setDescription("음성 채널 ID 입력. 이미 등록된 경우 해제")
        .addStringOption(option => option
            .setName('target')
            .setDescription("id")
            .setRequired(true)))
    .addSubcommand(subcommand => subcommand
        .setName("공지")
        .setDescription("텍스트 채널 ID 입력. 이미 등록된 경우 해제")
        .addStringOption(option => option
            .setName('notice')
            .setDescription("id")
            .setRequired(true))),
	async execute(interaction) {
        if (!interaction.member.permissions.has([Permissions.FLAGS.ADMINISTRATOR])) {
            await interaction.reply("채널의 관리자만 실행 가능해요 😢")
        }
        const dataBuffer = fs.readFileSync('db.json')
        const dataJSON = dataBuffer.toString()
        const data = JSON.parse(dataJSON)
        if (interaction.options.getSubcommand() == '공부방') {
            const id = interaction.options.getString('target')
            if (data.targetChannels.includes(id)) {
                data.targetChannels = data.targetChannels.filter(e => e !== id)
            } else {
                data.targetChannels = [
                    ...data.targetChannels,
                    id
                ]
            }
            fs.writeFileSync('db.json', JSON.stringify(data))
            await interaction.reply("Done!")
        }
        if (interaction.options.getSubcommand() == '공지') {
            const id = interaction.options.getString('notice')
            if (data.noticeChannels.includes(id)) {
                data.noticeChannels = data.noticeChannels.filter(e => e !== id)
            } else {
                data.noticeChannels = [
                    ...data.noticeChannels,
                    id
                ]
            }
            fs.writeFileSync('db.json', JSON.stringify(data))
            await interaction.reply("Done!")
        }
        console.log(interaction)
	},
};