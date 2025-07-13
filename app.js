const board = document.getElementById("board");
const turnDisplay = document.getElementById("turn");
let currentPlayer = "black";
const size = 8;
let cells = [];

function createBoard() {
  for (let y = 0; y < size; y++) {
    cells[y] = [];
    for (let x = 0; x < size; x++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.dataset.x = x;
      cell.dataset.y = y;
      cell.addEventListener("click", handleClick);
      board.appendChild(cell);
      cells[y][x] = cell;
    }
  }

  // 初期配置
  placeDisk(3, 3, "white");
  placeDisk(4, 4, "white");
  placeDisk(3, 4, "black");
  placeDisk(4, 3, "black");
}

function placeDisk(x, y, color) {
  const disk = document.createElement("div");
  disk.classList.add("disk", color);
  cells[y][x].appendChild(disk);
  cells[y][x].dataset.color = color;
}

function handleClick(e) {
  const x = parseInt(e.currentTarget.dataset.x);
  const y = parseInt(e.currentTarget.dataset.y);

  if (cells[y][x].dataset.color) return;

  const flipped = getFlippableDisks(x, y, currentPlayer);
  if (flipped.length === 0) return;

  placeDisk(x, y, currentPlayer);
  flipped.forEach(([fx, fy]) => {
    cells[fy][fx].innerHTML = "";
    placeDisk(fx, fy, currentPlayer);
  });

  currentPlayer = currentPlayer === "black" ? "white" : "black";
  turnDisplay.textContent = `現在のターン: ${currentPlayer === "black" ? "黒" : "白"}`;
}

function getFlippableDisks(x, y, color) {
  const directions = [
    [0, 1], [1, 0], [0, -1], [-1, 0],
    [1, 1], [-1, -1], [1, -1], [-1, 1]
  ];
  const opponent = color === "black" ? "white" : "black";
  let toFlip = [];

  for (const [dx, dy] of directions) {
    let nx = x + dx;
    let ny = y + dy;
    let line = [];

    while (nx >= 0 && nx < size && ny >= 0 && ny < size) {
      const cell = cells[ny][nx];
      if (!cell.dataset.color) break;
      if (cell.dataset.color === opponent) {
        line.push([nx, ny]);
      } else if (cell.dataset.color === color) {
        toFlip = toFlip.concat(line);
        break;
      } else {
        break;
      }
      nx += dx;
      ny += dy;
    }
  }

  return toFlip;
}

createBoard();
