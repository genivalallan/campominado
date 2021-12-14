
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
    // innerText = "";
    tableCell.classList.remove("normal");
    tableCell.classList.add("mine");
    tableCell.innerText = "X";
    window.alert("Booooom!!!");
  } else if (game.gridMap[id].tip === 0) {
    clearEmpty(id);
  } else {
    tableCell.classList.remove("normal");
    tableCell.innerText = game.gridMap[id].tip;
  }
}

function clearEmpty(cellId) {
  let coldCells = [];         // An array to store cell id's to clear
  let hotCells = [];          // An array to store cell id's near mines to be revealed
  coldCells.push(parseInt(cellId));
  let i = 0;
  
  do {
    setRegion(game,coldCells[i], id => {
      if (!game.gridMap[id].isMine && game.gridMap[id].tip === 0 &&
          !coldCells.includes(id))
        coldCells.push(id);
      else if (!game.gridMap[id].isMine && !hotCells.includes(id))
        hotCells.push(id);
    });
    
    i++;
  } while (i < coldCells.length)
  
  hotCells.forEach(i => {
    let tableCell = document.getElementsByTagName("td")[i];
    tableCell.innerText = game.gridMap[i].tip;
    tableCell.onclick = null;
    tableCell.classList.remove("normal");
  });

  coldCells.forEach(i => {
    let tableCell = document.getElementsByTagName("td")[i];
    tableCell.innerText = "";
    tableCell.onclick = null;
    tableCell.classList.remove("normal");
  });
}