let chessboardSize = 8;
let cellSize = 50;
let knightX = 0, knightY = 0;
let moves = []; // Stores order of moves (similar to orderOfMove)
let currentMove = 0;
let prev;
let img;

function preload() {
  // Load the image during preload phase (recommended)
  img = loadImage("https://static.wikia.nocookie.net/chess/images/7/7d/DarkKnight.png/revision/latest?cb=20230320152239"); // Replace with your image path
}

function setup() {
  createCanvas(chessboardSize * cellSize, chessboardSize * cellSize);
    
  knightX = 4;//random([0,1,2,3,4,5,6,7]);
  knightY = 4;//random([0,1,2,3,4,5,6,7]);
  prev = [knightX, knightY];
  solveTour(knightX, knightY);
  frameRate(2);
  background(220);
  drawChessboard();
  //drawKnight(knightX, knightY);
}

function draw() {
  let [x, y] = moves[currentMove];
  line(x*cellSize + cellSize/2, y*cellSize + cellSize/2, prev[0]*cellSize + cellSize/2, prev[1]*cellSize + cellSize/2);
  drawKnight(x, y);
  background(220);
  drawChessboard();
  for (let i = 0; i <= currentMove; i++){
    drawKnight(moves[i][0], moves[i][1]);
  }
  
  if (currentMove >= 1) {
    prev = [moves[currentMove-1][0], moves[currentMove-1][1]];
    let x2 = x*cellSize + cellSize/2;
    let y2 = y*cellSize + cellSize/2;
    let x1 = prev[0]*cellSize + cellSize/2;
    let y1 = prev[1]*cellSize + cellSize/2;
    stroke(255, 0, 0);
    line(x1, y1, x2, y2);
    stroke(0, 0, 0);
    var offset = 10;
    push() //start new drawing state
    var angle = atan2(y1 - y2, x1 - x2); //gets the angle of the line
    translate(x2, y2); //translates to the destination vertex
    rotate(angle-HALF_PI); //rotates the arrow point
    fill(0, 255, 0);
    triangle(-offset*0.5, offset, offset*0.5, offset, 0, -offset/2); //draws the arrow point as a triangle
    pop();
  }

  if (currentMove < 63) currentMove++;
  // if (currentMove == 63) {
  //   background(220);
  //   drawChessboard();
  //   for (let i = 0; i <= currentMove; i++){
  //     drawKnight(moves[i][0], moves[i][1]);
  //   } 
  // }
}

function drawChessboard() {
  for (let i = 0; i < chessboardSize; i++) {
    for (let j = 0; j < chessboardSize; j++) {
      fill((i + j) % 2 === 0 ? '#739552' : '#EBECD0');
      rect(i * cellSize, j * cellSize, cellSize, cellSize);
    }
  }
}

function drawKnight(x, y) {
  fill(255 - currentMove * 255/ 64); // Black for knight
  image(img, x * cellSize, y * cellSize, cellSize, cellSize);
}

// Knight's movement steps (similar to stepX and stepY)
const stepX = [2, 2, -1, -1, -2, -2, 1, 1];
const stepY = [1, -1, 2, -2, 1, -1, 2, -2];

function isValidMove(x, y) {
  return x >= 0 && x < chessboardSize && y >= 0 && y < chessboardSize && !moves.find(move => move[0] === x && move[1] === y);
}

function getPossibleMoves(x, y) {
  const movess = [];
  for (let i = 0; i < 8; i++) {
    const newX = x + stepX[i];
    const newY = y + stepY[i];
    if (isValidMove(newX, newY)) {
      movess.push([newX, newY]);
    }
  }
  return movess;
}

// Recursive function to solve Knight's Tour (similar to findTour)
function solveTour(x, y) {
  moves[0] = [knightX, knightY];
  if (moves.length === chessboardSize * chessboardSize) {
    console.log("Knight's Tour!");
    return true;
  }

  const possibleMoves = getPossibleMoves(x, y);
  possibleMoves.sort((a, b) => {
    return getPossibleMoves(a[0], a[1]).length - getPossibleMoves(b[0], b[1]).length;
  }); // Prioritize moves with fewer possible next moves

  for (let move of possibleMoves) {
    moves.push(move);
    if (solveTour(move[0], move[1])) {
      return true;
    }
    moves.pop(); // Backtrack if no solution found from this move
  }

  return false;
}
