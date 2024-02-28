import { Schema, model } from 'mongoose'

const ConfigSchema = new Schema({
    vp_ag: {
        type: Number,
        required: true,
        default: 13
    },
    vp_pb: {
        type: Number,
        required: true,
        default: 14.69
    },
    vp_zn: {
        type: Number,
        required: true,
        default: 13.76
    },
    similarDominio: {
        type: Boolean,
        default: false
    },
    similarLey: {
        type: Boolean,
        default: false
    },
    similarMining: {
        type: Boolean,
        default: false
    },
    tolerance: {
        type: Number,
        default: 1
    },
    user: {
        type: String,
        default: 'Admin'
    }
},{
    timestamps: true,
    versionKey: false
})

const ConfigModel = model('config', ConfigSchema)

export default ConfigModel