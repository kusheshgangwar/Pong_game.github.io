const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');

// Game constants
const PADDLE_WIDTH = 15;
const PADDLE_HEIGHT = 100;
const BALL_SIZE = 15;
const PADDLE_SPEED = 7;
const COMPUTER_SPEED = 5;

// Game state
let playerY = canvas.height / 2 - PADDLE_HEIGHT / 2;
let computerY = canvas.height / 2 - PADDLE_HEIGHT / 2;
let ballX = canvas.width / 2 - BALL_SIZE / 2;
let ballY = canvas.height / 2 - BALL_SIZE / 2;
let ballSpeedX = 5;
let ballSpeedY = 4;
let playerScore = 0;
let computerScore = 0;

// Controls
let upPressed = false;
let downPressed = false;

// Draw everything
function draw() {
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw middle dashed line
  ctx.setLineDash([20, 12]);
  ctx.strokeStyle = '#555';
  ctx.beginPath();
  ctx.moveTo(canvas.width / 2, 0);
  ctx.lineTo(canvas.width / 2, canvas.height);
  ctx.stroke();
  ctx.setLineDash([]);

  // Draw paddles
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, playerY, PADDLE_WIDTH, PADDLE_HEIGHT); // Player
  ctx.fillRect(canvas.width - PADDLE_WIDTH, computerY, PADDLE_WIDTH, PADDLE_HEIGHT); // Computer

  // Draw ball
  ctx.beginPath();
  ctx.arc(ballX + BALL_SIZE / 2, ballY + BALL_SIZE / 2, BALL_SIZE / 2, 0, Math.PI * 2);
  ctx.fillStyle = '#fff';
  ctx.fill();
}

// Move computer paddle
function moveComputer() {
  let target = ballY + BALL_SIZE/2 - PADDLE_HEIGHT/2;
  if (computerY < target) {
    computerY += COMPUTER_SPEED;
    if (computerY > target) computerY = target;
  } else if (computerY > target) {
    computerY -= COMPUTER_SPEED;
    if (computerY < target) computerY = target;
  }
  // Clamp
  computerY = Math.max(0, Math.min(canvas.height - PADDLE_HEIGHT, computerY));
}

// Move player paddle by keys
function movePlayer() {
  if (upPressed) playerY -= PADDLE_SPEED;
  if (downPressed) playerY += PADDLE_SPEED;
  // Clamp
  playerY = Math.max(0, Math.min(canvas.height - PADDLE_HEIGHT, playerY));
}

// Mouse movement
canvas.addEventListener('mousemove', function(e) {
  const rect = canvas.getBoundingClientRect();
  let mouseY = e.clientY - rect.top;
  playerY = mouseY - PADDLE_HEIGHT/2;
  playerY = Math.max(0, Math.min(canvas.height - PADDLE_HEIGHT, playerY));
});

// Keyboard controls
document.addEventListener('keydown', function(e) {
  if (e.key === 'ArrowUp') upPressed = true;
  if (e.key === 'ArrowDown') downPressed = true;
});

document.addEventListener('keyup', function(e) {
  if (e.key === 'ArrowUp') upPressed = false;
  if (e.key === 'ArrowDown') downPressed = false;
});

// Update ball position and detect collisions
function updateBall() {
  ballX += ballSpeedX;
  ballY += ballSpeedY;

  // Top/bottom wall collision
  if (ballY < 0) {
    ballY = 0;
    ballSpeedY *= -1;
  }
  if (ballY + BALL_SIZE > canvas.height) {
    ballY = canvas.height - BALL_SIZE;
    ballSpeedY *= -1;
  }

  // Paddle collision (Player)
  if (ballX < PADDLE_WIDTH &&
      ballY + BALL_SIZE > playerY &&
      ballY < playerY + PADDLE_HEIGHT) {
    ballX = PADDLE_WIDTH;
    ballSpeedX *= -1;
    // Add angle effect
    let deltaY = ballY + BALL_SIZE/2 - (playerY + PADDLE_HEIGHT/2);
    ballSpeedY = deltaY * 0.2;
  }

  // Paddle collision (Computer)
  if (ballX + BALL_SIZE > canvas.width - PADDLE_WIDTH &&
      ballY + BALL_SIZE > computerY &&
      ballY < computerY + PADDLE_HEIGHT) {
    ballX = canvas.width - PADDLE_WIDTH - BALL_SIZE;
    ballSpeedX *= -1;
    let deltaY = ballY + BALL_SIZE/2 - (computerY + PADDLE_HEIGHT/2);
    ballSpeedY = deltaY * 0.2;
  }

  // Score update
  if (ballX < 0) {
    computerScore++;
    resetBall();
    updateScoreboard();
  }
  if (ballX + BALL_SIZE > canvas.width) {
    playerScore++;
    resetBall();
    updateScoreboard();
  }
}

function resetBall() {
  ballX = canvas.width / 2 - BALL_SIZE / 2;
  ballY = canvas.height / 2 - BALL_SIZE / 2;
  ballSpeedX = (Math.random() > 0.5 ? 5 : -5);
  ballSpeedY = (Math.random() > 0.5 ? 4 : -4);
}

function updateScoreboard() {
  document.getElementById('playerScore').textContent = `Player: ${playerScore}`;
  document.getElementById('computerScore').textContent = `Computer: ${computerScore}`;
}

// Main game loop
function gameLoop() {
  movePlayer();
  moveComputer();
  updateBall();
  draw();
  requestAnimationFrame(gameLoop);
}

// Start game
updateScoreboard();
gameLoop();
