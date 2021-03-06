const mongoose = require("mongoose")
const Schema = mongoose.Schema
const ObjectId = Schema.ObjectId

const TaskSchema = new Schema({
    discordUser: String,
    status: String,
    description: String,
    type: String,
    lastSkip: Date,
})

class TaskModel {
    constructor() {
        this.model = mongoose.model("Task", TaskSchema, "Task")
    }

    async createTask(task, cb) {
        await this.model.create(task, err => {
            console.log(err)
            cb(err)
        })
    }
}

module.exports = new TaskModel()
