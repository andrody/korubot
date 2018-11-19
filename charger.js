const discord = require("./discord")
const Charge = require("./models/Charge")
const Task = require("./models/Task")

// Discord Imports
const Discord = require("discord.js")
const RichEmbed = new Discord.RichEmbed()
const CHANNEL_ID = "130406987388289025"
const bot = require("./discord").bot
// const bot = new Discord.Client()

const allUsers = [
    { discordUser: "130404454401835008", username: "andrody" },
    { discordUser: "132292098752905216", username: "bruno" },
    { discordUser: "133715213240369152", username: "mero" },
    { discordUser: "132295133914726401", username: "isaac" },
]

/*
 *  Next Tasks
 */
const chargeNextTasks = async msg => {
    const freeUsers = await getFreeUsers(allUsers)

    // Se existe usuários livres, ele pede novas tarefas para esses usuários
    if (freeUsers.length) {
        const users_mentions = freeUsers.reduce(
            (last, value, index) => last + "<@" + value.discordUser + ">, ",
            ""
        )
        sendMessageChargeNext(users_mentions, freeUsers)
        Charge.saveAwaitingNextCharges(freeUsers)
    }
}

const getFreeUsers = async users => {
    const pendingTasks = await Task.Model.find({ status: "OPEN" })
    const freeUsers = allUsers.filter(
        u =>
            pendingTasks.findIndex(pc => pc.discordUser === u.discordUser) ===
            -1
    )
    return freeUsers
}

const getChargedUsers = async users => {
    const chargedUsers = await Charge.Model.find({ type: "AWAITING_NEXT_TASK", status: 'PENDING' })
    return chargedUsers
}

const sendMessageChargeNext = (users_mentions, freeUsers) => {
    const channel = bot.channels.get(CHANNEL_ID)
    channel.send("Boa noite " + users_mentions + "!")
    if (freeUsers.length > 1) {
        channel.send(
            "Preciso que me digam as duas principais tarefas que vocês vão fazer amanhã!"
        )
    } else {
        channel.send(
            "Preciso que você me diga as duas principais tarefas que você vai fazer amanhã!"
        )
    }
    const embed = RichEmbed.setTitle("Exemplo de comando para adicionar tarefa")
        .setColor("#3498db")
        .setDescription("ko add Criar testes para o chat")
    channel.send(embed)
}

const chargeNextSecondTime = async () => {
    const chargedUsers = await getChargedUsers(allUsers, "AWAITING_NEXT_TASK")
    chargedUsers.map(async charge => {
        const user = await discord.bot.fetchUser(charge.discordUser)
        user.send('Eai cara, eu vi que você não criou suas tarefas para amanhã. Pode criar aí por favor?')
    })
}

const clearCharge = async (discordUser) => {
    await Charge.deleteCharge(discordUser)
}

module.exports = {
    chargeNextTasks,
    chargeNextSecondTime,
    clearCharge
}
