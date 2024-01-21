import axios from 'axios'
import ListTripModel from '../models/ListTripModel.js'
import RumaModel from '../models/RumaModel.js'

export const getAllListTrip = async (req, res) => {
    try {
        const response = await axios.get(`${process.env.FLASK_URL}/tripGeology`);
        const data = response.data

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
                // guardar el n_travels
                rumas.n_travels = rumas.travels.length;
                await rumas.save();
            } else {
                return res.status(400).json({ status: false, message: 'La ruma proporcionada no existe' });
            }
        }

        await newListTrip.save();

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

        await ListTripModel.updateOne({_id: travel_Id}, req.body)

        return res.status(200).json({ status: true, message: 'List Trip updated' })

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