import mongoose from 'mongoose'
import AI from '../database/db.js'

const tripSchema = new mongoose.Schema(
    {
        // DATA DE SISTEMA MINA (CSV)
        code: Number,
        month: String,
        year: Number,
        date: Date,
        status: String, // Cancha / Planta
        ubication: String,
        turn: String,
        mining: String,
        operator: String,
        tag: String,
        contract: String,
        type: String,
        tajo: String,
        zona: String,
        level: String,
        veta: String,
        material: String,
        dominio: String,
        ton: Number,
        tonh: Number, 
        vagones: Number,
        ley_ag: Number,
        ley_fe: Number,
        ley_mn: Number,
        ley_pb: Number,
        ley_zn: Number,
        tmh_ag: Number,
        tmh_fe: Number,
        tmh_mn: Number,
        tmh_pb: Number,
        tmh_zn: Number,
        rango: String,
        timestamp: Number,
        dateCreatedAt: Date,
        dateSupply: Date,
        week: Number,
        nro_month: Number,
        cod_despacho: String,
        cod_tableta: String,
        pila: String,
        // DATA DE SISTEMA GEOLOGY
        statusMina: String,  // Completo, Incompleto
        statusTrip: String, // Creado (APP truck, wagon) / Falta dividir (APP wagon) / Actualizado (QC) / Laboratorio (QC) / Muestreado (QC) / Despachando (QC) / Finalizado (AUTO)
        history: [], // {work: statusTrip, date: Date, user: String}
        carriage: String, // wagon, truck
        splitRequired: Boolean,
        destiny: [],
        materials: [],
        wagons: [],
        trips: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'trip'
            }
        ],
        temp: {
            default: 0,
            type: Number
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
)

tripSchema.plugin(AI.AutoIncrement, {inc_field: 'id_trip'})
const TripModel = mongoose.model('trip', tripSchema)

export default TripModel