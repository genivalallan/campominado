// Values needed for the game
function GameProps(gridBase = 10, gridHeight = 10, mineCount = 15) {
  this.gridBase = gridBase; // Length of the grid
  this.gridHeight = gridHeight; // Height of the grid
  this.gridSize = gridBase * gridHeight; // Area of the grid
  this.mineCount = mineCount; // Number of mines
  this.gridMap = new Array(this.gridSize); // State of each cell
}

// Properties of a cell (if it's a mine or how many mines are around it)
function CellState(isMine = false, tip = 0) {
  this.isMine = isMine;
  this.tip = tip;
}

// Auxiliary coordinates of a 3x3 square centered on the cell
function Square(cellNo, gridBase, gridHeight) {
  this.x1 = Math.floor(cellNo % gridBase);
  this.x2 = this.x1;
  this.y1 = Math.floor(cellNo / gridHeight);
  this.y2 = this.y1;
  if (this.x1 !== 0) --this.x1;           if (this.y1 !== 0) --this.y1;             // Top-Left corner
  if (this.x2 !== gridBase-1) ++this.x2;  if (this.y2 !== gridHeight-1) ++this.y2;  // Bottom-Right corner
}
