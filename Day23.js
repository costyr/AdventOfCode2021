const util = require('./Util.js');
const alg = require('./Dijkstra.js');
const alg2 = require('./Lee.js');
const alg3 = require('./Matrix.js');

const kAmphipods = ['A', 'B', 'C', 'D'];
const kAmphipodsFinalPositions = [[{ x: 3, y: 2 }, 
                                   { x: 3, y: 3 }, 
                                   { x: 3, y: 4 }, 
                                   { x: 3, y: 5 }],
                                  [{ x: 5, y: 2 }, 
                                   { x: 5, y: 3 }, 
                                   { x: 5, y: 4 }, 
                                   { x: 5, y: 5 }],
                                  [{ x: 7, y: 2 }, 
                                   { x: 7, y: 3 }, 
                                   { x: 7, y: 4 }, 
                                   { x: 7, y: 5 }],
                                  [{ x: 9, y: 2 }, 
                                   { x: 9, y: 3 }, 
                                   { x: 9, y: 4 }, 
                                   { x: 9, y: 5 }]];

function InValidDirection(aValue) {
  return true;
}

function GetAmphipodsPositions(aMap) {
  let gg = [];
  for (let i = 0; i < aMap.length; i++)
    for (let j = 0; j < aMap[i].length; j++) {
      let simbol = aMap[i][j];
      let index = kAmphipods.indexOf(simbol);

      if (index != -1)
        gg.push({ x: j, y: i });
    }

  return gg;
}

function IsEndPosition(aPos, aEndPositions) {
  return aEndPositions.findIndex(a => { return (a.x == aPos.x) && (a.y == aPos.y) }) != -1;
}

function IsOnAnyEndPosition(aPos) {
  for (let i = 0; i < kAmphipodsFinalPositions.length; i++)
    if (IsEndPosition(aPos, kAmphipodsFinalPositions[i]))
      return true;
  return false;
}

function IsNoPosition(aPos, aMap) {
  if (IsOnAnyEndPosition(aPos))
    return true;

  if (((aPos.y + 1) < aMap.length) &&
    ((aPos.x - 1) >= 0) &&
    ((aPos.x + 1) < aMap[0].length) &&
    (aMap[aPos.y + 1][aPos.x - 1] == '#') &&
    (aMap[aPos.y + 1][aPos.x + 1] == '#'))
    return true;

  return false;
}

function CreateNode(aMap, aSimbol, aAmphipodIndex, aPos, aCostPos, aCost) {
  let newMap = util.CopyObject(aMap);
  newMap[aCostPos.y][aCostPos.x] = aSimbol;
  newMap[aPos.y][aPos.x] = '.';

  return { id: JSON.stringify(newMap), cost: aCost * Math.pow(10, aAmphipodIndex) };
}

function GenerateEndNode(aMap) {

  let map = util.CopyObject(aMap);
  for (let i = 0; i < kAmphipodsFinalPositions.length; i++) {
    let simbol = kAmphipods[i];

    for (let j = 0; j < kAmphipodsFinalPositions[i].length; j++) {
      let pos = kAmphipodsFinalPositions[i][j];

      map[pos.y][pos.x] = simbol;
    }
  }

  return JSON.stringify(map);
}

class SpecialGraph {

  constructor(aStartNode) {
    this.mStartNode = aStartNode;
    this.mCache = [];
  }

  ComputeCost(aNodeId) {

    if (this.mCache[aNodeId] !== undefined) {
      console.log("cache hit!");
      return this.mCache[aNodeId];
    }

    let map = JSON.parse(aNodeId);

    let leeAlg = new alg2.Lee(map, InValidDirection);

    let amphipodsPositons = GetAmphipodsPositions(map);

    let neighbours = [];
    for (let i = 0; i < amphipodsPositons.length; i++) {

      let pos = amphipodsPositons[i];
      let simbol = map[pos.y][pos.x];
      let amphipodIndex = kAmphipods.indexOf(simbol);
      let endPositions = kAmphipodsFinalPositions[amphipodIndex];

      leeAlg.ComputeLee(pos);

      if (IsOnAnyEndPosition(pos)) {
        for (let k = 0; k < map.length; k++)
          for (let j = 0; j < map[k].length; j++) {
            let costPos = { x: j, y: k };
            let cost = leeAlg.GetCost(costPos);

            if(aNodeId != startNode && IsEndPosition(pos, endPositions))
              continue;

            if (!IsNoPosition(costPos, map) && (cost > 0)) {
              neighbours.push(CreateNode(map, simbol, amphipodIndex, pos, costPos, cost));
            }
          }
      }
      else {
        for (let j = 0; j < endPositions.length; j++) {
          let costPos = endPositions[j];
          let cost = leeAlg.GetCost(costPos);

          if (cost > 0)
            neighbours.push(CreateNode(map, simbol, amphipodIndex, pos, costPos, cost));
        }
      }
    }

    this.mCache[aNodeId] = neighbours;

    return neighbours;
  }

  GetNeighbours(aNodeId) {
    return this.ComputeCost(aNodeId);
  }
}

let map = util.MapInput('./Day23Input.txt', (aElem, aIndex) => {

  let line = aElem.split('');

  if (aIndex > 2) {
    line.push(' ');
    line.push(' ');
  }

  return line;
}, '\r\n', this);

console.log(map);

let startNode = JSON.stringify(map);
let endNode = GenerateEndNode(map);

let ss = new SpecialGraph(startNode);
/*let oo = ss.GetNeighbours(JSON.stringify(map));

for (let i = 0; i < oo.length; i++) {
  alg3.CreateMatrix(JSON.parse(oo[i].id)).Print();
  console.log(oo[i].cost);
}*/

let dd = new alg.Dijkstra(ss);

result = dd.FindShortestPath(startNode, endNode);
console.log(result.dist);

for (let i = 0; i < result.path.length; i++)
  alg3.CreateMatrix(JSON.parse(result.path[i])).Print();
