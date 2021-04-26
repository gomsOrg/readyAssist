const mongoose = require( 'mongoose')
const slotData = require( './model')
const moment = require('moment')
const _ = require('lodash')
const { mongoUrl } = require( './constants')
const express = require('express')
const bodyParser = require('body-parser')
const ParkingLot = require('./controller')
const router = express.Router()
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => '')
const storey = ['A1', 'A2', 'A3', 'B1', 'B2', 'B3']
const parking = new ParkingLot()
router.use(bodyParser.urlencoded({ extended: false }))
router.use(bodyParser.json())

router.put('/add', async (req, res, next) => {
  let response = {}
  if (req.body.vehicle === 'bus') {
    response.data = ''
    const slotValue = [req.body.slot, (parseInt(req.body.slot) + 1).toString(), (parseInt(req.body.slot) + 2).toString()]
    for (let z = 0; z < slotValue.length; z++) {
      req.body.slot = slotValue[z]
      let returnValue = await parking.updateVehicleSlot(req)
      response.message = returnValue.message
      response.data += `${returnValue.data} `
    }
  } else {
    response = await parking.updateVehicleSlot(req)
  }
  res.json(response)
  next()
})

router.put('/exit', async (req, res, next) => {
  let response = {}
  let cost = ''
  const costValue = await parking.getVehicleTime(req)
  if (_.isObject(costValue.userData) && !_.isEmpty(costValue.userData)) {
    const inTime = new moment(costValue.userData.intime)
    const outTime = new moment()
    var duration = moment.duration(outTime.diff(inTime))
    var hours = Math.ceil(duration.asHours())
    if (costValue.type === 'car') {
      if (costValue.vehicle === 'bus') {
        if (hours > 24) {
          cost = (24 * 60) + (hours - 24) * (60 * 1.5)
        } else {
          cost = (hours * 60)
        }
      } else {
        if (hours > 72) {
          cost = (72 * 20) + (hours - 72) * (20 * 1.5)
        } else {
          cost = (hours * 20)
        }
      }
    } else {
      if (hours > 24) {
        cost = (24 * 10) + (hours - 24) * (10 * 1.5)
      } else {
        cost = (hours * 10)
      }
    }
  }
  req.body = {
    "status": "free",
    "slot": `${req.body.slot}`,
    "storey": `${req.body.storey}`,
    "vehicle": "",
    "userData": {
        "name": "",
        "mobile": "",
        "vehicleNumber": "",
        "intime": "",
        "info": ""
    }
  }
  if (req.body.vehicle === 'bus') {
    response.data = ''
    const slotValue = [req.body.slot, (parseInt(req.body.slot) + 1).toString(), (parseInt(req.body.slot) + 2).toString()]
    for (let z = 0; z < slotValue.length; z++) {
      req.body.slot = slotValue[z]
      let returnValue = await parking.updateVehicleSlot(req)
      response.message = returnValue.message
      response.data += `${returnValue.data} `
    }
  } else {
    response = await parking.updateVehicleSlot(req)
  }
  response.cost = cost
  res.json(response)
  next()
})

router.get('/searchSlot', async (req, res, next) => {
  let response = {}
  let vehicleType = ''
  if (req.query.type === 'bus' || req.query.type === 'car') {
    vehicleType = 'car'
  }
  if (req.query.type === 'bike') {
    vehicleType = 'bike'
  }
  const busSlot = {}
  for (let i = 0; i < storey.length; i++) {
    const carSlots = []
    response = await slotData.find(
      { 
        type: vehicleType, status: req.query.status, storey: storey[i] 
      }).then(result => {
          if ((vehicleType === 'car' || vehicleType === 'bike') && req.query.status === 'free' && _.isNull(result)) {
              return {
                message: 'Parking is full. Please wait for sometime',
                data: 0
              }
          } else {
            if (req.query.type === 'car' || req.query.type === 'bike') {
              i = storey.length + 1
              return {
                message: "Slot found for the vehicle",
                data: `${result[0].storey} - ${result[0].slot}`
              }
            } else {
              _.forEach(result, (value) => {
                carSlots.push(parseInt(value.slot))
                busSlot[value.storey] = carSlots
              })
              for (let [slotName, slotArray] of Object.entries(busSlot)) {
                let isConsecutive
                if (slotArray.length >= 2) {
                  isConsecutive = parking.areConsecutive(slotArray.sort())
                  if (isConsecutive.length >= 3) {
                    return {
                      message: "Slot found for the vehicle",
                      data: `${slotName} - ${(isConsecutive.slice(0,3))[0]}, ${(isConsecutive.slice(0,3))[1]}, ${(isConsecutive.slice(0,3))[2]}`
                    }
                  }
                }
              }
            }
          }
    })
    .catch(error => {
          return {
            message: `${error}`
          }
      })
  }
  if (_.isUndefined(response)) {
    response = {
                message: 'Parking is full. Please wait for sometime',
                data: 0
              }
  }
  res.json(response)
  next()
})  

module.exports = router
