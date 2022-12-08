const fs = require("fs");

// Read input into heightMap
const heightMap = fs
  .readFileSync("input.txt", "utf-8")
  .split("\n")
  .map((l) => l.split("").map((d) => parseInt(d, 10)));


const gridW = heightMap[0].length;
const gridH = heightMap.length;

const constant = (a) => a;
const increment = (a) => a + 1;
const decrement = (a) => a - 1;

/**
 * Build a grid that for every cell says the height of the tallest tree
 * above, below, to the left and to the right. Initalised at -1
 * @returns Array of Array - Array of Rows
 */
function buildTallestTreeLookup(gridW, gridH) {
  // Keep a grid that for every cell says the height of the tallest tree
  // above, below, to the left and to the right. Initalised at 0
  const tallestMap = new Array(gridH).fill(0).map((_) =>
    new Array(gridW).fill(0).map((_) => ({
      above: -1,
      below: -1,
      left: -1,
      right: -1,
      height: -1
    }))
  );

  // Fill this tallestMap scanning the heightmap top to bottom, bottom to top, left to right, right to left
  // Scan all columns:
  for (let x = 0; x < gridW; x++) {
    // fill the `above` property scanning top to bottom
    fillTallestMap(
      tallestMap,
      "above",
      { 
        initX: x,
        nextX: constant,
        initY: 0,
        nextY:(y) => y + 1
      }
    );
    // fill the `below` property scanning from the bottom
    fillTallestMap(
      tallestMap,
      "below",
      { 
        initX: x,
        nextX: constant,
        initY: gridH - 1,
        nextY: (y) => y - 1
      }
    );
  }

  // Scan all rows:
  for (let y = 0; y < gridH; y++) {
    // fill the `left` property scanning from the left
    fillTallestMap(
      tallestMap,
      "left",
      { 
        initX: 0,
        nextX: (x) => x + 1,
        initY: y,
        nextY: constant
      }
    );
    // fill the `right` property scanning from right
    fillTallestMap(
      tallestMap,
      "right",
      { 
        initX: gridW - 1,
        nextX: (x) => x - 1,
        initY: y,
        nextY: constant
      }
    );
  }
  return tallestMap;
}


function fillTallestMap(
  tallestMap,
  prop,
  { 
    initX,
    initY,
    nextX,
    nextY 
  }
) {
  for (
    let x = initX, y = initY, px = -1, py = -1;
    x >= 0 && y >= 0 && x < gridW && y < gridH;
    px = x, py = y, x = nextX(x), y = nextY(y)
  ) {
    tallestMap[y][x].height = heightMap[y][x];
    tallestMap[y][x][prop] =
      (px !== -1 && py !== -1)
        ? Math.max(tallestMap[py][px][prop], heightMap[py][px])
        : -1;
  }
}


function countVisibleFromOutside(tallestMap, gridW, gridH) {
  const visibleEdgeTrees = 2*gridW + 2*(gridH - 2); // number of trees at the edge - always visible
  let innerVisible = 0;
  let visible = false;

  for (let y = 1; y < gridH - 1 ; y++) {
    for (let x = 1; x < gridW - 1; x++) {
      const tallest = tallestMap[y][x];
      const treeHeight = tallestMap[y][x].height;
      visible =
        treeHeight > tallest.above ||
        treeHeight > tallest.below ||
        treeHeight > tallest.left ||
        treeHeight > tallest.right;
      innerVisible += visible ? 1 : 0;
    }
  }
  return innerVisible + visibleEdgeTrees;
}


function visibleTreesInLine(initX, initY, heightMap, nextX, nextY) { 
  const h = heightMap[initY][initX];
  let result = 0;

  for (let x = nextX(initX), y=nextY(initY) ; 
    x>=0 && x<gridW && y>=0 && y<gridH ; x = nextX(x), y=nextY(y)){
    result++;
    if (heightMap[y][x] >= h) {
      return result; // stop here
    } 
  }
  return result;
}


function visibleTreesDown(initX, initY, heightMap) { 
  return visibleTreesInLine(initX, initY, heightMap, constant, increment);
}


function visibleTreesUp(initX, initY, heightMap) { 
  return visibleTreesInLine(initX, initY, heightMap, constant, decrement);
}


function visibleTreesLeft(initX, initY, heightMap) { 
  return visibleTreesInLine(initX, initY, heightMap, decrement, constant);
}


function visibleTreesRight(initX, initY, heightMap) { 
  return visibleTreesInLine(initX, initY, heightMap, increment, constant);
}


function score(x, y, heightMap) {
  return visibleTreesDown(x, y, heightMap) * 
    visibleTreesUp(x, y, heightMap) * 
    visibleTreesLeft(x, y, heightMap) * 
    visibleTreesRight(x, y, heightMap);
}


function highestScore() {
  let maxScore = -1;

  for (let y = 1; y < gridH - 1 ; y++) {
    for (let x = 1; x < gridW - 1; x++) {
      maxScore = Math.max(maxScore, score(x, y, heightMap));
    }
  }
  return maxScore;
} 


// Part 1:
const tallestMap = buildTallestTreeLookup(gridW, gridH);
console.log(countVisibleFromOutside(tallestMap, gridW, gridH));

// Part 2:
console.log(highestScore());