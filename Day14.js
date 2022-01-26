const util = require('./Util.js');

function CountPolimer(aTemplate) {
  let oo = [];
  for (let i = 0; i < aTemplate.length; i++)
    if (oo[aTemplate[i]] === undefined)
      oo[aTemplate[i]] = 1;
    else
      oo[aTemplate[i]] += 1;

  let min = Number.MAX_SAFE_INTEGER;
  let max = 0;

  for (let key in oo) {
    if (oo[key] > max)
      max = oo[key];

    if (oo[key] < min)
      min = oo[key];
  }

  return max - min;
}

function CreatePolimer(aTemplate, aInsts, aStepCount) {

  let template = util.CopyObject(aTemplate);

  let usedRules = [];

  for (let k = 0; k < aStepCount; k++) {

    let partOO = [];
    let line = '';
    for (let i = 0; i < template.length - 1; i++) {
      let pp = template[i] + template[i + 1];

      if (usedRules[pp] === undefined)
        usedRules[pp] = 1;
      else
        usedRules[pp] += 1;

      let nn = aInsts.get(pp);

      if (partOO[nn] === undefined)
        partOO[nn] = 1;
      else
        partOO[nn] += 1;

      if (nn !== undefined) {
        template.splice(i + 1, 0, nn);
        line += nn;
        i++;
      }
    }
  }
  return CountPolimer(template);
}

function CountPolimerBig(aInsts, aRules, aSteps) {

  let map = new Map();

  for (let i = 0; i < aInsts.length - 1; i++) {
    let rr = aInsts[i] + aInsts[i + 1];
    map.set(rr, (map.get(rr) ?? 0) + 1);
  }

  for (let i = 0; i < aSteps; i++) {
    let newMap = new Map();
    for (let [key, value] of map) {
      let ff = aRules.get(key);
      let aa = [];
      aa[0] = key[0] + ff;
      aa[1] = ff + key[1];

      for (let j = 0; j < aa.length; j++)
        newMap.set(aa[j], (newMap.get(aa[j]) ?? 0) + value);
    }
    map = newMap;
  }

  let letterCount = [];
  for (let [key, value] of map) {
    for (let i = 0; i < key.length; i++) {
      if (letterCount[key[i]] === undefined)
        letterCount[key[i]] = value;
      else
        letterCount[key[i]] += value;
    }
  }

  return Math.round((Math.max(...Object.values(letterCount)) / 2) - Math.min(...Object.values(letterCount)) / 2);
}

let insts = util.MapInput('./Day14Input.txt', (aElem, aIndex) => {

  if (aIndex == 0) {
    return aElem.split('');
  }
  else {
    let rules = new Map();
    aElem.split('\r\n').map(a => { let rr = a.split(' -> '); rules.set(rr[0], rr[1]); }, this);

    return rules;
  }

}, '\r\n\r\n');

console.log(CreatePolimer(insts[0], insts[1], 10));

let total = CountPolimerBig(insts[0], insts[1], 40);

console.log(total);
