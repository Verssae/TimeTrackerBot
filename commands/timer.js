const { SlashCommandBuilder } = require('@discordjs/builders');
const { timeformat } = require("../utils")


module.exports = {
    data: new SlashCommandBuilder()
        .setName('타이머')
        .setDescription('스탑워치를 실행합니다.')
        .addIntegerOption(option => option.setName('분').setDescription('시간 설정(분)'))
        .addIntegerOption(option => option.setName('초').setDescription('시간 설정(초)')),
    async execute(interaction) {

        const time = (interaction.options.getInteger('분')||0)*60 + (interaction.options.getInteger('초')||0)

        const embed = {
            title: `${timeformat(time)} 타이머`,
            color: 0xD53515,
            description: `\`${timeformat(time)}\``,
            thumbnail: {
                url: "https://c.tenor.com/sDj841HV7jkAAAAM/pocket-watch-clock.gif"
            }
        }
        
        await interaction.reply({
            embeds: [embed] 
        })

        let leftTime = time

        const timer = setInterval(() => {

            leftTime -= 1

            if (leftTime <= 0) {
                clearInterval(timer)
                interaction.editReply({
                    embeds: [{
                        ...embed,
                        description: `끝!`,
                        thumbnail: {
                            url: "https://cdn.pixabay.com/photo/2019/12/07/21/26/boom-4680150_1280.png"
                        }
                    }] 
                })
            } else {
                interaction.editReply({
                    embeds: [{
                        ...embed,
                        description: `\`${timeformat(leftTime)}\``
                    }] 
                })
            }

        }, 1000)

    },
};