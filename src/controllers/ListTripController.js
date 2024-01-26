import axios from 'axios'
import ListTripModel from '../models/ListTripModel.js'
import RumaModel from '../models/RumaModel.js'

const socket = require('../socket').socket

export const getAllListTrip = async (req, res) => {
    try {
        // console.log(req.query)
        // if (req.query.from == 'wagon') {
        //     console.log('wagon')
        //     return res.json({ message: 'Wagon' })
        // } else if (req.query.from == 'truck') {
        //     console.log('truck')
        //     return res.json({ message: 'Truck' })
        // } else {
            
        // }
        // ORE CONTROL
        // const listTrip = await ListTripModel.find({statusGeology: 'General'})
        // console.log(listTrip.length)
        // const response = await axios.get(`${process.env.FLASK_URL}/tripGeology`);
        // const data = response.data
        // const dataTotal = data.total
        
        const listTrip = await ListTripModel.find({statusGeology: 'OreControl'})
        
        // const dataTotalFiltered = dataTotal.filter((i) => {
        //     return !listTrip.some((j) => {
        //         return i.travel_Id === j.travel_Id
        //     })
        // })
        // console.log(dataTotalFiltered)
        return res.status(200).json(listTrip);
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
        // const response2 = await axios.get(`${process.env.FLASK_URL}/list_geology`)
        // const data2 = response2.data
        // const dataFormatted = data2.map((i) => {
        //     return {
        //         travel_Id: i.travel_Id,
        //         fecha: i.date_extraction,
        //         hora: '',
        //         turno: i.turn,
        //         operador: '',
        //         vehiculo: '',
        //         vagones: '',
        //         mina: i.mining,
        //         tipo: i.type,
        //         tajo: i.tajo,
        //         ton: i.ton,
        //         tonh: i.tonh,
        //         material: i.dominio,
        //         ruma: i.cod_tableta,
        //         ley_ag: i.ley_ag,
        //         ley_fe: i.ley_fe,
        //         ley_mn: i.ley_mn,
        //         ley_pb: i.ley_pb,
        //         ley_zn: i.ley_zn,
        //         statusMina: 'Completo',
        //         validMina: true,
        //         statusGeology: 'General',
        //         validGeology: true
        //     }
        // })
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
        socket.io.emit('ControlCalidad', tripUpdated)
        return res.status(200).json({ status: true, message: 'List Trip updated', data: tripUpdated })
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