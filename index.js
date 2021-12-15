
let game = new GameProps();

// Initialize cells state
for (let i = 0; i < game.gridSize; i++) {
  game.gridMap[i] = new CellState();
}

// Set random locations
for(let i = 0; i < game.mineCount;) {
  let location = Math.floor(Math.random() * game.gridSize);
  // If it already exists, try another one
  if(game.gridMap[location].isMine) continue;
  else game.gridMap[location].isMine = true;
  
  // Increase the counter of the cells around the mine
  setRegion(game, location, id => {
    if (!game.gridMap[id].isMine)
      game.gridMap[id].tip++;
  });
  i++;
}

// Set minesweeper table
const mineSweeper = document.getElementById("minesweeper");
if (!mineSweeper) {
  console.log("ERROR: minesweeper element not found!");
}
for (let i = 0; i < game.gridHeight; i++) {
  let tableRow = mineSweeper.insertRow();
  for (let j = 0; j < game.gridBase; j++) {
    let tableCell = tableRow.insertCell();
    tableCell.id = i * game.gridBase + j;
    tableCell.onclick = () => checkCell(tableCell);
    tableCell.classList.add("normal");
  }
}

// onClick event handler
function checkCell(tableCell) {
  tableCell.onclick = null;
  let id = parseInt(tableCell.id);
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

function terminate(win = true) {
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

  } else {
    
  }
}