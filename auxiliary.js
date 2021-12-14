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
