const util = require('./Util.js');

function Analize(aDepths) {
  let increaseCount = 0;
  for (let i = 1; i < aDepths.length; i++)
    if (aDepths[i] > aDepths[i - 1])
      increaseCount++;

  return increaseCount;
}

function Analize2(aDepths) {

  let increaseCount = 0;
  let prevSum = 0;
  for (let i = 0; i < aDepths.length - 2; i++) {
    let sum = aDepths[i] + aDepths[i + 1] + aDepths[i + 2];

    if (prevSum > 0 && sum > prevSum)
      increaseCount++;
    prevSum = sum;
  }

  return increaseCount;
}

let depths = util.MapInput('./Day1Input.txt', (aElem) => { return parseInt(aElem, 10); }, '\r\n');

console.log(Analize(depths));
console.log(Analize2(depths));
