const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const lines = [];
let nrOfBoards = 0;

rl.once('line', (line) => {
  nrOfBoards = parseInt(line);
})
  .on('line', (line) => {
    lines.push(line.split('').map(Number));
  })
  .on('close', () => {
    let lineCounter = 1;

    for (let i = 0; i < nrOfBoards; i++) {
      let size = lines[lineCounter].reduce((acc, dig) => acc * 10 + dig, 0);
      lineCounter++;

      let board = [];

      // Fill board from stdin
      for (let j = 0; j < size; j++) {
        board[j] = lines[lineCounter].map((v) => v - 1);
        lineCounter++;
      }
      solve(board);
    }
  });

// Sets the color of a connection of tiles
function colorConnector(board, color, tiles) {
  const newBoard = [];

  // Create a copy of the board
  for (let i = 0; i < board.length; i++) {
    newBoard[i] = board[i].slice();
  }

  tiles.forEach((tile) => {
    let x = tile[0];
    let y = tile[1];
    newBoard[x][y] = color;
  });

  return newBoard;
}

function countConnectedTiles(board) {
  const xMoves = [-1, 0, 0, 1];
  const yMoves = [0, -1, 1, 0];

  const visisted = Array.from({ length: board.length }, () => 
    Array.from({ length: board.length }, () => false)
  );
  const queue = [[0, 0]];
  visisted[0][0] = true;

  while (queue.length > 0) {
    let current = queue.shift();
    let x = current[0];
    let y = current[1];

    for (let i = 0; i < 4; i++) {
      let newX = x + xMoves[i];
      let newY = y + yMoves[i];

      if (newX < 0 || newX >= board.length || newY < 0 || newY >= board.length){
        continue;
      }

      let color = board[0][0];

      if (color === board[newX][newY] && !visisted[newX][newY]) {
        queue.push([newX, newY]);
        visisted[newX][newY] = true;
      }
    }
  }
  const connectedTiles = [];
  for (let i = 0; i < visisted.length; i++) {
    for (let j = 0; j < visisted[i].length; j++) {
      if (visisted[i][j]) {
        connectedTiles.push([i, j]);
      }
    }
  }
  return connectedTiles;
}

function solve(board) {
  let moves = 0;
  const colors = [0, 0, 0, 0, 0, 0];

  // Find the first color to play
  let connected = countConnectedTiles(board);

  while (connected.length !== board.length * board.length) {
    let biggestColor = 0;
    let biggestConnection = [];
    let biggestBoard = [];

    // Find what color to use next
    for (let color = 0; color < colors.length; color++) {
      if (color === board[0][0]){
        continue; // Previous
      } 
      
      let newBoard = colorConnector(board, color, connected);
      let connection = countConnectedTiles(newBoard);

      if (connection.length > biggestConnection.length) {
        biggestColor = color;
        biggestBoard = newBoard;
        biggestConnection = connection;
      }
    }

    board = biggestBoard;
    colors[biggestColor]++;
    connected = biggestConnection;
    moves++;
  }

  process.stdout.write(moves + '\n');
  process.stdout.write(colors.join(' ') + '\n');
}