const Trello = require("trello")
const trello = new Trello(
    "dd848ae6c2e646a8f0a836fdeb61bb1e",
    "3a5c03f8edb9251571154d5b285fe6c6571a2db33c13f83b212ef45b4cc43a72"
)
const distanceInWords = require("date-fns/distance_in_words")
const differenceInCalendarDays = require("date-fns/difference_in_calendar_days")
const bot = require("../discord").bot
const columnify = require("columnify")
const boardTasksID = "5c1bc533b7a78a1c2a7d1b36"
const { USERS, CHANNEL_GENERAL } = require("../constants")
const RichEmbed = require("../discord").RichEmbed

const koruBoardId = "5c9770d81d2ad179b66b024e"

const getBoardsFromTrello = async () => {
    return new Promise((resolve, reject) => {
        trello.getListsOnBoard(boardTasksID, async (err, lists) => {
            let boards = []
            console.log(lists)
            // await Promise.all(
            //     lists.map(async l => {
            //         const cards = await getCardsOnListFromTrello(l.id)
            //         l.cards = cards
            //         tasks.push(l)
            //     })
            // )
            // resolve(tasks.sort((a, b) => a.pos >= b.pos))
        })
    })
}

const getListsFromTrello = async () => {
    return new Promise((resolve, reject) => {
        trello.getListsOnBoard(boardTasksID, async (err, lists) => {
            let tasks = []
            await Promise.all(
                lists.map(async l => {
                    const cards = await getCardsOnListFromTrello(l.id)
                    l.cards = cards
                    tasks.push(l)
                })
            )
            resolve(tasks.sort((a, b) => a.pos >= b.pos))
        })
    })
}

const getCardsOnListFromTrello = id => {
    return new Promise(function(resolve, reject) {
        trello.getCardsOnList(id, function(err, result) {
            if (err) return reject(err)
            resolve(result)
        })
    })
}

const morningChargeTasks = async () => {
    const channel = bot.channels.get(CHANNEL_GENERAL)
    channel.send(["Bom dia. Essas são as tarefas pendentes"])
    chargeAll({ channel })
}

const chargeAll = async message => {
    try {
        const koruLists = await trello.getListsOnBoard(koruBoardId)
        const koruSprintsCards = await trello.getCardsOnList(
            koruLists.find(x => x.name === "Sprint boards").id
        )

        const separator =
            "----------------------------------------------------------------------"
        var response = []
        await Promise.all(
            koruSprintsCards.map(async spCard => {
                const lists = await trello.getListsOnBoard(spCard.desc)
                if (lists.length) {
                    const filteredList = lists.filter(
                        e =>
                            e.name.toLowerCase().includes("🚩") &&
                            !e.name.toLowerCase().includes("done")
                    )
                    const boardOpenTasks = await Promise.all(
                        filteredList.map(async (e, i) => {
                            const cards = await trello.getCardsOnList(e.id)
                            if (!cards || !cards.length) {
                                return null
                            }
                            const tasks = USERS.map(user => {
                                const cardsMapped = cards
                                    .filter(
                                        c =>
                                            c.idMembers.includes(
                                                user.trelloId
                                            ) &&
                                            c.labels.findIndex(
                                                x =>
                                                    x.name.toLowerCase() ===
                                                    "feito"
                                            ) === -1
                                    )
                                    .map(c => {
                                        const days =
                                            c.due !== null
                                                ? differenceInCalendarDays(
                                                      c.due,
                                                      new Date()
                                                  )
                                                : ""
                                        var formattedDays = ("0" + days).slice(
                                            -2
                                        )
                                        let timeleft = ""
                                        if (days !== "") {
                                            timeleft =
                                                days === 0
                                                    ? "-HOJE-"
                                                    : days > 0
                                                    ? formattedDays + " dias"
                                                    : "⚠️ ATRASADO EM " +
                                                      Math.abs(days) +
                                                      " DIAS!!"
                                        }
                                        return `__${timeleft}__  ${c.name}\n`
                                    })
                                    .join("")
                                if (cardsMapped) {
                                    return `**${user.name}**\n${cardsMapped}\n`
                                }
                                return ""
                            })
                            return `${separator}\n${e.name} - ${
                                spCard.name
                            }\n${separator}\n${tasks.join("")}`
                        })
                    )
                    // const link = `${separator}\n<${spCard.shortUrl}>\n${separator}`
                    // boardOpenTasks.push(link)
                    const listTasks = boardOpenTasks.filter(x => x !== null)
                    if (listTasks.length) {
                        response.push(listTasks)
                    }
                }
            })
        )
        message.channel.send(response.join(""))
    } catch (e) {
        console.log(e)
    }
    // trello.getListsOnBoard(koruBoardId, (err, lists) => {
    //     const sprintsList = lists.find(x => x.name === "Sprint boards")
    //     trello.getCardsOnList(sprintsList.id, (err, cards) => {
    //     })
    // })
}

module.exports = {
    chargeAll,
    morningChargeTasks
}
