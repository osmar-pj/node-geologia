import mongoose from 'mongoose'

const plantaSchema = new mongoose.Schema({
    // DATA DE SISTEMA MINA (CSV)
    code: Number,
    month: String,
    year: Number,
    date: Date,
    turn: String,
    operator: {
        type: String,
        default: 'Yumpag'
    },
    tag: {
        type: String,
        default: 'System'
    },
    contract: {
        type: String,
        default: 'Yumpag'
    },
    cod_tableta: String,
    ton: Number,
    tonh: Number,
    zona: {
        type: Array,
        default: []
    },
    dominio: {
        type: Array,
        default: []
    },
    veta: {
        type: Array,
        default: []
    },
    tajo: {
        type: Array,
        default: []
    },
    ubication: String,
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
    timestamp: Number,
    dateCreatedAt: Date,
    nro_month: Number,
    // DATA DE SISTEMA GEOLOGY
    statusMina: {
        type: String,
        default: 'Completo'
    },  // Completo, Incompleto
    validMina: {
        type: Boolean,
        default: true
    },
    pilaId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'pila'
    }
},
{
    timestamps: true,
    versionKey: false,
}
)

const PlantaModel = mongoose.model('Planta', plantaSchema)

export default PlantaModel