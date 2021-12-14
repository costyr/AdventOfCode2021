const util = require('./Util.js');

function CreatePolimer(aTemplate, aInsts, aStepCount) {

  for (let k = 0; k < aStepCount; k++) {
  for (let i = 0; i < aTemplate.length - 1; i++)
  {
    let pp = aTemplate[i] + aTemplate[i + 1];
    let nn = aInsts[pp];

    if (nn !== undefined)
    {
      aTemplate.splice(i + 1, 0, nn);
      i++;
    }
  }
  console.log(aTemplate.join(''));
}

  let oo = [];
  for (let i = 0; i < aTemplate.length; i++)
    if (oo[aTemplate[i]] === undefined)
      oo[aTemplate[i]] = 0;
    else
      oo[aTemplate[i]] += 1;

  let min = Number.MAX_SAFE_INTEGER;
  let max = 0;

  for (let key in oo)
  {
    if (oo[key] > max)
      max = oo[key];
    
    if (oo[key] < min)
      min = oo[key];
  }

  return oo['B']  - ((oo['H'] === undefined) ? 0 : oo['H']);
}

function InvertRules(aInsts) {

  let gg = []
  for (let key in aInsts)
  {
    if (gg[aInsts[key]] === undefined)
      gg[aInsts[key]] = [];
    gg[aInsts[key]].push(key); 
  } 
  
  return gg;
}

function CreatePolimer2(aTemplate, aInsts, aInvInsts, aStepCount) {

  for (let k = 0; k < aStepCount; k++) {
  for (let i = 0; i < aTemplate.length - 1; i++)
  {
    let pp = aTemplate[i] + aTemplate[i + 1];
    let nn = aInsts[pp];

    if (nn !== undefined)
    {
      aTemplate.splice(i + 1, 0, nn);
      i++;
    }
  }

  let last = aTemplate[aTemplate.length - 2] + aTemplate[aTemplate.length - 1];

  if (aInvInsts['B'].indexOf(last) == -1 && aInvInsts['H'].indexOf(last) == -1)
    aTemplate.splice(aTemplate.length - 1, 1);

  console.log(k + " " + aTemplate.join(''));
}

  let oo = [];
  for (let i = 0; i < aTemplate.length; i++)
    if (oo[aTemplate[i]] === undefined)
      oo[aTemplate[i]] = 0;
    else
      oo[aTemplate[i]] += 1;

  let min = Number.MAX_SAFE_INTEGER;
  let max = 0;

  for (let key in oo)
  {
    if (oo[key] > max)
      max = oo[key];
    
    if (oo[key] < min)
      min = oo[key];
  }

  console.log(oo['B']  + " " + oo['H']);
}

let insts = util.MapInput('./Day14TestInput.txt', (aElem, aIndex) => {

  if (aIndex == 0) {
    return aElem.split('');
  }
  else {
    let rules = [];
    aElem.split('\r\n').map(a => { let rr = a.split(' -> '); rules[rr[0]] = rr[1]; }, this);

    return rules;
  }

}, '\r\n\r\n');

console.log(insts);

console.log(insts[0].join(''));

let invInsts = InvertRules(insts[1]);

console.log(invInsts);

//let ret = CreatePolimer(['C', 'B'], insts[1], 10);

//console.log(ret);

ret = CreatePolimer(['N', 'N'], insts[1], 10);

console.log(ret);

ret = CreatePolimer(['N', 'C'], insts[1], 10);

console.log(ret);

ret = CreatePolimer(['C', 'B'], insts[1], 10);

console.log(ret);

/*let paper = MarkPoints(insts[0], max);

let firstFoldCount = Fold(paper, insts[1], insts[1].length);

console.log(firstFoldCount);

paper.Print('', (aElem) => { if (aElem == '.') return ' '; else return '*'; });*/
