// Aplly a call back function on a 3x3 cells region excluding the center cell
// callbackFunc: receives an integer parameter with the number of a cell
function setRegion(gameProps, center, callbackFunc) {
  if (!(gameProps instanceof GameProps) || typeof callbackFunc !== "function") {
    console.log("ERROR: function setRegion received invalid parameters!");
    return;
  }

  let sq = new Square(parseInt(center), gameProps.gridBase, gameProps.gridHeight);

  // Run through the borders of the square
  // The x value is meant to check left and right squares around the center
  for (let row = sq.y1, x = sq.x1; row <= sq.y2; row += sq.y2 - sq.y1, x = sq.x2) {
    for (let col = sq.x1; col <= sq.x2; col++) {
      let cell = row * game.gridBase + col;
      callbackFunc(cell);
    }
    // x is the left square on the first run, then the right
    let cell = (sq.y1+1) * game.gridBase + x;
    // May happen that the center is also the border, skip in this case
    if (cell !== center) callbackFunc(cell);
  }
}
