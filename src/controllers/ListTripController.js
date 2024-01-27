import axios from 'axios'
import ListTripModel from '../models/ListTripModel.js'
import RumaModel from '../models/RumaModel.js'

const socket = require('../socket').socket

export const getAllListTrip = async (req, res) => {
    try {
        const listTrip = await ListTripModel.find({statusGeology: 'OreControl'})
        
        const header = [
            { title: 'Año', field: 'year', fn: '', und: '' },
            { title: 'Mes', field: 'month', fn: '', und: '' },
            { title: 'Fecha', field: 'date', fn: '', und: '' },
            { title: 'Estado', field: 'status', fn: '', und: '' },
            { title: 'Ubicación', field: 'ubication', fn: '', und: '' },
            { title: 'Turno', field: 'turn', fn: '', und: '' },
            { title: 'Mina', field: 'mining', fn: '', und: '' },
            { title: 'Vehiculo', field: 'tag', fn: '', und: '' },
            { title: 'Nivel', field: 'level', fn: '', und: '' },
            { title: 'Tipo', field: 'type', fn: '', und: '' },
            { title: 'Veta', field: 'veta', fn: '', und: '' },
            { title: 'Tajo', field: 'tajo', fn: '', und: '' }
            // { title: 'Semana', field: 'week', fn: 'hidden', und: '' },
            // { title: 'Nro. Mes', field: 'nro_month', fn: 'hidden', und: '' }
        ]

        return res.status(200).json({status: true, data: listTrip, header: header});
    } catch (error) {
        res.json({ message: error.message });
    }
};

export const getListTrip = async (req, res) => {
    try {
        const travel_Id = req.params.travel_Id
        const listTrip = await ListTripModel.findOne({_id: travel_Id})
        if(!listTrip) {
            return res.status(200).json({ status: false, message: 'List Trip not found' })
        }
        return res.status(200).json(listTrip)
    } catch (error) {
        res.json({ message: error.message });
    }
}

export const getListTripQualityControl = async (req, res) => {
    try {
        const listTrip = await ListTripModel.find({statusGeology: 'QualityControl'})
        if(!listTrip) {
            return res.status(404).json({ message: 'List Trip not found' })
        }
        return res.status(200).json(listTrip)
    } catch (error) {
        res.json({ message: error.message });
    }
}

export const getListTripGeneral = async (req, res) => {
    try {
        const listTrip = await ListTripModel.find({statusGeology: 'General'})
        if(!listTrip) {
            return res.status(404).json({ message: 'List Trip not found' })
        }
        return res.status(200).json(listTrip)
    } catch (error) {
        res.json({ message: error.message });
    }
}

export const createListTrip = async (req, res) => {
    try {
        const trips = req.body
        for (let i = 0; i < trips.length; i++) {
            const { month, year, date, status, ubication, turn, mining, operator, tag, contract, type, tajo, dominio, ton, tonh, timestamp, nro_month, travel_Id, statusMina, validMina, statusGeology, validGeology } = trips[i];
            const existingRecord = await ListTripModel.findOne({ travel_Id });
            if (existingRecord) {
                return res.status(200).json({ status: false, message: 'Este viaje ya está registrado' });
            }

            const newListTrip = new ListTripModel({ month, year, date, status, ubication, turn, mining, operator, tag, contract, type, tajo, dominio, ton, tonh, timestamp, nro_month, travel_Id, statusMina, validMina, statusGeology, validGeology });
            newListTrip.ton = parseFloat((ton/1000).toFixed(2))
            newListTrip.tonh = parseFloat((tonh/1000).toFixed(2))
            const tripSaved = await newListTrip.save();
            socket.io.emit('OreControl', tripSaved)
        }
        // Aumentar Rumas donde aplique

        return res.status(200).json({ status: true, message: 'List Trip created successfully' });
    } catch (error) {
        res.json({ message: error.message });
    }
}

export const updateListTrip = async (req, res) => {
    try {
        const travel_Id = req.params.travel_Id
        const listTrip = await ListTripModel.findOne({_id: travel_Id})
        if(!listTrip) {
            console.log('List Trip not found')
            return res.status(200).json({ status: false, message: 'List Trip not found' })
        }
        const tripUpdated = await ListTripModel.findOneAndUpdate({_id: travel_Id}, req.body)
        // socket.io.emit('ControlCalidad', tripUpdated)
        return res.status(200).json({ status: true, message: 'List Trip updated', data: tripUpdated })
    } catch (error) {
        res.json({ message: error.message });
    }
}

export const updateManyTrip = async (req, res) => {
    try {
        // get cod_tableta
        const tableta = req.body.cod_tableta
        const rumas = await RumaModel.find({cod_tableta: tableta})
        const rumasId = rumas.map((i) => {
            return i._id
        })
        // update many
        const tripsUpdated = await ListTripModel.updateMany({ruma: {$in: rumasId}}, req.body.data)
        // socket.io.emit('ControlCalidad', tripUpdated)
        return res.status(200).json({ status: true, message: 'List Trip updated', data: tripsUpdated })
    } catch (error) {
        res.json({ message: error.message });
    }
}

export const deleteListTrip = async (req, res) => {
    try {
        const travel_Id = req.params.travel_Id
        const listTrip = await ListTripModel.findOne({_id: travel_Id})
        if(!listTrip) {
            return res.status(404).json({ status: false, message: 'List Trip not found' })
        }
        await ListTripModel.deleteOne({_id: travel_Id})
        return res.status(200).json({ status: true, message: 'Ore Control deleted' })
    } catch (error) {
        res.json({ message: error.message });
    }
}