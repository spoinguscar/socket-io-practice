const io = require("socket.io")(3000, {
  cors: {
    origin: ["http://localhost:8080", "http://127.0.0.1:8080"],
  },
});
const { initGame, gameLoop, getUpdatedVelocity } = require("./game");
const { FRAME_RATE } = require("./constants");
const { makeID } = require("./utils");

const state = {};
const clientRooms = {};

io.on("connection", (client) => {
  client.on("keydown", handleKeydown);
  client.on("newGame", handleNewGame);
  client.on("joinGame", handleJoinGame);

  function handleJoinGame(gameCode) {
    const room = io.sockets.adapter.rooms.get(gameCode);
    console.log(room);

    // let allUsers;
    // if (room) {
    //   allUsers = room.sockets;
    // }

    let numClients = room ? room.size : 0;
    // if (allUsers) {
    //   numClients = Object.keys(allUsers).length;
    // }

    if (numClients === 0) {
      console.log(allUsers, room, gameCode);
      client.emit("unknownGame");
      return;
    } else if (numClients > 1) {
      client.emit("tooManyPlayers");
      return;
    }

    clientRooms[client.id] = gameCode;

    client.join(gameCode);
    client.number = 2;
    client.emit("init", 2);

    startGameInterval(gameCode);
  }

  function handleNewGame() {
    let roomName = makeID(5);
    clientRooms[client.id] = roomName;
    console.log(
      "New Game Created with room ",
      roomName,
      " by client ",
      client.id
    );
    client.emit("gameCode", roomName);

    state[roomName] = initGame();

    client.join(roomName);
    client.number = 1;
    client.emit("init", 1);
  }

  function handleKeydown(keyCode) {
    const roomName = clientRooms[client.id];
    if (!roomName) {
      return;
    }

    try {
      keyCode = parseInt(keyCode);
    } catch (e) {
      console.error(e);
      return;
    }

    const vel = getUpdatedVelocity(
      keyCode,
      state[roomName].players[client.number - 1].vel
    );

    if (vel) {
      state[roomName].players[client.number - 1].vel = vel;
    }
  }
});

function startGameInterval(roomName) {
  const intervalID = setInterval(() => {
    const winner = gameLoop(state[roomName]);

    if (!winner) {
      emitGameState(roomName, state[roomName]);
    } else {
      emitGameOver(roomName, winner);
      state[roomName] = null;
      clearInterval(intervalID);
    }
  }, 1000 / FRAME_RATE);
}

function emitGameState(roomName, state) {
  io.sockets.in(roomName).emit("gameState", JSON.stringify(state));
}

function emitGameOver(roomName, winner) {
  io.sockets.in(roomName).emit("gameOver", JSON.stringify({ winner }));
}
