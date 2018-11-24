const splitargs = require("splitargs")
const minimist = require("minimist")

const Task = require("./managers/Task")
const Charge = require("./managers/Charge")
const Watcher = require("./managers/Watcher")
const Helper = require("./helper")

const doCommand = message => {
    const commands = minimist(splitargs(message.content))
    const command = commands._[1]
    switch (command) {
    case "task":
        taskCommands(commands, message)
        break
    case "help":
        Helper.showCommands(message)
        break
    case "next":
        if (message.author.id == "130404454401835008") {
            Charge.chargeNextTasks(message)
        }
        break
    case "next2":
        Charge.chargeNextSecondTime()
        break
    case "bomdia":
        Task.showDailyTasks()
        break
    case "chargeTasks":
        Charge.chargeIfTasksDone()
        setTimeout(Charge.chargeIfTasksDoneSecondTime, 10000)
        break
    case "status":
        Watcher.listServices()
        break
    default:
        message.reply(
            "Comando inválido. Tente **ko help** para ver a lista de comandos"
        )
        break
    }
}

const taskCommands = (commands, message) => {
    const command = commands._[2]
    switch (command) {
    case "add":
        Task.add(commands._[3], message)
        break
    case "done":
        Task.complete(commands._[3], message)
        break
    case "delete":
        Task.cancel(commands._[3], message)
        break
    case "list":
        Task.list(commands.a, message)
        break
    case "ls":
        Task.list(commands.a, message)
        break
    case "skip":
        Task.skip(message)
        break
    default:
        Task.list(commands.a, message)
        break
    }
}

module.exports = {
    doCommand
}
