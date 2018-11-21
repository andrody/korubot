/*
* Schedulers
*/
const scheduler = require("node-schedule")
const Task = require("./managers/Task")
const Charge = require("./managers/Charge")

// Bom dia as 8h
scheduler.scheduleJob("0 8 * * 1-5", function() {
    Task.showDailyTasks()
})

// Pedir tarefas do próximo dia
scheduler.scheduleJob("0 20 * * 1-5", function() {
    Charge.chargeNextTasks()
})

// Perguntar se tarefas foram feitas
scheduler.scheduleJob("0 19 * * 1-5", function() {
    Charge.chargeIfTasksDone()
    setTimeout(Charge.chargeIfTasksDoneSecondTime, 7200000)
})

//     // 2 hours
//     // setTimeout(Charger.chargeNextSecondTime, 7200000)
//     setTimeout(Charger.chargeNextSecondTime, 600000)