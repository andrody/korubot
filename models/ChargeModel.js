const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const ChargeSchema = new Schema({
    discordUser: String,
    type: String,
    status: String,
})

class ChargeModel {
    constructor() {
        this.model = mongoose.model('Charge', ChargeSchema, 'Charge') 
    }

    saveAwaitingNextCharges = async (users) => {
        await this.model.find({ type: 'AWAITING_NEXT_TASK' }).remove().exec()
        await this.model.insertMany(
            users.map(u => ({
                discordUser: u.discordUser,
                type: "AWAITING_NEXT_TASK",
                status: 'PENDING'
            })),
            null,
            err => {
                console.log(err)
            }
        )
    }

    deleteCharge = async (discordUser) => {
        await Charge.find({ discordUser }).remove().exec()
    }
}

module.exports = new ChargeModel()