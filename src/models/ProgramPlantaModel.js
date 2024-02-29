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
    finos_pb_prog: Number,
    finos_zn_prog: Number,
    ley_ag_lab: Number,
    ley_pb_lab: Number,
    ley_zn_lab: Number,
    month: String,
    year: Number,
    user: String
}, {
    versionKey: false
})

const ProgramPlantaModel = model('prog_planta', ProgramSchema)

export default ProgramPlantaModel