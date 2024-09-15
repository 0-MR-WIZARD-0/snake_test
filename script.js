const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const box = 6;
let score = 0;
let highscore = localStorage.getItem('highscore') || 0;
document.getElementById('highscore').innerText = highscore;

let snake = [{ x: 9 * box, y: 10 * box }];
let food = {
    x: Math.floor(Math.random() * 19 + 1) * box,
    y: Math.floor(Math.random() * 19 + 1) * box
};

let obstacles = [];
generateObstacles(5);

let direction = 'RIGHT';

document.addEventListener('keydown', setDirection);

function setDirection(event) {
    if (event.keyCode == 37 && direction != 'RIGHT') {
        direction = 'LEFT';
    } else if (event.keyCode == 38 && direction != 'DOWN') {
        direction = 'UP';
    } else if (event.keyCode == 39 && direction != 'LEFT') {
        direction = 'RIGHT';
    } else if (event.keyCode == 40 && direction != 'UP') {
        direction = 'DOWN';
    }
}

function collision(newHead, array) {
    for (let i = 0; i < array.length; i++) {
        if (newHead.x == array[i].x && newHead.y == array[i].y) {
            return true;
        }
    }
    return false;
}

function generateObstacles(count) {
    for (let i = 0; i < count; i++) {
        let obstacle = {
            x: Math.floor(Math.random() * 19 + 1) * box,
            y: Math.floor(Math.random() * 19 + 1) * box
        };
        obstacles.push(obstacle);
    }
}

function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = i == 0 ? 'green' : 'white'; 
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
    }

    ctx.fillStyle = 'red';
    ctx.fillRect(food.x, food.y, box, box);

    ctx.fillStyle = 'gray';
    for (let i = 0; i < obstacles.length; i++) {
        ctx.fillRect(obstacles[i].x, obstacles[i].y, box, box);
    }

    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if (direction == 'LEFT') snakeX -= box;
    if (direction == 'UP') snakeY -= box;
    if (direction == 'RIGHT') snakeX += box;
    if (direction == 'DOWN') snakeY += box;

    if (snakeX == food.x && snakeY == food.y) {
        score++;
        document.getElementById('score').innerText = score;
        food = {
            x: Math.floor(Math.random() * 19 + 1) * box,
            y: Math.floor(Math.random() * 19 + 1) * box
        };
    } else {
        snake.pop(); 
    }

    let newHead = { x: snakeX, y: snakeY };

    if (snakeX < 0 || snakeY < 0 || snakeX >= canvas.width || snakeY >= canvas.height || 
        collision(newHead, snake) || collision(newHead, obstacles)) {
        clearInterval(game); 
        if (score > highscore) {
            highscore = score;
            localStorage.setItem('highscore', highscore);
            document.getElementById('highscore').innerText = highscore;
        }
        alert('Игра окончена. Ваш счёт: ' + score);
        return;
    }

    snake.unshift(newHead); 
}

let game = setInterval(drawGame, 100);