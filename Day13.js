const util = require('./Util.js');
const alg = require('./Matrix.js');

function PrintPath(aPath) {
  let line = '';
  for (let i = 0; i < aPath.length; i++) {
    if (line.length > 0)
      line += ",";
    line += aPath[i]

  }
  return line;
}

const isUpperCase = (string) => /^[A-Z]*$/.test(string);

function CreateGraph(aNodeList) {
  let graph = new alg.Graph();

  for (let i = 0; i < aNodeList.length; i++) {
    graph.AddNeighbour(aNodeList[i][0], aNodeList[i][1]);
    graph.AddNeighbour(aNodeList[i][1], aNodeList[i][0]);
  }

  return graph;
}

function IsValidPath(aPath, aNode) {

  if (!isUpperCase(aNode) && aPath.indexOf(aNode) != -1)
    return false;

  return true;
}

function IsValidPath2(aPath) {

  let rr = [];
  for (let i = 0; i < aPath.length; i++)
    if (!isUpperCase(aPath[i]))
      if (rr[aPath[i]] === undefined)
        rr[aPath[i]] = 1;
      else
        rr[aPath[i]] += 1;

  let tt = 0;
  for (let key in rr) {
    if (rr[key] > 2)
      return false;
    else if (rr[key] == 2)
      tt++;
  }

  if (tt > 1)
    return false;

  return true;
}

function FoldY(aPaper, aPos) {
  for (let i = 0; i < aPaper.mMatix.length; i++)
    for (let j = 0; j < aPaper.mMatix[i].length; j++)
    {
      if (i > aPos && aPaper.GetValue(i, j) == '#')
      {
        aPaper.SetValue(i, j, '.');
        aPaper.SetValue(aPaper.mMatix.length - i - 1, j, '#');   
      }  
    }
}

function FoldX(aPaper, aPos) {
  for (let i = 0; i < aPaper.mMatix.length; i++)
    for (let j = 0; j < aPaper.mMatix[i].length; j++)
    {
      if (j > aPos && aPaper.GetValue(i, j) == '#')
      {
        aPaper.SetValue(i, j, '.');
        aPaper.SetValue(i, aPaper.mMatix[0].length - j - 1, '#');   
      }  
    }
}

function MarkPoints(aCoords) {

  let maxX = 0;
  let maxY = 0;
  for (let i = 0; i < aCoords.length; i++) {
    if (aCoords[i].x > maxX)
      maxX = aCoords[i].x;

    if (aCoords[i].y > maxY)
      maxY = aCoords[i].y;
  }

  let paper = new alg.Matrix(maxX + 1, maxY + 1, '.');

  for (let i = 0; i < aCoords.length; i++)
    paper.SetValue(aCoords[i].y, aCoords[i].x, '#');

  return paper;
}

/*function Fold(aPaper, aFolds) {
  for (let i = 0; i < aFolds.length; i++)
}*/

let insts = util.MapInput('./Day13Input.txt', (aElem, aIndex) => {

  if (aIndex == 0) {
     return aElem.split('\r\n').map(a=>{ let rr = a.split(','); return {x: parseInt(rr[0]), y: parseInt(rr[1]) }; });
  }
  else
  {
    return aElem.split('\r\n').map(a=>{ let rr = a.split('='); return { dir: (rr[0] == 'fold along x'), coord: parseInt(rr[1]) };});
  }

}, '\r\n\r\n');

console.log(insts[0]);
console.log(insts[1]);

let paper = MarkPoints(insts[0]);

paper.Print('');

//FoldY(paper, 7);

//console.log('\n');

//paper.Print('');

FoldX(paper, 655);

console.log('\n');

paper.Print('');

console.log(paper.CountElement('#'));

//let gr = CreateGraph(nodeList);

//console.log(BFS(gr, true));
//console.log(BFS(gr, false));
