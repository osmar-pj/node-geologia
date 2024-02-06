import mongoose from 'mongoose'

const pilaSchema = new mongoose.Schema({
    pila: String,
    samples: {
        default: [],
        type: Array
    },
    ubication: String, // Cancha 1/ Cancha 2/ Cancha Colquicocha
    status: String, // Cancha / Planta
    mining: String,
    cod_tableta: String,
    cod_despacho: String,
    tajo: {
        default: [],
        type: Array
    },
    dominio: String,
    ton: {
        default: 0,
        type: Number
    },
    tonh: {
        default: 0,
        type: Number
    },
    ley_ag: Number,
    ley_fe: Number,
    ley_mn: Number,
    ley_pb: Number,
    ley_zn: Number,
    typePila: String, // Pila / Giba
    statusPila: String, // Creado / Laboratorio / Muestreado / Mezclado / Trasladado / Fecha Abastecimiento / Despachado
    actionPila: String, // Acumulando / Analizando / Muestreando / Mezclando* / Trasladando* / Falta Fecha Abastecimiento / Listo para despachar  / Despachando / Finalizado
    history: [], // {type: typePila ,work: statusPila, date: Date, user: String}
    statusBelong: String,
    pilas_merged: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'pila'
        }
    ],
    travels: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'trip'
        }
    ],
    n_travels: Number,
    x: {
        default: 100,
        type: Number
    },
    y: {
        default: 50,
        type: Number
    },
    native: String,
    stock: {
        default: 0,
        type: Number
    },
    dateSupply: Date
},
{
    timestamps: true,
    versionKey: false
}
)

const PilaModel = mongoose.model('pila', pilaSchema)

export default PilaModel