function GameProps(gridBase = 10, gridHeight = 10, mineCount = 15) {
  this.gridBase = gridBase;                   // Length of the grid
  this.gridHeight = gridHeight;               // Height of the grid
  this.gridSize = gridBase * gridHeight;      // Area of the grid
  this.mineCount = mineCount;                 // Number of mines
  this.gridMap = new Array(this.gridSize);    // State of each cell
}

let gameProps = new GameProps();

for(let i = 0; i < gameProps.mineCount;) {
  // Set random location if it doesn't already exists
  let location = Math.floor(Math.random() * gameProps.gridSize);
  if (!gameProps.gridMap[location]) {
    gameProps.gridMap[location] = {isMine: true, hot: 0};
    i++;

    // Auxiliary coordinates of a sqaure centered on the mine
    let x1 = x2 = Math.floor(location % gameProps.gridBase);
    let y1 = y2 = Math.floor(location / gameProps.gridHeight);
    x1 -= x1 === 0 ? 0 : 1;
    y1 -= y1 === 0 ? 0 : 1;
    x2 += x2 === 9 ? 0 : 1;
    y2 += y2 === 9 ? 0 : 1;
    
    // Update counter on the neighbor cells
    for (let row = y1; row <= y2; row++)
      for (let col = x1; col <= x2; col++) {
        cell = row * gameProps.gridBase + col;
        if (cell !== location) {
          if (!gameProps.gridMap[cell]) {
            gameProps.gridMap[cell] = {isMine: false, hot: 1};
          } else if (!gameProps.gridMap[cell].isMine) {
            gameProps.gridMap[cell].hot++;
          }
        }
      }
  }
}

const mineField = document.getElementById("minefield");
if (!mineField) {
  console.log("ERROR: minefield element not found!");
}
for (let i = 0, s = gameProps.gridBase; i < s; i++) {
  let tableRow = mineField.insertRow();
  for (let j = 0; j < s; j++) {
    let tableCell = tableRow.insertCell();
    if (!gameProps.gridMap[i * s + j]) tableCell.innerText = "#";
    else if (gameProps.gridMap[i * s + j].isMine) tableCell.innerText = "X";
    else tableCell.innerText = gameProps.gridMap[i * s + j].hot;
  } 
}