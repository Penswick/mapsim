import PerlinNoise from './PerlinNoise.js';

const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
const generateBtn = document.querySelector('.genBtn');

function generateNoise() {
    const seed = Math.floor(Math.random() * 100000); // generates a random seed
    const noiseGenerator = new PerlinNoise(seed);
    const imageData = ctx.createImageData(canvas.width, canvas.height);
  
    for (let y = 0; y < canvas.height; y++) {
      for (let x = 0; x < canvas.width; x++) {
        const noiseValue = noiseGenerator.noise(x * 0.01, y * 0.01, 0);
        const colorValue = mapRange(noiseValue, -1, 1, 0, 255);
        const idx = (y * canvas.width + x) * 4;
        imageData.data[idx] = colorValue;
        imageData.data[idx + 1] = colorValue;
        imageData.data[idx + 2] = colorValue;
        imageData.data[idx + 3] = 255;
      }
    }
  
    ctx.putImageData(imageData, 0, 0);
  }
  

function mapRange(value, oldMin, oldMax, newMin, newMax) {
  return ((value - oldMin) / (oldMax - oldMin)) * (newMax - newMin) + newMin;
}

generateBtn.addEventListener('click', generateNoise);

generateNoise(); // Generates first time for testing purposes.
