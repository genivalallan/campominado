function GameProps(gridBase = 10, gridHeight = 10, mineCount = 15) {
  this.gridBase = gridBase;                   // Length of the grid
  this.gridHeight = gridHeight;               // Height of the grid
  this.gridSize = gridBase * gridHeight;      // Area of the grid
  this.mineCount = mineCount;                 // Number of mines
  this.gridMap = new Array(this.gridSize);    // State of each cell
  this.cleared = 0;                           // Number of cleared squares
}

let gameProps = new GameProps();
for (let i = 0; i < gameProps.gridSize; i++) {
  gameProps.gridMap[i] = {isMine: false, clear: false, tip: 0};
}

for(let i = 0; i < gameProps.mineCount;) {
  // Set random location if it doesn't already exists
  let location = Math.floor(Math.random() * gameProps.gridSize);
  if(gameProps.gridMap[location].isMine) continue;

  gameProps.gridMap[location].isMine = true;

  // Auxiliary coordinates of a 3x3 square centered on the mine
  let x1 = x2 = Math.floor(location % gameProps.gridBase);
  let y1 = y2 = Math.floor(location / gameProps.gridHeight);
  if(x1 !== 0) --x1;    if(y1 !== 0) --y1;    // Top-Left corner
  if(x2 !== 9) ++x2;    if(y2 !== 9) ++y2;    // Bottom-Right corner
    
  // Update counter on the neighbor cells
  for (let row = y1; row <= y2; row++)
    for (let col = x1; col <= x2; col++) {
      cell = row * gameProps.gridBase + col;
      if (cell !== location && !gameProps.gridMap[cell].isMine) {
        gameProps.gridMap[cell].tip++;
      }
    }
  i++;
}

function checkCell(tableCell) {
  tableCell.onclick = null;
  if (gameProps.gridMap[tableCell.id].tip === 0) {
    tableCell.innerText = "";
  } else if (gameProps.gridMap[tableCell.id].isMine) {
    window.alert("Booooom!!!");
  } else {
    tableCell.innerText = "";
    tableCell.onclick = null;
    gameProps.gridMap[tableCell.id].clear = true;

    if (gameProps.gridMap.size === gameProps.mineCount)
      window.alert("!!!!! Vitória !!!!!");
  }
}

const mineField = document.getElementById("minefield");
if (!mineField) {
  console.log("ERROR: minefield element not found!");
}
for (let i = 0; i < gameProps.gridHeight; i++) {
  let tableRow = mineField.insertRow();
  for (let j = 0; j < gameProps.gridBase; j++) {
    let tableCell = tableRow.insertCell();
    let id = i * gameProps.gridBase + j;
    tableCell.id = id;
    tableCell.onclick = () => checkCell(tableCell);

    if (gameProps.gridMap[id].isMine) tableCell.innerText = "X";
    else if (gameProps.gridMap[id].tip === 0) tableCell.innerText = "#";
    else tableCell.innerText = gameProps.gridMap[id].tip;
  } 
}