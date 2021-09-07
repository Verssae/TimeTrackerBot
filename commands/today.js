const fs = require('fs')
const { Permissions } = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders');

const timeformat = time => {
    let hours = Math.floor(time / 3600) 
    let minutes = Math.floor((time - hours * 3600) / 60) 
    let seconds = (time - hours * 3600 - minutes * 60).toFixed(2)
    return `${hours > 0 ? hours + '시간 ': ''}${minutes > 0 ? minutes + '분 ': ''}${seconds}초`
}


module.exports = {
	data: new SlashCommandBuilder()
    .setName('정산')
    .setDescription('오늘 공부를 정산합니다.'),
	async execute(interaction) {
        if (!interaction.member.permissions.has([Permissions.FLAGS.ADMINISTRATOR])) {
            await interaction.reply("채널의 관리자만 실행 가능해요 😢")
        }

        const dataBuffer = fs.readFileSync('db.json')
        const dataJSON = dataBuffer.toString()
        const data = JSON.parse(dataJSON)

        const todays = Object.entries(data.todayTimes)
        const result = todays.sort((a, b) => {
            if (a[1] > b[1]) return -1
            if (a[1] == b[1]) return 0
            if (a[1] < b[1]) return 1
        })
        console.log(result)

        let results = []

        await result.forEach(e=>{
            console.log(e)
            interaction.client.users.fetch(e[0]).then(el => {
                const value = timeformat(e[1]/1000)
                results = [
                    ...results,
                    {
                        name: el.username,
                        value: value
                    }
                ]
                data.todayTimes[e[0]] = 0
                console.log(results)
            }).catch(er => er)
        })
        
        fs.writeFileSync('db.json', JSON.stringify(data))
        
        await interaction.reply({
            embeds:[
                {
                    title: "🏆 랭킹 🏆",
                    description: "오늘의 공부 시간 랭킹",
                    fields: [
                        ...results
                    ]
                }
            ]
        })

	},
};