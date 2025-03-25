const io = require('socket.io')(3000, {
    cors: {
        origin: ["http://127.0.0.1:8080", "http://localhost:8080"]
    }
})

io.on('connection', socket => {
    console.log(socket.id);
    // socket.on('custom-event', (number, string, obj) => {
    //     console.log(number, string, obj)
    // })
    socket.on('send-message', message => {
        socket.broadcast.emit('receive-message', message)
        console.log(message);
    })
})

