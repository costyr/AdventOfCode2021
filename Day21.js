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
  constructor(aPlayer1Start, aPlayer1Score, aPlayer1RoolCount, aPlayer2Start, aPlayer2Score, aPlayer2RoolCount, aDiceValue, aResumePos, aMultivers, aWinnerCount) {
    this.mDice = { value: aDiceValue, count: 0 };
    this.mPlayer1 = { position: aPlayer1Start, score: aPlayer1Score };
    this.mPlayer2 = { position: aPlayer2Start, score: aPlayer2Score };
    this.mMultivers = aMultivers;
    this.mWinnerCount = aWinnerCount;
    this.mPlayer1RoolCount = aPlayer1RoolCount;
    this.mPlayer2RoolCount = aPlayer2RoolCount;
    this.mResumePos = aResumePos;
  }

  EvaluateNewGame(aGame) {
    this.mMultivers.push(aGame);
  }

 RollDice() {
  
  this.mDice.count++;

   //if (this.mPactice)
   //  return this.mDice.value;

  this.mResumePos ++;
  if (this.mResumePos > 5) {
    this.mResumePos = 0;
    this.mPlayer1RoolCount = 0;
    this.mPlayer2RoolCount = 0;
  }

   let ver1 = new DiracDiceQuantumGame(this.mPlayer1.position, this.mPlayer1.score, this.mPlayer1RoolCount, this.mPlayer2.position, this.mPlayer2.score, this.mPlayer2RoolCount, 1, this.mResumePos, this.mMultivers, this.mWinnerCount);
   let ver2 = new DiracDiceQuantumGame(this.mPlayer1.position, this.mPlayer1.score, this.mPlayer1RoolCount, this.mPlayer2.position, this.mPlayer2.score, this.mPlayer2RoolCount, 2, this.mResumePos, this.mMultivers, this.mWinnerCount);
   let ver3 = new DiracDiceQuantumGame(this.mPlayer1.position, this.mPlayer1.score, this.mPlayer1RoolCount, this.mPlayer2.position, this.mPlayer2.score, this.mPlayer2RoolCount, 3, this.mResumePos, this.mMultivers, this.mWinnerCount);

   this.EvaluateNewGame(ver1);
   this.EvaluateNewGame(ver2);
   this.EvaluateNewGame(ver3);
 }

 PlayOneRound() {

   for (let i = this.mResumePos; i < 3; i++) {
     this.mPlayer1RoolCount += this.mDice.value;
     this.RollDice();
     return { ended : true, winner: -1};
   }
   //this.mPlayer1RoolCount += this.RollDice();
   //this.mPlayer1RoolCount += this.RollDice();
   
   if (this.mResumePos < 3) {
   this.mPlayer1.position = ComputeNewPosition(this.mPlayer1.position, this.mPlayer1RoolCount);

   this.mPlayer1.score += this.mPlayer1.position;

   console.log("Player 1 " + this.mPlayer1.position + " " + this.mPlayer1.score);
   if (this.mPlayer1.score >= 21) {
     return { ended : true, winner: 0 };
   }
  }

   for (let i = this.mResumePos; i < 6; i++) {
     this.mPlayer2RoolCount += this.mDice.value;
     this.RollDice();
     return { ended : true, winner: -1};
   }
   //this.mPlayer2RoolCount += this.RollDice();
   //this.mPlayer2RoolCount += this.RollDice();

   this.mPlayer2.position = ComputeNewPosition(this.mPlayer2.position, this.mPlayer2RoolCount);

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
let winnerCount = [0, 0];


let firstGame = new DiracDiceQuantumGame(4, 0, 0, 8, 0, 0, 0, 0, multivers, winnerCount);

multivers.push(firstGame);
while(multivers.length > 0) {
   let next = multivers[0];  
   console.log(multivers.length);
   let result = next.PlayOneRound();
   if (result.ended) {

     if (result.winner >= 0)
       winnerCount[result.winner] ++;

     //console.log(winnerCount);
     multivers.shift();
   }
}

console.log(winnerCount);

//let practiceGame = new DiracDiceQuantumGame(4, 0, 8, 0, 3, multivers, cache, winnerCount, true);

//practiceGame.Play();
//console.log("Dice roll count: " + practiceGame.mDice.count);
