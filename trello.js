const Trello = require("trello");
const trello = new Trello('dd848ae6c2e646a8f0a836fdeb61bb1e', "3a5c03f8edb9251571154d5b285fe6c6571a2db33c13f83b212ef45b4cc43a72");
const androdyID = '5146068fca3c512414000bae'
const korujaID = '5778488ff25064ccc045d8d8'
const boardTasksID = '5c1bc533b7a78a1c2a7d1b36'

// trello.addCard('Clean car', 'Wax on, wax off', myListId,
//     function (error, trelloCard) {
//         if (error) {
//             console.log('Could not add card:', error);
//         }
//         else {
//             console.log('Added card:', trelloCard);
//         }
//     });

// trello.getBoards(androdyID, (err, boards) => {
//     // console.log(boards)
//     boards.map(e => {
//         if (e.name == 'Tasks') {
//             console.log(e)
//         }
//     })
// })

trello.getListsOnBoard(boardTasksID, (err, lists) => {
    console.log('Listas: ', lists)
    lists.map(l => {
        trello.getCardsOnList(l.id, (err, card) => {
            console.log('Card :', card)
        });
    })
})