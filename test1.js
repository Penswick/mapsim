import PerlinNoise from '../PerlinNoise.js';

export function generateLayerThree(width, height, seed3, landNoiseData) {
  const noiseGenerator = new PerlinNoise(seed3);
  const scalingFactor = 0.01; // Controls frequency for the forest noise generator
  const forestThreshold = 0.6; // Adjust this value to control the forest distribution

  const layerData = new Float32Array(width * height);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const noiseValue = noiseGenerator.noise(x * scalingFactor, y * scalingFactor, 0);
      layerData[y * width + x] = noiseValue > forestThreshold && landNoiseData[y * width + x] > 0.06 ? 1 : 0;
    }
  }

  return layerData;
}
