export function generateLayerThree(width, height, seed4, heatMapContainer) {
  const layerData = new Float32Array(width * height);
  
  let forestCount = 0;
  let tundraCount = 0;
  let desertCount = 0;
  let defaultCount = 0;

  const cellSize = 25;

  const cellValues = Array.from(Array(Math.ceil(height/cellSize)), () => new Array(Math.ceil(width/cellSize)));

  // Anchor points
  const N = -5;
  const S = 5;
  const E = Math.floor(Math.random() * 7) - 3;  // Random value between -3 and 3
  const W = Math.floor(Math.random() * 5) - 2;  // Random value between -2 and 2

  for (let y = 0; y < Math.ceil(height/cellSize); y++) {
    for (let x = 0; x < Math.ceil(width/cellSize); x++) {
      // Check if the current cell is an anchor point
      if (y === 0 && x === Math.floor(width/(2*cellSize))) cellValues[y][x] = N;
      else if (y === Math.floor(height/cellSize) - 1 && x === Math.floor(width/(2*cellSize))) cellValues[y][x] = S;
      else if (x === 0 && y === Math.floor(height/(2*cellSize))) cellValues[y][x] = W;
      else if (x === Math.floor(width/cellSize) - 1 && y === Math.floor(height/(2*cellSize))) cellValues[y][x] = E;
      else cellValues[y][x] = 0;
    }
  }


  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  ctx.strokeStyle = 'black';
  ctx.lineWidth = 0.5;

  ctx.font = 'bold 14px Arial';
  ctx.fillStyle = 'white';

  for (let y = 0; y < Math.ceil(height/cellSize); y++) {
    for (let x = 0; x < Math.ceil(width/cellSize); x++) {
      ctx.strokeRect(x * cellSize, y * cellSize, cellSize, cellSize);
      
      const cellValue = cellValues[y][x];

      const textX = x * cellSize + cellSize / 2;
      const textY = y * cellSize + cellSize / 2;

      ctx.fillText(cellValue, textX, textY);
    }
  }
  // draws the anchor points
  ctx.font = 'bold 14px Arial';
  ctx.fillStyle = 'red'

// Draw the direction letters
ctx.fillText('N', Math.floor(width/(2*cellSize)) * cellSize + cellSize / 2, cellSize / 2); // N at the top
ctx.fillText('S', Math.floor(width/(2*cellSize)) * cellSize + cellSize / 2, height - cellSize / 2); // S at the bottom
ctx.fillText('W', cellSize / 2, Math.floor(height/(2*cellSize)) * cellSize + cellSize / 2); // W at the left
ctx.fillText('E', width - cellSize / 2, Math.floor(height/(2*cellSize)) * cellSize + cellSize / 2); // E at the right


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
