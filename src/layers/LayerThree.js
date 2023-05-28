import PerlinNoise from '../PerlinNoise.js';

export function generateLayerThree(width, height, seed4, landNoiseData, heatMapContainer) {
  const layerData = new Float32Array(width * height);
  
  const nWeight = 10;
  const sWeight = 80;
  // E and W weights should be random between 30 and 60
  const eWeight = Math.floor(Math.random() * (60 - 30 + 1)) + 30; 
  const wWeight = Math.floor(Math.random() * (60 - 30 + 1)) + 30;

  // Temperature map related variables
  const temperatureSeed = seed4 + 1000; // Use a different seed for temperature map
  const temperatureGenerator = new PerlinNoise(temperatureSeed);
  const temperatureScalingFactor = 0.002;
  const temperatureGradient = 0.4 / height; // Adjust this value to control the gradient

  let forestCount = 0;
  let tundraCount = 0;
  let desertCount = 0;
  let defaultCount = 0;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const landValue = landNoiseData[y * width + x];
  
      // Generate temperature value and apply gradient
      const temperatureValue = temperatureGenerator.noise(x * temperatureScalingFactor, y * temperatureScalingFactor, 0);
      const temperatureWithGradient = temperatureValue - y * temperatureGradient;

      // Biome placement logic that depends on temperatureWithGradient
      if (landValue > 0.06 && temperatureWithGradient <= 0.6 && temperatureWithGradient > 0.4) {
        layerData[y * width + x] = 1; // Forest
        forestCount++;
      } else if (landValue > 0.06 && temperatureWithGradient <= 0.2) {
        layerData[y * width + x] = 2; // Tundra
        tundraCount++;
      } else if (landValue > 0.06 && temperatureWithGradient >= 0.8) {
        layerData[y * width + x] = 3; // Desert
        desertCount++;
      } else {
        layerData[y * width + x] = 0; // Default
        defaultCount++;
      }
    }
  }
  
  // Simplified visualization of the temperature map
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
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

  // Draw anchor points
  ctx.font = '30px Arial';
  ctx.fillStyle = 'white';
  ctx.fillText('N', width / 2, 30); // North
  ctx.fillText('S', width / 2, height - 10); // South
  ctx.fillText('W', 10, height / 2); // West
  ctx.fillText('E', width - 20, height / 2); // East

  heatMapContainer.innerHTML = ''; // Clear the heatMapContainer
  heatMapContainer.appendChild(canvas); // Append the new canvas to the heatMapContainer

  console.log("Forest count:", forestCount);
  console.log("Tundra count:", tundraCount);
  console.log("Desert count:", desertCount);
  console.log("Default count:", defaultCount);
  return layerData;
}
