export function generateLayerThree(width, height, seed4, heatMapContainer) {
  const layerData = new Float32Array(width * height);
  
  let forestCount = 0;
  let tundraCount = 0;
  let desertCount = 0;
  let defaultCount = 0;

  // Create a 2D array to store the random numbers for each cell
  const cellValues = Array.from(Array(height), () => new Array(width));

  // Define the size of the grid cells
  const cellSize = 25;

  // Create a canvas for the heatmap grid
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  // Draw the grid on the canvas
  ctx.strokeStyle = 'black'; // Set grid color
  ctx.lineWidth = 0.5; // Set grid line width

  ctx.font = 'bold 14px Arial'; // Set font for numbers
  ctx.fillStyle = 'white'; // Set color for numbers

  for (let x = 0; x <= width; x += cellSize) {
    for (let y = 0; y <= height; y += cellSize) {
      ctx.strokeRect(x, y, cellSize, cellSize);

      // Generate a random number between -5 and 5
      const number = Math.floor(Math.random() * 11) - 5; 

      // Store the random number for this cell
      cellValues[Math.floor(y/cellSize)][Math.floor(x/cellSize)] = number;

      // Calculate the center position of each cell for the text
      const textX = x + cellSize / 2;
      const textY = y + cellSize / 2;

      // Add the number to the center of the cell
      ctx.fillText(number, textX, textY);
    }
  }

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      // Retrieve the value for this cell
      const cellValue = cellValues[Math.floor(y/cellSize)][Math.floor(x/cellSize)];

      // Biome placement logic
      if (cellValue >= -5 && cellValue <= -2) {
        layerData[y * width + x] = 4; // Tundra
        tundraCount++;
      } else if (cellValue >= -1 && cellValue <= 3) {
        layerData[y * width + x] = 2; // Forest
        forestCount++;
      } else if (cellValue >= 4 && cellValue <= 5) {
        layerData[y * width + x] = 1; // Desert
        desertCount++;
      } else {
        layerData[y * width + x] = 0; // Default
        defaultCount++;
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
