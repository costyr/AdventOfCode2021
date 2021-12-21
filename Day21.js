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

    console.log("Player 1 " + player1Pos + " " + player1Score);

    if (player1Score >= 1000)
      break;

    let player2RoolCount = RollDice(aDice) +  RollDice(aDice) + RollDice(aDice);

    player2Pos = ComputeNewPosition(player2Pos, player2RoolCount);

    player2Score += player2Pos;

    console.log("Player 2 " + player2Pos + " " + player2Score);

    if (player2Score >= 1000)
      break;
  }

  if (player1Score < player2Score)
    return aDice.count * player1Score;
  else
    return aDice.count * player2Score;
}

class DiracDiceQuantumGame {
  constructor(aPlayer1Start, aPlayer1Score, aPlayer2Start, aPlayer2Score, aDiceValue, aMultivers) {
    this.mDice = { value: aDiceValue };
    this.mPlayer1 = { position: aPlayer1Start, score: aPlayer1Score };
    this.mPlayer2 = { position: aPlayer2Start, score: aPlayer2Score };
    this.mMultivers = aMultivers;
  }

 RollDice() {
  
   let ver1 = new DiracDiceQuantumGame(this.mPlayer1.position, this.mPlayer1.score, this.mPlayer2.position, this.mPlayer2.score, 1, this.mMultivers);
   let ver2 = new DiracDiceQuantumGame(this.mPlayer1.position, this.mPlayer1.score, this.mPlayer2.position, this.mPlayer2.score, 2, this.mMultivers);
   let ver3 = new DiracDiceQuantumGame(this.mPlayer1.position, this.mPlayer1.score, this.mPlayer2.position, this.mPlayer2.score, 3, this.mMultivers);

   if (this.mDice.value == 0)
   {
     this.mMultivers.push(ver2);
     this.mMultivers.push(ver3);

     this.mDice.value = 1;
     return 1;
   }
   else {
      this.mMultivers.push(ver1);
      this.mMultivers.push(ver2);
      this.mMultivers.push(ver3);
     return this.mDice.value;
   }
 }

 Play() {
   let player1RoolCount = this.RollDice() +  this.RollDice() + this.RollDice();
   
   this.mPlayer1.position = ComputeNewPosition(this.mPlayer1.position, player1RoolCount);

   this.mPlayer1.score += this.mPlayer1.position;

   if (this.mPlayer1.score >= 21) {
    console.log("Player 1 " + this.mPlayer1.position + " " + this.mPlayer1.score + " " + this.mDice.value);
     return { ended : true, winner: 0 };
   }

   let player2RoolCount = this.RollDice() +  this.RollDice() + this.RollDice();

   this.mPlayer2.position = ComputeNewPosition(this.mPlayer2.position, player2RoolCount);

   this.mPlayer2.score += this.mPlayer2.position;

   if (this.mPlayer2.score >= 21) {
    console.log("Player 2 " + this.mPlayer2.position + " " + this.mPlayer2.score + " " + this.mDice.value);
     return { ended : true, winner: 1 };
   }

   return  {ended: false, winner: -1 };
 }
}

console.log(PlayDiracDice(6, 9, deterministicDice));

let multivers = [];
let firstGame = new DiracDiceQuantumGame(4, 0, 8, 0, 0, multivers);

multivers.push(firstGame);

let winnerCount = [0, 0];
while(multivers.length > 0) {
   let next = multivers[0];  
   let result = next.Play();
   if (result.ended) {
     winnerCount[result.winner] ++;

     console.log(winnerCount);
     multivers.shift();
   }
}

console.log(winnerCount);
