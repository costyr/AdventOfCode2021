const util = require('./Util.js');
const alg = require('./Matrix.js');

function FoldY(aPaper, aPos) {
  for (let i = 0; i < aPaper.mMatix.length; i++)
    for (let j = 0; j < aPaper.mMatix[i].length; j++) {
      if (i > aPos && aPaper.GetValue(i, j) == '#') {
        aPaper.SetValue(i, j, '.');
        aPaper.SetValue(aPos - (i - aPos), j, '#');
      }
    }

  aPaper.mMatix.splice(aPos);
}

function FoldX(aPaper, aPos) {
  for (let i = 0; i < aPaper.mMatix.length; i++) {
    for (let j = 0; j < aPaper.mMatix[i].length; j++) {
      if (j > aPos && aPaper.GetValue(i, j) == '#') {
        aPaper.SetValue(i, j, '.');
        aPaper.SetValue(i, aPos - (j - aPos), '#');
      }
    }
  }
  for (let i = 0; i < aPaper.mMatix.length; i++)
    aPaper.mMatix[i].splice(aPos);
}

function MarkPoints(aCoords, aSize) {
  let paper = new alg.Matrix(aSize.x + 1, aSize.y + 1, '.');

  aCoords.map((aCoord)=>{
    paper.SetValue(aCoord.y, aCoord.x, '#');}, this);

  return paper;
}

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
  console.log(k);
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

  return max - min;
}

let insts = util.MapInput('./Day14Input.txt', (aElem, aIndex) => {

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

let ret = CreatePolimer(insts[0], insts[1], 40);

console.log(ret);

/*let paper = MarkPoints(insts[0], max);

let firstFoldCount = Fold(paper, insts[1], insts[1].length);

console.log(firstFoldCount);

paper.Print('', (aElem) => { if (aElem == '.') return ' '; else return '*'; });*/
