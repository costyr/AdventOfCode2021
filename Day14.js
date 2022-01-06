const { count } = require('console');
const util = require('./Util.js');

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

function CountOO(aTemplate) {
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

  /*for (let key in oo)
  {
    oo[key] = Math.round(oo[key] * 100 / aTemplate.length);
  }*/

  console.log(oo);

  return max - min;
}

function PrintStats(aLine) {

  let gg = [];
  for (let i = 0; i < aLine.length; i++)
    if (gg[aLine[i]] == undefined)
      gg[aLine[i]] = 1;
    else
      gg[aLine[i]] += 1;

  let ff = [];
  for (let key in gg)
  {
    ff.push(Math.round(gg[key] * 100 / aLine.length)); 
  }

  return ff.sort((a, b) => { return a - b;});
}

function CreatePolimer(aTemplate, aInsts, aStepCount) {
  
  let usedRules = [];

  for (let k = 0; k < aStepCount; k++) {

  let partOO = [];
  let line = '';  
  for (let i = 0; i < aTemplate.length - 1; i++)
  {
    let pp = aTemplate[i] + aTemplate[i + 1];

    if (usedRules[pp] === undefined)
      usedRules[pp] = 1;
    else 
      usedRules[pp] += 1;
  
    let nn = aInsts[pp];

    if (partOO[nn] === undefined)
      partOO[nn] = 1;
    else
    partOO[nn] += 1;

    if (nn !== undefined)
    {
      aTemplate.splice(i + 1, 0, nn);
      line += nn;
      i++;
    }

    //let ff = CountOO(partOO);
  }

  //console.log(partOO);
  //let ss = CountOO(aTemplate);

  console.log(aTemplate.join(''));
  //console.log(PrintStats(line) /*+ " " + ss + " " + tt + " " + aTemplate.join('') line*/);
}

  //console.log(usedRules);

  return CountOO(aTemplate);
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

for (let key in insts[1]) {
  console.log(key + "=>" + insts[1][key])
let ret = CreatePolimer([key[0], [key[1]]], insts[1], 7);

console.log(ret);
}

/*ret = CreatePolimer(['N', 'N'], insts[1], 10);

console.log(ret);

ret = CreatePolimer(['N', 'C'], insts[1], 10);

console.log(ret);

ret = CreatePolimer(['C', 'B'], insts[1], 10);

console.log(ret);*/

/*let paper = MarkPoints(insts[0], max);

let firstFoldCount = Fold(paper, insts[1], insts[1].length);

console.log(firstFoldCount);

paper.Print('', (aElem) => { if (aElem == '.') return ' '; else return '*'; });*/
