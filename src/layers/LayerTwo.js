import PerlinNoise from '../PerlinNoise.js';

export function generateLayerTwo(width, height, seed3, numClusters = 3) {
  const noiseGenerator = new PerlinNoise(seed3);
  const clusterNoiseGenerator = new PerlinNoise(seed3 + 1); // Use a different seed for the clusters
  const scalingFactor = 0.009; // Controls frequency for the mountain noise generator
  const clusterScalingFactor = 0.05; // Controls frequency for the mountain cluster generator

  const layerData = new Float32Array(width * height);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const noiseValue = noiseGenerator.noise(x * scalingFactor, y * scalingFactor, 0);
      const clusterValue = clusterNoiseGenerator.noise(x * clusterScalingFactor, y * clusterScalingFactor, 0);

      // Calculate the combined noise value based on the cluster influence
      const combinedNoiseValue = calculateCombinedNoiseValue(noiseValue, clusterValue, numClusters);

      layerData[y * width + x] = combinedNoiseValue;
    }
  }

  return layerData;
}

function calculateCombinedNoiseValue(noiseValue, clusterValue, numClusters) {
  // Determine the cluster influence based on the clusterValue and numClusters
  const clusterInfluence = Math.floor((clusterValue + 1) * numClusters / 2);

  // Adjust the noiseValue based on the clusterInfluence
  const combinedNoiseValue = noiseValue * clusterInfluence;

  return combinedNoiseValue;
}
