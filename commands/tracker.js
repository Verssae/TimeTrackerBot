const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js')

let records = {}

const timeformat = time => {
    let hours = Math.floor(time / 3600) 
    let minutes = Math.floor((time - hours * 3600) / 60) 
    let seconds = time - hours * 3600 - minutes * 60
    return `${hours > 0 ? hours + '시간 ': ''}${minutes > 0 ? minutes + '분 ': ''}${seconds}초`
}

module.exports = {
	data: new SlashCommandBuilder()
    .setName('기록')
	.setDescription('시간을 기록합니다.')
    .addSubcommand(subcommand => 
        subcommand
        .setName('시작')
        .setDescription('시간 기록을 시작합니다.'))
    .addSubcommand(subcommand => 
        subcommand
        .setName('종료')
        .setDescription('시간 기록을 종료합니다.'))
    .addSubcommand(subcommand => 
        subcommand
        .setName('수정')
        .setDescription('시간 정보를 입력합니다.')
        .addUserOption(option => 
            option.setName('유저')
            .setDescription("해당 유저 입력")
            .setRequired(true))
        .addIntegerOption(option => 
            option.setName('시간')
            .setDescription("해당 시간 입력 (초)")
            .setRequired(true)))
    .addSubcommand(subcommand => 
        subcommand
        .setName('랭킹')
        .setDescription('기록 랭킹을 보여줍니다.')),
	async execute(interaction) {
        if (interaction.options.getSubcommand() === '시작') {
            const userId = interaction.user.id

            if (!records[userId]) {
                records = {
                    ...records,
                    [userId]: {
                            time:  0,
                            name: interaction.user.username
                        }
                }
            }

            await interaction.reply(`**${interaction.user.username}**님의 시간 측정 시작`)

            const timer = setInterval(()=>{

                interaction.editReply(`**${interaction.user.username}**님의 시간: \`${timeformat(records[userId].time)}\``)
                records = {
                    ...records,
                    [userId]: {
                            ...[userId],
                            time: records[userId].time + 1 ,
                            timerId: timer,
                            name: interaction.user.username
                        }
                }
            }, 1000)
        } else if (interaction.options.getSubcommand() === '종료') {
            const userId = interaction.user.id
            if (!userId) {
                await interaction.reply({content: '아직 기록을 시작한 적이 없어요. `\\기록 \\시작`로 기록을 시작해 주세요', ephemeral: true})
            }
            clearInterval(records[userId].timerId)
            await interaction.reply(`**시간 추적 종료!**`)
            await interaction.followUp(`**${interaction.user.username}**님의 기록된 시간: \`${timeformat(records[userId].time)}\``)

        } else if (interaction.options.getSubcommand() === '수정') {
            const userId = interaction.options.getUser('유저').id
            
            const time = interaction.options.getInteger('시간')

            records = {
                ...records,
                [userId]: {
                    ...[userId],
                    time: time,
                    name: interaction.options.getUser('유저').username
                }
            }

            await interaction.reply(`${interaction.options.getUser('유저')}님의 시간이 \`${timeformat(records[userId].time)}\`로 설정되었습니다.`)
        } else if (interaction.options.getSubcommand() === '랭킹') {
            const recordsArray = Object.entries(records)
            // console.log(recordsArray)
            const candidates = recordsArray.map(([userId, value]) => {
                const {time, timerId, name} = value
                return {name:name, value:time}
            } ).sort((a, b) => {
                if (a.value > b.value) return -1
                if (a.value == b.value) return 0
                if (a.value < b.value) return 1
            })

            const result = candidates.reduce((acc, cur, i) => {
                return `${acc}\n${cur.name}: ${i+1}등 (${timeformat(cur.value)})`
            }, '**기록 랭킹**')

            console.log(result)
            
            await interaction.reply(result)
        }

	},
};