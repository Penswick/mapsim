import PerlinNoise from './PerlinNoise.js';

export const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
const generateBtn = document.querySelector('.genBtn');

function generateNoise() {
  let landPixels;
  let totalPixels;
  let landPercentage;
  const minLandPercentage = 30; // Minimum percentage of land
  const maxLandPercentage = 70; // Maximum percentage of land
  let imageData;

  do {
    const seed = Math.floor(Math.random() * 100000); // generates the seed
    const noiseGenerator = new PerlinNoise(seed);
    imageData = ctx.createImageData(canvas.width, canvas.height);
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const maxDistanceX = centerX;
    const maxDistanceY = centerY;
    const bufferZone = 0.1; // Add a buffer zone around the canvas, where only water can be generated

    landPixels = 0;
    totalPixels = 0;

    for (let y = 0; y < canvas.height; y++) {
      for (let x = 0; x < canvas.width; x++) {
        const scalingFactor = 0.001; // change frequency
        const noiseValue = noiseGenerator.noise(x * scalingFactor, y * scalingFactor, 0);
        const dx = x - centerX;
        const dy = y - centerY;
        const distanceX = Math.abs(dx) / maxDistanceX;
        const distanceY = Math.abs(dy) / maxDistanceY;
        const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

        // Blend the noise value with the radial gradient
        const gradient = Math.max(0, 1 - Math.min(Math.pow(distance / (1 - bufferZone), 4), 1));
        const blendedNoiseValue = noiseValue * gradient;

        const idx = (y * canvas.width + x) * 4;
        const colorThreshold = 0.02; // change the water/land ratio

        if (blendedNoiseValue < colorThreshold) {
          // Water
          imageData.data[idx] = 0;
          imageData.data[idx + 1] = 0;
          imageData.data[idx + 2] = 150;
        } else {
          // Land
          imageData.data[idx] = 0;
          imageData.data[idx + 1] = 150;
          imageData.data[idx + 2] = 0;
          landPixels++;
        }
        imageData.data[idx + 3] = 255;
        totalPixels++;
      }
    }

    landPercentage = (landPixels / totalPixels) * 100;
  } while (landPercentage < minLandPercentage || landPercentage > maxLandPercentage);

  ctx.putImageData(imageData, 0, 0);
}

generateBtn.addEventListener('click', generateNoise);

generateNoise(); // Generates first time for testing purposes.
