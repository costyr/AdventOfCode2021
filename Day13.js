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

function Fold(aPaper, aFolds, aFoldsCount) {
  let firstFoldCount = 0;
  aFolds.splice(0, Math.min(aFolds.length, aFoldsCount)).map((aFold, aIndex) => {
    if (aFold.dir)
      FoldX(aPaper, aFold.pos);
    else
      FoldY(aPaper, aFold.pos);

    if (aIndex == 0)
      firstFoldCount = aPaper.CountElement('#');
  }, this);

  return firstFoldCount;
}

let max = { x: 0, y: 0 };

let insts = util.MapInput('./Day13Input.txt', ((aMax, aElem, aIndex) => {

  if (aIndex == 0) {
    let coord = aElem.split('\r\n').map(((aMax, a) => {
      let rr = a.split(',');
      let x = parseInt(rr[0]);
      let y = parseInt(rr[1]);

      if (x > aMax.x)
        aMax.x = x;

      if (y > aMax.y)
        aMax.y = y;

      return { x: x, y: y };
    }).bind(null, aMax));

    return coord;
  }
  else
    return aElem.split('\r\n').map(a => { let rr = a.split('='); return { dir: (rr[0] == 'fold along x'), pos: parseInt(rr[1]) }; });

}).bind(null, max), '\r\n\r\n');

let paper = MarkPoints(insts[0], max);

let firstFoldCount = Fold(paper, insts[1], insts[1].length);

console.log(firstFoldCount);

paper.Print('', (aElem) => { if (aElem == '.') return ' '; else return '*'; });
