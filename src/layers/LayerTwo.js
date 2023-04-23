import PerlinNoise from '../PerlinNoise.js';

export function generateLayerTwo(width, height, seed3, numClusters = 3) {
  const noiseGenerator = new PerlinNoise(seed3);
  const clusterNoiseGenerator = new PerlinNoise(seed3 + 1); // Use a different seed for the clusters
  const scalingFactor = 0.005; // Controls frequency for the mountain noise generator
  const clusterScalingFactor = 0.03; // Controls frequency for the mountain cluster generator

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
    const smoothedMountainData = smoothMountainData(layerData, width, height, 5); // Try 3 iterations for better smoothing
    return smoothedMountainData;
}

function calculateCombinedNoiseValue(noiseValue, clusterValue, numClusters) {
  // Determine the cluster influence based on the clusterValue and numClusters
  const clusterInfluence = Math.floor((clusterValue + 1) * 5 * numClusters / 2);

  // Adjust the noiseValue based on the clusterInfluence
  const combinedNoiseValue = noiseValue * clusterInfluence;

  return combinedNoiseValue;
}

function smoothMountainData(mountainData, width, height, iterations = 1) {
  for (let iteration = 0; iteration < iterations; iteration++) {
    const newMountainData = new Float32Array(width * height);

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        let neighbors = 0;

        // Check the neighboring pixels around the current pixel
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            const newX = x + dx;
            const newY = y + dy;

            if (newX >= 0 && newX < width && newY >= 0 && newY < height && !(dx === 0 && dy === 0)) {
              if (mountainData[newY * width + newX] > 0.4) { // Use the same mountainThreshold value
                neighbors++;
              }
            }
          }
        }

        // If a pixel has at least X neighboring mountain pixels, set it as a mountain pixel
        if (neighbors >= 3) {
          newMountainData[y * width + x] = 1;
        } else {
          newMountainData[y * width + x] = mountainData[y * width + x];
        }
      }
    }

    // Overwrites the orginal data with the new, smoothed data.
    mountainData = newMountainData;
  }

  return mountainData;
}
