import ListTripModel from '../models/ListTripModel.js'
import RumaModel from '../models/RumaModel.js'

export const getAllRumas = async (req, res) => {
    try {

        const rumas = await RumaModel.find({valid: 1, statusBelong: 'single'}, { _id: 0, travels: 0, data: 0, rumas_united: 0, createdAt: 0})

        return res.status(200).json(rumas)
        
    } catch (error) {
        res.json({ message: error.message });
    }
}

export const getRuma = async (req, res) => {
    try {

        const ruma_Id = req.params.ruma_Id

        const ruma = await RumaModel.findOne({ruma_Id: ruma_Id})

        if(!ruma) {
            return res.status(200).json({ status: false, message: 'Ruma not found' })
        }

        return res.status(200).json(ruma)
        
    } catch (error) {
        res.json({ message: error.message });
    }
}

export const createRuma = async (req, res) => {
    try {

        const lastRuma = await RumaModel.findOne().sort({ _id: -1 }).limit(1);

        let newRumaId;

        if (lastRuma) {
            const currentYear = new Date().getFullYear();

            const lastRumaYear = parseInt(lastRuma.ruma_Id.split('-')[1], 10);

            let newRumaNumber;

            if (currentYear === lastRumaYear) {
                const lastRumaNumber = parseInt(lastRuma.ruma_Id.split('-')[2], 10);
                newRumaNumber = lastRumaNumber + 1;
            } else {
                newRumaNumber = 1;
            }

            newRumaId = `CA-${currentYear}-${('0000' + newRumaNumber).slice(-4)}`;
        } else {
            newRumaId = 'CA-2024-0001';
        }

        const newRuma = new RumaModel({
            ruma_Id: newRumaId,
            valid: 1,
            statusBelong: 'single',
            statusTransition: 'llenando',
            ton: 0,
            tonh: 0,
        });

        await newRuma.save();

        return res.status(200).json({ status: true, message: 'Ruma creada exitosamente' });

    } catch (error) {
        res.json({ message: error.message });
    }
};

export const updateRuma = async (req, res) => {
    try {

        const ruma_Id = req.params.ruma_Id

        const ruma = await RumaModel.findOne({ruma_Id: ruma_Id})

        if(!ruma) {
            return res.status(200).json({ status: false, message: 'Ruma not found' })
        }

        await RumaModel.updateOne({ruma_Id: ruma_Id}, req.body)

        return res.status(200).json({ status: true, message: 'Ruma updated' })

    } catch (error) {
        res.json({ message: error.message });
    }
}

export const deleteRuma = async (req, res) => {
    try {

        const ruma_Id = req.params.ruma_Id

        const rumaDeleted = await RumaModel.findOne({ruma_Id: ruma_Id})

        if(!rumaDeleted) {
            return res.status(200).json({ status: false, message: 'No existe la ruma' })
        }

        await RumaModel.deleteOne({ruma_Id: ruma_Id})

        return res.status(200).json({ status: true, message: 'Ruma deleted' })

    } catch (error) {
        res.json({ message: error.message });
    }
}

export const getListRumas = async (req, res) => {
    try {

        const rumas = await RumaModel.find({ valid: 1 }, { data: 0 });

        const listTrip = await ListTripModel.find({ statusGeology: { $in: ['General', 'QualityControl'] } });

        const rumasWithTon = rumas.map(ruma => {
            const travelsWithTon = ruma.travels.map(travel => {
                const ton = listTrip.find(trip => trip._id.equals(travel));
                return {
                    travel: travel,
                    ton: ton ? ton.ton : null,
                    tonh: ton ? ton.tonh : null
                };
            });

            return {
                ruma_Id: ruma.ruma_Id,
                travels: ruma.travels.length,
                rumas_united: ruma.rumas_united,
                ton: travelsWithTon.reduce((acc, cur) => acc + (cur.ton || 0), 0),
                tonh: travelsWithTon.reduce((acc, cur) => acc + (cur.tonh || 0), 0),
            };
        });

        const updateRumas = await Promise.all(rumasWithTon.map(async ruma => {
            if (ruma.rumas_united === undefined || ruma.rumas_united.length === 0) {
                await RumaModel.updateOne({ ruma_Id: ruma.ruma_Id }, { $set: { ton: ruma.ton, tonh: ruma.tonh, n_travels: ruma.travels } });
            }
        }));

        const rumasB = await RumaModel.find({ valid: 1 }, { _id: 0, data: 0 });

        const rumasBFinal = rumasB.map(ruma => {
            return {
                ruma_Id: ruma.ruma_Id,
                travels: ruma.travels.length,
                rumas_united: ruma.rumas_united,
                valid: ruma.valid,
                ton: ruma.ton,
                tonh: ruma.tonh,
                createdAt: ruma.createdAt
            };
        });

        return res.status(200).json(rumasBFinal);

    } catch (error) {
        res.json({ message: error.message });
    }
};

export const updateOrCreateRumas = async (req, res) => {
    try {
        const rumas = req.body.rumas;

        const rumaIds = rumas.map(ruma => ruma.ruma_Id)
        const ton = rumas.map(ruma => ruma.ton)
        const tonh = rumas.map(ruma => ruma.tonh)
        const n_travels = rumas.map(ruma => ruma.n_travels)

        const updateRumas = await Promise.all(rumas.map(async ruma => {
            const updateRuma = await RumaModel.updateOne({ ruma_Id: ruma.ruma_Id }, { $set: { valid: 0, statusTransition: 'unido' } });
            return updateRuma;
        }));

        const lastRuma = await RumaModel.findOne().sort({ _id: -1 }).limit(1);
        let newRumaId;

        if (lastRuma) {
            const currentYear = new Date().getFullYear();
            const lastRumaYear = parseInt(lastRuma.ruma_Id.split('-')[1], 10);
            let newRumaNumber;

            if (currentYear === lastRumaYear) {
                const lastRumaNumber = parseInt(lastRuma.ruma_Id.split('-')[2], 10);
                newRumaNumber = lastRumaNumber + 1;
            } else {
                newRumaNumber = 1;
            }

            newRumaId = `CA-${currentYear}-${('0000' + newRumaNumber).slice(-4)}`;
        } else {
            newRumaId = 'CA-2024-0001';
        }

        const newRuma = new RumaModel({
            ruma_Id: newRumaId,
            valid: 1,
            statusBelong: 'multiple',
            statusTransition: 'planta',
            rumas_united: rumaIds,
            ton: ton.reduce((acc, cur) => acc + cur, 0),
            tonh: tonh.reduce((acc, cur) => acc + cur, 0),
            n_travels: n_travels.reduce((acc, cur) => acc + cur, 0),
        });

        await newRuma.save();

        return res.status(200).json({ status: true, message: 'Las rumas antiguas se han unido y se ha creado una nueva ruma' });

    } catch (error) {
        res.json({ message: error.message });
    }
};