const Trello = require("trello");
const trello = new Trello('dd848ae6c2e646a8f0a836fdeb61bb1e', "3a5c03f8edb9251571154d5b285fe6c6571a2db33c13f83b212ef45b4cc43a72");
const distanceInWords = require("date-fns/distance_in_words")
const differenceInCalendarDays = require("date-fns/difference_in_calendar_days")
const bot = require("../discord").bot
const columnify = require("columnify")
const boardTasksID = '5c1bc533b7a78a1c2a7d1b36'
const { USERS, CHANNEL_GENERAL } = require("../constants")
const RichEmbed = require("../discord").RichEmbed

const getFromTrello = async () => {
    return new Promise((resolve, reject) => {
        trello.getListsOnBoard(boardTasksID, async (err, lists) => {
            let tasks = []
            await Promise.all(lists.map(async l => {
                const cards = await getCardsOnListFromTrello(l.id)
                l.cards = cards
                tasks.push(l)
            }))
            resolve(tasks.sort((a, b) => a.pos >= b.pos))
        })
    })
}

const getCardsOnListFromTrello = (id) => {
    return new Promise(function (resolve, reject) {
        trello.getCardsOnList(id, function (err, result) {
            if (err) return reject(err);
            resolve(result);
        });
    });
}

const morningChargeTasks = async () => {
    const channel = bot.channels.get(CHANNEL_GENERAL)
    channel.send([
        "Bom dia. Essas são as tarefas pendentes"
    ])
    chargeAll({channel})
}

// chargeAll()
const chargeAll = async (message) => {
    const lists = await getFromTrello()
    // const embed = RichEmbed
    //             // .setColor("#2ecc71")
    //             .setDescription(
    //                 lists
    //                     // .filter(t => t.discordUser == u.discordUser)
    //                     .map(
    //                         (l, i) =>
    //                             "**" +
    //                             l.name +
    //                             "**   " +
    //                             l.cards[0].name +
    //                             "\n"
    //                     )
    //             )
    // message.channel.send(embed)
    // let fields = []
    // console.log(lists)
    if (lists.length) {
        const response = lists
            .filter(e => e.cards.length)
            .filter(e => e.name.toLowerCase() != 'done')
            .map((e, i) => {
                const cards = e.cards.map(c => {
                    const usersObj = USERS.filter(u => c.idMembers.includes(u.trelloId))
                    let users = 'n/a'
                    if (usersObj.length) {
                        users = usersObj.map(user => user.name).join(', ')
                    }
                    // return (`${users ? (`${users} `) : ''}\"${c.name}\"`)
                    const days = c.due !== null  ? differenceInCalendarDays(c.due, new Date()) : ''
                    let timeleft = ''
                    if (days !== '') {
                        console.log(days)
                        timeleft = days === 0 ? 'HOJE!' : (days > 0 ? ('Restam ' + days + ' dias') : ('ATRASADO EM ' + Math.abs(days) + ' DIAS!!'))
                    }
                    return {
                        task: `+ ${c.name}`,
                        users,
                        timeleft
                    }
                })
                // fields.push(`${e.name.toLocaleUpperCase()}\n${cards}`)
                const columns = columnify(cards,
                    {
                        columns: [
                            "task",
                            "users",
                            "timeleft",
                        ],
                        minWidth: 15,
                        showHeaders: false,
                        config: {
                            task: { minWidth: 50, maxWidth: 50 },
                            users: { minWidth: 15 },
                        }
                    }
                )
                return `-${e.name}\n${columns}\n`
            })
        // message.channel.send({
        //     embed: {
        //     color: 0xBA8B47,
        //     // author: {
        //     //   name: 'Lista de tarefas',
        //     //   icon_url: 'https://www.clipartsfree.net/vector/small/28461-parchment-background-or-border-2-icon.png'
        //     // },
        //     title: ":scroll: Tarefas",
        //     url: "https://trello.com/b/HvIRQr0T/tasks",
        //     // description: "This is a test embed to showcase what they look like and what they can do.",
        //     fields,
        //     // timestamp: new Date(),
        //     // footer: {
        //     //   icon_url: 'https://www.clipartsfree.net/vector/small/28461-parchment-background-or-border-2-icon.png',
        //     //   text: "Listagem por departamento"
        //     // }
        //   }
        // });
    
        // const respond = "```xl\n" + fields.join('\n\n') + "[1] [a] (a)\n```"
        message.channel.send("```diff\n" + response.join('\n') + "```")
    }
}

module.exports = {
    chargeAll,
    morningChargeTasks
}