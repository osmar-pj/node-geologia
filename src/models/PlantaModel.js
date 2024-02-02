import mongoose from 'mongoose'

const plantaSchema = new mongoose.Schema({
    // DATA DE SISTEMA MINA (CSV)
    code: Number,
    month: String,
    year: Number,
    date: Date,
    cod_tableta: String,
    operator: String,
    tag: String,
    contract: String,
    ton: Number,
    tonh: Number,
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
    week: Number,
    nro_month: Number,
    // DATA DE SISTEMA GEOLOGY
    cod_tableta: String,
    statusMina: String,  // Completo, Incompleto
    validMina: Boolean
},
{
    timestamps: true,
    versionKey: false,
}
)

const PlantaModel = mongoose.model('Planta', plantaSchema)

export default PlantaModel