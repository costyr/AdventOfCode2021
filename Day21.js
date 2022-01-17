const util = require('./Util.js');

let deterministicDice = { value: 0, count: 0 };

function RollDice(aDice) {
  aDice.value ++;
  aDice.count ++;

  if (aDice.value > 100)
    aDice.value = 1;

  return aDice.value;
}

function ComputeNewPosition(aPos, aCount) {
  
  /*for (let i = 0; i < aCount; i++) {
    aPos ++;

    if (aPos > 10)
      aPos = 1;
  }*/

  let newPos = (aPos + aCount) % 10;

  if (newPos == 0)
    newPos = 10;

  return newPos;
}

function PlayDiracDice(aPlayer1Start, aPlayer2Start, aDice) {
  let player1Pos = aPlayer1Start;
  let player2Pos = aPlayer2Start;

  let player1Score = 0;
  let player2Score = 0;

  while (1) {
    let player1RoolCount = RollDice(aDice) +  RollDice(aDice) + RollDice(aDice);
    
    player1Pos = ComputeNewPosition(player1Pos, player1RoolCount);

    player1Score += player1Pos;

    //console.log("Player 1 " + player1Pos + " " + player1Score);

    if (player1Score >= 1000)
      break;

    let player2RoolCount = RollDice(aDice) +  RollDice(aDice) + RollDice(aDice);

    player2Pos = ComputeNewPosition(player2Pos, player2RoolCount);

    player2Score += player2Pos;

    //console.log("Player 2 " + player2Pos + " " + player2Score);

    if (player2Score >= 1000)
      break;
  }

  if (player1Score < player2Score)
    return aDice.count * player1Score;
  else
    return aDice.count * player2Score;
}

function GenerateFirst() {

  let firstRools = []
  for (let i = 1; i < 4; i++)
    for (let j = 1; j < 4; j++)
      for (let k = 1; k < 4; k++)
        firstRools.push(i + j + k);
  return firstRools;
}

class DiracDiceQuantumGame {
  constructor(aPlayer1Start, aPlayer1Score, aPlayer1RoolCount, aPlayer2Start, aPlayer2Score, aPlayer2RoolCount, aMultivers, aCache) {
    this.mPlayer1 = { position: aPlayer1Start, score: aPlayer1Score };
    this.mPlayer2 = { position: aPlayer2Start, score: aPlayer2Score };
    this.mMultivers = aMultivers;
    this.mCache = aCache;
    this.mPlayer1RoolCount = aPlayer1RoolCount;
    this.mPlayer2RoolCount = aPlayer2RoolCount;
    this.mId = aPlayer1Start + "_" + aPlayer1Score + "_" + aPlayer2Start + "_" + aPlayer2Score + "_" + aPlayer1RoolCount + "_" + aPlayer2RoolCount;
  }

 PlayOneRound() {
  
  //if (this.mCache[this.mId] == undefined) {

   this.mPlayer1.position = ComputeNewPosition(this.mPlayer1.position, this.mPlayer1RoolCount);

   this.mPlayer1.score += this.mPlayer1.position;

   //console.log("Player 1 " + this.mPlayer1.position + " " + this.mPlayer1.score);
   if (this.mPlayer1.score >= 21) {
     return { ended : true, winner: 0 };
   }

   this.mPlayer2.position = ComputeNewPosition(this.mPlayer2.position, this.mPlayer2RoolCount);

   this.mPlayer2.score += this.mPlayer2.position;

  //console.log("Player 2 " + this.mPlayer2.position + " " + this.mPlayer2.score);
   if (this.mPlayer2.score >= 21) {
     return { ended : true, winner: 1 };
   }
  //}
  //else
  //{

  //}

   for (let i = 0; i < kPrecomputed.length; i++)
      for (let j = 0; j < kPrecomputed.length; j++) {
    let newGame = new DiracDiceQuantumGame(this.mPlayer1.position, this.mPlayer1.score, kPrecomputed[i], this.mPlayer2.position, this.mPlayer2.score, kPrecomputed[j], this.mMultivers);
    this.mMultivers.push(newGame);
  }

   return  {ended: false, winner: -1 };
 }

  Play() {
    while(1)
    {
      let result = this.PlayOneRound();

      if (result.ended)
        break;
    }
  }
}

console.log(PlayDiracDice(6, 9, deterministicDice));

const kPrecomputed = GenerateFirst();

let cache = [];
let multivers = [];
let winnerCount = [0, 0];

for (let i = 0; i < kPrecomputed.length; i++)
  for (let j = 0; j < kPrecomputed.length; j++) {
    let newGame = new DiracDiceQuantumGame(4, 0, kPrecomputed[i], 8, 0, kPrecomputed[j], multivers, cache);
    multivers.push(newGame);
  }

while(multivers.length > 0) {
   let next = multivers[0];  
   //console.log(multivers.length);
   let result = next.PlayOneRound();
   if (result.ended) {

     if (result.winner >= 0)
       winnerCount[result.winner] ++;

     console.log(next.mId + " " + multivers.length + " " + winnerCount);
     multivers.shift();
     //break;
   }
}

console.log(winnerCount);

//let practiceGame = new DiracDiceQuantumGame(4, 0, 8, 0, 3, multivers, cache, winnerCount, true);

//practiceGame.Play();
//console.log("Dice roll count: " + practiceGame.mDice.count);

//console.log(GenerateFirst());
