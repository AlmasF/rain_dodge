const LEFT_CODE = "ArrowLeft";
const UP_CODE = "ArrowUp";
const RIGHT_CODE = "ArrowRight";
const DOWN_CODE = "ArrowDown";

const UPDATE_INTERVAL = 16; // about 60 updates per second
const MAX_SPEED = 8; // was 5
const FRICTION = 0.25; // lower means a longer, gentler coast

const ARENA_WIDTH = 620;
const ARENA_HEIGHT = 420;

let velocityX = 0;
let velocityY = 0;

function slowDown(velocity) {
  if (Math.abs(velocity) <= FRICTION) return 0;
  return velocity - Math.sign(velocity) * FRICTION;
}

let isGameOn = false;
let pressedKeys = {
  [LEFT_CODE]: false,
  [RIGHT_CODE]: false,
  [UP_CODE]: false,
  [DOWN_CODE]: false,
};
const keyCodeDirectionMap = {
  [LEFT_CODE]: "left",
  [RIGHT_CODE]: "right",
  [UP_CODE]: "up",
  [DOWN_CODE]: "down",
};
const character = document.getElementById("character");

document.addEventListener("keydown", (e) => {
  if (isGameOn == false) return;
  const PRESSED_KEYCODE = e.code;
  if (Object.hasOwn(pressedKeys, PRESSED_KEYCODE)) {
    pressedKeys[e.code] = true;
  }
});

document.addEventListener("keyup", (e) => {
  if (isGameOn == false) return;
  const PRESSED_KEYCODE = e.code;
  if (Object.hasOwn(pressedKeys, PRESSED_KEYCODE)) {
    pressedKeys[e.code] = false;
  }
});

function move() {
  const character = document.getElementById("character");
  const currentCharacterTopPosition = Number(character.style.top.slice(0, -2));
  const currentCharacterLeftPosition = Number(
    character.style.left.slice(0, -2),
  );

  const horizontal =
    Number(pressedKeys[RIGHT_CODE]) - Number(pressedKeys[LEFT_CODE]);
  const vertical =
    Number(pressedKeys[DOWN_CODE]) - Number(pressedKeys[UP_CODE]);

  const magnitude = Math.hypot(horizontal, vertical) || 1;
  const inputX = horizontal / magnitude;
  const inputY = vertical / magnitude;

  const TURN_SMOOTHING = 0.12;

  if (magnitude > 0) {
    velocityX += (inputX * MAX_SPEED - velocityX) * TURN_SMOOTHING;
    velocityY += (inputY * MAX_SPEED - velocityY) * TURN_SMOOTHING;
  } else {
    velocityX = slowDown(velocityX);
    velocityY = slowDown(velocityY);
  }

  const nextLeft = currentCharacterLeftPosition + velocityX;
  const nextTop = currentCharacterTopPosition + velocityY;

  character.style.left = `${Math.max(0, Math.min(ARENA_WIDTH - character.offsetWidth, nextLeft))}px`;
  character.style.top = `${Math.max(0, Math.min(ARENA_HEIGHT - character.offsetHeight, nextTop))}px`;
}

let intervalID;

function startGame() {
  isGameOn = true;
  pressedKeys = {
    [LEFT_CODE]: false,
    [RIGHT_CODE]: false,
    [UP_CODE]: false,
    [DOWN_CODE]: false,
  };
  intervalID = requestAnimationFrame(function gameLoop() {
    move();
    intervalID = requestAnimationFrame(gameLoop);
  });
}

function stopGame() {
  isGameOn = false;
  pressedKeys = {
    [LEFT_CODE]: false,
    [RIGHT_CODE]: false,
    [UP_CODE]: false,
    [DOWN_CODE]: false,
  };
  cancelAnimationFrame(intervalID);
}

document.addEventListener("keydown", (e) => {
  const PRESSED_KEYCODE = e.code;
  if (PRESSED_KEYCODE == "Space") {
    if (isGameOn) {
      stopGame();
    } else {
      startGame();
    }
  }
});
