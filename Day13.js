const util = require('./Util.js');
const alg = require('./Matrix.js');

function FoldY(aPaper, aPos) {
  for (let i = 0; i < aPaper.mMatix.length; i++)
    for (let j = 0; j < aPaper.mMatix[i].length; j++) {
      if (i > aPos && aPaper.GetValue(i, j) == '#') {
        aPaper.SetValue(i, j, '.');
        aPaper.SetValue(aPaper.mMatix.length - i - 1, j, '#');
      }
    }

  aPaper.mMatix.splice(aPos);
}

function FoldX(aPaper, aPos) {
  for (let i = 0; i < aPaper.mMatix.length; i++) {
    for (let j = 0; j < aPaper.mMatix[i].length; j++) {
      if (j > aPos && aPaper.GetValue(i, j) == '#') {
        aPaper.SetValue(i, j, '.');
        aPaper.SetValue(i, aPaper.mMatix[0].length - j - 1, '#');
      }
    }
  }
  for (let i = 0; i < aPaper.mMatix.length; i++)
    aPaper.mMatix[i].splice(aPos);
}

function MarkPoints(aCoords, aFolds) {

  let maxX = 0;
  let maxY = 0;
  for (let i = 0; i < aFolds.length; i++) {
    if (aFolds[i].dir) {
      if (aFolds[i].pos > maxX)
        maxX = aFolds[i].pos;
    }
    else {
      if (aFolds[i].pos > maxY)
        maxY = aFolds[i].pos;
    }
  }

  let paper = new alg.Matrix(maxX * 2 + 1, maxY * 2 + 1, '.');

  for (let i = 0; i < aCoords.length; i++)
    paper.SetValue(aCoords[i].y, aCoords[i].x, '#');

  return paper;
}

function Fold(aPaper, aFolds, aFoldsCount) {
  let firstFoldCount = 0
  for (let i = 0; i < aFoldsCount; i++) {
    if (aFolds[i].dir)
      FoldX(aPaper, aFolds[i].pos);
    else
      FoldY(aPaper, aFolds[i].pos);

    if (i == 0)
      firstFoldCount = aPaper.CountElement('#');
  }

  return firstFoldCount;
}

let insts = util.MapInput('./Day13Input.txt', (aElem, aIndex) => {

  if (aIndex == 0)
    return aElem.split('\r\n').map(a => { let rr = a.split(','); return { x: parseInt(rr[0]), y: parseInt(rr[1]) }; });
  else
    return aElem.split('\r\n').map(a => { let rr = a.split('='); return { dir: (rr[0] == 'fold along x'), pos: parseInt(rr[1]) }; });

}, '\r\n\r\n');

let paper = MarkPoints(insts[0], insts[1]);

let firstFoldCount = Fold(paper, insts[1], insts[1].length);

console.log(firstFoldCount);

paper.Print('', (aElem) => { if (aElem == '.') return ' '; else return '*'; });
