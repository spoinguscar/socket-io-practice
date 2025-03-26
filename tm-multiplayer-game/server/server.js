const io = require('socket.io')(3000, {
    cors: {
        origin: ["http://localhost:8080", "http://127.0.0.1:8080"]
    }
});
const { createGameState, gameLoop } = require('./game');
const { FRAME_RATE } = require("./constants");


io.on('connection', client => {
    const state = createGameState();
    startGameInterval(client, state);
});

function startGameInterval(client, state) {
    const intervalID = setInterval(() => {
        const winner = gameLoop(state);

        if (!winner) {
            client.emit('gameState', JSON.stringify(state));
        } else {
            client.emit('gameOver');
            clearInterval(intervalID);
        }
    }, 1000 / FRAME_RATE)
}

