import { generateLayerOne } from './layers/LayerOne.js';

export const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
const generateBtn = document.querySelector('.genBtn');

function generateNoise() {
  let landPixels;
  let totalPixels;
  let landPercentage;
  const minLandPercentage = 30; // Minimum percentage of land
  const maxLandPercentage = 60; // Maximum percentage of land
  const maxAttempts = 100; // Maximum number of attempts to generate a map
  let attempts = 0;
  const shallowWaterThreshold = 0.05; // change the deep/shallow water ratio
  let imageData;
  
  do {
    const seed1 = Math.floor(Math.random() * 100000); // generates the first seed
    const seed2 = Math.floor(Math.random() * 100000); // generates the second seed
    imageData = ctx.createImageData(canvas.width, canvas.height);
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const maxDistanceX = centerX;
    const maxDistanceY = centerY;
    const bufferZone = 0.1; // Add a buffer zone around the canvas, where only water can be generated

    landPixels = 0;
    totalPixels = 0;

    const layerData = generateLayerOne(canvas.width, canvas.height, seed1, seed2);

    for (let y = 0; y < canvas.height; y++) {
      for (let x = 0; x < canvas.width; x++) {
        const combinedNoiseValue = layerData[y * canvas.width + x];
        const dx = x - centerX;
        const dy = y - centerY;
        const distanceX = Math.abs(dx) / maxDistanceX;
        const distanceY = Math.abs(dy) / maxDistanceY;
        const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

        // Blend the noise value with the radial gradient
        const gradient = Math.max(0, 1 - Math.min(Math.pow(distance / (1 - bufferZone), 4), 1));
        const blendedNoiseValue = combinedNoiseValue * gradient;

        const idx = (y * canvas.width + x) * 4;
        const colorThreshold = 0.015; // change the water/land ratio

        if (blendedNoiseValue < colorThreshold) {
          // Deep water
          imageData.data[idx] = 0;
          imageData.data[idx + 1] = 0;
          imageData.data[idx + 2] = 150;
        } else if (blendedNoiseValue < shallowWaterThreshold) {
          // Shallow water
          imageData.data[idx] = 0;
          imageData.data[idx + 1] = 100;
          imageData.data[idx + 2] = 255;
        } else {
          // Land
          imageData.data[idx] = 0;
          imageData.data[idx + 1] = 150;
          imageData.data[idx + 2] = 0;
          landPixels++;
        }

        // Set the alpha channel value to 255
        imageData.data[idx + 3] = 255;
        totalPixels++;
      }
    }

    landPercentage = (landPixels / totalPixels) * 100;
    console.log(`Attempt ${attempts}: ${landPercentage}% land`);
    attempts++; // increments the attempts at generating the map.
  } while ((landPercentage < minLandPercentage || landPercentage > maxLandPercentage) && attempts < maxAttempts);

  ctx.putImageData(imageData, 0, 0);
}



generateBtn.addEventListener('click', generateNoise);

generateNoise(); // Generates first time for testing purposes.
