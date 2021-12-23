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
  
  for (let i = 0; i < aCount; i++) {
    aPos ++;

    if (aPos > 10)
      aPos = 1;
  }

  return aPos;
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

class DiracDiceQuantumGame {
  constructor(aPlayer1Start, aPlayer1Score, aPlayer2Start, aPlayer2Score, aDiceValue, aMultivers, aCache, aWinnerCount, aPractice) {
    this.mDice = { value: aDiceValue, count: 0 };
    this.mPlayer1 = { position: aPlayer1Start, score: aPlayer1Score };
    this.mPlayer2 = { position: aPlayer2Start, score: aPlayer2Score };
    this.mMultivers = aMultivers;
    this.mCache = aCache;
    this.mWinnerCount = aWinnerCount;
    this.mId = '';
    this.mId += aPlayer1Start + "_" + aPlayer1Score + "_" + aPlayer2Start + "_" + aPlayer2Score + "_" + aDiceValue;
    this.mPractice = aPractice;
  }

  EvaluateNewGame(aGame) {
    if (this.mCache[aGame.mId] !== undefined)
      this.mWinnerCount[this.mCache[aGame.mId]]++;
    else
      this.mMultivers.push(aGame);
  }

 RollDice() {
  
  this.mDice.count++;

   if (this.mPactice)
     return this.mDice.value;

   let ver1 = new DiracDiceQuantumGame(this.mPlayer1.position, this.mPlayer1.score, this.mPlayer2.position, this.mPlayer2.score, 1, this.mMultivers, this.mCache, this.mWinnerCount);
   let ver2 = new DiracDiceQuantumGame(this.mPlayer1.position, this.mPlayer1.score, this.mPlayer2.position, this.mPlayer2.score, 2, this.mMultivers, this.mCache, this.mWinnerCount);
   let ver3 = new DiracDiceQuantumGame(this.mPlayer1.position, this.mPlayer1.score, this.mPlayer2.position, this.mPlayer2.score, 3, this.mMultivers, this.mCache, this.mWinnerCount);

   if (this.mDice.value == 0)
   {
     this.EvaluateNewGame(ver2);
     this.EvaluateNewGame(ver3);
     this.mDice.value = 1;
     return 1;
   }
   else {
     this.EvaluateNewGame(ver1);
     this.EvaluateNewGame(ver2);
     this.EvaluateNewGame(ver3);
     return this.mDice.value;
   }
 }

 PlayOneRound() {
   let player1RoolCount = this.RollDice();
   player1RoolCount += this.RollDice();
   player1RoolCount += this.RollDice();
   
   this.mPlayer1.position = ComputeNewPosition(this.mPlayer1.position, player1RoolCount);

   this.mPlayer1.score += this.mPlayer1.position;

   console.log("Player 1 " + this.mPlayer1.position + " " + this.mPlayer1.score);
   if (this.mPlayer1.score >= 21) {
     return { ended : true, winner: 0 };
   }

   let player2RoolCount = this.RollDice();
   player2RoolCount += this.RollDice();
   player2RoolCount += this.RollDice();

   this.mPlayer2.position = ComputeNewPosition(this.mPlayer2.position, player2RoolCount);

   this.mPlayer2.score += this.mPlayer2.position;

    console.log("Player 2 " + this.mPlayer2.position + " " + this.mPlayer2.score);
   if (this.mPlayer2.score >= 21) {
     return { ended : true, winner: 1 };
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


let multivers = [];
let cache = [];
let winnerCount = [0, 0];

/*
let firstGame = new DiracDiceQuantumGame(4, 0, 8, 0, 0, multivers, cache, winnerCount);

multivers.push(firstGame);
while(multivers.length > 0) {
   let next = multivers[0];  
   let result = next.Play();
   if (result.ended) {
     winnerCount[result.winner] ++;

     //console.log(winnerCount);
     console.log(cache);
     multivers.shift();

     cache[next.mId] = result.winner;


   }
}

console.log(winnerCount);
*/

let practiceGame = new DiracDiceQuantumGame(4, 0, 8, 0, 3, multivers, cache, winnerCount, true);

practiceGame.Play();
console.log("Dice roll count: " + practiceGame.mDice.count);
