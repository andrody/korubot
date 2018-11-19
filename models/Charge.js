const mongoose = require('mongoose')

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const ChargeSchema = new Schema({
    discordUser: String,
    type: String,
    status: String,
})
const Charge = mongoose.model('Charge', ChargeSchema, 'Charge') 

const saveAwaitingNextCharges = async (users) => {
    await Charge.find({ type: 'AWAITING_NEXT_TASK' }).remove().exec()
    await Charge.insertMany(
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

const deleteCharge = async (discordUser) => {
    await Charge.find({ discordUser }).remove().exec()
}

module.exports = {
    saveAwaitingNextCharges,
    deleteCharge,
    Model: Charge
}