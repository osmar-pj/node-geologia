import PlantaModel from '../models/PlantaModel.js'
import PilaModel from '../models/PilaModel.js'
import axios from 'axios'
const socket = require('../socket.js').socket

export const getPlantaList = async (req, res) => {
  try {
    const trips = await PlantaModel.find().sort({createdAt: 'desc'}).limit(50)
    if (!trips) return res.status(404).json({ message: 'No trips found' })
    const data = trips
    const columns = [
        { title: 'Id', field: 'id_planta', fn: '', und: '', type: 'unique', group: false},
        { title: 'Año', field: 'year', fn: '', und: '', type: 'time', group: false},
        { title: 'Mes', field: 'month', fn: '', und: '', type: 'time', group: false},
        { title: 'Fecha', field: 'date', fn: 'date', und: '', type: 'time', group: false},
        // { title: 'Estado', field: 'status', fn: '', und: '', type: 'categorical', group: true},
        { title: 'Ubicación', field: 'ubication', fn: 'arr', und: '', type: 'categorical', group: true},
        { title: 'Tableta', field: 'cod_tableta', fn: '', und: '', type: 'unique', group: false},
        { title: 'Turno', field: 'turn', fn: '', und: '', type: 'categorical', group: true},
        // { title: 'Nivel', field: 'level', fn: '', und: '', type: 'categorical', group: true},
        // { title: 'Tipo', field: 'type', fn: '', und: '', type: 'categorical', group: true},
        { title: 'Veta', field: 'veta', fn: 'arr', und: '', type: 'categorical', group: true},
        { title: 'Tajo', field: 'tajo', fn: 'arr', und: '', type: 'categorical', group: true},
        { title: 'Dominio', field: 'dominio', fn: 'arr', und: '', type: 'categorical', group: true},
        { title: 'Zona', field: 'zona', fn: 'arr', und: '', type: 'categorical', group: true},
    ]
    
    const staticColumns = [
        // { title: 'Ton', field: 'ton', fn: 'fixed', und: 'TM' },
        { title: 'Tonh', field: 'tonh', fn: 'fixed', und: 'TMH' },
        { title: 'Ley Ag', field: 'ley_ag', fn: 'fixed', und: '' },
        { title: 'Ley Fe', field: 'ley_fe', fn: 'fixed', und: '' },
        { title: 'Ley Mn', field: 'ley_mn', fn: 'fixed', und: '' },
        { title: 'Ley Pb', field: 'ley_pb', fn: 'fixed', und: '' },
        { title: 'Ley Zn', field: 'ley_zn', fn: 'fixed', und: '' },
    ]

    const header = [...columns, ...staticColumns]
    return res.status(200).json({status: true, data: data, header: header, grouped: columns.filter(i => i.group === true)} )
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

export const getListFiltered = async (req, res) => {
    try {
        const {ts, arr, category} = req.body
        const limit = arr.length === 0 ? 50 : 10000
        const trips = await PlantaModel.find({}).sort({createdAt: -1}).limit(limit).populate('pilaId')
        if (!trips) return res.status(404).json({ message: 'No trips found' })
        const columns = [
            { title: 'Id', field: 'id_planta', fn: '', und: '' },
            { title: 'Año', field: 'year', fn: '', und: '' },
            { title: 'Mes', field: 'month', fn: '', und: '' },
            { title: 'Fecha', field: 'date', fn: 'date', und: '' },
            // { title: 'Zona', field: 'zona', fn: '', und: '' },
            { title: 'Ubicación', field: 'ubication', fn: '', und: '' },
            { title: 'Tableta', field: 'cod_tableta', fn: '', und: '' },
            { title: 'Turno', field: 'turn', fn: '', und: '' },
            { title: 'Mina', field: 'mining', fn: '', und: '' },
            { title: 'Zona', field: 'zona', fn: 'arr', und: '' },
            { title: 'Veta', field: 'veta', fn: 'arr', und: '' },
            { title: 'Tajo', field: 'tajo', fn: 'arr', und: '' },
            { title: 'Dominio', field: 'dominio', fn: 'arr', und: '' }
        ]
        const staticColumns = [
            // { title: 'Ton', field: 'ton', fn: 'fixed', und: 'TM' },
            { title: 'Tonh', field: 'tonh', fn: 'fixed', und: 'TMH' },
            { title: 'Ley Ag', field: 'ley_ag', fn: 'fixed', und: '' },
            { title: 'Ley Fe', field: 'ley_fe', fn: 'fixed', und: '' },
            { title: 'Ley Mn', field: 'ley_mn', fn: 'fixed', und: '' },
            { title: 'Ley Pb', field: 'ley_pb', fn: 'fixed', und: '' },
            { title: 'Ley Zn', field: 'ley_zn', fn: 'fixed', und: '' }
        ]

        const filterColumns = columns.filter((col) => arr.includes(col.field));
        const orderColumns = arr.map((item) => filterColumns.find((col) => col.field === item));
        
        if (arr.length === 0) {
            const data = trips
            const header = [...columns, ...staticColumns]
            return res.status(200).json({status: true, len: data.length, data: data, header: header});
        } else {
            const response = await axios.post(`${process.env.FLASK_URL}/analysis/planta`, {ts: Math.floor(ts/1000), arr, trips, category})
            const data = response.data
            const header = [...orderColumns, ...staticColumns];
            return res.status(200).json({status: true, len: data.length, data: data.data, header: header});
        }
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
                mining: pila.mining,
                turn: trip.turn,
                operator: trip.operator,
                tag: trip.tag,
                contract: trip.contract,
                cod_tableta: trip.cod_tableta,
                ton: trip.ton,
                tonh: trip.tonh,
                zona: pila.zona,
                dominio: pila.dominio,
                veta: pila.veta,
                tajo: pila.tajo,
                ubication: pila.ubication,
                tajo: pila.tajo,
                ley_ag: pila.ley_ag,
                ley_fe: pila.ley_fe,
                ley_mn: pila.ley_mn,
                ley_pb: pila.ley_pb,
                ley_zn: pila.ley_zn,
                tmh_ag: pila.tmh_ag,
                tmh_fe: pila.tmh_fe,
                tmh_mn: pila.tmh_mn,
                tmh_pb: pila.tmh_pb,
                tmh_zn: pila.tmh_zn,
                timestamp: trip.timestamp,
                dateCreatedAt: trip.dateCreatedAt,
                nro_month: trip.nro_month,
                statusMina: trip.statusMina,
                validMina: trip.validMina,
                pilaId: pila._id
            }
            const newTrip = new PlantaModel(data)
            socket.io.emit('planta', newTrip)
            pila.stock -= trip.tonh
            const pilaUpdated = await PilaModel.findByIdAndUpdate(pila._id, {stock: pila.stock}, {new: true})
            socket.io.emit('pilas', [pilaUpdated])
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