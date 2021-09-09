module.exports = {
    timeformat: time => {
        let hours = Math.floor(time / 3600) 
        let minutes = Math.floor((time - hours * 3600) / 60) 
        let seconds = (time - hours * 3600 - minutes * 60).toFixed(0)
        return `${hours > 0 ? hours + '시간 ': ''}${minutes > 0 ? minutes + '분 ': ''}${seconds}초`
    }
}