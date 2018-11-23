const mongoose = require("mongoose")
const Schema = mongoose.Schema
const ObjectId = Schema.ObjectId

const WatcherSchema = new Schema({
    name: String,
    enviroment: String,
    url: String,
    status: String,
    active: Boolean,
    lastChange: Date,
    lastCheck: Date,
    errorCount: Number,
    order: Number
})

class WatcherModel {
    constructor() {
        this.model = mongoose.model("Watcher", WatcherSchema, "Watcher")
    }
}

module.exports = new WatcherModel()
