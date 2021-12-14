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
  let id = parseInt(tableCell.id);
  if (gameProps.gridMap[id].isMine) {
    // innerText = "";
    window.alert("Booooom!!!");
  } else if (gameProps.gridMap[id].tip === 0) {
    clearRegion(id);
  } else {
    // tableCell.innerText = "";
    tableCell.onclick = null;
    tableCell.classList.remove("normal");
    tableCell.innerText = gameProps.gridMap[id].tip;

    if (gameProps.gridMap.length === gameProps.mineCount)
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
    tableCell.classList.add("normal");

    // if (gameProps.gridMap[id].isMine) tableCell.innerText = "X";
    // else if (gameProps.gridMap[id].tip === 0) tableCell.innerText = "#";
    // else tableCell.innerText = gameProps.gridMap[id].tip;
  } 
}

function clearRegion(cellId) {
  let coldCells = [];         // An array to store cell id's to clear
  let hotCells = [];          // An array to store cells that are near mines that will be revealed
  coldCells.push(parseInt(cellId));
  let i = 0;
  
  do {
    // Auxiliary coordinates of a square that expands around a point
    let x1 = Math.floor(coldCells[i] % gameProps.gridBase);
    let x2 = x1;
    let y1 = Math.floor(coldCells[i] / gameProps.gridHeight);
    let y2 = y1;
    if (x1 !== 0) --x1; // Top border
    if (y1 !== 0) --y1; // Left border
    if (x2 !== 9) ++x2; // Right border
    if (y2 !== 9) ++y2; // Bottom border

    // Run through the borders of the square
    // The x value is meant to check left and right squares around the center
    for (row = y1, x = x1; row <= y2; row += y2 - y1, x = x2) {
      for (col = x1; col <= x2; col++) {
        let id = row * gameProps.gridBase + col;
        if (gameProps.gridMap[id].isMine) continue;
        else if (gameProps.gridMap[id].tip === 0 && !coldCells.includes(id))
          coldCells.push(id);
        else if (!hotCells.includes(id))
          hotCells.push(id);
      }
      // Checks the left square on the first run, then the right square
      id = (y1 + 1) * gameProps.gridBase + x;
      if (!gameProps.gridMap[id].isMine) continue;
      else if (gameProps.gridMap[id].tip === 0 && !coldCells.includes(id))
        coldCells.push(id);
      else if (!hotCells.includes(id))
        hotCells.push(id);
    }
    i++;
  } while (i < coldCells.length)
  
    hotCells.forEach(i => {
      let tableCell = document.getElementsByTagName("td")[i];
      tableCell.innerText = gameProps.gridMap[i].tip;
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