import mongoose from 'mongoose'

const rumaSchema = new mongoose.Schema({
    ruma_Id: String,
    samples: [],
    ubication: String, // Cancha 1/ Cancha 2/ Cancha 3
    mining: String,
    cod_tableta: String,
    tajo: [],
    dominio: String,
    ton: Number,
    tonh: Number,
    ley_ag: Number,
    tmh_ag: Number,
    statusTransition: String, // Cancha (variable) /Muestreo (static,variable) /Planta (static)
    statusCumm: Boolean, // static (false) / variable (true)
    valid: Boolean,
    statusBelong: String,
    rumas_merged: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'ruma'
        }
    ],
    travels: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'listTrip'
        }
    ],
    n_travels: Number,
    x: Number,
    y: Number,
    native: String
},
{
    timestamps: true,
    versionKey: false,
}
)

const RumaModel = mongoose.model('ruma', rumaSchema)

export default RumaModel