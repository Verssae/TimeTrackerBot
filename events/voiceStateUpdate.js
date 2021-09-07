module.exports = {
    name: 'voiceStateUpdate',
    execute(oldMember, newMember) {
        console.log('voice state update')
        console.log(`${oldMember.channelId}, ${newMember.channelId}`)        
        console.log(`${oldMember.member}, ${newMember.member}`)      
    }
}