module.exports = {
    name: 'ready',
    once: true,
    execute(client) {
        console.log(`Ready! Logged in as ${client.user.tag}`)
        client.user.setActivity("공부 시간 기록 중")
    },
}