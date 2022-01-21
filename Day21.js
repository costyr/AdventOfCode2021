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
    let player1RoolCount = RollDice(aDice) + RollDice(aDice) + RollDice(aDice);
    
    player1Pos = ComputeNewPosition(player1Pos, player1RoolCount);

    player1Score += player1Pos;

    //console.log("Player 1 " + player1Pos + " " + player1Score);

    if (player1Score >= 1000)
      break;

    let player2RoolCount = RollDice(aDice) + RollDice(aDice) + RollDice(aDice);

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
  constructor(aPlayer1Position, aPlayer1Score, aPlayer2Position, aPlayer2Score, aMultivers, aWinnerCount) {
    this.mPlayer1Position = aPlayer1Position;
    this.mPlayer1Score = aPlayer1Score;
    this.mPlayer2Position = aPlayer2Position;
    this.mPlayer2Score = aPlayer2Score;
    this.mMultivers = aMultivers;
    this.mId = aPlayer1Score + "_" + aPlayer2Score;
    this.mNewGames = [];
    this.mWinnerCount = aWinnerCount;
  }

 PlayOneRound() {
  
  //if (this.mCache[this.mId] == undefined) {

   //this.mPlayer1.position = ComputeNewPosition(this.mPlayer1.position, this.mPlayer1RoolCount);

   //this.mPlayer1.score += this.mPlayer1.position;

   //console.log("Player 1 " + this.mPlayer1.position + " " + this.mPlayer1.score);
   //if (this.mPlayer1.score >= 21) {
   //  return { ended : true, winner: 0 };
  // }

   let player1NewPositions = kPosMap[this.mPlayer1Position];

   for (let i = 0; i < player1NewPositions.length; i++) {

     let newScore = this.mPlayer1Score + player1NewPositions[i];
     
     if (newScore >= 21)
     {
       this.mWinnerCount[0] ++;
       continue;
     }

     let newGame = new DiracDiceQuantumGame(player1NewPositions[i], newScore, this.mPlayer2Position, this.mPlayer2Score, this.mMultivers, this.mWinnerCount);
     this.mMultivers.push(newGame);
   }

   //this.mPlayer2.position = ComputeNewPosition(this.mPlayer2.position, this.mPlayer2RoolCount);

   //this.mPlayer2Score += this.mPlayer2.position;

  //console.log("Player 2 " + this.mPlayer2.position + " " + this.mPlayer2.score);
   //if (this.mPlayer2.score >= 21) {
   //  return { ended : true, winner: 1 };
   //}
  //}
  //else
  //{

  //}

  let player2NewPositions = kPosMap[this.mPlayer2Position];

   for (let i = 0; i < player2NewPositions.length; i++) {

    let newScore = this.mPlayer2Score + player2NewPositions[i];
     
     if (newScore >= 21)
     {
       this.mWinnerCount[1] ++;
       continue;
     }

    let newGame = new DiracDiceQuantumGame(this.mPlayer1Position, this.mPlayer1Score, player2NewPositions[i], newScore, this.mMultivers, this.mWinnerCount);
    this.mMultivers.push(newGame);
  }

   //return  {ended: false, winner: -1 };
 }

  Play() {
    while(1)
    {
      let result = this.PlayOneRound();

      if (result.ended)
        return result;
    }
  }

  Play2() {

    let key = this.mPlayer1Position + "_" + this.mPlayer2Position + "_" + this.mPlayer1Score + "_" + this.mPlayer2Score;

    let pp = kRepMap[key];

    this.mWinnerCount[0] += pp.winnerCount[0];
    this.mWinnerCount[1] += pp.winnerCount[1];

    this.mMultivers.push(...pp.newGames);
}
}

function GeneratePositionMap() {
  let posMap = [];
  for (let i = 1; i <= 10; i++) {
    posMap[i] = [];
    for (let j = 0; j < kPrecomputed.length; j++)
      posMap[i].push(ComputeNewPosition(i, kPrecomputed[j]));
  }

  return posMap;
}

function GenerateRepMap(aMultivers, aWinnerCount) {
  let gg = [];
  let cc = 0;
  for (let x = 1; x <= 10; x++)
    for (let y = 1; y <= 10; y++)
      for (let k = 0; k < 21; k++)
        for (let l = 0; l < 21; l++)
         {
           let key = x + "_" + y + "_" + k + "_" + l;
           console.log(cc + " " + key);

           let player1NewPositions = kPosMap[x];
           let player2NewPositions = kPosMap[y];
       
           let winners = [0, 0];
           let newGames = [];
       for (let i = 0; i < player1NewPositions.length; i++)
         for (let j = 0; j < player2NewPositions.length; j++) {
       
           let newScore1 = k + player1NewPositions[i];
           
           if (newScore1 >= 14) {
            winners[0]++;
             continue;
           }
       
           let newScore2 = l + player2NewPositions[j];
       
           if (newScore2 >= 14) {
            winners[1]++;
             continue;
           }
       
           let newGame = new DiracDiceQuantumGame(player1NewPositions[i], newScore1, player2NewPositions[j], newScore2, aMultivers, aWinnerCount);
           newGames.push(newGame);
         }
         
         gg[key] = {winnerCount: winners, newGames: newGames };
         cc++;
        }
  return gg;      
}

console.log(PlayDiracDice(6, 9, deterministicDice));

const kPrecomputed = GenerateFirst();
const kPosMap = GeneratePositionMap();

let cache = [];
let multivers = [];
let winnerCount = [0, 0];

//const kRepMap = GenerateRepMap(multivers, winnerCount);

let gamesMap = new Map();
gamesMap.set("4_0_8_0", 1);

while (1) {

  let hasNewGames = false;
let newMap = new Map();
for (let game of gamesMap.keys()) {

let stats = game.split('_').map(a => {return parseInt(a);} );
let gameCount = gamesMap.get(game);

if (stats[1] >= 11 || stats[3] >= 11) {

  if (stats[1] >= 11)
    winnerCount[0] += gameCount;
  else
    winnerCount[1] += gameCount;

  continue;
}

let player1NewPositions = kPosMap[stats[0]];
let player2NewPositions = kPosMap[stats[2]];

hasNewGames = true;
for (let i = 0; i < player1NewPositions.length; i++)
  for (let j = 0; j < player2NewPositions.length; j++) {

    let newScore1 = stats[1] + player1NewPositions[i];
    let newScore2 = stats[3] + player2NewPositions[j];

    let newGameId = "";
    newGameId += player1NewPositions[i] + "_" + newScore1 + "_" + player1NewPositions[j] + "_" + newScore2;

    //console.log(newGameId);

    let count = 1;
    if (gamesMap.has(newGameId))
    {
      count = gamesMap.get(newGameId);
    }

    if (newMap.has(newGameId)) {
      let value = newMap.get(newGameId);
      newMap.set(newGameId, ++value);
    }
    else 
      newMap.set(newGameId, count + 1);

    //let newGame = new DiracDiceQuantumGame(player1NewPositions[i], player1NewPositions[i], player2NewPositions[j], player2NewPositions[j], multivers, winnerCount);
    //multivers.push(newGame);
  }
}

console.log(gamesMap.size);

if (!hasNewGames)
  break;

gamesMap = newMap;

}

console.log(winnerCount);

//let kk = 0;  
//while(multivers.length > 0) {
  // let next = multivers.pop();

   /*if (cache[next.mId] != undefined) {
    winnerCount[cache[next.mId].winner]++;
    multivers.push(...cache[next.mId].newGames);
    continue;
  }*/
   //console.log(multivers.length);
  // next.Play2();
  // if (kk % 10000000 == 0)
   //  console.log(multivers.length + " " + winnerCount);
   /*if (result.ended) {

     if (result.winner >= 0) {
       winnerCount[result.winner] ++;
       if (kk % 1000000000 == 0)
        
       //cache[next.mId] =  { winner: result.winner, newGames: next.mNewGames};

       //multivers.push(...next.mNewGames);
     }

     //multivers.pop();
     //break;
   }*/

  // kk++;
//}

//console.log(winnerCount);

//let practiceGame = new DiracDiceQuantumGame(4, 0, 8, 0, 3, multivers, cache, winnerCount, true);

//practiceGame.Play();
//console.log("Dice roll count: " + practiceGame.mDice.count);

//console.log(GenerateFirst());
