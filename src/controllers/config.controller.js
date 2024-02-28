import ConfigModel from '../models/ConfigModel'

export const getConfiguration = async (req, res) => {
    try {
        const config = await ConfigModel.find()
        res.status(200).json(config)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const createConfiguration = async (req, res) => {
    const config = req.body
    const newConfig = new ConfigModel(config)
    try {
        await newConfig.save()
        res.status(201).json(newConfig)
    } catch (error) {
        res.status(409).json({ message: error.message })
    }
}

export const updateConfiguration = async (req, res) => {
    try {
        const config = req.body
        const configUpdated = await ConfigModel.findOneAndUpdate({_id: config._id}, config, { new: true })
        res.status(201).json({status: true, configUpdated})
    }
    catch (error) {
        res.status(409).json({ message: error.message })
    }
}