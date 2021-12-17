
function TestHitTarget(aStartX, aEndX, aStartY, aEndY, aVel) {

  let pt = { x: 0, y: 0 };
  let vel = aVel;
  let max = 0;
  while (1) {
    if (pt.x >= aStartX && pt.x <= aEndX && pt.y >= aStartY && pt.y <= aEndY)
      return { ret: true, max: max };

    if (pt.y < aStartY)
      return { ret: false, max: 0 };

    pt.x += vel.x;
    pt.y += vel.y;

    if (vel.x > 0)
      vel.x -= 1;
    else if (vel.x < 0)
      vel.x += 1;

    vel.y -= 1;

    if (pt.y > max)
      max = pt.y;
  }
}

function FindVelocity(aTargetStartX, aTargetEndX, aTargetStartY, aTargetEndY, aEndX, aEndY) {

  let maxMax = 0;
  let count = 0;
  for (let i = aTargetStartY; i <= aEndY; i++)
    for (let j = 1; j <= aEndX; j++) {
      let result = TestHitTarget(aTargetStartX, aTargetEndX, aTargetStartY, aTargetEndY, { x: j, y: i });

      if (result.ret && result.max > maxMax)
        maxMax = result.max;

      if (result.ret)
        count++;
    }

  return { max: maxMax, count: count };
}

// 137, 171, -98, -73
// 20, 30, -10, -5

let result = FindVelocity(137, 171, -98, -73, 300, 300);

console.log(result.max);
console.log(result.count);
