export function generateLayerThree(width, height, seed4, heatMapContainer) {
  const layerData = new Float32Array(width * height);
  
  let forestCount = 0;
  let tundraCount = 0;
  let desertCount = 0;
  let defaultCount = 0;

// Defines the size of the grid cells. Don't go below 2. Default is 25.
const cellSize = 25;

// Creates a 2D array to store the random numbers for each cell
const cellValues = Array.from(Array(Math.ceil(height/cellSize)), () => new Array(Math.ceil(width/cellSize)));

// Generates a random number between -5 and 5 for each cell
for (let y = 0; y < Math.ceil(height/cellSize); y++) {
  for (let x = 0; x < Math.ceil(width/cellSize); x++) {
    cellValues[y][x] = Math.floor(Math.random() * 11) - 5;
  }
}

  // Creates a canvas for the heatmap grid
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  // Draws the grid on the canvas
  ctx.strokeStyle = 'black'; // Sets grid color
  ctx.lineWidth = 0.5; // Sets grid line width

  ctx.font = 'bold 14px Arial'; // Sets font for numbers
  ctx.fillStyle = 'white'; // Sets color for numbers

// Draws the grid on the canvas and add the cell values
for (let y = 0; y < Math.ceil(height/cellSize); y++) {
  for (let x = 0; x < Math.ceil(width/cellSize); x++) {
    // Draws cell boundaries
    ctx.strokeRect(x * cellSize, y * cellSize, cellSize, cellSize);
    
    const cellValue = cellValues[y][x];

    // Calculates the center position of each cell for the text
    const textX = x * cellSize + cellSize / 2;
    const textY = y * cellSize + cellSize / 2;

    // Adds the number to the center of the cell
    ctx.fillText(cellValue, textX, textY);
  }
}



for (let y = 0; y < Math.ceil(height/cellSize); y++) {
  for (let x = 0; x < Math.ceil(width/cellSize); x++) {
    // Retrieves the value for this cell
    const cellValue = cellValues[y][x];

    // For every pixel in the cell
    for (let innerY = 0; innerY < cellSize; innerY++) {
      for (let innerX = 0; innerX < cellSize; innerX++) {
        // Calculates the pixel index
        const pixelX = x * cellSize + innerX;
        const pixelY = y * cellSize + innerY;

        // Skips if out of bounds
        if (pixelX >= width || pixelY >= height) continue;

        // Biome placement logic
        if (cellValue >= 4 && cellValue <= 5) {
          layerData[pixelY * width + pixelX] = 1; // Desert
          desertCount++;
        } else if (cellValue >= -1 && cellValue <= 3) {
          layerData[pixelY * width + pixelX] = 2; // Forest
          forestCount++;
        } else if (cellValue >= -5 && cellValue <= -2) {
          layerData[pixelY * width + pixelX] = 4; // Tundra
          tundraCount++;
        } else {
          layerData[pixelY * width + pixelX] = 0; // Default
          defaultCount++;
        }
      }
    }
  }
}


  heatMapContainer.innerHTML = ''; // Clear the heatMapContainer
  heatMapContainer.appendChild(canvas); // Append the new canvas to the heatMapContainer

  console.log("Forest count:", forestCount);
  console.log("Tundra count:", tundraCount);
  console.log("Desert count:", desertCount);
  console.log("Default count:", defaultCount);
  return layerData;
}
