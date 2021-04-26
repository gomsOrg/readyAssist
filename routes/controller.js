const mongoose = require( 'mongoose')
const slotData = require( './model')
const moment = require('moment')
const { mongoUrl } = require( './constants')
mongoose.connect(mongoUrl, { useNewUrlParser: true })
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('connected to database'))


class ParkingLot {

    async updateVehicleSlot (req) {
        return await slotData.findOneAndUpdate(
          {
            slot: req.body.slot,
            storey: req.body.storey
          },
          { $set: req.body },
          {
          upsert: true,
          new: true,
          rawResult: true
          }).then(result => {
          return {
            message: "Slot updated for the vehicle",
            data: `${result.value.storey} - ${result.value.slot}`
          }
         })
        .catch(error => {
          return {
            message: `${error}`
          }
        })
    }
    
    async getVehicleTime (req) {
        return await slotData.findOne(
          {
            slot: req.body.slot,
            storey: req.body.storey
          }).then(result => {
          return result
         })
        .catch(error => {
          return {
            message: `${error}`
          }
        })
    }

    async areConsecutive(slotNum) {
        console.log(slotNum)
        let chunks = []
        let prev = 0
    
        slotNum.forEach((current) => {
          console.log(current)
          if ( current - prev != 1 ) chunks.push([])
          chunks[chunks.length - 1].push(current)
          prev = current
        })
    
        chunks.sort((a, b) => b.length - a.length)
        return chunks
    }
}

module.exports = ParkingLot
