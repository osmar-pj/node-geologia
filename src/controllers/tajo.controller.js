import TajoModel from '../models/TajoModel.js'

export const getAllTajo = async (req, res) => {
    try {
        const tajoGeology = await TajoModel.find()
        return res.status(200).json(tajoGeology)
    } catch (error) {
        res.json({message: error.message})
    }
}

export const createTajo = async (req, res) => {
    try {
        const tajos = req.body
        const tajoSaved = tajos.data.forEach( async (tajo) => {
            const data = {
                name: tajo.name,
                valid: true,
                level: tajo.level,
                veta: tajo.veta,
                mineral: tajo.mineral,
                zona: tajo.zona,
                user: tajos.user
            }
            const newTajo = await new TajoModel(data)
            const tajoSaved = await newTajo.save()
            return tajoSaved
        })
        return res.status(200).json({ status: true, message: 'Tajo creado exitosamente', data: tajoSaved })
    } catch (error) {
        res.json({ message: error.message })
    }
}

export const updateTajo = async (req, res) => {
    try {
        const { tajoId } = req.params
        const tajoUpdated = await TajoModel.findByIdAndUpdate(tajoId, req.body, { new: true })
        return res.status(200).json({ status: true, message: 'Tajo actualizado exitosamente', data: tajoUpdated })
    }
    catch (error) {
        res.json({ message: error.message })
    }
}