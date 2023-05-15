import PerlinNoise from '../PerlinNoise.js';

function threshold(value, levels) {
  for (let i = 0; i < levels.length; i++) {
    if (value < levels[i]) {
      return levels[i];
    }
  }
  return levels[levels.length - 1];
}

export function generateLayerThree(width, height, seed4, landNoiseData, heatMapContainer) {
  const noiseGenerator = new PerlinNoise(seed4);
  const scalingFactor = 0.01;
  const forestThreshold = 0.55;
  const tundraThreshold = 0.20; // New threshold for tundra
  const desertThreshold = 0.55; // New threshold for desert

  const layerData = new Float32Array(width * height);

  // Temperature map related variables
  const temperatureSeed = seed4 + 1000; // Use a different seed for temperature map
  const temperatureGenerator = new PerlinNoise(temperatureSeed);
  const temperatureScalingFactor = 0.002;
  const temperatureGradient = 1.9 / height; // Adjust this value to control the gradient
  
  let forestCount = 0;
  let tundraCount = 0;
  let desertCount = 0;
  let defaultCount = 0;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const noiseValue = noiseGenerator.noise(x * scalingFactor, y * scalingFactor, 0);
      const landValue = landNoiseData[y * width + x];
  
      // Generate temperature value and apply gradient
      const temperatureValue = threshold(
        temperatureGenerator.noise(x * temperatureScalingFactor, y * temperatureScalingFactor, 0),
        [0.2, 0.5, 0.8] // example levels
      );
      const temperatureWithGradient = temperatureValue - y * temperatureGradient;
      // Adjusted biome placement logic that depends on temperatureWithGradient
      if (noiseValue > forestThreshold && landValue > 0.06 && temperatureWithGradient > 0.5) {
        layerData[y * width + x] = 1; // Forest
        forestCount++;
      } else if (noiseValue > tundraThreshold && landValue > 0.06 && temperatureWithGradient < 0.5 && temperatureWithGradient > 0.2) {
        layerData[y * width + x] = 2; // Tundra
        tundraCount++;
      } else if (noiseValue > desertThreshold && landValue > 0.06 && temperatureWithGradient < 0.2) {
        layerData[y * width + x] = 3; // Desert
        desertCount++;
      } else {
        layerData[y * width + x] = 0; // Default
        defaultCount++;
      }
    }
  }
  
  

// Simple visualization of the temperature map
const canvas = document.createElement('canvas');
canvas.width = width;
canvas.height = height;
heatMapContainer.innerHTML = ''; // Clear the heatMapContainer
heatMapContainer.appendChild(canvas); // Append the new canvas to the heatMapContainer
const ctx = canvas.getContext('2d');

for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    const temperatureWithGradient = temperatureGenerator.noise(x * temperatureScalingFactor, y * temperatureScalingFactor, 0) - y * temperatureGradient;
    const colorValue = (temperatureWithGradient + 1) * 0.5;
    const r = (1 - colorValue) * 150;
    const g = 0;
    const b = colorValue * 150;
    ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
    ctx.fillRect(x, y, 1, 1);
  }
}
  console.log("Forest count:", forestCount);
  console.log("Tundra count:", tundraCount);
  console.log("Desert count:", desertCount);
  console.log("Default count:", defaultCount);
  return layerData;
}



