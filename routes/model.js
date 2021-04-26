const mongoose = require( 'mongoose')

const slotDataModel = mongoose.Schema({
    status: {
        type: String, 
        required: true
    },
    type: {
        type: String, 
        required: true
    },
    slot: {
        type: String, 
        required: true
    },
    storey: {
        type: String, 
        required: true
    },
    vehicle: {
        type: String
    },
    userData : {
        name: { 
            type: String, 
            required: true
        },
        mobile: {
            type: String,
            required: true
        },
        vehicleNumber: {
            type: String, 
            required: true
        },
        intime: {
            type: String, 
            required: true
        },
        info: {
            type: String, 
            required: true
        }
    }
})

module.exports = mongoose.model('slotData', slotDataModel)