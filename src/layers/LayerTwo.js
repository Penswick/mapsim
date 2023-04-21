import PerlinNoise from '../PerlinNoise.js';

export function generateLayerTwo(width, height, seed3) {
  const noiseGenerator = new PerlinNoise(seed3);
  const scalingFactor = 0.1; // Change frequency for the mountain noise generator

  const layerData = new Float32Array(width * height);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const noiseValue = noiseGenerator.noise(x * scalingFactor, y * scalingFactor, 0);

      layerData[y * width + x] = noiseValue;
    }
  }

  return layerData;
}
