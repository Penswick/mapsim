export function generateLayerThree(width, height, seed4, heatMapContainer) {
  const layerData = new Float32Array(width * height);

  let forestCount = 0;
  let tundraCount = 0;
  let desertCount = 0;
  let defaultCount = 0;

  const cellSize = 25;

  const cellValues = Array.from(Array(Math.ceil(height / cellSize)), () =>
    new Array(Math.ceil(width / cellSize)).fill(0)
);

const cellOrigins = Array.from(Array(Math.ceil(height / cellSize)), () =>
  new Array(Math.ceil(width / cellSize)).fill(null)
);


// Define the anchor points with their coordinates and values
const anchorPoints = [
  { x: Math.floor(width / (2 * cellSize)), y: 0, value: -5 }, // North
  { x: Math.floor(width / (2 * cellSize)), y: Math.floor(height / cellSize) - 1, value: 5 }, // South
  { x: 0, y: Math.floor(height / (2 * cellSize)), value: Math.floor(Math.random() * 5) - 2 }, // West
  { x: Math.floor(width / cellSize) - 1, y: Math.floor(height / (2 * cellSize)), value: Math.floor(Math.random() * 7) - 3 } // East
];


// Function to calculate Euclidean distance between two points. I hate maths I hate maths I hate maths I hate maths.
function calculateDistance(x1, y1, x2, y2) {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

// Function to calculate weight based on distance
function calculateWeight(distance) {
  return 1 / (distance + 1);
}

// Set cellValues for anchor points
for (const anchorPoint of anchorPoints) {
  cellValues[anchorPoint.y][anchorPoint.x] = anchorPoint.value;
}

// Calculate cellValues for the rest of the cells
for (let y = 0; y < Math.ceil(height / cellSize); y++) {
  for (let x = 0; x < Math.ceil(width / cellSize); x++) {
    if (cellValues[y][x] === 0) {
      let weightedSum = 0;
      let totalWeight = 0;
      let maxWeight = 0;
      let maxWeightOrigin = null;

      for (const [i, anchorPoint] of anchorPoints.entries()) {
        const distance = calculateDistance(x, y, anchorPoint.x, anchorPoint.y);
        const weight = calculateWeight(distance);
        weightedSum += weight * anchorPoint.value;
        totalWeight += weight;

        if (weight > maxWeight) {
          maxWeight = weight;
          maxWeightOrigin = ['N', 'S', 'W', 'E'][i]; // Assume the anchorPoints are in order: N, S, W, E
        }
      }

      cellValues[y][x] = Math.round(weightedSum / totalWeight);
      cellOrigins[y][x] = maxWeightOrigin;
    }
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
      const cellOrigin = cellOrigins[y][x];
      
      switch (cellOrigin) {
        case 'N':
          ctx.fillStyle = 'red';
          break;
        case 'S':
          ctx.fillStyle = 'blue';
          break;
        case 'W':
          ctx.fillStyle = 'pink';
          break;
        case 'E':
          ctx.fillStyle = 'white';
          break;
      }
  
      const textX = x * cellSize + cellSize / 2;
      const textY = y * cellSize + cellSize / 2;
  
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

        // Skip if out of bounds
        if (pixelX >= width || pixelY >= height) continue;

        // Biome placement logic
        if (cellValue >= 2 && cellValue <= 5) {
          layerData[pixelY * width + pixelX] = 1; // Desert
          desertCount++;
        } else if (cellValue >= -1 && cellValue <= 1) {
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

ctx.fillStyle = 'red'; // Change the fill color  to red for anchor letters
// draw the direction letters
ctx.fillText('N', Math.floor(width/(2*cellSize)) * cellSize + cellSize / 2, cellSize / 2); // N at the top
ctx.fillText('S', Math.floor(width/(2*cellSize)) * cellSize + cellSize / 2, height - cellSize / 2); // S at the bottom
ctx.fillText('W', cellSize / 2, Math.floor(height/(2*cellSize)) * cellSize + cellSize / 2); // W at the left
ctx.fillText('E', width - cellSize / 2, Math.floor(height/(2*cellSize)) * cellSize + cellSize / 2); // E at the right


  heatMapContainer.innerHTML = ''; // Clear the heatMapContainer
  heatMapContainer.appendChild(canvas); // Append the new canvas to the heatMapContainer

  console.log("Forest count:", forestCount);
  console.log("Tundra count:", tundraCount);
  console.log("Desert count:", desertCount);
  console.log("Default count:", defaultCount);
  return layerData;
}
