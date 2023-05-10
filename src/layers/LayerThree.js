import PerlinNoise from '../PerlinNoise.js';

export function generateLayerThree(width, height, seed3, landNoiseData) {
    const noiseGenerator = new PerlinNoise(seed3);
    const scalingFactor = 0.01;
    const forestThreshold = 0.55;
    const tundraThreshold = 0.45; // New threshold for tundra
    const desertThreshold = 0.35; // New threshold for desert
  
    const layerData = new Float32Array(width * height);

    console.log("Forest threshold:", forestThreshold);
    console.log("Tundra threshold:", tundraThreshold);
    console.log("Desert threshold:", desertThreshold);

    let forestCount = 1000;
    let tundraCount = 1500;
    let desertCount = 2500;
    let defaultCount = 2120;
  
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const noiseValue = noiseGenerator.noise(x * scalingFactor, y * scalingFactor, 0);
        const landValue = landNoiseData[y * width + x];
  
        if (noiseValue > forestThreshold && landValue > 0.06) {
            layerData[y * width + x] = 1; // Forest
            forestCount++;
          } else if (noiseValue > tundraThreshold && landValue > 0.06) {
            layerData[y * width + x] = 2; // Tundra
            tundraCount++;
          } else if (noiseValue > desertThreshold && landValue > 0.06) {
            layerData[y * width + x] = 3; // Desert
            desertCount++;
          } else {
            layerData[y * width + x] = 0; // Default
            defaultCount++;
          }          
      }
    }
    console.log("Forest count:", forestCount);
    console.log("Tundra count:", tundraCount);
    console.log("Desert count:", desertCount);
    console.log("Default count:", defaultCount);

  
    return layerData;
  }
  