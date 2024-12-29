const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const gridSize = 20; // Розмір клітинки
const rows = 30; // Кількість рядків
const cols = 40; // Кількість стовпців

canvas.width = cols * gridSize;
canvas.height = rows * gridSize;

const player = {
    x: 1,
    y: 1,
    width: gridSize,
    height: gridSize,
    color: "red"
};

const finish = {
    x: cols - 2,
    y: rows - 2,
    width: gridSize,
    height: gridSize,
    color: "green"
};

// Створюємо стіни лабіринту
const walls = [];

// Генерація лабіринту з проходами
function generateWalls() {
    const visited = [];
    const stack = [];
    let startX = 1, startY = 1;
    
    // Створюємо стіни по всьому канвасу
    for (let row = 0; row < rows; row++) {
        walls[row] = [];
        visited[row] = [];
        for (let col = 0; col < cols; col++) {
            walls[row][col] = true; // Спочатку все стіни
            visited[row][col] = false;
        }
    }

    // Стартова точка
    walls[startY][startX] = false; // Початковий прохід
    stack.push([startX, startY]);

    while (stack.length > 0) {
        const [x, y] = stack[stack.length - 1];
        visited[y][x] = true;
        const directions = [];

        // Додаємо можливі напрямки (право, ліво, вниз, вгору)
        if (x + 2 < cols && !visited[y][x + 2]) directions.push([x + 2, y]);
        if (x - 2 >= 0 && !visited[y][x - 2]) directions.push([x - 2, y]);
        if (y + 2 < rows && !visited[y + 2][x]) directions.push([x, y + 2]);
        if (y - 2 >= 0 && !visited[y - 2][x]) directions.push([x, y - 2]);

        if (directions.length > 0) {
            const [newX, newY] = directions[Math.floor(Math.random() * directions.length)];
            walls[newY][newX] = false;
            walls[(newY + y) / 2][(newX + x) / 2] = false;
            stack.push([newX, newY]);
        } else {
            stack.pop();
        }
    }

    // Встановлюємо фініш
    walls[finish.y][finish.x] = false;
}

// Створення стін
generateWalls();

let isGameOver = false;

function drawPlayer() {
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x * gridSize, player.y * gridSize, player.width, player.height);
}

function drawFinish() {
    ctx.fillStyle = finish.color;
    ctx.fillRect(finish.x * gridSize, finish.y * gridSize, finish.width, finish.height);
}

function drawWalls() {
    ctx.fillStyle = "black";
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            if (walls[row][col]) {
                ctx.fillRect(col * gridSize, row * gridSize, gridSize, gridSize);
            }
        }
    }
}

function canMove(newX, newY) {
    // Перевірка на стіну
    if (walls[newY][newX]) {
        return false;
    }

    // Перевірка на фініш
    if (newX === finish.x && newY === finish.y) {
        isGameOver = true;
        alert("Вітаємо! Ви перемогли!");
    }

    return true;
}

function movePlayer(dx, dy) {
    const newX = player.x + dx;
    const newY = player.y + dy;

    if (canMove(newX, newY)) {
        player.x = newX;
        player.y = newY;
    }
}

function drawGame() {
    if (isGameOver) {
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height); // Очистка екрану

    drawWalls();
    drawFinish();
    drawPlayer();
}

window.addEventListener("keydown", (e) => {
    if (isGameOver) return;

    if (e.key === "ArrowUp") {
        movePlayer(0, -1);
    } else if (e.key === "ArrowDown") {
        movePlayer(0, 1);
    } else if (e.key === "ArrowLeft") {
        movePlayer(-1, 0);
    } else if (e.key === "ArrowRight") {
        movePlayer(1, 0);
    }

    drawGame();
});

// Початкова ініціалізація гри
drawGame();
