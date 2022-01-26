let deterministicDice = { value: 0, count: 0 };

function RollDice(aDice) {
  aDice.value++;
  aDice.count++;

  if (aDice.value > 100)
    aDice.value = 1;

  return aDice.value;
}

function ComputeNewPosition(aPos, aCount) {

  let newPos = ((aPos + aCount - 1) % 10) + 1;

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

    if (player1Score >= 1000)
      break;

    let player2RoolCount = RollDice(aDice) + RollDice(aDice) + RollDice(aDice);

    player2Pos = ComputeNewPosition(player2Pos, player2RoolCount);

    player2Score += player2Pos;

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

function GeneratePositionMap() {
  let posMap = [];
  for (let i = 1; i <= 10; i++) {
    posMap[i] = [];
    for (let j = 0; j < kPrecomputed.length; j++)
      posMap[i].push(ComputeNewPosition(i, kPrecomputed[j]));
  }

  return posMap;
}

function PlayDiracDiceMulti(aPlayer1Start, aPlayer2Start) {
  let winnerCount = [0, 0];

  let gamesMap = new Map();
  gamesMap.set(aPlayer1Start + "_" + aPlayer2Start + "_0_0", 1);

  while (gamesMap.size > 0) {
    let newMap2 = new Map();
    for (let game of gamesMap.keys()) {

      let stats = game.split('_').map(a => { return parseInt(a); });
      let gameCount = gamesMap.get(game);

      let player1NewPositions = kPosMap[stats[0]];

      let newMap = new Map();
      for (let i = 0; i < player1NewPositions.length; i++) {

        let newScore1 = stats[2] + player1NewPositions[i];

        if (newScore1 >= 21) {
          winnerCount[0] += gameCount;
          continue;
        }

        let newGameId = "";
        newGameId += player1NewPositions[i] + "_" + stats[1] + "_" + newScore1 + "_" + stats[3];

        if (newMap.has(newGameId)) {
          let value = newMap.get(newGameId) + gameCount;
          newMap.set(newGameId, value);
        }
        else
          newMap.set(newGameId, gameCount);
      }

      for (let gameI of newMap.keys()) {

        let stats2 = gameI.split('_').map(a => { return parseInt(a); });
        let gameCount2 = newMap.get(gameI);

        let player2NewPositions = kPosMap[stats2[1]];

        for (let j = 0; j < player2NewPositions.length; j++) {

          let newScore2 = stats2[3] + player2NewPositions[j];

          if (newScore2 >= 21) {
            winnerCount[1] += gameCount2;
            continue;
          }

          let newGameId = "";
          newGameId += stats2[0] + "_" + player2NewPositions[j] + "_" + stats2[2] + "_" + newScore2;

          if (newMap2.has(newGameId)) {
            let value = newMap2.get(newGameId) + gameCount2;
            newMap2.set(newGameId, value);
          }
          else {
            newMap2.set(newGameId, gameCount2);
          }
        }
      }

    }

    gamesMap = newMap2;
  }

  return Math.max(...winnerCount);
}

console.log(PlayDiracDice(6, 9, deterministicDice));

const kPrecomputed = GenerateFirst();
const kPosMap = GeneratePositionMap();

console.log(PlayDiracDiceMulti(6, 9));
