const util = require('./Util.js');
const alg = require('./Matrix.js');
const dijkstra = require('./Dijkstra.js');

const neighboursTransform = [[0, 1], [0, -1], [1, 0], [-1, 0]];

function CreateGraph(aRawRiskMap) {

  let graph = new dijkstra.Graph();

  for (let i = 0; i < aRawRiskMap.length; i++)
    for (let j = 0; j < aRawRiskMap[i].length; j++) {
      for (let k = 0; k < neighboursTransform.length; k++) {
        let x = j + neighboursTransform[k][0];
        let y = i + neighboursTransform[k][1];
        let neighbourId = x + "_" + y;

        if (x >= 0 && x < aRawRiskMap[i].length && y >= 0 && y < aRawRiskMap.length) {
          let nodeId = j + "_" + i;
          graph.AddNeighbour(nodeId, { id: neighbourId, cost: aRawRiskMap[y][x] });
        }
      }
    }
  return graph;
}

function ExtendMapDown(aRawRiskMap) {

  let hh = aRawRiskMap.length;
  for (let i = 1; i < 5; i++) {
    let yStart = hh * i;
    for (let y = yStart, k = 0; y < yStart + hh; y++, k++) {
      aRawRiskMap[y] = [];
      for (let j = 0; j < aRawRiskMap[0].length; j++) {
        let gg = (aRawRiskMap[k][j] + i);
        if (gg > 9)
          gg = gg % 9;
        aRawRiskMap[y][j] = gg;
      }
    }
  }
}

function FindShortestPath(aGraph, aStart, aEnd) {
  let dijsk = new dijkstra.Dijkstra(graph);

  let startNodeId = aStart.x + "_" + aStart.y;

  let endNodeId = aEnd.x + "_" + aEnd.y;

  let ret = dijsk.FindShortestPath(startNodeId, endNodeId);
  return ret.dist;
}

let rawRiskMap = util.MapInput('./Day15Input.txt', (aElem) => {
  let firstLine = aElem.split('').map(a => { return parseInt(a); });

  let line = [];
  for (let i = 0; i < 5; i++)
    for (let j = 0; j < firstLine.length; j++) {
      let gg = (firstLine[j] + i);

      if (gg > 9)
        gg = gg % 9;

      line[firstLine.length * i + j] = gg;
    }

  return line;

}, '\r\n');

ExtendMapDown(rawRiskMap);

//alg.CreateMatrix(rawRiskMap).Print();

let graph = CreateGraph(rawRiskMap);

let dist = FindShortestPath(graph, { x: 0, y: 0 }, { x: rawRiskMap[0].length / 5 - 1, y: rawRiskMap.length / 5 - 1 });

console.log(dist);

console.log("Part 2 will take a while. Please wait...");

dist = FindShortestPath(graph, { x: 0, y: 0 }, { x: rawRiskMap[0].length - 1, y: rawRiskMap.length - 1 });

console.log(dist);

