const { instrument } = require('@socket.io/admin-ui');
const io = require('socket.io')(3000, {
    cors: {
        // origin: "*",
        origin: ["https://admin.socket.io", "http://127.0.0.1:8080", "http://localhost:8080"],
        // It was the goddman fuckin slash
        // Put in https://localhost:3000 and do not add the last slash (in the admin website)
        // what the fuck is this shit
        credentials: true
    },
    // transports: "*"
})

io.on('connection', socket => {
    console.log(socket.id);


    socket.on('send-message', (message, room) => {
        if (room === "") {
            socket.broadcast.emit('receive-message', message);
        } else {
            // room is a specific socket id for now
            socket.to(room).emit('receive-message', `From ${room}: ${message}`);
        }
        console.log(message);
    })

    socket.on('join-room', (room, cb) => {
        socket.to(room).emit('receive-message', `${socket.id} has joined room ${room}`)
        socket.join(room);
        cb(`Joined ${room}`)
    })
})


instrument(io, { 
    auth: false 
})
