/*
* Schedulers
*/
const scheduler = require("node-schedule")
const Task = require("./managers/Task")
const Charge = require("./managers/Charge")
const Watcher = require("./managers/Watcher")

// Bom dia as 8h
scheduler.scheduleJob("0 8 * * 1-5", function() {
    Task.showDailyTasks()
})

// Pedir tarefas do próximo dia
scheduler.scheduleJob("0 20 * * 0-4", function() {
    Charge.chargeNextTasks()
    setTimeout(Charge.chargeNextSecondTime, 7200000)
})

// Perguntar se tarefas foram feitas
scheduler.scheduleJob("0 19 * * 1-5", function() {
    Charge.chargeIfTasksDone()
    setTimeout(Charge.chargeIfTasksDoneSecondTime, 7200000)
})

/* Watcher
=================================== */
Watcher.watch()
setInterval(() => {
    Watcher.watch()
}, 1800000)


// scheduler.scheduleJob("0 * * * 1-5", function() {
//     Charge.chargeIfTasksDone()
//     setTimeout(Charge.chargeIfTasksDoneSecondTime, 7200000)
// })

//     // 2 hours
//     // setTimeout(Charger.chargeNextSecondTime, 7200000)
//     setTimeout(Charger.chargeNextSecondTime, 600000)