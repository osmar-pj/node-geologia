import { Server } from 'socket.io'

const socket = {}
let io

function connect(server) {
    io = new Server(server, {
        cors: {
            origin: '*'
            // origin: process.env.ORIGIN_URL_CLIENT
        }
    })
    socket.io = io
    let USERS = {}
    io.on('connection', socket => {
        console.log(`${socket.id} connected`)
        USERS[socket.id] = socket
        socket.on('disconnect', () => {
            console.log(`${socket.id} disconnected`)
            delete USERS[socket.id]
        })
    })

    setInterval(() => {
        const data = 'HOLA MUNXO'
        for (let i in USERS) {
            USERS[i].emit('message', {data})
        }
    }, 2000)
}

module.exports = {
    connect,
    socket
}

// PARA LLAMAR AL SOCKET DESDE DONDE SEA DEL BACKEND

/*
    const socket = require($route of socket.js$).socket
    const {socket} = require($route of socket.js$)
    socket.io.emit('data', data)
*/

// const socket = require('./socket').socket
// socket.io.emit('deviceData', device)