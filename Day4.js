const util = require('./Util.js');


function MarkNumber(aBoard, aNumber) {
  for (let i = 0; i < aBoard.length; i++)
    for (let j = 0; j < aBoard[i].length; j++)
      if (aBoard[i][j].v == aNumber)
        aBoard[i][j].d = true;
}

function FindBingo(aBoard, aNumber) {
  for (let i = 0; i < aBoard.length; i++) {
    let count = 0;
    for (let j = 0; j < aBoard[i].length; j++)
      if (aBoard[i][j].d)
        count++;
    if (count == aBoard[i].length)
      return true;    
  }
  
  for (let i = 0; i < aBoard.length; i++) {
    let count = 0;
    for (let j = 0; j < aBoard[i].length; j++)
      if (aBoard[j][i].d)
        count++;
    if (count == aBoard[i].length)
      return true;    
  }

  return false;
}

function ComputeScore(aBoard, aNumber) {

  let score = 0;
  for (let i = 0; i < aBoard.length; i++)
    for (let j = 0; j < aBoard[i].length; j++)
      if (!aBoard[i][j].d)
        score += aBoard[i][j].v;

  return score * aNumber;
}

function Analize(aNumbers) {
  
  let scores = [];

  for (let k = 0; k < aNumbers.length; k++)
    scores.push( { s: 0, c: 0});

  for (let i = 0; i < aNumbers[0].length;i++)
    for (let j = 1; j < aNumbers.length; j++) {
      MarkNumber(aNumbers[j], aNumbers[0][i]);

      if (FindBingo(aNumbers[j], aNumbers[0][i]))
        if (scores[j].s == 0) {
          scores[j].s = ComputeScore(aNumbers[j], aNumbers[0][i]);
          scores[j].c = i;
        }
    }
  return scores;
}

let numbers = util.MapInput('./Day4Input.txt', (aElem, aIndex) => {

  if (aIndex == 0)
    return aElem.split(',').map((aNumber)=>{return parseInt(aNumber);});
  else   
    return aElem.split('\r\n').map((aLine)=>{ 
      let rawLine = aLine.split(' ').map((aa)=>{ 
        return parseInt(aa.trim());
      });
      
      let newLine = [];
      for (let i = 0; i < rawLine.length; i++)
        if (rawLine[i] >= 0)
          newLine.push({v: rawLine[i], d: false});
      return newLine;
    });
}, '\r\n\r\n');

let rr = Analize(numbers);

let max = 0;
let min = Number.MAX_SAFE_INTEGER;
let lastScore = 0;
let firstScore = 0;
for (let i = 1; i < rr.length;i++) {
  if (rr[i].c > max) {
    lastScore = rr[i].s;
    max = rr[i].c;
  }

  if (rr[i].c < min) {
    firstScore = rr[i].s;
    min = rr[i].c;
  }
}

console.log(firstScore);
console.log(lastScore);
  