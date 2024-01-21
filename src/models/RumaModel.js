import mongoose from 'mongoose'

const rumaSchema = new mongoose.Schema({
    ruma_Id: String,
    data: JSON,
    ton: Number,
    tonh: Number,
    statusBelong: String,
    statusTransition: String,
    valid: Number,
    rumas_united: JSON,
    travels: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'list-trip'
        }
    ],
    n_travels: Number,
    createdAt: {
        type: Date,
        default: Date.now
    }
},
{
    versionKey: false,
}
)

const RumaModel = mongoose.model('ruma', rumaSchema)

export default RumaModel