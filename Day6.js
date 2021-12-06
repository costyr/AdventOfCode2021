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

function SimulateGrouth(aFishTimers, aCiclesCount) {

  let total = 0;
  let cache = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

  for (let i = 0; i < aFishTimers.length; i++) {

    let count = 0;
    if (cache[aFishTimers[i]] > 0)
      count = cache[aFishTimers[i]];
    else {
      count = SimulateFishGrouth(aFishTimers[i], aCiclesCount, true);
      cache[aFishTimers[i]] = count;
    }

    //console.log(count);
    total += count;
  }
  return total;
}

let fishTimers = util.MapInput('./Day6Input.txt', (aElem) => {
  return parseInt(aElem);
}, ',');

console.log(SimulateGrouth(fishTimers, 80));

console.log("Part 2 will take some time...");
console.log(SimulateGrouth(fishTimers, 256));
