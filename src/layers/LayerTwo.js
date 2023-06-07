import PerlinNoise from '../PerlinNoise.js';

export function generateLayerTwo(width, height, seed3, numClusters = 5, mountainBuffer = 0.1, landNoiseData) {
  const noiseGenerator = new PerlinNoise(seed3);
  const clusterNoiseGenerator = new PerlinNoise(seed3 + 1); // Use a different seed for the clusters
  const scalingFactor = 0.008; // Controls frequency for the mountain noise generator
  const clusterScalingFactor = 0.008; // Controls frequency for the mountain cluster generator
  const globalMountainThreshold = 0.4; // Add a global threshold for mountains

  const layerData = new Float32Array(width * height);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const noiseValue = noiseGenerator.noise(x * scalingFactor, y * scalingFactor, 0);
      const clusterValue = clusterNoiseGenerator.noise(x * clusterScalingFactor, y * clusterScalingFactor, 0);
      // Calculates the combined noise value based on the cluster influence
      // Pass landNoiseData as an additional parameter to calculateCombinedNoiseValue
      const combinedNoiseValue = calculateCombinedNoiseValue(noiseValue, clusterValue, numClusters, landNoiseData[y * width + x]);
      layerData[y * width + x] = combinedNoiseValue;
      
    }
  }

  const smoothedMountainData = smoothMountainData(layerData, width, height, 5); // Try 3 iterations for better smoothing
  const filteredMountainData = filterMountainsByThreshold(smoothedMountainData, width, height, globalMountainThreshold);
  return filteredMountainData;
}

function calculateCombinedNoiseValue(noiseValue, clusterValue, numClusters, landNoiseValue) {
  // Adjust the noiseValue based on the weighted clusterValue
  const combinedNoiseValue = noiseValue * (1 + clusterValue * numClusters);

  // Modify combinedNoiseValue based on landNoiseValue
  const mountainCutoff = 0.8; // Increase this value to reduce mountains near the coastline
  const adjustedNoiseValue = landNoiseValue < mountainCutoff ? combinedNoiseValue * (landNoiseValue / mountainCutoff) : combinedNoiseValue;

  return adjustedNoiseValue;
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
              if (mountainData[newY * width + newX] > 0.1) { // Use the same mountainThreshold value
                neighbors++;
              }
            }
          }
      }
        // If a pixel has at least X neighboring mountain pixels, set it as a mountain pixel
        if (neighbors >= 1) {
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

// Add a new function to filter mountains based on a global threshold. Gods above, this was such a nightmare.
function filterMountainsByThreshold(mountainData, width, height, threshold) {
  const filteredData = new Float32Array(width * height);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const value = mountainData[y * width + x];
      filteredData[y * width + x] = value > threshold ? value : 0;
    }
  }

  return filteredData;
}