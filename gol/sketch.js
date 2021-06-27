let gridSize = 400;
let x = screen.width / 2 - (gridSize / 2);
let y = 80;
let rows = 20;
let cols = 20;
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
let confirmButton;

let sizeInput;
let rowsInput;
let colsInput;

let canvas;

function setup() {
    canvas = createCanvas(gridSize, gridSize);
    canvas.position(x, y);

    emptyGrid(grid);

    frameRate(10);

    startButton = createButton("Start Simulating");
    startButton.position(gridSize + 15 + x, 5 + y);
    startButton.mousePressed(startSim);

    stopButton = createButton("Stop Simulating");
    stopButton.position(gridSize + 15 + x, 30 + y);
    stopButton.mousePressed(stopSim);

    stepButton = createButton("Step Forward");
    stepButton.position(gridSize + 15 + x, 55 + y);
    stepButton.mousePressed(stepSim);

    randButton = createButton("Randomize");
    randButton.position(gridSize + 15 + x, 80 + y);
    randButton.mousePressed(randomizeGrid);

    gridButton = createButton("Toggle Grid");
    gridButton.position(gridSize + 15 + x, 105 + y);
    gridButton.mousePressed(toggleGrid);

    clearButton = createButton("Clear");
    clearButton.position(gridSize + 15 + x, 130 + y);
    clearButton.mousePressed(clearSim);

    sizeInput = createInput(gridSize.toString());
    sizeInput.position(gridSize + 15 + x, 180 + y);

    colsInput = createInput(rows.toString());
    colsInput.position(gridSize + 15 + x, 205 + y);

    rowsInput = createInput(cols.toString());
    rowsInput.position(gridSize + 15 + x, 230 + y);

    confirmButton = createButton("Confirm");
    confirmButton.position(gridSize + 15 + x, 255 + y);
    confirmButton.mousePressed(confirmChanges);
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
    if (mouseX < 0 || mouseY < 0 || mouseX > gridSize || mouseY > gridSize) return;
    for (let i=1; i<=rows; i++) {
        if (mouseX < i*rowStep) {
            for (let j=1; j<=cols; j++) {
                if (mouseY < j*colStep) {
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
                count++;
            }
        }
    }
    return count;
}

function nextCellState(arr, r, c) {
    let neighbors = countNeighbors(arr, r, c);
    let state = arr[r][c];
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

function confirmChanges() {
    isRunning = false;
    gridSize = parseInt(sizeInput.value());
    x = screen.width / 2 - (gridSize / 2);
    rows = parseInt(rowsInput.value());
    cols = parseInt(colsInput.value());
    rowStep = gridSize / rows;
    colStep = gridSize / cols;
    grid = createGrid(rows, cols);
    
    canvas = createCanvas(gridSize, gridSize);
    canvas.position(x, y);

    emptyGrid(grid);

    frameRate(10);

    startButton.position(gridSize + 15 + x, 5 + y);
    stopButton.position(gridSize + 15 + x, 30 + y);
    stepButton.position(gridSize + 15 + x, 55 + y);
    randButton.position(gridSize + 15 + x, 80 + y);
    gridButton.position(gridSize + 15 + x, 105 + y);
    clearButton.position(gridSize + 15 + x, 130 + y);
    sizeInput.position(gridSize + 15 + x, 180 + y);
    colsInput.position(gridSize + 15 + x, 205 + y);
    rowsInput.position(gridSize + 15 + x, 230 + y);
    confirmButton.position(gridSize + 15 + x, 255 + y);
}
