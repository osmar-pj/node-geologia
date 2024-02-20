import TripModel from '../models/TripModel.js'
import PilaModel from '../models/PilaModel.js'

const socket = require('../socket.js').socket

// GET PILAS TO SHOW IN MODAL ORE CONTROL
export const getAllPilas = async (req, res) => {
    try {
        const pilas = await PilaModel.find({}).sort({createdAt: -1}).populate('pilas_merged', 'pila').populate('travels', 'date tonh carriage dominio tajo id_trip mining turn ubication')
        const pilasToMap = pilas.filter(i => i.statusPila !== 'Finalizado')
        const pilasToOreControl = await PilaModel.find({statusPila: 'Acumulando', typePila: 'Pila'}).sort({createdAt: -1})
        const pilasToAppTruck = pilas.filter(i => (i.statusPila === 'waitBeginDespacho' || i.statusPila === 'Despachando') && i.typePila === 'Pila')
        // console.log(pilas)
        if(!pilas) {
            return res.status(404).json({ message: 'Control calidad sin pendientes' })
        }
        const header = [
            { title: 'Id', field: 'id_pila', fn: '', und: '' },
            { title: 'Mina', field: 'mining', fn: '', und: '' },
            { title: 'Ubicación', field: 'ubication', fn: '', und: '' },
            { title: 'Pila', field: 'pila', fn: '', und: '' },
            { title: 'Viajes', field: 'travels', fn: 'count', und: '' }, // contar el array para tener los viaje
            { title: 'Status', field: 'statusPila', fn: 'status', und: '' },
            { title: 'Tajo', field: 'tajo', fn: 'arr', und: '' },
            { title: 'Dominio', field: 'dominio', fn: 'arr', und: '' },
            // { title: 'Unido', field: 'pilas_merged', fn: '', und: '' },
            // { title: 'Cod. Tableta', field: 'cod_tableta', fn: '', und: '' },
            { title: 'Cod. Despacho', field: 'cod_despacho', fn: 'arr', und: '' },
            { title: 'Fecha. Abastecimiento', field: 'dateSupply', fn: 'date', und: '' },

            { title: 'Stock mineral', field: 'stock', fn: 'fixed', und: 'TMH' },
            { title: 'Ton. Total', field: 'tonh', fn: 'fixed', und: 'TMH' },
            { title: 'Ley Ag', field: 'ley_ag', fn: 'fixed', und: '' },
            { title: 'Ley Fe', field: 'ley_fe', fn: 'fixed', und: '' },
            { title: 'Ley Mn', field: 'ley_mn', fn: 'fixed', und: '' },
            { title: 'Ley Pb', field: 'ley_pb', fn: 'fixed', und: '' },
            { title: 'Ley Zn', field: 'ley_zn', fn: 'fixed', und: '' },
        ]

        return res.status(200).json({status: true, data: pilas, header: header, pilasToOreControl: pilasToOreControl, pilasToMap: pilasToMap, pilasToAppTruck: pilasToAppTruck})
    } catch (error) {
        res.json({ message: error.message })
    }
}

export const getPila = async (req, res) => {
    try {
        const cod_tableta = req.params.cod_tableta
        const pila = await PilaModel.findOne({cod_tableta: cod_tableta})
        if(!pila) {
            return res.status(200).json({ status: false, message: 'Pila not found' })
        }
        return res.status(200).json(pila)
    } catch (error) {
        res.json({ message: error.message })
    }
}

export const getPilaByTableta = async (req, res) => {
    try {
        const ruma_Id = req.params.ruma_Id
        const ruma = await PilaModel.findOne({ruma_Id: ruma_Id})
        if(!ruma) {
            return res.status(200).json({ status: false, message: 'Pila not found' })
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
            stock: 0,
            tonh: 0,
            ton: 0,
            x: 30,
            y: 30,
            native: 'GUNJOP'
        })
        const newPilaSaved = await newPila.save()
        socket.io.emit('newPila', newPilaSaved)
        // socket.io.emit('pilas', [newPilaSaved])
        return res.status(200).json({ status: true, message: 'Pila creada exitosamente', pila: newPilaSaved })
    } catch (error) {
        res.json({ message: error.message })
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
                dominio: pila.dominio,
                statusPila: 'Acumulando',
                history: [...pila.history, {work: 'UPDATE giba cambia a Pila y se analiza', date: new Date(), user: 'System'}],
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
            socket.io.emit('newPila', newPilaSaved)
            socket.io.emit('pilas', [newPilaSaved])
            return newPilaSaved
    } catch (error) {
        console.error(error)
    }
}

const resetGiba = async (pilaId) => {
    try {
        const pilaToUpdate = {
            statusTrip: 'Acumulando',
            history: [{work: 'DELETE CREATE giba reinicia status', date: new Date(), user: 'System'}],
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
            cod_despacho: [],
            level: 0,
            type: '',
            veta: '',
            tajo: [],
            zone: '',
            travels: [],
            samples: [],
            dominio: []
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
        const name = req.body.name
        const pilaFound = await PilaModel.findOne({_id: pila_Id})
        const samples = pilaFound.cod_despacho.length
        const statusPila = pilaFound.statusPila
        const isPila = pilaFound.typePila === 'Pila'
        if(!pilaFound) {
            return res.status(200).json({ status: false, message: 'Pila not found' })
        }
        
        if ((statusPila === 'Acumulando' || statusPila === 'waitBeginAnalysis') && isPila) {
            console.log('Pila pasa a analisis')
            const dataToUpdate = {
                cod_despacho: [req.body.cod_despacho],
                statusPila: 'Analizando',
                history: [...pilaFound.history, {work: 'UPDATE pila pasa a Analisis', date: new Date(), user: name}]
            }
            const pilaUpdated = await PilaModel.findOneAndUpdate({_id: pila_Id}, dataToUpdate, {new: true})
            const trips = await TripModel.find({pila: pilaUpdated.pila})
            // UPDATE TRIPS TO Analizando
            const tripsToUpdate = trips.map(trip => {
                const data = {
                    cod_despacho: req.body.cod_despacho,
                    statusTrip: 'Analizando',
                    history: [...trip.history, {work: 'UPDATE viaje pasa a Analisis', date: new Date(), user: name}]
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
                cod_despacho: [...pilaFound.cod_despacho, req.body.cod_despacho],
                statusPila: 'Analizando',
                history: [...pilaFound.history, {work: 'UPDATE giba pasa a Analisis', date: new Date(), user: name}]
            }
            const pilaUpdated = await PilaModel.findOneAndUpdate({_id: pila_Id}, dataToUpdate, {new: true})
            const trips = await TripModel.find({pila: pilaUpdated.pila},{temp: samples})
            // UPDATE TRIPS TO Analizando
            const tripsToUpdate = trips.map(trip => {
                const data = {
                    cod_despacho: req.body.cod_despacho,
                    statusTrip: 'Analizando',
                    history: [...trip.history, {work: 'UPDATE viaje pasa a Analisis', date: new Date(), user: name}],
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
                    statusTrip: 'Acumulando',  // Puede actualizar a Analizando si el proceso es continuo
                    history: [...trip.history, {work: 'UPDATE viaje con Cod Tableta', date: new Date(), user: name}]
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
            dataToUpdate.history = [...pilaFound.history, {work: 'UPDATE se sube el archivo de muestras a la pila', date: new Date(), user: name}]
            const pilaUpdated = await PilaModel.findOneAndUpdate({_id: pila_Id}, dataToUpdate, {new: true})
            const trips = await TripModel.find({pila: pilaUpdated.pila})
            const tripsToUpdate = trips.map(trip => {
                const data = {
                    ley_ag: req.body.ley_ag,
                    ley_fe: req.body.ley_fe,
                    ley_mn: req.body.ley_mn,
                    ley_pb: req.body.ley_pb,
                    ley_zn: req.body.ley_zn,
                    tmh_ag: req.body.tmh_ag,
                    tmh_fe: req.body.tmh_fe,
                    tmh_mn: req.body.tmh_mn,
                    tmh_pb: req.body.tmh_pb,
                    tmh_zn: req.body.tmh_zn,
                    rango: req.body.rango,
                    statusTrip: 'waitDateAbastecimiento',  // Puede actualizar a Analizando si el proceso es continuo
                    history: [...trip.history, {work: 'UPDATE Muestreado', date: new Date(), user: name}]
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
            console.log('Giba obtiene codigo tableta', req.body)
            if (samples == 0) {
                const dataToUpdate = req.body
                dataToUpdate.statusPila = 'Acumulando'
                dataToUpdate.history = [...pilaFound.history, {work: 'UPDATE se sube el archivo de muestras a la giba', date: new Date(), user: name}]
                const pilaUpdated = await PilaModel.findOneAndUpdate({_id: pila_Id}, dataToUpdate, {new: true})
                const trips = await TripModel.find({pila: pilaUpdated.pila})
                const tripsToUpdate = trips.map(trip => {
                    const data = {
                        ley_ag: req.body.ley_ag,
                        ley_fe: req.body.ley_fe,
                        ley_mn: req.body.ley_mn,
                        ley_pb: req.body.ley_pb,
                        ley_zn: req.body.ley_zn,
                        tmh_ag: req.body.tmh_ag,
                        tmh_fe: req.body.tmh_fe,
                        tmh_mn: req.body.tmh_mn,
                        tmh_pb: req.body.tmh_pb,
                        tmh_zn: req.body.tmh_zn,
                        rango: req.body.rango,
                        statusTrip: 'Acumulando',  // Puede actualizar a Analizando si el proceso es continuo
                        history: [...trip.history, {work: `UPDATE se sube las muestras ${samples + 1} a la giba`, date: new Date(), user: name}]
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
                history: [...pilaFound.history, {work: 'UPDATE fecha abastecimiento', date: new Date(), user: name}]
            }
            const pilaUpdated = await PilaModel.findOneAndUpdate({_id: pila_Id}, dataToUpdate, {new: true})
            const trips = await TripModel.find({pila: pilaUpdated.pila})
            // UPDATE TRIPS TO Analizando
            const tripsToUpdate = trips.map(trip => {
                const data = {
                    dateSupply: req.body.dateSupply,
                    statusTrip: 'waitBeginDespacho',
                    history: [...trip.history, {work: 'UPDATE fecha abastecimiento', date: new Date(), user: name}]
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

export const updatePilaOfMap = async (req, res) => {
    try {
        console.log(req.body)
        const pila_Id = req.params.pila_Id
        const dataToUpdate = req.body
        const pilaUpdated = await PilaModel.findOneAndUpdate
        ({_id: pila_Id}, dataToUpdate, {new: true})
        console.log(pilaUpdated.statusPila)
        socket.io.emit('pilas', [pilaUpdated])
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
        return res.status(200).json({pilas})

    } catch (error) {
        res.json({ message: error.message })
    }
}