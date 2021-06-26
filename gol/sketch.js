let gridSize = 600;
let rows = 30;
let cols = 30;
let grid = createGrid(rows, cols);

let rowStep = gridSize / rows;
let colStep = gridSize / cols;

let isRunning = false;
let isStep = false;
let showGrid = true;

let startButton;
let stopButton;
let clearButton;
let stepButton;
let randButton;
let gridButton;

function setup() {
    createCanvas(gridSize, gridSize);
    emptyGrid(grid);

    frameRate(10);

    startButton = createButton("Start Simulating");
    startButton.position(gridSize + 30, 5);
    startButton.mousePressed(startSim);

    stopButton = createButton("Stop Simulating");
    stopButton.position(gridSize + 30, 30);
    stopButton.mousePressed(stopSim);

    clearButton = createButton("Clear Grid");
    clearButton.position(gridSize + 30, 55);
    clearButton.mousePressed(clearSim);

    stepButton = createButton("Step Forward");
    stepButton.position(gridSize + 30, 80);
    stepButton.mousePressed(stepSim);

    randButton = createButton("Randomize");
    randButton.position(gridSize + 30, 105);
    randButton.mousePressed(randomizeGrid);

    gridButton = createButton("Toggle Grid");
    gridButton.position(gridSize + 30, 130);
    gridButton.mousePressed(toggleGrid);
}

function draw() {
    background(255);
    
    for (let row=0; row<rows; row++) {
        for (let col=0; col<cols; col++) {
            if (grid[row][col] == 1) {
                fill(0);
                strokeWeight(0.5);
                if (showGrid) {
                    stroke(200);
                }
                else {

                stroke(0);
                }
                rect(row*rowStep, col*colStep, rowStep, colStep);
            }
            else {
                if (showGrid) {
                    fill(255);
                    strokeWeight(0.5);
                    stroke(200);
                    rect(row*rowStep, col*colStep, rowStep, colStep);
                }
            }
        }
    }

    if (isStep) {
        grid = populateNextGen(grid);
        isStep = false;
    }
    else if (isRunning) {
        grid = populateNextGen(grid);
    }
}

function mouseClicked() {
    if (mouseX > gridSize || mouseY > gridSize) return;
    for (let i=0; i<gridSize; i++) {
        console.log(mouseX);
        if (mouseX < i*rowStep) {
            for (let j=0; j<gridSize; j++) {
                if (mouseY < j*colStep) {
                    console.log(i, j);
                    if (grid[i-1][j-1] == 1) grid[i-1][j-1] = 0;
                    else grid[i-1][j-1] = 1;
                    break;
                }
            }
            break;
        }
    }
}

function createGrid(rows, cols) {
    let arr = new Array(rows);
    for (let i=0; i<rows; i++) {
        arr[i] = new Array(cols);
    }
    return arr;
}

function randomizeGrid() {
    for (let row=0; row<rows; row++) {
        for (let col=0; col<cols; col++) {
            grid[row][col] = Math.floor((Math.random() * 2));
        }
    }
}

function emptyGrid(arr) {
    for (let row=0; row<rows; row++) {
        for (let col=0; col<cols; col++) {
            arr[row][col] = 0;
        }
    }
}

function countNeighbors(arr, r, c) {
    let count = 0;
    for (let row=r-1; row<=r+1; row++) {
        for (let col=c-1; col<=c+1; col++) {
            if (row >= 0 && row <= rows-1 && col >= 0 && col <= cols-1 && (row != r || col != c) && arr[row][col] == 1) {
                console.log("( " + r, ",", c + " ) I FOUND N AT: ", row, col);
                count++;
            }
        }
    }
    return count;
}

function nextCellState(arr, r, c) {
    let neighbors = countNeighbors(arr, r, c);
    console.log("( " + r, ",", c + " ) I FOUND A TOTAL OF: ", neighbors);
    let state = arr[r][c];
    console.log("( " + r, ",", c + " ) I AM CURRENTLY AT STATE: ", state);
    if (state == 1) {
        if (neighbors < 2) return 0;
        if (neighbors == 2 || neighbors == 3) return 1;
        if (neighbors > 3) return 0;
    }
    else if (state == 0) {
        if (neighbors == 3) return 1;
    }
    return 0;
}

function populateNextGen(arr) {
    let out = createGrid(rows, cols);
    for (let row=0; row<rows; row++) {
        for (let col=0; col<cols; col++) {
            out[row][col] = nextCellState(arr, row, col);
            console.log("I am the cell at: " + row, col);
            console.log("Above cell value next value: " + out[row][col]);
        }
    }
    return out;
}

function startSim() {
    isRunning = true;
}

function stopSim() {
    isRunning = false;
}

function clearSim() {
    isRunning = false;
    emptyGrid(grid);
}

function stepSim() {
    isRunning = false;
    isStep = true;
}

function toggleGrid() {
    if (showGrid) {
        showGrid = false;
    }
    else {
        showGrid = true;
    }
}
