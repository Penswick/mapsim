import PerlinNoise from '../PerlinNoise.js';

export function generateLayerThree(width, height, seed3, landNoiseData) {
  const noiseGenerator = new PerlinNoise(seed3);
  const scalingFactor = 0.01;
  const forestThreshold = 0.55;
  const tundraThreshold = 0.45; // New threshold for tundra
  const desertThreshold = 0.35; // New threshold for desert

  const layerData = new Float32Array(width * height);

  // Temperature map related variables
  const temperatureSeed = seed3 + 1000; // Use a different seed for temperature map
  const temperatureGenerator = new PerlinNoise(temperatureSeed);
  const temperatureScalingFactor = 0.05;
  const temperatureGradient = 1.5 / height; // Adjust this value to control the gradient
  
  let forestCount = 0;
  let tundraCount = 0;
  let desertCount = 0;
  let defaultCount = 0;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const noiseValue = noiseGenerator.noise(x * scalingFactor, y * scalingFactor, 0);
      const landValue = landNoiseData[y * width + x];

      // Generate temperature value and apply gradient
      const temperatureValue = temperatureGenerator.noise(x * temperatureScalingFactor, y * temperatureScalingFactor, 0);
      const temperatureWithGradient = temperatureValue - y * temperatureGradient;

      // Biome placement logic will depend on temperatureWithGradient
      
      if (noiseValue > forestThreshold && landValue > 0.06) {
          layerData[y * width + x] = 1; // Forest
          forestCount++;
        } else if (noiseValue > tundraThreshold && landValue > 0.06) {
          layerData[y * width + x] = 2; // Tundra
          tundraCount++;
        } else if (noiseValue > desertThreshold && landValue > 0.06) {
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
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const temperatureWithGradient = temperatureGenerator.noise(x * temperatureScalingFactor, y * temperatureScalingFactor, 0) - y * temperatureGradient;
      const colorValue = (temperatureWithGradient + 1) * 0.5 * 255;
      ctx.fillStyle = `rgb(${colorValue}, ${colorValue}, ${colorValue})`;
      ctx.fillRect(x, y, 1, 1);
    }
  }

  console.log("Forest count:", forestCount);
  console.log("Tundra count:", tundraCount);
  console.log("Desert count:", desertCount);
  console.log("Default count:", defaultCount);

  return layerData;
}
