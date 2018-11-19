const schedule = require("node-schedule")

const mongoose = require("mongoose")
const discord = require("./discord")
const bot = discord.bot
const database = require("./database")

const Charger = require("./charger")
const Tasker = require("./tasker")
const Helper = require("./helper")

const TOKEN = "NTEzNDMxMzA0MTc2NTMzNTA0.DtH95Q.QdLQ4hvpXNmq1AFDVeLoTUnd7bI"
const PREFIX = "ko "


bot.on("ready", () => {
    console.log(`Logged in as ${bot.user.tag}!`)
})
bot.login(TOKEN)

bot.on("message", async msg => {
    if (msg.author.equals(bot.user)) return
    if (!msg.content.startsWith(PREFIX)) return
    const command = msg.content.split(" ")[1]
    const rest = msg.content.substring(
        msg.content.indexOf(command) + command.length + 1
    )
    // Charger.chargeNextTasks(msg)
    // return
    // }
    switch (command) {
        case "add":
            if (rest.trim()) {
                Tasker.createTask(rest, msg)
            }
            break
        case "done":
            Tasker.completeTask(rest.trim(), msg)
            break
        case "arregar":
            Tasker.cancelTask(rest.trim(), msg)
            break
        case "folgar":
            msg.reply(
                "Esse comando ainda não foi implementado, sorry!!! TRABALHA VAGABUNDOOO!"
            )
            break
        case "tasks":
            if (msg.content.split(" ")[2] == "-a") {
                Tasker.listAllTasks(msg)
            } else {
                Tasker.listTasks(msg)
            }
            break
        case "help":
            Helper.showCommands(msg)
            break
        case "next":
            if(msg.author.id == '130404454401835008') {
                Charger.chargeNextTasks(msg)
            }
            break
        case "next2":
            Charger.chargeNextSecondTime()
            break
        case "bomdia":
            Tasker.showDailyTasks()
            break
        default:
            msg.reply(
                "Comando inválido. Tente **!help** para ver a lista de comandos"
            )
            break
    }
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
    setTimeout(Charger.chargeNextSecondTime, 7200000)
})

// Pedir tarefas pela segunda vez
// const chargeSecondSchedule = schedule.scheduleJob("51 * * * *", function() {
//     Charger.chargeNextSecondTime()
// })

module.exports = bot
