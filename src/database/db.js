import mongoose from 'mongoose';

import { config } from 'dotenv';
config();

const db = mongoose.connect(process.env.MONGO_URL, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
    // auth: {
    //     username: process.env.MONGO_USER,
    //     password: process.env.MONGO_PASS
    // },
    // authSource: 'admin'
})
.then(() => {
    console.log('Connected to BD');
})
.catch((error) => {
    console.error('Error al conectar a la base de datos:', error);
});

export default db;