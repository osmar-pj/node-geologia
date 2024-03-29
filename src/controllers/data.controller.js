import axios from 'axios'

import TripModel from '../models/TripModel.js'
import PilaModel from '../models/PilaModel.js'

export const getAllListTrip = async (req, res) => {
    try {
        const response = await axios.get(`${process.env.FLASK_URL}/tripGeology`);
        const data = response.data;
        const dataTotal = data.total
        const listTrip = await TripModel.find({}, { createdAt: 0 })
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

export const getListGeology = async (req, res) => {
    try {
        const mining = req.query.mining;
        const month = req.query.month;
        const array = req.query.array;
        const response = await axios.get(`${process.env.FLASK_URL}/datageology`)
        const data = response.data
        return res.status(200).json(data);
    } catch (error) {
        res.json({ message: error.message });
    }
};

export const createListTrips = async (req, res) => {
    try {
        const { travel_Id, fecha, hora, turno, operador, vehiculo, vagones, mina, tipo, tajo, ton, tonh, material, ruma, ley_ag, ley_fe, ley_mn, ley_pb, ley_zn, fecha_abast, datetime, statusMina, validMina, statusGeology, validGeology } = req.body;
        const existingRecord = await TripModel.findOne({ travel_Id });

        if (existingRecord) {
            return res.status(200).json({ status: false, message: 'Este viaje ya está registrado' });
        }

        const newListTrip = new TripModel({ travel_Id, fecha, hora, turno, operador, vehiculo, vagones, mina, tipo, tajo, ton, tonh, material, ruma, ley_ag, ley_fe, ley_mn, ley_pb, ley_zn, fecha_abast, datetime, statusMina, validMina, statusGeology, validGeology });

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

export const getGroup = async (req, res) => {
    try {
        // const response = await axios.post(`${process.env.FLASK_URL}/analysis`, req.body);

        // const data = response.data;
        // const filtered = req.body.arr
        // const columns = [
        //     { title: 'Año', field: 'year', fn: '', und: '' },
        //     { title: 'Mes', field: 'month', fn: '', und: '' },
        //     { title: 'Fecha', field: 'date', fn: 'date', und: '' },
        //     { title: 'Estado', field: 'status', fn: '', und: '' },
        //     { title: 'Ubicación', field: 'ubication', fn: '', und: '' },
        //     { title: 'Turno', field: 'turn', fn: '', und: '' },
        //     { title: 'Mina', field: 'mining', fn: '', und: '' },
        //     { title: 'Nivel', field: 'level', fn: '', und: '' },
        //     { title: 'Tipo', field: 'type', fn: '', und: '' },
        //     { title: 'Veta', field: 'veta', fn: '', und: '' },
        //     { title: 'Tajo', field: 'tajo', fn: '', und: '' },
        //     { title: 'Dominio', field: 'dominio', fn: '', und: '' },
        //     { title: 'Rango', field: 'rango', fn: '', und: '' },
        //     { title: 'Fecha de abastecimiento', field: 'date_abas', fn: 'date', und: '' }
        // ]
        
        // const staticColumns = [
        //     { title: 'Ton', field: 'ton', fn: 'fixed', und: 'TM' },
        //     { title: 'Tonh', field: 'tonh', fn: 'fixed', und: 'TMH' },
        //     { title: 'Ley Ag', field: 'ley_ag', fn: 'fixed', und: '' },
        //     { title: 'Ley Fe', field: 'ley_fe', fn: 'fixed', und: '' },
        //     { title: 'Ley Mn', field: 'ley_mn', fn: 'fixed', und: '' },
        //     { title: 'Ley Pb', field: 'ley_pb', fn: 'fixed', und: '' },
        //     { title: 'Ley Zn', field: 'ley_zn', fn: 'fixed', und: '' }
        // ];

        // const filterColumns = columns.filter((col) => filtered.includes(col.field));
        // const orderColumns = filtered.map((item) => filterColumns.find((col) => col.field === item));
        
        // if (filtered.length === 0) {
        //     const header = [...columns, ...staticColumns]
        //     return res.status(200).json({status: true, data: data, header: header});
        // } else {

        //     const header = [...orderColumns, ...staticColumns];
        //     return res.status(200).json({status: true, data: data, header: header});
        // }

    } catch (error) {
        res.json({ message: error.message });
    }
}

export const getDataAnalysis = async (req, res) => {
    try {
        const ts = Math.round(req.query.ts / 1000)
        const mining = req.query.mining
        const stage = req.query.stage
        const response = await axios.get(`${process.env.FLASK_URL}/${stage}?ts=${ts}&mining=${mining}`);
        const data = response.data.result;
        const meta = response.data.meta
        return res.status(200).json({status: true, data, meta});

    } catch (error) {
        res.json({ message: error.message });
    }
}