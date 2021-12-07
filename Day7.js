const util = require('./Util.js');

function ComputeCost(aSteps) {
  let cost = 0;
  for (let i = 1; i <= aSteps; i++)
    cost += i;
  return cost;
}

function FindBestPos(aCrabPositions, aMaxPos, aSimpleCost) {

  let min = Number.MAX_SAFE_INTEGER;
  for (let i = 0; i <= aMaxPos; i++) {

    let sum = 0
    for (let j = 0; j < aCrabPositions.length; j++) {
      let cc = aSimpleCost ? Math.abs(aCrabPositions[j] - i) : ComputeCost(Math.abs(aCrabPositions[j] - i));
      sum += cc;
    }

    if (sum < min)
      min = sum;
  }

  return min;
}

let crabPositions = util.MapInput('./Day7Input.txt', (aElem) => {
  return parseInt(aElem);
}, ',');

let maxPos = 0;
for (let i = 0; i < crabPositions.length; i++)
  if (crabPositions[i] > maxPos)
    maxPos = crabPositions[i];

console.log(FindBestPos(crabPositions, maxPos, true));
console.log(FindBestPos(crabPositions, maxPos, false));
