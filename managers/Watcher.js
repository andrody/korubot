const WatcherModel = require("../models/WatcherModel")
const { CHANNEL_GENERAL } = require("../constants")

const bot = require("../discord").bot
const https = require("https")
const columnify = require("columnify")
const distanceInWords = require("date-fns/distance_in_words")
const http = require("http")
const statusType = {
    ONLINE: "ONLINE",
    OFFLINE: "OFFLINE"
}

const watch = async () => {
    const services = await WatcherModel.model.find({
        active: true
    })

    services.map(service => {
        const requester =
            service.url.toString().indexOf("https") === 0 ? https : http
        requester
            .get(service.url, resp => {
                updateServiceOnline(service)
            })
            .on("error", err => {
                if (err.code == "UNABLE_TO_VERIFY_LEAF_SIGNATURE") {
                    updateServiceOnline(service)
                } else {
                    if (service.status !== statusType.OFFLINE) {
                        service.lastChange = new Date()
                    }
                    if (service.errorCount == 1 || service.errorCount % 6 == 0) {
                        notifyError(service)
                    }
                    service.errorCount += 1
                    service.status = statusType.OFFLINE
                    service.lastCheck = new Date()
                    service.save()
                }
            })
    })
}

const updateServiceOnline = (service) => {
    if (service.status !== statusType.ONLINE) {
        service.lastChange = new Date()
    }
    service.errorCount = 0
    service.status = statusType.ONLINE
    service.lastCheck = new Date()
    service.save()
}

const notifyError = service => {
    console.log(
        "Error no serviço:",
        service.name,
        "Numero de ocorrências: ",
        service.errorCount
    )
    setTimeout(() => {
        const channel = bot.channels.get(CHANNEL_GENERAL)
        channel.send(
            ":fire::fire::no_entry_sign: :no_entry_sign:  Serviço **" +
                service.name +
                " " +
                service.enviroment +
                "** está fora do ar :no_entry_sign: :no_entry_sign: :fire::fire:"
        )
    }, 5000)
}

const listServices = async () => {
    watch()
    const services = await WatcherModel.model.find({}).sort("order")   
    const channel = bot.channels.get(CHANNEL_GENERAL)
    channel.send(
        "```css\n" +
            columnify(
                services.map(s => ({
                    emoji: ":balloon:",
                    name: s.name,
                    status:
                        s.status == statusType.OFFLINE ? ":OFFLINE" : "#ONLINE",
                    enviroment: s.enviroment,
                    lastChange: distanceInWords(new Date(), s.lastChange),
                    lastCheck: distanceInWords(new Date(), s.lastCheck)
                })),
                {
                    columns: [
                        "name",
                        "status",
                        "enviroment",
                        "lastChange",
                        "lastCheck"
                    ],
                    minWidth: 15,
                    config: {
                        name: { minWidth: 30 }
                    }
                }
            ) +
            "```"
    )
}

const createService = async service => {
    const serviceCreated = await WatcherModel.model.create(service, err => {
        console.log(err)
    })
    console.log(serviceCreated)
}

// API Staging
// createService({
//     name: "API do GanhoMais",
//     enviroment: "Staging",
//     url: "http://api.ganhomais.com.br:5001/api",
//     status: "",
//     active: true,
//     lastChange: new Date(),
//     lastCheck: new Date(),
//     errorCount: 0,
//     order: 0
// })
// Backoffice Staging
// createService({
//     name: "Backoffice do GanhoMais",
//     enviroment: "Staging",
//     url: "http://www.ganhomais.com.br:5000",
//     status: "",
//     active: true,
//     lastChange: new Date(),
//     lastCheck: new Date(),
//     errorCount: 0,
//     order: 0
// })

// API Produção
// createService({
//     name: "API do GanhoMais",
//     enviroment: "Production",
//     url: "https://www.zaytec.com.br:3000/api/",
//     status: "",
//     active: true,
//     lastChange: new Date(),
//     lastCheck: new Date(),
//     errorCount: 0,
//     order: 0
// })
// API Produção
// createService({
//     name: "Backoffice do GanhoMais",
//     enviroment: "Production",
//     url: "https://www.zaytec.com.br:5000",
//     status: "",
//     active: true,
//     lastChange: new Date(),
//     lastCheck: new Date(),
//     errorCount: 0,
//     order: 0
// })

module.exports = {
    watch,
    createService,
    listServices
}
