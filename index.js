require("./database")
const bot = require("./discord").bot
const doCommand = require("./commands").doCommand

const TOKEN = "NTEzNDMxMzA0MTc2NTMzNTA0.DtH95Q.QdLQ4hvpXNmq1AFDVeLoTUnd7bI"
const PREFIX = "ko "

bot.on("ready", () => {
    console.log(`Korubot inicializado como ${bot.user.tag}!`)
})
bot.login(TOKEN)

bot.on("message", async message => {
    if (message.author.equals(bot.user)) return
    if (!message.content.startsWith(PREFIX)) return
    doCommand(message)
})

/*
 * Schedulers
 */



// Pedir tarefas pela segunda vez
// const chargeSecondSchedule = schedule.scheduleJob("51 * * * *", function() {
//     Charger.chargeNextSecondTime()
// })
