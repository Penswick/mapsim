import PerlinNoise from '../PerlinNoise.js';

export function generateLayerOne(width, height, seed1, seed2) {
  const noiseGenerator = new PerlinNoise(seed1);
  const noiseGenerator2 = new PerlinNoise(seed2);
  const scalingFactor = 0.001; // change frequency for the first noise generator
  const scalingFactor2 = 0.01; // change frequency for the second noise generator

  const layerData = new Float32Array(width * height);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const noiseValue = noiseGenerator.noise(x * scalingFactor, y * scalingFactor, 0);
      const noiseValue2 = noiseGenerator2.noise(x * scalingFactor2, y * scalingFactor2, 0);
      const combinedNoiseValue = noiseValue * 0.8 + noiseValue2 * 0.2;

      layerData[y * width + x] = combinedNoiseValue;
    }
  }

  return layerData;
}
