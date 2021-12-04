const util = require('./Util.js');


function MarkNumber(aBoard, aNumber) {
  for (let i = 0; i < aBoard.length; i++)
    for (let j = 0; j < aBoard[i].length; j++)
      if (aBoard[i][j].v == aNumber)
        aBoard[i][j].d = true;
}

function FindBingo(aBoard, aNumber) {
  for (let i = 0; i < aBoard.length; i++) {
    let countLine = 0;
    let countCol = 0;
    for (let j = 0; j < aBoard[i].length; j++) {
      if (aBoard[i][j].d)
        countLine++;
      if (aBoard[j][i].d)
        countCol++;
    }
    if (countLine == aBoard[i].length)
      return true;
    
    if (countCol == aBoard[i].length)
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
  let firstScore = 0;
  let lastScore = 0;
  for (let k = 0; k < aNumbers.length; k++)
    scores.push(0);

  for (let i = 0; i < aNumbers[0].length;i++)
    for (let j = 1; j < aNumbers.length; j++) {
      MarkNumber(aNumbers[j], aNumbers[0][i]);

      if (FindBingo(aNumbers[j], aNumbers[0][i]))
        if (scores[j] == 0) {
          scores[j] = ComputeScore(aNumbers[j], aNumbers[0][i]);
          if (firstScore == 0)
            firstScore = scores[j];
          else 
            lastScore = scores[j];
        }
    }
  return {first: firstScore, last: lastScore };
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

let score = Analize(numbers);

console.log(score.first);
console.log(score.last);
  