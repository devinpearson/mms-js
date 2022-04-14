const API = require('./API');

function log(text) {
    console.error(text);
}

function main() {
  let maze = new Maze();
  let mouse = new Mouse('n', 0, 0);
  // add Maze ()
  // Maze.cell(x, y)
  log("Running...");
  API.setColor(0, 0, 'G');
  API.setText(0, 0, "abc");
  displayRoute(maze, 0, 0, mouse.direction)

  while (true) {
    mouse.next();
    mouse.move();
    API.setText(1, 0, mouse.x);
    API.setText(1, 1, mouse.y);
  }
}

function displayRoute(maze, x, y, currentDirection) {
  let currentVal = maze.cell(x, y).value;
  let val = 999;
  direction = currentDirection;
  let nextX = x;
  let nextY = y;
  while (currentVal != 0) {
    [nextX, nextY] = changeCoordinates(direction, nextX, nextY)
    API.setColor(nextX, nextY, 'G');
    let val = maze.cell(nextX, nextY).value;
    if (val >= currentVal) {
      direction = 'e';
    }
    currentVal = val;
  }
}

function getNextCell(maze, x, y, direction) {
    switch (direction) {
        case 'n':
          y++;
        case 'e':
          x++;
        case 's':
          y--;
        case 'w':
          x--;
    }
    if (x < 0 || y < 0) {
      return 999;
    }
    API.setText(13, 0, x);
    API.setText(14, 1, y);
    return maze.cell(x, y).value;
}



function changeCoordinates(direction, x, y) {
  switch (direction) {
      case 'n':
          y++;
          break;
      case 'e':
          x++;
          break;
      case 's':
          y--;
          break;
      case 'w':
          x--;
          break;
  }
  return [x, y];
}

class Maze {
  constructor() {
    this.mazeArray = [];
    this.prepareFloodfill()
  }
  
  cell(x, y) {
    return this.mazeArray[x][y];
  }

  floodFill( x, y, value) {
    

    this.floodfill(x + 1, y, value);
    this.floodFill(x, y + 1, value);
    this.floodFill(x - 1, y, value);
    this.floodFill(x, y - 1, value);
  }
  
  prepareFloodfill() {
    for (let i = 0; i < 16; i++) {
      this.mazeArray[i] = [];
      let val2 = 0;
      if (i > 7) {
        val2 = 14 + i - 15; 
      } else {
        val2 = 14 - i;
      }
      for (let j = 0; j < 16; j++) {
        let val = 0;
        if (j > 7 ) {
          val = val2 + j - 15;
        } else {
          val = val2 - j;
        }
        
        this.mazeArray[i][j] = new Cell(i, j, val)
        API.setText(i, j, val);
      }
    }
  }
}
class Mouse {
    constructor(direction, x, y) {
        this.direction = direction;
        this.x = x;
        this.y = y;
        API.setWall(x, y, 's');
    }

    changeDirection(direction) {
      this.direction = this.fetchDirection(direction);
      if (direction === 'left') {
        API.turnLeft();
      }
      if (direction === 'right') {
        API.turnRight();
      }
    }

    fetchDirection(direction) {
      switch (this.direction) {
          case 'n':
            if (direction === 'left') {
              return 'w';
            } else {
              return 'e';
            }
          case 'e':
            if (direction === 'left') {
              return 'n';
            } else {
              return 's';
            }
          case 's':
            if (direction === 'left') {
              return 'e';
            } else {
              return 'w';
            }
          case 'w':
            if (direction === 'left') {
              return 's';
            } else {
              return 'n';
            }
      }
  }
  
  move() {
    switch (this.direction) {
        case 'n':
            this.y += 1;
            break;
        case 'e':
            this.x += 1;
            break;
        case 's':
            this.y -= 1;
            break;
        case 'w':
            this.x -= 1;
            break;
    }
    API.moveForward();
  }

  next() {
    let leftAmount = 100;
    let rightAmount = 100;
    let forwardAmount = 100;

    let currentLeft = this.fetchDirection('left')
    let currentRight = this.fetchDirection('right')
    //leftAmount = getNextCell(maze, mouse.x, mouse.y, currentLeft);
    //rightAmount = getNextCell(maze, mouse.x, mouse.y, currentRight);
    //forwardAmount = getNextCell(maze, mouse.x, mouse.y, mouse.direction);
    
    // mark the walls
    if (API.wallLeft()) {
      API.setWall(this.x, this.y, currentLeft);
    }
    if (API.wallRight()) {
      API.setWall(this.x, this.y, currentRight);
    }
    if (API.wallFront()) {
      API.setWall(this.x, this.y, this.direction);
    }

    if (!API.wallLeft()) { 
      this.changeDirection('left');
    }
    while (API.wallFront()) {
        this.changeDirection('right');
    }
  }
}
class Cell {
  constructor(latitude, longitude, value) {
    this.latitude = latitude;
    this.longitude = longitude;
    this.value = value;
    this.visited = false;
    this.n = false;
    this.e = false;
    this.s = false;
    this.w = false;
  }

  setWall(direction) {
    switch (direction) {
      case 'n':
        this.n = true;
        break;
      case 'e':
        this.e = true;
        break;
      case 's':
        this.s = true;
        break;
      case 'w':
        this.w = true;
        break;
    }
    API.setWall(this.latitude, this.longitude, direction);

  }
}
main();
