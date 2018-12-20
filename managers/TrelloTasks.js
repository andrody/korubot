const Trello = require("trello");
const trello = new Trello('dd848ae6c2e646a8f0a836fdeb61bb1e', "3a5c03f8edb9251571154d5b285fe6c6571a2db33c13f83b212ef45b4cc43a72");
const boardTasksID = '5c1bc533b7a78a1c2a7d1b36'

const chargeAll = async () => {
    const tasks = await getFromTrello()
    console.log(tasks)
}

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
// const getFromTrello = async () => {
//     return new Promise((resolve, reject) => {
//         trello.getListsOnBoard(boardTasksID, async (err, lists) => {
//             if (err) reject(err)
//             console.log('lists', lists)
//             const tasks = await Promise.all(lists.map(l => {
//                 await new Promise((resolve2, reject2) => {
//                     trello.getCardsOnList(l.id, (err, card) => {
//                         console.log('card', card)
//                         if (err) {
//                             reject(err)
//                         }
//                         // console.log('Card :', card)
//                     })
//                 }))

//             })

//             console.log('tasks11', tasks)
//             resolve(tasks)
//         })
//     })
// }

chargeAll()