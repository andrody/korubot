const mongoose = require("mongoose")

const Schema = mongoose.Schema
const ObjectId = Schema.ObjectId

const TaskSchema = new Schema({
    discordUser: String,
    status: String,
    description: String,
    type: String
})

const Task = mongoose.model("Task", TaskSchema, "Task")

const createTask = async (task, cb) => {
    const newTask = await Task.create(task, err => {
        console.log(err)
        cb(err)
    })
}

module.exports = {
    createTask,
    Model: Task
}
