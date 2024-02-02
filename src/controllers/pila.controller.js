import TripModel from '../models/TripModel.js'
import PilaModel from '../models/PilaModel.js'

const socket = require('../socket.js').socket

export const getAllPilas = async (req, res) => {
    try {
        const pilas = await PilaModel.find({statusCumm: true}, { _id: 0, travels: 0})
        const pilasAvailable = pilas.filter(pila => pila.statusTransition != 'Transition' && pila.statusTransition != 'Planta' && pila.statusTransition != 'Muestreo')
        return res.status(200).json({pilas, pilasAvailable})
    } catch (error) {
        res.json({ message: error.message })
    }
}

export const getPila = async (req, res) => {
    try {
        const ruma_Id = req.params.ruma_Id
        const ruma = await PilaModel.findOne({ruma_Id: ruma_Id})
        if(!ruma) {
            return res.status(200).json({ status: false, message: 'Ruma not found' })
        }
        return res.status(200).json(ruma)
    } catch (error) {
        res.json({ message: error.message })
    }
}

export const createPila = async (req, res) => {
    try {
        const {mining} = req.body
        const lastPila = await PilaModel.findOne({native: 'GUNJOP'}).sort({ _id: -1 }).limit(1)

        let newPilaId
        if (lastPila) {
            const currentYear = new Date().getFullYear()
            const lastPilaYear = new Date(lastPila.createdAt).getFullYear()
            let newPilaNumber
            if (currentYear === lastPilaYear) {
                const lastPilaNumber = parseInt(lastPila.pila.split('-')[1], 10)
                newPilaNumber = lastPilaNumber + 1
            } else {
                newPilaNumber = 1
            }
            // ultimas 2 cifras de currentYear
            const year = currentYear.toString().slice(-2)
            newPilaId = `P${year}-${('00' + newPilaNumber).slice(-3)}`
        } else {
            newPilaId = 'P24-001'
        }
        const newPila = new PilaModel({
            // Se crea desde el viaje de un camion
            pila: newPilaId,
            cod_tableta: newPilaId,
            valid: true,
            mining: mining,
            ubication: mining === 'YUMPAG' ? 'Cancha Colquicocha' : 'Cancha 2',
            statusBelong: 'No Belong',
            statusPila: 'Creado',
            actionPila: 'Acumulando',
            ton: 0,
            tonh: 0,
            x: 100,
            // x: mining === 'YUMPAG' ? 120 : 100,
            y: 50,
            // y: mining === 'YUMPAG' ? 100 : 50,
            native: 'GUNJOP',
            stock: 0
        })
        const newPilaSaved = await newPila.save()
        socket.io.emit('ControlCalidad', [newPilaSaved])
        
        return res.status(200).json({ status: true, message: 'Pila creada exitosamente' })
    } catch (error) {
        res.json({ message: error.message })
    }
}

const rango = (ley) => {
    // switch case
    switch (true) {
        case ley >= 0 && ley <= 3:
            return '0-3'
        case ley > 3 && ley <= 4:
            return '3-4'
        case ley > 4 && ley <= 4.5:
            return '4-4.5'
        case ley > 4.5 && ley <= 5:
            return '4.5-5'
        case ley > 5 && ley <= 10:
            return '5-10'
        default:
            return '10'
    }
}

export const updatePila = async (req, res) => {
    try {
        const pila_Id = req.params.pila_Id
        const pilaUpdated = await PilaModel.findOneAndUpdate({_id: pila_Id}, req.body, {new: true})
        const trips = await TripModel.find({pila: pilaUpdated.pila})
        console.log(trips)
        // if(trips.ley_ag && trips.ley_fe && trips.ley_mn && trips.ley_pb && trips.ley_zn && trips.statusGeology === 'Laboratorio') {
        if(trips.length) {
            // updateMany trips
            const tripToUpdate = {
                cod_despacho: pilaUpdated.cod_despacho,
                ley_ag: pilaUpdated.ley_ag,
                ley_fe: pilaUpdated.ley_fe,
                ley_mn: pilaUpdated.ley_mn,
                ley_pb: pilaUpdated.ley_pb,
                ley_zn: pilaUpdated.ley_zn,
                statusGeology: 'Muestreado',
                rango: rango(pilaUpdated.ley_ag)
            }
            const updatedTrips = await TripModel.updateMany({pila: pilaUpdated.pila}, {$set: tripToUpdate}, {new: true})
            console.log(updatedTrips)
            socket.io.emit('General', updatedTrips)
        }
        return res.status(200).json({ status: true, message: 'Pila updated', data: pilaUpdated })
    } catch (error) {
        res.json({ message: error.message })
    }
}

export const deletePila = async (req, res) => {
    try {

        const pila_Id = req.params.pila_Id

        const pilaDeleted = await PilaModel.findOne({pila_Id: pila_Id})

        if(!pilaDeleted) {
            return res.status(200).json({ status: false, message: 'No existe la pila' })
        }

        await PilaModel.deleteOne({pila_Id: pila_Id})

        return res.status(200).json({ status: true, message: 'pila deleted' })
    } catch (error) {
        res.json({ message: error.message })
    }
}

export const getListPilas = async (req, res) => {
    try {
        const pilas = await PilaModel.find({statusTransition: {$ne: 'Planta'}, statusBelong: 'No Belong'}, { data: 0 })
        const staticRUmas = pilas.filter(i => i.statusCumm === true)
        const dynamicRumas = pilas.filter(i => i.statusCumm === false)
        // 
        return res.status(200).json({pilas})

    } catch (error) {
        res.json({ message: error.message })
    }
}

// export const updateOrCreatePilas = async (req, res) => {
//     try {
//         const pilas = req.body.rumas;

//         const rumaIds = pilas.map(ruma => ruma.ruma_Id)
//         const ton = pilas.map(ruma => ruma.ton)
//         const tonh = rumas.map(ruma => ruma.tonh)
//         const n_travels = rumas.map(ruma => ruma.n_travels)

//         const updateRumas = await Promise.all(rumas.map(async ruma => {
//             const updateRuma = await PilaModel.updateOne({ ruma_Id: ruma.ruma_Id }, { $set: { valid: 0, statusBelong: 'Belong' } });
//             return updateRuma;
//         }));

//         const lastRuma = await PilaModel.findOne().sort({ _id: -1 }).limit(1);
//         let newRumaId;

//         if (lastRuma) {
//             const currentYear = new Date().getFullYear();
//             const lastRumaYear = parseInt(lastRuma.ruma_Id.split('-')[1], 10);
//             let newRumaNumber;

//             if (currentYear === lastRumaYear) {
//                 const lastRumaNumber = parseInt(lastRuma.ruma_Id.split('-')[2], 10);
//                 newRumaNumber = lastRumaNumber + 1;
//             } else {
//                 newRumaNumber = 1;
//             }

//             newRumaId = `CA-${currentYear}-${('000' + newRumaNumber).slice(-3)}`;
//         } else {
//             newRumaId = 'R24-0001';
//         }

//         const newRuma = new PilaModel({
//             ruma_Id: newRumaId,
//             valid: 1,
//             statusBelong: 'Belong',
//             statusTransition: 'Planta',
//             rumas_united: rumaIds,
//             ton: ton.reduce((acc, cur) => acc + cur, 0),
//             tonh: tonh.reduce((acc, cur) => acc + cur, 0),
//             n_travels: n_travels.reduce((acc, cur) => acc + cur, 0)
//         });

//         await newRuma.save();

//         return res.status(200).json({ status: true, message: 'Las rumas antiguas se han unido y se ha creado una nueva ruma' });

//     } catch (error) {
//         res.json({ message: error.message });
//     }
// };