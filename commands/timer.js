const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
    .setName('타이머')
	.setDescription('스탑워치를 실행합니다.')
	.addIntegerOption(option => option.setName('시간').setDescription('시간 설정(분)').setRequired(true)),
	async execute(interaction) {
		
        const time = interaction.options.getInteger('시간')
        await interaction.reply(`**${time}분 타이머**`)

        let leftTime = time * 60.0

        const timer = setInterval(()=>{
            
            let minutes = Math.floor(leftTime / 60)
            let seconds = leftTime - minutes * 60
            
            if (leftTime <= 0) {
                clearInterval(timer)
                interaction.editReply(`**${time}분 타이머** \`${minutes}분 ${seconds}초\``)
                interaction.followUp(`**${time}분 타이머 종료!**`)
            } else {
                interaction.editReply(`**${time}분 타이머** \`${minutes}분 ${seconds}초\``)
            }
            leftTime -= 10
        }, 10000)

	},
};