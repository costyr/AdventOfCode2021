const util = require('./Util.js');
const alg = require('./Dijkstra.js');

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

function HasPath(aPaths, aPath) {
  for (let i = 0; i < aPaths.length; i++) {


    if (aPath.length != aPaths[i].length)
      continue;

    let found = true;
    for (let j = 0; j < aPaths.length; j++)
      if (aPath[j] != aPaths[i][j]) {
        found = false;
        break;
      }

    if (found)
      return true;
  }
  return false;
}

function BFS(aGraph, aPart1) {
  let queue = [{ n: 'start', p: ['start'] }];
  let total = 0;
  while (queue.length > 0) {
    let cc = queue.shift();

    let neighbours = aGraph.GetNeighbours(cc.n);
    let path = cc.p;

    if (path[path.length - 1] == 'end') {
      total++;
      continue;
    }

    if (neighbours === undefined)
      continue;

    for (let i = 0; i < neighbours.length; i++) {
      let vv = neighbours[i];

      if (vv == 'start')
        continue;

      let newPath = util.CopyObject(path);
      newPath.push(vv);

      if (aPart1 ? !IsValidPath(path, vv) : !IsValidPath2(newPath))
        continue;

      queue.push({ n: vv, p: newPath });
    }
  }

  return total;
}

let nodeList = util.MapInput('./Day12Input.txt', (aElem) => {
  return aElem.split('-');
}, '\r\n');

let gr = CreateGraph(nodeList);

console.log(BFS(gr, true));
console.log(BFS(gr, false));
