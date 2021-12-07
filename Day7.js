const util = require('./Util.js');

function SimulateFishGrouth(aFishTimer, aCiclesCount, aIsFirst) {
  let sum = aIsFirst ? 1 : 0;

  if (aCiclesCount <= aFishTimer)
    return 0;

  let pp = (aCiclesCount - aFishTimer) / 7;

  if ((aCiclesCount - aFishTimer) % 7 == 0)
    pp--;

  for (let i = 0; i <= pp; i++) {
    sum += SimulateFishGrouth(8, aCiclesCount - (i * 7 + aFishTimer + 1));

    sum += 1;
  }

  return sum;
}

function ComputeCost(aSteps) {
  let cost = 0;
  for (let i = 1; i <= aSteps; i++)
    cost += i;
  return cost;
}

function FindBestPos(aCrabPositions) {

  let min = Number.MAX_SAFE_INTEGER;
  for (let i = 0; i < 2000; i++) {

    let sum = 0
    for (let j = 0; j <= aCrabPositions.length; j++)
     /*if (i != j)*/ {
      let cc = ComputeCost(Math.abs(aCrabPositions[j] - i));
      //console.log(cc);
       sum += cc;
     }

    if (sum < min)
      min = sum;

    console.log(i + " " + sum);
    }
   
  return min;
}

let crabPositions = util.MapInput('./Day7Input.txt', (aElem) => {
  return parseInt(aElem);
}, ',');

console.log(FindBestPos(crabPositions));
