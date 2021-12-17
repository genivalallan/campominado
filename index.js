// Globals
const title = document.getElementById("title");
const levelSelect = document.getElementById("level-select");
const baseInput = document.getElementById("base-input");
const heightInput = document.getElementById("height-input");
const minesInput = document.getElementById("mines-input");
const startBtn = document.getElementById("start-btn");
const timer = document.getElementById("timer");
const minesTable = document.getElementById("minesweeper");
let game = null;
let timerId = null;

levelSelect.onchange = levelSelector;
startBtn.onclick = startGame;

// Update the panel when select element changes
function levelSelector() {
  let option = levelSelect.value;
  
  switch (option) {
    case "easy":
      baseInput.disabled = true;
      heightInput.disabled = true;
      minesInput.disabled = true;
      baseInput.value = 10;
      heightInput.value = 10;
      minesInput.value = 15;
      break;
    case "medium":
      baseInput.disabled = true;
      heightInput.disabled = true;
      minesInput.disabled = true;
      baseInput.value = 15;
      heightInput.value = 10;
      minesInput.value = 30;
      break;
    case "hard":
      baseInput.disabled = true;
      heightInput.disabled = true;
      minesInput.disabled = true;
      baseInput.value = 20;
      heightInput.value = 15;
      minesInput.value = 50;
      break;
    case "custom":
      baseInput.disabled = false;
      heightInput.disabled = false;
      minesInput.disabled = false;
    break;
    default:
      break;
  }
}

function startGame() {
  let gridBase = parseInt(baseInput.value);
  let gridHeight = parseInt(heightInput.value);
  let mineCount = parseInt(minesInput.value);

  if (isNaN(gridBase) || isNaN(gridHeight) || isNaN(mineCount)) {
    window.alert("ERROR!\nCannot start the game.\nInvalid arguments.");
    return;
  }
  if (gridBase < 10 || gridBase > 20 || gridHeight < 10 || gridHeight > 15) {
    window.alert(
      "ERROR!\nCannot start the game. Argumens out of range.\n{10 <= Length <= 20} {10 <= Height <= 15}"
    );
    return;
  }

  // Reset game properties
  game = new GameProps(gridBase, gridHeight, mineCount);
  resetGame();

  // Set random locations
  for (let i = 0; i < mineCount; ) {
    let location = Math.floor(Math.random() * game.gridSize);
    // If it already exists, try another one
    if (game.gridMap[location].isMine) continue;
    else game.gridMap[location].isMine = true;
    i++;

    // Increase the counter on the cells around the mine
    setRegion(game, location, (id) => {
      if (!game.gridMap[id].isMine) game.gridMap[id].tip++;
    });
  }

  // Create minesweeper table
  if (!minesTable) console.log("ERROR: minesweeper element not found!");
  for (let i = 0; i < gridHeight; i++) {
    let tableRow = minesTable.insertRow();
    for (let j = 0; j < gridBase; j++) {
      let tableCell = tableRow.insertCell();
      tableCell.id = i * gridBase + j;
      tableCell.onclick = () => cellClick(tableCell);
      tableCell.classList.add("normal");
    }
  }
}

// Handle clicks on table cells
function cellClick(tableCell) {
  if (!timerId) timerId = setInterval(updateTimer, 1000);
  tableCell.onclick = null;
  let id = parseInt(tableCell.id);
  if (isNaN(id) || id < 0 || id > game.gridSize) {
    console.log("function cellClick received an invalid argument.");
    return;
  }

  if (game.gridMap[id].isMine) {
    terminate(false);
    return;
  } else if (game.gridMap[id].tip === 0) {
    clearEmpty(id);
  } else {
    tableCell.classList.remove("normal");
    tableCell.innerText = game.gridMap[id].tip;
    game.gridMap[id].clear = true;
  }

  let clear = 0;
  for (let i = 0; i < game.gridSize; i++)
    if (game.gridMap[i].clear) clear++;

  if (game.gridSize - clear === game.mineCount)
    terminate();
}

// Show game results and terminate the game
function terminate(win = true) {
  clearInterval(timerId);
  title.classList.remove("bg-primary");
  let tableCells = document.getElementsByTagName("td");
  for (let i = 0; i < game.gridMap.length; i++) {
    tableCells[i].onclick = null;
    if (game.gridMap[i].isMine) {
      tableCells[i].classList.remove("normal");
      tableCells[i].classList.add("mine");
      tableCells[i].innerText = "X";
    }
  }
  if (win) {
    title.classList.add("bg-success");
    title.innerText = "Vitória!";
  } else {
    title.classList.add("bg-danger");
    title.innerText = "Boooommm!";
  }
}

// Clear the empty cells connected to each other
function clearEmpty(cellId) {
  let coldCells = [];         // An array to store cell id's to clear
  let hotCells = [];          // An array to store cell id's near mines to be revealed
  coldCells.push(parseInt(cellId));
  let i = 0;
  
  do {
    setRegion(game,coldCells[i], id => {
      if (game.gridMap[id].isMine) /* Do nothing */;
      else if (game.gridMap[id].tip === 0 && !coldCells.includes(id))
        coldCells.push(id);
      else if (!hotCells.includes(id) && !coldCells.includes(id))
        hotCells.push(id);
    });
    
    i++;
  } while (i < coldCells.length)
  
  coldCells.forEach(i => {
    game.gridMap[i].clear = true;
    let tableCell = document.getElementsByTagName("td")[i];
    tableCell.onclick = null;
    tableCell.classList.remove("normal");
  });
  
  hotCells.forEach(i => {
    game.gridMap[i].clear = true;
    let tableCell = document.getElementsByTagName("td")[i];
    tableCell.innerText = game.gridMap[i].tip;
    tableCell.onclick = null;
    tableCell.classList.remove("normal");
  });
}

// Aplly a call back function on a 3x3 cells region excluding the center cell
// callbackFunc: receives an integer parameter with the number of a cell
function setRegion(gameProps, center, callbackFunc) {
  if (!(gameProps instanceof GameProps) || typeof callbackFunc !== "function") {
    console.log("ERROR: function setRegion received invalid parameters!");
    return;
  }

  let sq = new Square(parseInt(center), gameProps.gridBase, gameProps.gridHeight);

  // Run through the borders of the square
  for (let row = sq.y1; row <= sq.y2; row++) {
    for (let col = sq.x1; col <= sq.x2; col++) {
      let cell = row * game.gridBase + col;
      if (cell !== center) callbackFunc(cell);
    }
  }
}

// Update elapsed time
function updateTimer() {
  game.elapsedTime++;
  timer.value = game.elapsedTime.toString().padStart(3, "0");
}

function resetGame() {
  // Reset title bar
  title.classList.remove("bg-danger", "bg-success");
  title.classList.add("bg-primary");
  title.innerText = "Campo Minado";
  // Reset timer
  if (timerId) clearInterval(timerId);
  timerId = null;
  timer.value = "000";
  // Clear table element
  while (minesTable.firstChild) minesTable.removeChild(minesTable.firstChild);

  // Initialize cells state
  game.gridMap = [];
  game.gridMap = Array.from({ length: game.gridSize }, () => new CellState());
}