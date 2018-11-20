const schedule = require("node-schedule")

const mongoose = require("mongoose")
const discord = require("./discord")
const bot = discord.bot
const doCommand = require("./commands").doCommand
const database = require("./database")

const Charger = require("./charger")
const Tasker = require("./managers/task")
const Helper = require("./helper")

const TOKEN = "NTEzNDMxMzA0MTc2NTMzNTA0.DtH95Q.QdLQ4hvpXNmq1AFDVeLoTUnd7bI"
const PREFIX = "ko "

bot.on("ready", () => {
    console.log(`Logged in as ${bot.user.tag}!`)
})
bot.login(TOKEN)

bot.on("message", async message => {
    if (message.author.equals(bot.user)) return
    if (!message.content.startsWith(PREFIX)) return
    doCommand(message)

    // const command = msg.content.split(" ")[1]
    // const rest = msg.content.substring(
    //     msg.content.indexOf(command) + command.length + 1
    // )
    
})

/*
* Schedulers
*/

// Bom dia
const dailyTasksSchedule = schedule.scheduleJob("0 8 * * 1-5", function() {
    Tasker.showDailyTasks()
})

// Pedir tarefas do próximo dia
const chargeFirstSchedule = schedule.scheduleJob("0 19 * * 1-5", function() {
    Charger.chargeNextTasks()

    // 2 hours
    // setTimeout(Charger.chargeNextSecondTime, 7200000)
    setTimeout(Charger.chargeNextSecondTime, 600000)
})

// Pedir tarefas pela segunda vez
// const chargeSecondSchedule = schedule.scheduleJob("51 * * * *", function() {
//     Charger.chargeNextSecondTime()
// })

module.exports = bot
