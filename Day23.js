const util = require('./Util.js');
const alg = require('./Dijkstra.js');
const alg2 = require('./Lee.js');
const alg3 = require('./Matrix.js');

const kAmphipods = ['A', 'B', 'C', 'D'];

function IsValidDirection(aValue) {
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

function IsEndPosition(aMap, aPos, aSimbol) {
  let x = (aSimbol == 'A') ? 3 : (aSimbol == 'B') ? 5 : (aSimbol == 'C') ? 7 : 9;

  if ((aPos.x == x) && (aPos.y > 1) && (aPos.y < aMap.length - 1))
    return true;

  return false;
}

function IsOnAnyEndPosition(aMap, aPos) {
  for (let i = 0; i < kAmphipods.length; i++)
    if (IsEndPosition(aMap, aPos, kAmphipods[i]))
      return true;
  return false;
}

function IsNoPosition(aMap, aPos, aSimbol) {

  if (((aPos.x == 3) && (aPos.y == 1)) ||
    ((aPos.x == 5) && (aPos.y == 1)) ||
    ((aPos.x == 7) && (aPos.y == 1)) ||
    ((aPos.x == 9) && (aPos.y == 1)))
    return true;

  if (IsOnAnyEndPosition(aMap, aPos, aSimbol) && !IsEndPosition(aMap, aPos, aSimbol))
    return true;

  if (IsEndPosition(aMap, aPos, aSimbol) && !IsValidBottom(aMap, aPos, aSimbol)) {
    return true;
  }

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
  let endPositions = [];
  for (let i = 0; i < map.length; i++)
    for (let j = 0; j < map.length; j++) {
      for (let k = 0; k < kAmphipods.length; k++)
        if (IsEndPosition(map, { x: j, y: i }, kAmphipods[k])) {
          map[i][j] = kAmphipods[k];
          endPositions.push({ x: j, y: i });
        }
    }

  return { endNode: JSON.stringify(map), endPositions: endPositions };
}

function IsValidBottom(aMap, aPos, aSimbol) {
  for (let i = aPos.y + 1; i < aMap.length; i++) {
    let bottom = map[i][aPos.x];

    if (bottom != '#' && bottom != aSimbol)
      return false;
  }

  return true;
}

class SpecialGraph {

  constructor(aStartNode, aEndNode) {
    this.mStartNode = aStartNode;
    this.mEndNode = aEndNode;
  }

  ComputeCost(aNodeId) {

    if (aNodeId == this.mEndNode)
      console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");

    let map = JSON.parse(aNodeId);

    console.log("\n");
    alg3.CreateMatrix(JSON.parse(aNodeId)).Print();
    console.log("---------------------------------------");

    let leeAlg = new alg2.Lee(map, IsValidDirection);

    let amphipodsPositons = GetAmphipodsPositions(map);

    let neighbours = [];
    for (let i = 0; i < amphipodsPositons.length; i++) {

      let pos = amphipodsPositons[i];
      let simbol = map[pos.y][pos.x];
      let amphipodIndex = kAmphipods.indexOf(simbol);

      leeAlg.ComputeLee(pos);

      if (IsOnAnyEndPosition(map, pos, simbol)) {
        for (let k = 0; k < map.length; k++)
          for (let j = 0; j < map[k].length; j++) {
            let costPos = { x: j, y: k };
            let cost = leeAlg.GetCost(costPos);

            if (cost < 0)
              continue;

            if (IsEndPosition(map, pos, simbol) && IsValidBottom(map, pos, simbol)) {
              continue;
            }

            if (!IsNoPosition(map, costPos, simbol)) {

              let newNode = CreateNode(map, simbol, amphipodIndex, pos, costPos, cost);
              console.log();
              alg3.CreateMatrix(JSON.parse(newNode.id)).Print();
              neighbours.push(newNode);


            }
          }
      }
      else {
        for (let j = 0; j < kEndPositions.length; j++) {
          let costPos = kEndPositions[j];

          let cost = leeAlg.GetCost(costPos);

          if (cost > 0) {

            if (!IsValidBottom(map, costPos, simbol))
              continue;

            let newNode = CreateNode(map, simbol, amphipodIndex, pos, costPos, cost);

            //if (newNode.id == this.mEndNode) {
            console.log();
            alg3.CreateMatrix(JSON.parse(newNode.id)).Print();
            //}

            neighbours.push(newNode);
          }
        }
      }
    }

    return neighbours;
  }

  GetNeighbours(aNodeId) {
    return this.ComputeCost(aNodeId);
  }
}

let map = util.MapInput('./Day23TestInput.txt', (aElem, aIndex) => {

  let line = aElem.split('');

  if (aIndex > 2) {
    line.push(' ');
    line.push(' ');
  }

  return line;
}, '\r\n', this);

//console.log(map);

let startNode = JSON.stringify(map);
let result = GenerateEndNode(map);
let endNode = result.endNode;
let kEndPositions = result.endPositions;

//alg3.CreateMatrix(JSON.parse(endNode)).Print();

let ss = new SpecialGraph(startNode, endNode);
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
