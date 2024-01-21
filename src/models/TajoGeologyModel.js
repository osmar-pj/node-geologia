import mongoose from 'mongoose'

const TajoGeologySchema = new mongoose.Schema({
    tajoId: Number,
    name: String,
    valid: Number,
    createdAt: {
        type: Date,
        default: Date.now
    }
},
{
    versionKey: false,
}
)

const TajoGeologyModel = mongoose.model('tajo-geology', TajoGeologySchema)

export default TajoGeologyModel