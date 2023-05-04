export function floodFill(terrainData, startX, startY, width, height, condition) {
    const visited = new Set();
  
    function dfs(x, y) {
      if (
        x < 0 || x >= width ||
        y < 0 || y >= height ||
        visited.has(y * width + x) ||
        !condition(terrainData[y * width + x])
      ) {
        return;
      }
  
      visited.add(y * width + x);
  
      dfs(x - 1, y);
      dfs(x + 1, y);
      dfs(x, y - 1);
      dfs(x, y + 1);
    }
  
    dfs(startX, startY);
  
    return visited;
  }
  