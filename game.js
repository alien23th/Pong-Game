const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');

// Game constants
const PADDLE_WIDTH = 15;
const PADDLE_HEIGHT = 100;
const BALL_RADIUS = 10;
const AI_SPEED = 4;
const PLAYER_X = 20;
const AI_X = canvas.width - PADDLE_WIDTH - 20;

// Game state
let playerY = canvas.height / 2 - PADDLE_HEIGHT / 2;
let aiY = canvas.height / 2 - PADDLE_HEIGHT / 2;
let ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  vx: 5 * (Math.random() > 0.5 ? 1 : -1),
  vy: 3 * (Math.random() > 0.5 ? 1 : -1)
};
let playerScore = 0;
let aiScore = 0;

// Mouse control for left paddle
canvas.addEventListener('mousemove', function(e) {
  const rect = canvas.getBoundingClientRect();
  const mouseY = e.clientY - rect.top;
  playerY = mouseY - PADDLE_HEIGHT / 2;
  // Clamp paddle within canvas
  playerY = Math.max(0, Math.min(canvas.height - PADDLE_HEIGHT, playerY));
});

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw center line
  ctx.strokeStyle = '#8f8f8fff';
  ctx.setLineDash([10, 15]);
  ctx.beginPath();
  ctx.moveTo(canvas.width / 2, 0);
  ctx.lineTo(canvas.width / 2, canvas.height);
  ctx.stroke();
  ctx.setLineDash([]);

  // Draw paddles
  ctx.fillStyle = '#fff';
  ctx.fillRect(PLAYER_X, playerY, PADDLE_WIDTH, PADDLE_HEIGHT);
  ctx.fillRect(AI_X, aiY, PADDLE_WIDTH, PADDLE_HEIGHT);

  // Draw ball
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, BALL_RADIUS, 0, Math.PI * 2);
  ctx.fillStyle = '#73edfdff';
  ctx.fill();

  // Draw scores
  ctx.font = '36px Arial';
  ctx.fillText(playerScore, canvas.width / 2 - 60, 50);
  ctx.fillText(aiScore, canvas.width / 2 + 30, 50);
}

function update() {
  // Ball movement
  ball.x += ball.vx;
  ball.y += ball.vy;

  // Wall collision (top/bottom)
  if (ball.y - BALL_RADIUS < 0 || ball.y + BALL_RADIUS > canvas.height) {
    ball.vy = -ball.vy;
    // Clamp ball inside canvas
    ball.y = Math.max(BALL_RADIUS, Math.min(canvas.height - BALL_RADIUS, ball.y));
  }

  // Player paddle collision
  if (
    ball.x - BALL_RADIUS < PLAYER_X + PADDLE_WIDTH &&
    ball.y > playerY &&
    ball.y < playerY + PADDLE_HEIGHT
  ) {
    ball.vx = Math.abs(ball.vx);
    // Add angle based on where it hits paddle
    let hitPos = (ball.y - playerY - PADDLE_HEIGHT / 2) / (PADDLE_HEIGHT / 2);
    ball.vy += hitPos * 2;
  }

  // AI paddle collision
  if (
    ball.x + BALL_RADIUS > AI_X &&
    ball.y > aiY &&
    ball.y < aiY + PADDLE_HEIGHT
  ) {
    ball.vx = -Math.abs(ball.vx);
    let hitPos = (ball.y - aiY - PADDLE_HEIGHT / 2) / (PADDLE_HEIGHT / 2);
    ball.vy += hitPos * 2;
  }

  // Score if ball goes past paddle
  if (ball.x < 0) {
    aiScore++;
    resetBall();
  } else if (ball.x > canvas.width) {
    playerScore++;
    resetBall();
  }

  // AI movement (follows ball)
  let aiCenter = aiY + PADDLE_HEIGHT / 2;
  if (ball.y < aiCenter - 10) {
    aiY -= AI_SPEED;
  } else if (ball.y > aiCenter + 10) {
    aiY += AI_SPEED;
  }
  // Clamp AI paddle
  aiY = Math.max(0, Math.min(canvas.height - PADDLE_HEIGHT, aiY));
}

function resetBall() {
  ball.x = canvas.width / 2;
  ball.y = canvas.height / 2;
  // Randomize direction
  ball.vx = 5 * (Math.random() > 0.5 ? 1 : -1);
  ball.vy = 3 * (Math.random() > 0.5 ? 1 : -1);
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

loop();