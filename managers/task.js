const Charger = require("./charger")
const TaskModel = require("./models/TaskModel")
const CHANNEL_ID = "130406987388289025"

// Discord Imports
const Discord = require("discord.js")
const bot = require("./discord").bot
const RichEmbed = new Discord.RichEmbed()

const allUsers = [
    { discordUser: "130404454401835008", name: "Andrody" },
    { discordUser: "132292098752905216", name: "Bruno" },
    { discordUser: "133715213240369152", name: "Mero" },
    { discordUser: "132295133914726401", name: "Isaac" },
]

/*
 *  Add Task
 */
const add = async (commands, message) => {
    const userTasks = await TaskModel.find({
        discordUser: message.author.id,
        status: "OPEN"
    })
    let type = "TASK_1"
    if (userTasks.length == 2) {
        message.reply(
            "Você já tem duas tarefas cadastradas, delete ou conclua uma para adicionar novas tarefas.\nDigite **!help** para ver os todos os comandos."
        )
        return
    }
    if (userTasks.length == 1) {
        userTasks[0].type = "TASK_1"
        userTasks[0].save(err => console.log(err))
        type = "TASK_2"
    }
    await Task.createTask(
        {
            discordUser: message.author.id,
            status: "OPEN",
            description: commands,
            type
        },
        () => listTasks(msg)
    )

    Charger.clearCharge(msg.author.id)
}

const completeTask = async (taskNumber, msg) => {
    const task = await Task.Model.findOne({
        type: "TASK_" + taskNumber,
        status: "OPEN",
        discordUser: msg.author.id
    })
    if (task) {
        task.status = "DONE"
        await task.save()
        msg.channel.send(
            ":checkered_flag: **" +
                msg.author.username +
                "** concluiu a tarefa  :confetti_ball::tada::tada:*" +
                task.description +
                "* :tada::tada::confetti_ball:"
        )
        listTasks(msg)
    } else {
        msg.reply("Você não tem nenhuma tarefa com a numeração " + taskNumber)
    }
}

const cancelTask = async (taskNumber, msg) => {
    const task = await Task.Model.findOne({
        type: "TASK_" + taskNumber,
        status: "OPEN",
        discordUser: msg.author.id
    })
    if (task) {
        task.status = "DONE"
        await task.save()
        msg.reply(
            "Você desistiu de fazer a tarefa *" +
                task.description +
                "*. Que vergonha! :unamused: :unamused: "
        )
    } else {
        msg.reply("Essa task não existe mongol")
    }
}

const listTasks = async msg => {
    const tasks = await Task.Model.find({
        status: "OPEN",
        discordUser: msg.author.id
    })
    const embed = RichEmbed.setTitle(
        "Tarefas abertas do **" + msg.author.username + "**"
    )
        .setColor("#2ecc71")
        .setDescription(
            tasks.map(
                (t, i) =>
                    ":balloon:  (" +
                    t.type.substring(5) +
                    ")   " +
                    t.description
            )
        )
    msg.channel.send(embed)
}

const listAllTasks = async msg => {
    const tasks = await Task.Model.find({
        status: "OPEN"
    })

    allUsers.map(u => {
        if (tasks.findIndex(t => t.discordUser == u.discordUser) > -1) {
            const embed = RichEmbed.setTitle(
                "Tarefas abertas do **" + u.name + "**"
            )
                .setColor("#2ecc71")
                .setDescription(
                    tasks
                        .filter(t => t.discordUser == u.discordUser)
                        .map(
                            (t, i) =>
                                ":balloon:  (" +
                                t.type.substring(5) +
                                ")   " +
                                t.description
                        )
                )
            msg.channel.send(embed)
        }
    })
}

const getAllTasks = async msg => {
    const tasks = await Task.Model.find({
        status: "OPEN"
    })

    return allUsers.map(u => {
        if (tasks.findIndex(t => t.discordUser == u.discordUser) > -1) {
            return RichEmbed.setTitle(
                "Tarefas abertas do **" + u.name + "**"
            )
                .setColor("#2ecc71")
                .setDescription(
                    tasks
                        .filter(t => t.discordUser == u.discordUser)
                        .map(
                            (t, i) =>
                                ":balloon:  (" +
                                t.type.substring(5) +
                                ")   " +
                                t.description
                        )
                )
        }
    })
}

const showDailyTasks = async () => {
    const userTasks = await getAllTasks()
    if (userTasks.length) {
        const channel = bot.channels.get(CHANNEL_ID)
        channel.send([
            "Bom dia meus queridos! Que belo dia para fazer a Koruja crescer!",
            "Vamos olhar as tarefas que temos cadastradas para hoje..."
        ])
        userTasks.map(tasks => {
            if (tasks) {
                channel.send(tasks)
            }
            return
        })
    }
}

module.exports = {
    add,
    completeTask,
    cancelTask,
    listTasks,
    listAllTasks,
    showDailyTasks
}
