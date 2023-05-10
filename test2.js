// old

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
  const shallowWaterThreshold = 0.05; // change the deep/shallow water ratio
  let imageData;
  let seed1; // Declares seed1 
  let seed2; // Declares seed2 
  let seed3; // Declares seed3 
  const numClusters = 4


  
  do {
    seed1 = Math.floor(Math.random() * 100000); // generates the first seed
    seed2 = Math.floor(Math.random() * 100000); // generates the second seed
    seed3 = Math.floor(Math.random() * 100000); // generates the third seed
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
    const forestData = generateLayerThree(canvas.width, canvas.height, seed3, layerData);

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
        const colorThreshold = 0.015;
        const coastlineThreshold = 0.06;
        const mountainThreshold = 0.4;
        const forestThreshold = 0.2;
    
        // Get the forest noise value from the forest data
        const forestValue = forestData[y * canvas.width + x];
    
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
        } else if (blendedNoiseValue < coastlineThreshold) {
          imageData.data[idx] = 240;
          imageData.data[idx + 1] = 230;
          imageData.data[idx + 2] = 50;
          landPixels++;
        } else if (mountainData[y * canvas.width + x] > mountainThreshold) {
          // Mountain
          imageData.data[idx] = 180;
          imageData.data[idx + 1] = 180;
          imageData.data[idx + 2] = 180;
          landPixels++;
        } else if (forestValue > forestThreshold) {
          // Forest
          imageData.data[idx] = 255;
          imageData.data[idx + 1] = 0;
          imageData.data[idx + 2] = 0;
          landPixels++;
        } else {
          // Land
          imageData.data[idx] = 0;
          imageData.data[idx + 1] = 150;
          imageData.data[idx + 2] = 0;
          landPixels++;
        }
    
        // Sets the alpha channel value
        imageData.data[idx + 3] = 255;
        totalPixels++;
      }
    }
    

    landPercentage = (landPixels / totalPixels) * 100;
    const nonWaterPixels = (totalPixels - (canvas.width * canvas.height * shallowWaterThreshold));
    const nonWaterPercentage = (landPixels / nonWaterPixels) * 100;
    console.log(`Attempt ${attempts}: ${nonWaterPercentage}% non-water`);    
    console.log(`${seed1} ${seed2} ${seed3}`); 

    // GIVE THE ATTEMPTS COUNTER SOME BLOODY SPACE SO I STOP TOUCHING IT AND CRASHING MY BROWSER
    attempts++; // increments the attempts at generating the map.
    // GIVE THE ATTEMPTS COUNTER SOME BLOODY SPACE SO I STOP TOUCHING IT AND CRASHING MY BROWSER

  } while ((landPercentage < minLandPercentage || landPercentage > maxLandPercentage) && attempts < maxAttempts);
  
  // Call the removeMountainsTouchingCoast function before putting the image data onto the canvas
  removeMountainsTouchingCoast(imageData, canvas.width, canvas.height);
  ctx.putImageData(imageData, 0, 0);


  return { seed1, seed2, seed3 };
}

function removeMountainsTouchingCoast(imageData, width, height) {
  const coastlineColor = {
    r: 240,
    g: 230,
    b: 50
  };
  const landColor = {
    r: 0,
    g: 150,
    b: 0
  };
  const mountainColor = {
    r: 180,
    g: 180,
    b: 180
  };

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const currentPixelColor = {
        r: imageData.data[idx],
        g: imageData.data[idx + 1],
        b: imageData.data[idx + 2]
      };

      if (isColorEqual(currentPixelColor, mountainColor) && isAdjacentToColor(imageData, x, y, width, height, coastlineColor)) {
        floodFill(imageData, x, y, width, height, mountainColor, landColor);
      }
    }
  }
}

function getPixelColor(imageData, x, y) {
  const idx = (y * imageData.width + x) * 4;
  return {
    r: imageData.data[idx],
    g: imageData.data[idx + 1],
    b: imageData.data[idx + 2],
  };
}


function floodFill(imageData, x, y, width, height, targetColor, replacementColor) {
  if (isColorEqual(targetColor, replacementColor)) {
    return;
  }

  const stack = [];
  stack.push({ x, y });

  while (stack.length > 0) {
    const { x, y } = stack.pop();
    const currentColor = getPixelColor(imageData, x, y);

    if (isColorEqual(currentColor, targetColor)) {
      setPixelColor(imageData, x, y, width, height, replacementColor);

      if (x > 0) stack.push({ x: x - 1, y });
      if (x < width - 1) stack.push({ x: x + 1, y });
      if (y > 0) stack.push({ x, y: y - 1 });
      if (y < height - 1) stack.push({ x, y: y + 1 });
    }
  }
}

function setPixelColor(imageData, x, y, width, height, color) {
  const idx = (y * width + x) * 4;
  imageData.data[idx] = color.r;
  imageData.data[idx + 1] = color.g;
  imageData.data[idx + 2] = color.b;
}




function isColorEqual(color1, color2) {
  return color1.r === color2.r && color1.g === color2.g && color1.b === color2.b;
}

function isAdjacentToColor(imageData, x, y, width, height, targetColor) {
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      if (dx === 0 && dy === 0) continue;

      const newX = x + dx;
      const newY = y + dy;

      if (newX >= 0 && newX < width && newY >= 0 && newY < height) {
        const idx = (newY * width + newX) * 4;
        const adjacentPixelColor = {
          r: imageData.data[idx],
          g: imageData.data[idx + 1],
          b: imageData.data[idx + 2]
        };

        if (isColorEqual(adjacentPixelColor, targetColor)) {
          return true;
        }
      }
    }
  }

  return false;
}

generateBtn.addEventListener('click', () => {
  const seeds = generateNoise();
  saveBtn.dataset.seed1 = seeds.seed1;
  saveBtn.dataset.seed2 = seeds.seed2;
  saveBtn.dataset.seed3 = seeds.seed3; 
});

saveBtn.addEventListener('click', () => {
  const seed1 = saveBtn.dataset.seed1;
  const seed2 = saveBtn.dataset.seed2;
  const seed3 = saveBtn.dataset.seed3; 
  const filename = `Map_${seed1}_${seed2}_${seed3}.png`; // filename string
  canvas.toBlob((blob) => {
    window.saveAs(blob, filename); 
  }, 'image/png');
});


const initialSeeds = generateNoise();
saveBtn.dataset.seed1 = initialSeeds.seed1;
saveBtn.dataset.seed2 = initialSeeds.seed2;



// new
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
  const shallowWaterThreshold = 0.05; // change the deep/shallow water ratio
  let imageData;
  let seed1; // Declares seed1 
  let seed2; // Declares seed2 
  let seed3; // Declares seed3 
  const numClusters = 4


  
  do {
    seed1 = Math.floor(Math.random() * 100000); // generates the first seed
    seed2 = Math.floor(Math.random() * 100000); // generates the second seed
    seed3 = Math.floor(Math.random() * 100000); // generates the third seed
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
    const forestData = generateLayerThree(canvas.width, canvas.height, seed3, layerData);
    
    for (let y = 0; y < canvas.height; y++) {
      for (let x = 0; x < canvas.width; x++) {
        const biomeValue = forestData[y * canvas.width + x]; // Move this line here
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
        const colorThreshold = 0.015;
        const coastlineThreshold = 0.06;
        const mountainThreshold = 0.4;
        
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
        } else if (blendedNoiseValue < coastlineThreshold) {
          imageData.data[idx] = 240;
          imageData.data[idx + 1] = 230;
          imageData.data[idx + 2] = 50;
          landPixels++;
        } else if (mountainData[y * canvas.width + x] > mountainThreshold) {
          // Mountain
          imageData.data[idx] = 180;
          imageData.data[idx + 1] = 180;
          imageData.data[idx + 2] = 180;
          landPixels++;
        } else if (biomeValue === 1) {
          // Forest
          imageData.data[idx] = 0;
          imageData.data[idx + 1] = 150;
          imageData.data[idx + 2] = 0;
          landPixels++;
        } else if (biomeValue === 2) {
          // Tundra
          imageData.data[idx] = 210;
          imageData.data[idx + 1] = 180;
          imageData.data[idx + 2] = 140;
          landPixels++;
        } else if (biomeValue === 3) {
          // Desert
          imageData.data[idx] = 255;
          imageData.data[idx + 1] = 255;
          imageData.data[idx + 2] = 102;
          landPixels++;
        } else {
          // Land
          imageData.data[idx] = 0;
          imageData.data[idx + 1] = 150;
          imageData.data[idx + 2] = 0;
          landPixels++;
        }
    
        // Sets the alpha channel value
        imageData.data[idx + 3] = 255;
        totalPixels++;
      }

    }
    
    landPercentage = (landPixels / totalPixels) * 100;
    const nonWaterPixels = (totalPixels - (canvas.width * canvas.height * shallowWaterThreshold));
    const nonWaterPercentage = (landPixels / nonWaterPixels) * 100;
    console.log(`Attempt ${attempts}: ${nonWaterPercentage}% non-water`);    
    console.log(`${seed1} ${seed2} ${seed3}`); 

    // GIVE THE ATTEMPTS COUNTER SOME BLOODY SPACE SO I STOP TOUCHING IT AND CRASHING MY BROWSER
    attempts++; // increments the attempts at generating the map.
    // GIVE THE ATTEMPTS COUNTER SOME BLOODY SPACE SO I STOP TOUCHING IT AND CRASHING MY BROWSER

  } while ((landPercentage < minLandPercentage || landPercentage > maxLandPercentage) && attempts < maxAttempts);
  
  // Call the removeMountainsTouchingCoast function before putting the image data onto the canvas
  removeMountainsTouchingCoast(imageData, canvas.width, canvas.height);
  ctx.putImageData(imageData, 0, 0);


  return { seed1, seed2, seed3 };
}

function removeMountainsTouchingCoast(imageData, width, height) {
  const coastlineColor = {
    r: 240,
    g: 230,
    b: 50
  };
  const landColor = {
    r: 0,
    g: 150,
    b: 0
  };
  const mountainColor = {
    r: 180,
    g: 180,
    b: 180
  };

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const currentPixelColor = {
        r: imageData.data[idx],
        g: imageData.data[idx + 1],
        b: imageData.data[idx + 2]
      };

      if (isColorEqual(currentPixelColor, mountainColor) && isAdjacentToColor(imageData, x, y, width, height, coastlineColor)) {
        floodFill(imageData, x, y, width, height, mountainColor, landColor);
      }
    }
  }
}

function getPixelColor(imageData, x, y) {
  const idx = (y * imageData.width + x) * 4;
  return {
    r: imageData.data[idx],
    g: imageData.data[idx + 1],
    b: imageData.data[idx + 2],
  };
}


function floodFill(imageData, x, y, width, height, targetColor, replacementColor) {
  if (isColorEqual(targetColor, replacementColor)) {
    return;
  }

  const stack = [];
  stack.push({ x, y });

  while (stack.length > 0) {
    const { x, y } = stack.pop();
    const currentColor = getPixelColor(imageData, x, y);

    if (isColorEqual(currentColor, targetColor)) {
      setPixelColor(imageData, x, y, width, height, replacementColor);

      if (x > 0) stack.push({ x: x - 1, y });
      if (x < width - 1) stack.push({ x: x + 1, y });
      if (y > 0) stack.push({ x, y: y - 1 });
      if (y < height - 1) stack.push({ x, y: y + 1 });
    }
  }
}

function setPixelColor(imageData, x, y, width, height, color) {
  const idx = (y * width + x) * 4;
  imageData.data[idx] = color.r;
  imageData.data[idx + 1] = color.g;
  imageData.data[idx + 2] = color.b;
}




function isColorEqual(color1, color2) {
  return color1.r === color2.r && color1.g === color2.g && color1.b === color2.b;
}

function isAdjacentToColor(imageData, x, y, width, height, targetColor) {
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      if (dx === 0 && dy === 0) continue;

      const newX = x + dx;
      const newY = y + dy;

      if (newX >= 0 && newX < width && newY >= 0 && newY < height) {
        const idx = (newY * width + newX) * 4;
        const adjacentPixelColor = {
          r: imageData.data[idx],
          g: imageData.data[idx + 1],
          b: imageData.data[idx + 2]
        };

        if (isColorEqual(adjacentPixelColor, targetColor)) {
          return true;
        }
      }
    }
  }

  return false;
}

generateBtn.addEventListener('click', () => {
  const seeds = generateNoise();
  saveBtn.dataset.seed1 = seeds.seed1;
  saveBtn.dataset.seed2 = seeds.seed2;
  saveBtn.dataset.seed3 = seeds.seed3; 
});

saveBtn.addEventListener('click', () => {
  const seed1 = saveBtn.dataset.seed1;
  const seed2 = saveBtn.dataset.seed2;
  const seed3 = saveBtn.dataset.seed3; 
  const filename = `Map_${seed1}_${seed2}_${seed3}.png`; // filename string
  canvas.toBlob((blob) => {
    window.saveAs(blob, filename); 
  }, 'image/png');
});


const initialSeeds = generateNoise();
saveBtn.dataset.seed1 = initialSeeds.seed1;
saveBtn.dataset.seed2 = initialSeeds.seed2;