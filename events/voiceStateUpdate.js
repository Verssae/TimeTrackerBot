const fs = require('fs')


const timeformat = time => {
    let hours = Math.floor(time / 3600) 
    let minutes = Math.floor((time - hours * 3600) / 60) 
    let seconds = (time - hours * 3600 - minutes * 60).toFixed(2)
    return `${hours > 0 ? hours + '시간 ': ''}${minutes > 0 ? minutes + '분 ': ''}${seconds}초`
}

module.exports = {
    name: 'voiceStateUpdate',
    async execute(oldState, newState) {
        const dataBuffer = fs.readFileSync('db.json')
        const dataJSON = dataBuffer.toString()
        const data = JSON.parse(dataJSON)

        const idomsDataBuffer = fs.readFileSync('good.json')
        const idomsDataJSON = idomsDataBuffer.toString()
        const idomsData = JSON.parse(idomsDataJSON)

        const oldIsTarget = data.targetChannels.includes(oldState.channelId)
        const newIsTarget = data.targetChannels.includes(newState.channelId)

        const sender = (title, description) => data.noticeChannels.forEach(ch => {
            newState.member.guild.channels.fetch(ch)
                .then(channel => channel.send({
                    embeds: [
                        {
                            title: title,
                            color: 0xDCE2E8,
                            author: {
                                name: newState.member.user.username,
                                icon_url: newState.member.user.avatarURL()
                            },
                            description: description,
                            thumbnail: {
                                url: data.figures[Math.floor(Math.random()*data.figures.length)]
                            },
                            fields: [
                                {
                                    name: '오늘 공부한 시간',
                                    value: timeformat((data.todayTimes[newState.member.user.id]||0)/1000)
                                }
                            ],
                            image: {
                                url: 'https://cdn.discordapp.com/attachments/882280565770969140/884847850847076492/1550064396166.png'
                            },
                            footer: {
                                text: idomsData.contents[Math.floor(Math.random()*idomsData.contents.length)],
                                icon_url: 'https://cdn.discordapp.com/attachments/883914249431318570/884851727168323584/4a379b5a3936aa15.png',
                            },
                        }
                    ]
                })
                    .then(console.log)
                    .catch(console.error))
                .catch(console.error)
        })

        if (oldState.member == newState.member) {
            
            if (newIsTarget) {

                if (!oldState.channelId || !oldIsTarget) {
                    console.log(`${newState.member.user.username} Get Into ${newState.channel.name}`)
                    data.startTimes[newState.member.user.id] = new Date().getTime()
                    fs.writeFileSync('db.json', JSON.stringify(data))
                    sender("공부 시작", "공부 채널에 들어왔습니다. 공부 시간을 측정합니다.")
                } 
            } 

            if (oldIsTarget) {
                if (!newState.channelId || !newIsTarget) {
                    console.log(`${newState.member.user.username} Get Out ${oldState.channel.name}`)
                    const startTime = data.startTimes[newState.member.user.id]
                    if (startTIme) {
                        const milliSeconds = new Date().getTime() - startTime
                        data.todayTimes[newState.member.user.id] = (data.todayTimes[newState.member.user.id] || 0) + milliSeconds
                        delete data.startTimes[newState.member.user.id]
                        fs.writeFileSync('db.json', JSON.stringify(data))
                        sender("공부 종료", "공부 채널에서 나갔습니다. 공부 시간을 기록했습니다.")
                    }
                }
            }
        }
    

        


        
        // 공부방에서 voiceState updated
        
        // console.log('voice state update')
        // console.log(`${oldState.channelId}, ${newState.channelId}`)        
        // console.log(`${oldState.member}, ${newState.member}`)      
        
    }
}