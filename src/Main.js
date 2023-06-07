import { generateLayerOne } from './layers/LayerOne.js';
import { generateLayerTwo } from './layers/LayerTwo.js';
import { generateLayerThree } from './layers/LayerThree.js'; // Add this import

export const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
const generateBtn = document.querySelector('.genBtn');
const saveBtn = document.querySelector('.saveBtn'); 


function generateNoise() {
  let landPixels;
  let totalPixels;
  let landPercentage;
  const minLandPercentage = 40; // Minimum percentage of land
  const maxLandPercentage = 90; // Maximum percentage of land
  const maxAttempts = 1; // Maximum number of attempts to generate a map
  let attempts = 0;
  const shallowWaterThreshold = 0.05; // controls the deep/shallow water ratio
  let imageData;
  let seed1; // Declares seed1 
  let seed2; // Declares seed2 
  let seed3; // Declares seed3 
  let seed4 = Math.floor(Math.random() * 100000);
  const numClusters = 4
  const heatMapContainer = document.getElementById('heatMapContainer'); 
  
  
  do {
    seed1 = Math.floor(Math.random() * 100000); // generates the first seed
    seed2 = Math.floor(Math.random() * 100000); // generates the second seed
    seed3 = Math.floor(Math.random() * 100000); // generates the third seed
    seed4 = Math.floor(Math.random() * 100000); // generates the fourth seed
    imageData = ctx.createImageData(canvas.width, canvas.height);
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const maxDistanceX = centerX;
    const maxDistanceY = centerY;
    const bufferZone = 0.01; // Controls the buffer zone around the canvas, where only water can be generated

    landPixels = 0;
    totalPixels = 0;
    
    // generates data related to layers.
    const layerData = generateLayerOne(canvas.width, canvas.height, seed1, seed2);
    const mountainData = generateLayerTwo(canvas.width, canvas.height, seed3, numClusters, 0.1, layerData); 
    const forestData = generateLayerThree(canvas.width, canvas.height, seed4, heatMapContainer); // Pass heatMapContainer as an argument

    for (let y = 0; y < canvas.height; y++) {
      for (let x = 0; x < canvas.width; x++) {
        const combinedNoiseValue = layerData[y * canvas.width + x];
        const dx = x - centerX;
        const dy = y - centerY;
        const distanceX = Math.abs(dx) / maxDistanceX;
        const distanceY = Math.abs(dy) / maxDistanceY;
        const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
    
        // Blends the noise value with the radial gradient
        const gradient = Math.max(0, 1 - Math.min(Math.pow(distance / (1 - bufferZone), 4), 1));
        const blendedNoiseValue = combinedNoiseValue * gradient;
    
        const idx = (y * canvas.width + x) * 4;
        const colorThreshold = 0.005; // deep water threshold
        const mountainThreshold = 0.4;
    
        // Gets the forest noise value from the forest data
        const biomeValue = forestData[y * canvas.width + x];
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
        } else if (mountainData[y * canvas.width + x] > mountainThreshold) {
          // Mountain
          imageData.data[idx] = 180;
          imageData.data[idx + 1] = 180;
          imageData.data[idx + 2] = 180;
          landPixels++;
        } else if (biomeValue >= 50) {
          // Desert
          imageData.data[idx] = 244;
          imageData.data[idx + 1] = 164;
          imageData.data[idx + 2] = 48;
          landPixels++;
        } else if (biomeValue >= 20) {
          // Rainforest
          imageData.data[idx] = 24;
          imageData.data[idx + 1] = 43;
          imageData.data[idx + 2] = 24;
          landPixels++;
        } else if (biomeValue >= -10) {
          // Grassland
          imageData.data[idx] = 124;
          imageData.data[idx + 1] = 185;
          imageData.data[idx + 2] = 0;
          landPixels++;
        } else if (biomeValue >= -30) {
          // Forest
          imageData.data[idx] = 34;
          imageData.data[idx + 1] = 139;
          imageData.data[idx + 2] = 34;
          landPixels++;
        } else if (biomeValue >= -50) {
          // Boreal Forest
          imageData.data[idx] = 85;
          imageData.data[idx + 1] = 107;
          imageData.data[idx + 2] = 47;
          landPixels++;
        }
        // Sets the alpha channel value
        imageData.data[idx + 3] = 255;
        totalPixels++;
      }
    }


    ctx.putImageData(imageData, 0, 0);

    landPercentage = (landPixels / totalPixels) * 100;
    const nonWaterPixels = (totalPixels - (canvas.width * canvas.height * shallowWaterThreshold));
    const nonWaterPercentage = (landPixels / nonWaterPixels) * 100;
    console.log(`Attempt ${attempts}: ${nonWaterPercentage}% non-water`);    
    console.log(`${seed1} ${seed2} ${seed3}`); 

    // GIVE THE ATTEMPTS COUNTER SOME BLOODY SPACE SO I STOP TOUCHING IT AND CRASHING MY BROWSER
    attempts++; // increments the attempts at generating the map.
    // GIVE THE ATTEMPTS COUNTER SOME BLOODY SPACE SO I STOP TOUCHING IT AND CRASHING MY BROWSER

  } while ((landPercentage < minLandPercentage || landPercentage > maxLandPercentage) && attempts < maxAttempts);

  return { seed1, seed2, seed3, seed4 };
}


generateBtn.addEventListener("click", () => {
  const seeds = generateNoise();
  saveBtn.dataset.seed1 = seeds.seed1;
  saveBtn.dataset.seed2 = seeds.seed2;
  saveBtn.dataset.seed3 = seeds.seed3;
  saveBtn.dataset.seed4 = seeds.seed4; 
});


saveBtn.addEventListener("click", () => {
  const seed1 = saveBtn.dataset.seed1;
  const seed2 = saveBtn.dataset.seed2;
  const seed3 = saveBtn.dataset.seed3;
  const seed4 = saveBtn.dataset.seed4; 
  const filename = `Map_${seed1}_${seed2}_${seed3}_${seed4}.png`; // Updates filename string
  canvas.toBlob((blob) => {
    window.saveAs(blob, filename);
  }, "image/png");
});

const initialSeeds = generateNoise();
saveBtn.dataset.seed1 = initialSeeds.seed1;
saveBtn.dataset.seed2 = initialSeeds.seed2;
saveBtn.dataset.seed3 = initialSeeds.seed3;
saveBtn.dataset.seed4 = initialSeeds.seed4; 

const toggleTempMapBtn = document.querySelector('.toggleTempMapBtn');
const heatMapContainer = document.querySelector('#heatMapContainer');

toggleTempMapBtn.addEventListener('click', function() {
  if (heatMapContainer.style.display !== 'none') {
    heatMapContainer.style.display = 'none';
  } 
  else {
    heatMapContainer.style.display = 'block';
  }
});