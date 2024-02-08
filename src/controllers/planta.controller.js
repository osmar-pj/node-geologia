import PlantaModel from '../models/PlantaModel.js'
import PilaModel from '../models/PilaModel.js'
const socket = require('../socket.js').socket

export const getPlantaList = async (req, res) => {
  try {
    const plantas = await PlantaModel.find()
    res.json(plantas)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getPlanta = async (req, res) => {
    try {
        const planta = await PlantaModel.findById(req.params.planta_Id)
        res.json(planta)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const createPlanta = async (req, res) => {
    try {
        const trips = req.body
        const tripPromises = trips.map(async trip => {
            const pila = await PilaModel.findOne({cod_tableta: trip.cod_tableta})
            const data = {
                code: trip.code,
                month: trip.month,
                year: trip.year,
                date: trip.date,
                turn: trip.turn,
                operator: trip.operator,
                tag: trip.tag,
                contract: trip.contract,
                cod_tableta: trip.cod_tableta,
                ton: trip.ton,
                tonh: trip.tonh,
                ley_ag: pila.ley_ag,
                ley_fe: pila.ley_fe,
                ley_mn: pila.ley_mn,
                ley_pb: pila.ley_pb,
                ley_zn: pila.ley_zn,
                tmh_ag: trip.tonh * pila.ley_ag,
                tmh_fe: trip.tonh * pila.ley_fe,
                tmh_mn: trip.tonh * pila.ley_mn,
                tmh_pb: trip.tonh * pila.ley_pb,
                tmh_zn: trip.tonh * pila.ley_zn,
                timestamp: trip.timestamp,
                dateCreatedAt: trip.dateCreatedAt,
                week: trip.week,
                nro_month: trip.nro_month,
                statusMina: trip.statusMina,
                validMina: trip.validMina,
                pilaId: pila._id
            }
            const newTrip = new PlantaModel(data)
            pila.stock -= trip.ton
            const pilaUpdated = await PilaModel.findByIdAndUpdate(pila._id, {stock: pila.stock}, {new: true})
            console.log(pilaUpdated)
            socket.io.emit('pilas', pilaUpdated)
            return newTrip.save()
        })
        const newTripPlantaSaved = await Promise.all(tripPromises)

        res.status(201).json({status: true, message: 'Planta criada com sucesso', data: newTripPlantaSaved})
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

export const updatePlanta = async (req, res) => {
    try {
        const planta = await PlantaModel.findById(req.params.planta_Id)
        planta.nome = req.body.nome
        planta.descricao = req.body.descricao
        planta.imagem = req.body.imagem

        const updatedPlanta = await planta.save()
        res.json(updatedPlanta)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

export const deletePlanta = async (req, res) => {
    try {
        const planta = await PlantaModel.findById(req.params.planta_Id)
        const deletedPlanta = await planta.remove()
        res.json(deletedPlanta)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}