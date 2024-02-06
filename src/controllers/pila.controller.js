import TripModel from '../models/TripModel.js'
import PilaModel from '../models/PilaModel.js'

const socket = require('../socket.js').socket

// GET PILAS TO SHOW IN MODAL ORE CONTROL
export const getAllPilas = async (req, res) => {
    try {
        const pilas = await PilaModel.find({}).sort({createdAt: -1})
        const pilasToOreControl = await PilaModel.find({statusPila: 'Acumulando', typePila: 'Pila'}).sort({createdAt: -1})
        // console.log(pilas)
        if(!pilas) {
            return res.status(404).json({ message: 'Control calidad sin pendientes' })
        }
        const header = [
            { title: 'Mina', field: 'mining', fn: '', und: '' },
            { title: 'Ubicación', field: 'ubication', fn: '', und: '' },
            { title: 'Pila', field: 'pila', fn: '', und: '' },
            { title: 'Viajes', field: 'travels', fn: 'count', und: '' }, // contar el array para tener los viaje
            { title: 'Status', field: 'statusPila', fn: 'status', und: '' },
            { title: 'Tajo', field: 'tajo', fn: 'arr', und: '' },
            { title: 'Dominio', field: 'dominio', fn: '', und: '' },
            { title: 'Cod. Tableta', field: 'cod_tableta', fn: '', und: '' },
            { title: 'Cod. Despacho', field: 'cod_despacho', fn: '', und: '' },
            { title: 'Fecha. Abastecimiento', field: 'dateSupply', fn: '', und: '' },

            { title: 'Stock mineral', field: 'stock', fn: 'fixed', und: 'TMH' },
            { title: 'Ton. Total', field: 'tonh', fn: 'fixed', und: 'TMH' },
            { title: 'Ley Ag', field: 'ley_ag', fn: 'fixed', und: '' },
            { title: 'Ley Fe', field: 'ley_fe', fn: 'fixed', und: '' },
            { title: 'Ley Mn', field: 'ley_mn', fn: 'fixed', und: '' },
            { title: 'Ley Pb', field: 'ley_pb', fn: 'fixed', und: '' },
            { title: 'Ley Zn', field: 'ley_zn', fn: 'fixed', und: '' },
        ]

        return res.status(200).json({status: true, data: pilas, header: header, pilasToOreControl: pilasToOreControl})
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
            typePila: 'Pila',
            statusPila: 'Acumulando',
            history: [{work: 'Creado', date: new Date(), user: 'System'}],
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

const newPila = async (pila) => {
    try {
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
                mining: 'UCHUCCHACUA',
                ubication: 'Cancha 2',
                statusBelong: 'No Belong',
                typePila: 'Pila',
                statusPila: 'Analizando',
                history: [...pila.history, {work: 'Giba cambia a Pila y analiza', date: new Date(), user: 'System'}],
                ton: pila.ton,
                tonh: pila.tonh,
                x: 100,
                y: 50,
                native: 'GUNJOP',
                stock: pila.stock,
                travels: pila.travels,
                samples: pila.samples,
                tajo: pila.tajo,
                cood_despacho: pila.cood_despacho,
                ley_ag: pila.ley_ag,
                ley_fe: pila.ley_fe,
                ley_mn: pila.ley_mn,
                ley_pb: pila.ley_pb,
                ley_zn: pila.ley_zn
            })
            const newPilaSaved = await newPila.save()
            socket.io.emit('ControlCalidad', [newPilaSaved])
            return newPilaSaved
    } catch (error) {
        console.error(error)
    }
}

const resetGiba = async (pilaId) => {
    try {
        const pilaToUpdate = {
            statusTrip: 'Acumulando',
            history: [{work: 'Limpiado', date: new Date(), user: 'System'}],
            ton: 0,
            tonh: 0,
            stock: 0,
            ley_ag: 0,
            ley_fe: 0,
            ley_mn: 0,
            ley_pb: 0,
            ley_zn: 0,
            rango: '',
            dominio: '',
            level: 0,
            type: '',
            veta: '',
            tajo: [],
            zone: '',
            travels: [],
            samples: []
        }
        const updatePila = await PilaModel.findOneAndUpdate({_id: pilaId}, pilaToUpdate, {new: true})
        socket.io.emit('pilas', [updatePila])
        return {msg: 'Giba reseteado'}
    } catch (error) {
        console.error(error)
    }
}

export const updatePila = async (req, res) => {
    try {
        const pila_Id = req.params.pila_Id
        const isCoding = req.body.isCoding ? req.body.isCoding : false
        const userId = req.body.userId
        const pilaFound = await PilaModel.findOne({_id: pila_Id})
        const samples = pilaFound.samples.length
        const statusPila = pilaFound.statusPila
        const isPila = pilaFound.typePila === 'Pila'
        if(!pilaFound) {
            return res.status(200).json({ status: false, message: 'Pila not found' })
        }
        
        if ((statusPila === 'Acumulando' || statusPila === 'waitBeginAnalysis') && isPila) {
            console.log('Pila pasa a analisis')
            const dataToUpdate = {
                statusPila: 'Analizando',
                history: [...pilaFound.history, {work: 'Pila pasa a Analisis', date: new Date(), user: userId}]
            }
            const pilaUpdated = await PilaModel.findOneAndUpdate({_id: pila_Id}, dataToUpdate, {new: true})
            const trips = await TripModel.find({pila: pilaUpdated.pila})
            // UPDATE TRIPS TO Analizando
            const tripsToUpdate = trips.map(trip => {
                const data = {
                    statusTrip: 'Analizando',
                    history: [...trip.history, {work: 'Viaje pasa a Analisis', date: new Date(), user: userId}]
                }
                const updateTrip = TripModel.findOneAndUpdate({_id: trip._id}, data, {new: true})
                return updateTrip
            })
            const updatedTrips = await Promise.all(tripsToUpdate)
            socket.io.emit('pilas', [pilaUpdated])
            socket.io.emit('trips', updatedTrips)
        }
        if (statusPila === 'Acumulando' && !isPila  && !isCoding) {
            console.log('Giba pasa a analisis')
            const dataToUpdate = {
                statusPila: 'Analizando',
                history: [...pilaFound.history, {work: 'Giba pasa a Analisis', date: new Date(), user: userId}]
            }
            const pilaUpdated = await PilaModel.findOneAndUpdate({_id: pila_Id}, dataToUpdate, {new: true})
            const trips = await TripModel.find({pila: pilaUpdated.pila})
            // UPDATE TRIPS TO Analizando
            const tripsToUpdate = trips.map(trip => {
                const data = {
                    statusTrip: 'Analizando',
                    history: [...trip.history, {work: 'Viaje pasa a Analisis', date: new Date(), user: userId}],
                    temp: samples + 1
                }
                const updateTrip = TripModel.findOneAndUpdate({_id: trip._id}, data, {new: true})
                return updateTrip
            })
            const updatedTrips = await Promise.all(tripsToUpdate)
            socket.io.emit('pilas', [pilaUpdated])
            socket.io.emit('trips', updatedTrips)
        }
        if (statusPila === 'Acumulando' && !isPila && isCoding) {
            console.log('Giba obtiene codigo tableta')
            // Create new Pila
            const newPilaSaved = await newPila(pilaFound)
            const trips = await TripModel.find({pila: pilaFound.pila, temp: samples})
            const tripsToUpdate = trips.map(trip => {
                const data = {
                    pila: newPilaSaved.cod_tableta,
                    cod_tableta: newPilaSaved.cod_tableta,
                    statusTrip: 'waitBeginAnalysis',  // Puede actualizar a Analizando si el proceso es continuo
                    history: [...trip.history, {work: 'Viaje con Cod Tableta', date: new Date(), user: userId}]
                }
                const updateTrip = TripModel.findOneAndUpdate({_id: trip._id}, data, {new: true})
                return updateTrip
            })
            const updatedTrips = await Promise.all(tripsToUpdate)
            const resteGibaDone = await resetGiba(pila_Id)
            socket.io.emit('trips', updatedTrips)
        }
        if (statusPila === 'Analizando' && isPila) {
            console.log('Pila pasa a waitDateAbastecimiento')
            const dataToUpdate = req.body
            dataToUpdate.statusPila = 'waitDateAbastecimiento'
            dataToUpdate.history = [...pilaFound.history, {work: statusPila, date: new Date(), user: userId}]
            const pilaUpdated = await PilaModel.findOneAndUpdate({_id: pila_Id}, dataToUpdate, {new: true})
            const trips = await TripModel.find({pila: pilaUpdated.pila})
            const tripsToUpdate = trips.map(trip => {
                const data = {
                    statusTrip: 'waitDateAbastecimiento',  // Puede actualizar a Analizando si el proceso es continuo
                    history: [...trip.history, {work: 'Muestreado', date: new Date(), user: userId}]
                }
                const updateTrip = TripModel.findOneAndUpdate({_id: trip._id}, data, {new: true})
                return updateTrip
            })
            const updatedTrips = await Promise.all(tripsToUpdate)
            socket.io.emit('pilas', [pilaUpdated])
            socket.io.emit('trips', updatedTrips)
        }
        if (statusPila === 'Analizando' && !isPila) {
            console.log('Giba obtiene codigo tableta o puede acumular y analizar denuveo nueva pila encima')
            if (samples == 0) {
                const dataToUpdate = req.body
                dataToUpdate.statusPila = 'Acumulando'
                dataToUpdate.history = [...pilaFound.history, {work: statusPila, date: new Date(), user: userId}]
                const pilaUpdated = await PilaModel.findOneAndUpdate({_id: pila_Id}, dataToUpdate, {new: true})
                const trips = await TripModel.find({pila: pilaUpdated.pila})
                const tripsToUpdate = trips.map(trip => {
                    const data = {
                        statusTrip: 'Acumulando',  // Puede actualizar a Analizando si el proceso es continuo
                        history: [...trip.history, {work: `UPDATE muestra ${samples + 1}`, date: new Date(), user: userId}]
                    }
                    const updateTrip = TripModel.findOneAndUpdate({_id: trip._id}, data, {new: true})
                    return updateTrip
                })
                const updatedTrips = await Promise.all(tripsToUpdate)
                socket.io.emit('pilas', [pilaUpdated])
                socket.io.emit('trips', updatedTrips)
            }
        }
        if (statusPila === 'waitDateAbastecimiento') {
            console.log('Pila obtiene fecha de abastecimiento')
            const dataToUpdate = {
                dateSupply: req.body.dateSupply,
                statusPila: 'waitBeginDespacho',
                history: [...pilaFound.history, {work: 'UPDATE fecha abastecimiento', date: new Date(), user: userId}]
            }
            const pilaUpdated = await PilaModel.findOneAndUpdate({_id: pila_Id}, dataToUpdate, {new: true})
            const trips = await TripModel.find({pila: pilaUpdated.pila})
            // UPDATE TRIPS TO Analizando
            const tripsToUpdate = trips.map(trip => {
                const data = {
                    dateSupply: req.body.dateSupply,
                    statusTrip: 'waitBeginDespacho',
                    history: [...trip.history, {work: 'UPDATE fecha abastecimiento', date: new Date(), user: userId}]
                }
                const updateTrip = TripModel.findOneAndUpdate({_id: trip._id}, data, {new: true})
                return updateTrip
            })
            const updatedTrips = await Promise.all(tripsToUpdate)
            socket.io.emit('pilas', [pilaUpdated])
            socket.io.emit('trips', updatedTrips)
        }
        if (statusPila === 'waitBeginDespacho') {
            console.log('Pila inicia despacho')
        }
        if (statusPila === 'Despachando') {console.log('Pila despachando')}
        if (statusPila === 'Finalizado') {console.log('Despachado')}
        return res.status(200).json({ status: true, message: 'Pila updated' })
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
//         const pilas = rumas;

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