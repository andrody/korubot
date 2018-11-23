const WatcherModel = require("../models/WatcherModel")
const { CHANNEL_GENERAL } = require("../contants")

const bot = require("../discord").bot
const https = require("https")
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
                if (service.status !== statusType.ONLINE) {
                    service.lastChange = new Date()
                }
                service.errorCount = 0
                service.status = statusType.ONLINE
                service.lastCheck = new Date()
                service.save()
            })
            .on("error", err => {
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
            })
    })
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
        channel.send("Serviço " + service.name + " está fora do ar")
    }, 5000)
}

const createService = async service => {
    const serviceCreated = await WatcherModel.model.create(service, err => {
        console.log(err)
    })
    console.log(serviceCreated)
}

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

module.exports = {
    watch,
    createService
}
