const mongoose = require( 'mongoose')
const slotData = require( './model')
const { mongoUrl } = require( './constants')
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
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

  areConsecutive(slotNum) {
    let chunks = []
    let prev = 0

    slotNum.forEach((current) => {
      if ( (current - prev) === 1 ) {
        if (chunks.length > 0) {
            if(current - chunks[chunks.length - 1] === 1) {
            chunks.push(current)
            chunks.push(prev)
          }
        } else {
          if (current > 1) {
            chunks.push(prev)
            chunks.push(current)
          } else{
            chunks.push(current)
          }
        }
        chunks = chunks.filter( function( item, index, inputArray ) {
          return inputArray.indexOf(item) == index
        })
      }
      prev = current
    })

    return chunks.sort((a, b) => b.length - a.length)
  }
}

module.exports = ParkingLot
