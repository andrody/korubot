const splitargs = require("splitargs")
const minimist = require("minimist")
const Task = require("./managers/task")

const doCommand = message => {
    const commands = minimist(splitargs(message))
    const command = commands._[1]
    switch (command) {
        case "add":
            Task.add(commands, message)
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
            if (msg.author.id == "130404454401835008") {
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
}

module.exports = {
    doCommand
}
