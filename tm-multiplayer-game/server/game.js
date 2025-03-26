const { GRID_SIZE } = require("./constants");

module.exports = {
  initGame,
  gameLoop,
  getUpdatedVelocity,
};

function initGame() {
  const state = createGameState();
  randomFood(state);
  return state;
}

function createGameState() {
  return {
    players: [
      {
        pos: {
          x: 3,
          y: 10,
        },
        vel: {
          x: 1,
          y: 0,
        },
        snake: [
          { x: 1, y: 10 },
          { x: 2, y: 10 },
          { x: 3, y: 10 },
        ],
      },
      {
        pos: {
          x: 18,
          y: 10,
        },
        vel: {
          x: 0,
          y: 0,
        },
        snake: [
          { x: 20, y: 10 },
          { x: 19, y: 10 },
          { x: 18, y: 10 },
        ],
      },
    ],
    food: {
      x: 7,
      y: 7,
    },
    gridsize: GRID_SIZE,
  };
}

function gameLoop(state) {
  if (!state) {
    return;
  }

  const playerOne = state.players[0];
  const playerTwo = state.players[1];

  playerOne.pos.x += playerOne.vel.x;
  playerOne.pos.y += playerOne.vel.y;

  if (
    playerOne.pos.x < 0 ||
    playerOne.pos.x > GRID_SIZE ||
    playerOne.pos.y < 0 ||
    playerOne.pos.y > GRID_SIZE
  ) {
    return 2;
  }

  if (
    playerTwo.pos.x < 0 ||
    playerTwo.pos.x > GRID_SIZE ||
    playerTwo.pos.y < 0 ||
    playerTwo.pos.y > GRID_SIZE
  ) {
    return 1;
  }

  if (state.food.x === playerOne.pos.x && state.food.y === playerOne.pos.y) {
    playerOne.snake.push({ ...playerOne.pos });
    playerOne.pos.x += playerOne.vel.x;
    playerOne.pos.y += playerOne.vel.y;
    randomFood(state);
  }

  if (state.food.x === playerTwo.pos.x && state.food.y === playerTwo.pos.y) {
    playerTwo.snake.push({ ...playerTwo.pos });
    playerTwo.pos.x += playerTwo.vel.x;
    playerTwo.pos.y += playerTwo.vel.y;
    randomFood(state);
  }

  if (playerOne.vel.x || playerOne.vel.y) {
    for (let cell of playerOne.snake) {
      if (cell.x === playerOne.pos.x && cell.y === playerOne.pos.y) {
        return 2;
      }
    }

    playerOne.snake.push({ ...playerOne.pos });
    playerOne.snake.shift();
  }

  if (playerTwo.vel.x || playerTwo.vel.y) {
    for (let cell of playerTwo.snake) {
      if (cell.x === playerTwo.pos.x && cell.y === playerTwo.pos.y) {
        return 1;
      }
    }

    playerTwo.snake.push({ ...playerTwo.pos });
    playerTwo.snake.shift();
  }

  return 0;
}

function randomFood(state) {
  food = {
    x: Math.floor(Math.random() * GRID_SIZE),
    y: Math.floor(Math.random() * GRID_SIZE),
  };

  for (let cell of [...state.players[0].snake, ...state.players[1].snake]) {
    if (cell.x === food.x && cell.y === food.y) {
      return randomFood(state);
    }
  }

  state.food = food;
}

const LEFT_ARROW = 37;
const DOWN_ARROW = 38;
const RIGHT_ARROW = 39;
const UP_ARROW = 40;

function getUpdatedVelocity(keyCode, prevVel) {
  const VEL = {
    LEFT: { x: -1, y: 0 },
    DOWN: { x: 0, y: -1 },
    RIGHT: { x: 1, y: 0 },
    UP: { x: 0, y: 1 },
    DEF: { x: 0, y: 0 },
  };

  function isEqual(obj1, obj2) {
    return obj1.x === obj2.x && obj1.y === obj2.y;
  }

  switch (keyCode) {
    case LEFT_ARROW: {
      return isEqual(prevVel, VEL.RIGHT) ? VEL.RIGHT : VEL.LEFT;
    }
    case DOWN_ARROW: {
      return isEqual(prevVel, VEL.UP) ? VEL.UP : VEL.DOWN;
    }
    case RIGHT_ARROW: {
      return isEqual(prevVel, VEL.LEFT) ? VEL.LEFT : VEL.RIGHT;
    }
    case UP_ARROW: {
      return isEqual(prevVel, VEL.DOWN) ? VEL.DOWN : VEL.UP;
    }
    default: {
      return prevVel;
    }
  }
}
