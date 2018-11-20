const TaskModel = require("./models/TaskModel")
const Charge = require("./Charge")
const { USERS, CHANNEL_GENERAL } = require("../contants")

const Discord = require("discord.js")
const bot = require("./discord").bot
const RichEmbed = new Discord.RichEmbed()

/*
 *  Add Task
 */
const add = async (description, message) => {
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
    await TaskModel.createTask(
        {
            discordUser: message.author.id,
            status: "OPEN",
            description,
            type
        },
        () => list(message)
    )

    Charge.clearCharge(message.author.id)
}

const complete = async (taskNumber, message) => {
    const task = await TaskModel.findOne({
        type: "TASK_" + taskNumber,
        status: "OPEN",
        discordUser: message.author.id
    })
    if (task) {
        task.status = "DONE"
        await task.save()
        message.channel.send(
            ":checkered_flag: **" +
                message.author.username +
                "** concluiu a tarefa  :confetti_ball::tada::tada:*" +
                task.description +
                "* :tada::tada::confetti_ball:"
        )
        list(message)
    } else {
        message.reply(
            "Você não tem nenhuma tarefa com a numeração " + taskNumber
        )
    }
}

const cancel = async (taskNumber, message) => {
    const task = await TaskModel.findOne({
        type: "TASK_" + taskNumber,
        status: "OPEN",
        discordUser: message.author.id
    })
    if (task) {
        task.status = "DONE"
        await task.save()
        message.reply(
            "Você desistiu de fazer a tarefa *" +
                task.description +
                "*. Que vergonha! :unamused: :unamused: "
        )
    } else {
        message.reply("Essa task não existe mongol")
    }
}

const list = async message => {
    const tasks = await TaskModel.find({
        status: "OPEN",
        discordUser: message.author.id
    })
    const embed = RichEmbed.setTitle(
        "Tarefas abertas do **" + message.author.username + "**"
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
    message.channel.send(embed)
}

const listAll = async message => {
    const tasks = await TaskModel.find({
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
            message.channel.send(embed)
        }
    })
}

const getAllTasks = async message => {
    const tasks = await TaskModel.find({
        status: "OPEN"
    })

    return USERS.map(u => {
        if (tasks.findIndex(t => t.discordUser == u.discordUser) > -1) {
            return RichEmbed.setTitle("Tarefas abertas do **" + u.name + "**")
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
        const channel = bot.channels.get(CHANNEL_GENERAL)
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
    complete,
    cancel,
    list,
    listAll,
    showDailyTasks
}
