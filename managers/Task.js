const TaskModel = require("../models/TaskModel")
const Charge = require("./Charge")
const { USERS, CHANNEL_GENERAL } = require("../constants")

const bot = require("../discord").bot
const RichEmbed = require("../discord").RichEmbed

/*
 *  Add Task
 */
const add = async (description, message) => {
    const userTasks = await TaskModel.model.find({
        discordUser: message.author.id,
        status: "OPEN"
    })
    let type = "TASK_1"
    if (userTasks.length == 2) {
        message.reply(
            "Você já tem duas tarefas cadastradas, delete ou conclua uma para adicionar novas tarefas.\nDigite **ko help** para ver os todos os comandos."
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
            lastSkip: new Date(),
            type
        },
        () => list(false, message)
    )

    Charge.clearCharge(message.author.id)
}

/*
 *  Complete Task
 */
const complete = async (taskNumber, message) => {
    const task = await TaskModel.model.findOne({
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
        list(false, message)
    } else {
        message.reply(
            "Você não tem nenhuma tarefa com a numeração " + taskNumber
        )
    }
}

/*
 *  Cancel Task
 */
const cancel = async (taskNumber, message) => {
    const task = await TaskModel.model.findOne({
        type: "TASK_" + taskNumber,
        status: "OPEN",
        discordUser: message.author.id
    })
    if (task) {
        task.status = "CANCELLED"
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

/*
 *  Skip Task
 */
const skip = async message => {
    const task = await TaskModel.model.findOne({
        status: "OPEN",
        discordUser: message.author.id
    })
    if (task) {
        task.lastSkip = new Date()
        await task.save()
        message.reply(
            "Você adiou suas tarefas para amanhã! Ta vagundin o bixin né?"
        )
    } else {
        message.reply("Não tem nenhuma tarefa")
    }
}

/*
 *  List Task
 */
const list = async (isAllUsers, message, { user = false } = {}) => {
    if (isAllUsers) {
        listAllUsersTask(message)
    } else {
        const tasks = await TaskModel.model.find({
            status: "OPEN",
            discordUser: user ? user.discordUser : message.author.id
        })
        tasks.map(t => {
            const embed = RichEmbed.setDescription(
                "**" + t.type.substring(5) + "**   " + t.description
            ).setThumbnail(undefined)
            if (user) {
                user.send(embed)
            } else {
                message.channel.send(embed)
            }
        })
        if (!tasks.length && !user) {
            message.channel.send(
                "Você não nenhuma tarefa amorzinho. Por que não cadastra uma?"
            )
        }
    }
}

/*
 *  List All Users Task
 */
const listAllUsersTask = async message => {
    const tasks = await TaskModel.model.find({
        status: "OPEN"
    })

    USERS.map(async u => {
        const user = await bot.fetchUser(u.discordUser)
        const avatar = user.avatarURL
        if (tasks.findIndex(t => t.discordUser == u.discordUser) > -1) {
            // .setTitle(
            //     "Tarefas abertas do **" + u.name + "**"
            // )
            const embed = RichEmbed
                // .setColor("#2ecc71")
                .setDescription(
                    tasks
                        .filter(t => t.discordUser == u.discordUser)
                        .map(
                            (t, i) =>
                                "**" +
                                t.type.substring(5) +
                                "**   " +
                                t.description +
                                "\n"
                        )
                )
                .setThumbnail(avatar)
            message.channel.send(embed)
        }
    })
}

const getUserTasks = async () => {}

const getAllTasks = async message => {
    const tasks = await TaskModel.model.find({
        status: "OPEN"
    })

    return USERS.map(u => {
        if (tasks.findIndex(t => t.discordUser == u.discordUser) > -1) {
            return (
                "\n**" +
                u.name +
                "**\n" +
                tasks
                    .filter(t => t.discordUser == u.discordUser)
                    .map(
                        e =>
                            "- " +
                            e.description +
                            " (" +
                            e.type.substring(5) +
                            ")"
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
            "Bom dia. Essas são as tarefas pendentes"
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
    skip,
    listAllUsersTask,
    showDailyTasks
}

exports.list = list
