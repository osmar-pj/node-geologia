import { Schema, model } from 'mongoose'

const ProgramSchema = new Schema({
    mining: String,
    date: Date,
    ton_prog: Number,
    ley_ag_prog: Number,
    ley_fe_prog: Number,
    ley_mn_prog: Number,
    ley_pb_prog: Number,
    ley_zn_prog: Number,
    nsr_prog: Number,
    finos_ag_prog: Number,
    tmf_pb_prog: Number,
    tmf_zn_prog: Number,
    ley_ag_lab: Number,
    ley_pb_lab: Number,
    ley_zn_lab: Number,
    ton_planta: Number,
    ley_ag_planta: Number,
    ley_pb_planta: Number,
    ley_zn_planta: Number,
    ley_mn_planta: Number,
    ley_fe_planta: Number,
    finos_ag_planta: Number,
    tmf_pb_planta: Number,
    tmf_zn_planta: Number,
    ag_rec_planta: Number,
    pb_rec_planta: Number,
    zn_rec_planta: Number,
    month: String,
    year: Number,
    user: String
}, {
    timestamps: true,
    versionKey: false
})

const ProgramPlantaModel = model('prog_planta', ProgramSchema)

export default ProgramPlantaModel