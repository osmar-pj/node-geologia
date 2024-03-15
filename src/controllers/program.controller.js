import ProgramCanchaModel from '../models/ProgramCanchasModel.js'
import ProgramPlantaModel from '../models/ProgramPlantaModel.js'

export const getProgramsCancha = async (req, res) => {
    try {
        const response = await ProgramCanchaModel.find()
        const data = new Map(response.map((item) => [item.month, item]))
        const dataFilter = [...data.values()]
        return res.status(200).json({status: true, data: dataFilter.map(i => {return {month: i.month, year: i.year, user: i.user, createdAt: i.createdAt}})})
    } catch (error) {
        res.json({ message: error.message })
    }
}

export const getProgramsPlanta = async (req, res) => {
    try {
        const response = await ProgramPlantaModel.find()
        const data = new Map(response.map((item) => [item.month, item]))
        const dataFilter = [...data.values()]
        return res.status(200).json({status: true, data: dataFilter.map(i => {return {month: i.month, year: i.year, user: i.user, createdAt: i.createdAt}})})
    } catch (error) {
        res.json({ message: error.message })
    }
}

export const createProgram = async (req, res) => {
    try {
        const programs = req.body
        const months = ['ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO','JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE','DICIEMBRE']
        const month = programs.data.map(i => months[new Date(i.date).getMonth()])
        const year = programs.data.map(i => new Date(i.date).getFullYear())
        const modaData = (data) => {
            if (data.length === 0) return ""
            const dataCount = {}
            let max = 0
            let moda = 0
            data.forEach((i) => {
              if (dataCount[i]) {
                dataCount[i]++
              } else {
                dataCount[i] = 1
              }
            })
            for (const i in dataCount) {
              if (dataCount[i] > max) {
                moda = i
                max = dataCount[i]
              }
            }
            return moda
          }
        programs.data.forEach(async (program) => {
            const data = {
                mining: program.mining,
                date: program.date,
                ton_prog: program.ton_prog,
                ley_ag_prog: program.ley_ag_prog,
                ley_fe_prog: program.ley_fe_prog,
                ley_mn_prog: program.ley_mn_prog,
                ley_pb_prog: program.ley_pb_prog,
                ley_zn_prog: program.ley_zn_prog,
                user: programs.user,
                month: modaData(month),
                year: modaData(year)
            }
            const newProgram = await new ProgramCanchaModel(data)
            const programSaved =  await newProgram.save()
        })
        return res.status(200).json({ status: true, message: 'Programa de Canchas creado exitosamente' })
    }
    catch (error) {
        res.json({ message: error.message })
    }
}

export const createProgramPlanta = async (req, res) => {
    try {
        const programs = req.body
        const months = ['ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO','JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE','DICIEMBRE']
        const month = programs.data.map(i => months[new Date(i.date).getMonth()])
        const year = programs.data.map(i => new Date(i.date).getFullYear())
        const modaData = (data) => {
            if (data.length === 0) return ""
            const dataCount = {}
            let max = 0
            let moda = 0
            data.forEach((i) => {
              if (dataCount[i]) {
                dataCount[i]++
              } else {
                dataCount[i] = 1
              }
            })
            for (const i in dataCount) {
              if (dataCount[i] > max) {
                moda = i
                max = dataCount[i]
              }
            }
            return moda
          }
        programs.data.forEach(async (program) => {
            const data = {
                mining: program.mining,
                date: program.date,
                ton_prog: program.ton_prog,
                ley_ag_prog: program.ley_ag_prog,
                ley_fe_prog: program.ley_fe_prog,
                ley_mn_prog: program.ley_mn_prog,
                ley_pb_prog: program.ley_pb_prog,
                ley_zn_prog: program.ley_zn_prog,
                nsr_prog: program.nsr_prog,
                finos_ag_prog: program.finos_ag_prog,
                finos_pb_prog: program.finos_pb_prog,
                finos_zn_prog: program.finos_zn_prog,
                ley_ag_lab: program.ley_ag_lab,
                ley_pb_lab: program.ley_pb_lab,
                ley_zn_lab: program.ley_zn_lab,
                ton_planta: program.ton_planta,
                ley_ag_planta: program.ley_ag_planta,
                ley_pb_planta: program.ley_pb_planta,
                ley_zn_planta: program.ley_zn_planta,
                ley_mn_planta: program.ley_mn_planta,
                ley_fe_planta: program.ley_fe_planta,
                finos_ag_planta: program.finos_ag_planta,
                finos_pb_planta: program.finos_pb_planta,
                finos_zn_planta: program.finos_zn_planta,
                ag_rec_planta: program.ag_rec_planta,
                pb_rec_planta: program.pb_rec_planta,
                zn_rec_planta: program.zn_rec_planta,
                month: modaData(month),
                year: modaData(year),
                user: programs.user
            }
            const newProgram = await new ProgramPlantaModel(data)
            const programSaved =  await newProgram.save()
        })
        return res.status(200).json({ status: true, message: 'Programa de Plantas creado exitosamente' })
    }
    catch (error) {
        res.json({ message: error.message })
    }
}

export const updateProgram = async (req, res) => {
    try {
        const { mining, status, date, ton_prog, ley_prog, user } = req.body
        const existingRecord = await ProgramCanchaModel.findOne({ mining})

        if (!existingRecord) {
            return res.status(200).json({ status: false, message: 'Este programa no está registrado' })
        }

        existingRecord.mining = mining
        existingRecord.status = status
        existingRecord.date = date
        existingRecord.ton_prog = ton_prog
        existingRecord.ley_prog = ley_prog
        existingRecord.user = user
        await existingRecord.save()
        return res.status(200).json({ status: true, message: 'Programa actualizado exitosamente' })

    } catch (error) {
        res.json({ message: error.message })
    }
}

export const deleteProgram = async (req, res) => {
    try {
        const { mining } = req.body
        const existingRecord = await ProgramCanchaModel.findOne({ mining })

        if (!existingRecord) {
            return res.status(200).json({ status: false, message: 'Este programa no está registrado' })
        }
        
        await existingRecord.remove()
        return res.status(200).json({ status: true, message: 'Programa eliminado exitosamente' })
    }
    catch (error) {
        res.json({ message: error.message })
    }
}