import axios from 'axios'

import ListTripModel from '../models/ListTripModel.js'
import RumaModel from '../models/RumaModel.js'

export const getAllListTrip = async (req, res) => {
    try {
        const response = await axios.get(`${process.env.FLASK_URL}/tripGeology`);
        const data = response.data;

        const dataTotal = data.total

        const listTrip = await ListTripModel.find({}, { createdAt: 0 })

        const dataTotalFiltered = dataTotal.filter((i) => {
            return !listTrip.some((j) => {
                return i.travel_Id === j.travel_Id
            })
        })

        return res.status(200).json(dataTotalFiltered);

    } catch (error) {
        res.json({ message: error.message });
    }
};

export const createListTrips = async (req, res) => {
    try {
        const { travel_Id, fecha, hora, turno, operador, vehiculo, vagones, mina, tipo, tajo, ton, tonh, material, ruma, ley_ag, ley_fe, ley_mn, ley_pb, ley_zn, fecha_abast, datetime, statusMina, validMina, statusGeology, validGeology } = req.body;

        const existingRecord = await ListTripModel.findOne({ travel_Id });

        if (existingRecord) {
            return res.status(200).json({ status: false, message: 'Este viaje ya está registrado' });
        }

        const newListTrip = new ListTripModel({ travel_Id, fecha, hora, turno, operador, vehiculo, vagones, mina, tipo, tajo, ton, tonh, material, ruma, ley_ag, ley_fe, ley_mn, ley_pb, ley_zn, fecha_abast, datetime, statusMina, validMina, statusGeology, validGeology });

        if (ruma) {
            const rumas = await RumaModel.findOne({ ruma_Id: ruma });

            if (rumas) {
                rumas.travels.push(newListTrip._id);
                await rumas.save();
            } else {
                return res.status(400).json({ status: false, message: 'La ruma proporcionada no existe' });
            }
        }

        await newListTrip.save();

        return res.status(200).json({ status: true, message: 'List Trip created successfully' });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
}

export const getListGeology = async (req, res) => {
    try {

        const mining = req.query.mining;
        const month = req.query.month;

        const array = req.query.array;

        // const array = req.body

        console.log(array);

        // const array = ['year', 'month', 'mining', 'date_extraction']

        // const response = await axios.get(`${process.env.FLASK_URL}/datageology?mining=${mining}&month=${month}`);
        const response = await axios.get(`${process.env.FLASK_URL}/datageology`);
        
        const response1 = await axios.get(`${process.env.FLASK_URL}/datageology?array=${array}`);


        const data = response.data;

        return res.status(200).json(data);

    } catch (error) {
        res.json({ message: error.message });
    }
};

export const getGroup = async (req, res) => {
    try {

        console.log(req.body);

        const response = await axios.post(`${process.env.FLASK_URL}/analysis`, req.body);

        const data = response.data;

        return res.status(200).json({status: true, data: data});

    } catch (error) {
        res.json({ message: error.message });
    }
}