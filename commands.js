const splitargs = require("splitargs")
const minimist = require("minimist")

const Task = require("./managers/Task")
const Charge = require("./managers/Charge")

const doCommand = message => {
    const commands = minimist(splitargs(message.content))
    const command = commands._[1]
    switch (command) {
        case "add":
            Task.add(commands[2], message)
            break
        case "done":
            Task.complete(rest.trim(), msg)
            break
        case "arregar":
            Task.cancel(rest.trim(), msg)
            break
        case "folgar":
            msg.reply(
                "Esse comando ainda não foi implementado, sorry!!! TRABALHA VAGABUNDOOO!"
            )
            break
        case "tasks":
            if (msg.content.split(" ")[2] == "-a") {
                Task.listAllTasks(msg)
            } else {
                Task.listTasks(msg)
            }
            break
        case "help":
            Helper.showCommands(msg)
            break
        case "next":
            if (msg.author.id == "130404454401835008") {
                Charge.chargeNextTasks(msg)
            }
            break
        case "next2":
            Charge.chargeNextSecondTime()
            break
        case "bomdia":
            Task.showDailyTasks()
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
