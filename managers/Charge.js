// Discord Imports
const bot = require("../discord").bot
const mongoose = require('mongoose')
// const RichEmbed = require("../discord").RichEmbed
var differenceInHours = require("date-fns/difference_in_hours")

const ChargeModel = require("../models/ChargeModel")
const TaskModel = require("../models/TaskModel")
const Task = require("./Task")
const { USERS, CHANNEL_GENERAL } = require("../contants")

/*
 *  Next Tasks
 */
const chargeNextTasks = async () => {
    const freeUsers = await getUsers(true)

    // Se existe usuários livres, ele pede novas tarefas para esses usuários
    if (freeUsers.length) {
        const users_mentions = freeUsers.reduce(
            (last, value) => last + "<@" + value.discordUser + ">, ",
            ""
        )
        sendMessageChargeNext(users_mentions, freeUsers)
        ChargeModel.saveAwaitingNextCharges(freeUsers)
    }
}

const getUsers = async isFree => {
    const pendingTasks = await TaskModel.model.find({ status: "OPEN" })
    const freeUsers = USERS.filter(u => {
        const result =
            pendingTasks.findIndex(pc => pc.discordUser === u.discordUser) ===
            -1
        return isFree ? result : !result
    })
    return freeUsers
}

const getChargedUsers = async () => {
    const chargedUsers = await ChargeModel.find({
        type: "AWAITING_NEXT_TASK",
        status: "PENDING"
    })
    return chargedUsers
}

const sendMessageChargeNext = (users_mentions, freeUsers) => {
    const channel = bot.channels.get(CHANNEL_GENERAL)
    channel.send("Boa noite " + users_mentions + "!")
    if (freeUsers.length > 1) {
        channel.send(
            "Preciso que vocês adicione as duas principais tarefas que cada um de vocês vão fazer amanhã!"
        )
    } else {
        channel.send(
            "Preciso que você adicione as duas principais tarefas que você vai fazer amanhã!"
        )
    }
    // const embed = RichEmbed.setTitle("Exemplo de comando para adicionar tarefa")
    //     .setColor("#3498db")
    //     .setDescription("ko task add \"Criar testes para o chat\"")
    // channel.send(embed)
}

const chargeNextSecondTime = async () => {
    const chargedUsers = await getChargedUsers(USERS, "AWAITING_NEXT_TASK")
    chargedUsers.map(async charge => {
        const user = await bot.fetchUser(charge.discordUser)
        user.send(
            "Eai cara, eu vi que você não criou suas tarefas para amanhã. Pode criar aí por favor?"
        )
    })
}

const clearCharge = async discordUser => {
    await ChargeModel.deleteCharge(discordUser)
}

/*
 *  Charge if tasks were done
 */
const chargeIfTasksDone = async () => {
    const busyUsers = await getUsers()
    console.log('busyUsers', busyUsers)
    busyUsers.map(async u => {
        const user = await bot.fetchUser(u.discordUser)
        console.log('Cobrando se tarefas foram feita do ' + u.name)
        user.send(
            "Olá " +
                u.name +
                "! Eu vi que você tem tarefas abertas, você já terminou elas?"
        )
        Task.list(null, null, { user })
        user.send("`Caso queria adiar essas tarefas para amanha digite ko task skip\nCaso tenha terminado todas digite ko task done all`")
    })
}

const chargeIfTasksDoneSecondTime = async () => {
    const busyUsers = await getUsers()
    busyUsers.map(async u => {
        const tasks = await TaskModel.model.find({ status: "OPEN", discordUser: u.discordUser })
        let hasTasks = false
        tasks.map(t => {
            console.log(Math.abs(differenceInHours(t.lastSkip, new Date())))
            console.log(t.lastSkip)
            if (Math.abs(differenceInHours(t.lastSkip, new Date())) >= 0) {
                hasTasks = true
            }
        })
        if (hasTasks) {
            const user = await bot.fetchUser(u.discordUser)
            user.send(
                "Ow seu filha da puta! Já falei que você tem tarefa aberta, finaliza essa porra ou adia ela pra amanha!\nNão me obrigue a vir cobrar de novo viu!!?? :rage::rage::rage:  ")
        }
    })
}

module.exports = {
    chargeNextTasks,
    chargeNextSecondTime,
    chargeIfTasksDoneSecondTime,
    chargeIfTasksDone,
    clearCharge
}
