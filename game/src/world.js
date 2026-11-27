// Farmyard Dash — the run itself: state, spawning, physics and collisions.
// The turkey holds a fixed screen x; the world (hazards, corn, scenery) scrolls left.
// The farmer is a distance behind the turkey measured in pixels: stumbling lets him
// close in, running clean lets the turkey pull away. He catches the turkey at catchGap.
import { FARMER, GOAL_DISTANCE, GROUND_Y, HAZARDS, RUN, SCORE, TURKEY, TURKEY_X, mulberry32 } from './config.js';

export const PHASE_TITLE = 'title';
export const PHASE_PLAY = 'play';
export const PHASE_CAUGHT = 'caught';
export const PHASE_ESCAPED = 'escaped';

export function createWorld(seed) {
  return {
    phase: PHASE_TITLE,
    random: mulberry32(seed),
    time: 0,
    runPhase: 0,
    distance: 0, // metres run
    distanceScore: 0, // fractional metres banked into the score
    bonus: 0, // corn, dodges and the escape bonus
    speed: RUN.startSpeed,
    score: 0,
    lives: RUN.startLives,
    turkey: { y: GROUND_Y, vy: 0, ducking: false, onGround: true, invulnerable: 0 },
    farmer: { x: FARMER.startX, gap: 110 },
    hazards: [], // { kind, x, y, width, height, passed }
    corns: [], // { x, y, taken }
    spawnIn: 420, // px until the next hazard spawns
    lastKind: '', // kind of the last hazard spawned (keeps knives from ambushing landings)
    shake: 0,
    flash: 0,
    message: '',
    messageTime: 0,
    best: 0,
  };
}

function spawnHazard(world) {
  const roll = world.random();
  const kinds = ['oven', 'fence', 'knife', 'oven', 'fence', 'knife', 'oven'];
  const kind = kinds[Math.floor(roll * kinds.length)];
  const spec = HAZARDS[kind];
  const x = 1320;
  if (kind === 'knife') {
    // A carving knife sweeps across at head height: duck under it (or jump clean over it).
    // It rides the world scroll (speed 0), so the gap it spawns with is the gap it keeps:
    // a knife never creeps up on the hazard ahead of it, and the turkey always gets a
    // fair beat between one danger and the next.
    world.hazards.push({ kind, x, y: GROUND_Y - 118, width: spec.width, height: spec.height, passed: false, speed: 0 });
  } else if (kind === 'fence') {
    world.hazards.push({ kind, x, y: GROUND_Y - spec.height, width: spec.width, height: spec.height, passed: false, speed: 0 });
  } else {
    world.hazards.push({ kind, x, y: GROUND_Y - spec.height, width: spec.width, height: spec.height, passed: false, speed: 0 });
  }
  // Sometimes a row of corn arcs over the hazard as a reward for jumping it.
  if (world.random() < RUN.cornChance) {
    for (let i = 0; i < 3; i += 1) {
      world.corns.push({ x: x + 30 + i * 44, y: GROUND_Y - 150 - Math.sin((i / 2) * Math.PI) * 60, taken: false });
    }
  }
  const gap = RUN.spawnGapMin + world.random() * (RUN.spawnGapMax - RUN.spawnGapMin);
  // Leave extra room after a knife: a ground hazard hard on a knife's heels forces
  // the turkey to duck and jump in the same breath, which is not a fair ask.
  const afterKnife = kind === 'knife' ? 320 : 0;
  world.lastKind = kind;
  world.spawnIn = (gap + afterKnife) * (RUN.startSpeed / world.speed);
}

function turkeyBox(world) {
  const height = world.turkey.ducking ? TURKEY.duckHeight : TURKEY.height;
  return {
    x: TURKEY_X - TURKEY.width / 2 + 14,
    y: world.turkey.y - height,
    width: TURKEY.width - 28,
    height: height - 10, // the turkey's dangling legs do not count as a hit
  };
}

function boxesOverlap(a, b) {
  return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
}

export function startRun(world, seed) {
  const fresh = createWorld(seed === undefined ? (Math.random() * 1e9) | 0 : seed);
  fresh.phase = PHASE_PLAY;
  fresh.best = world.best;
  return fresh;
}

export function updateWorld(world, input, dt, sounds) {
  world.time += dt;
  if (world.shake > 0) world.shake = Math.max(0, world.shake - dt * 3);
  if (world.flash > 0) world.flash = Math.max(0, world.flash - dt * 2.5);
  if (world.messageTime > 0) world.messageTime -= dt;
  if (world.phase !== PHASE_PLAY) return;

  const turkey = world.turkey;
  if (turkey.invulnerable > 0) turkey.invulnerable -= dt;

  // Speed and difficulty grow with distance: the farmyard turns into the kitchen yard.
  world.speed = Math.min(RUN.maxSpeed, RUN.startSpeed + world.distance * RUN.speedPerMetre);
  const level = 1 + Math.floor(world.distance / 250);

  // Jump and duck.
  if (input.jump && turkey.onGround) {
    turkey.vy = TURKEY.jumpVelocity;
    turkey.onGround = false;
    turkey.ducking = false;
    if (sounds) sounds.jump();
  }
  turkey.ducking = input.duck && turkey.onGround;
  if (!turkey.onGround) {
    turkey.vy += TURKEY.gravity * dt;
    turkey.y += turkey.vy * dt;
    if (turkey.y >= GROUND_Y) {
      turkey.y = GROUND_Y;
      turkey.vy = 0;
      turkey.onGround = true;
    }
  }

  // Distance and score tick up with the run (1 point per metre, banked fractionally).
  const metres = (world.speed * dt) / 34;
  world.distance += metres;
  world.distanceScore += metres;
  world.score = Math.floor(world.distanceScore) + world.bonus;
  world.runPhase += dt * (world.speed / 300);

  // The farmer: he falls behind while the turkey runs clean (gap drifts toward 110,
  // so he stays in sight at the left edge), but he never gives up (a slow 2 px/s gain),
  // and every stumble lets him close in fast.
  world.farmer.gap += 8 * dt;
  if (world.farmer.gap > 110) world.farmer.gap = 110;
  world.farmer.x = TURKEY_X - TURKEY.width / 2 - world.farmer.gap - FARMER.width;

  // Spawn hazards ahead.
  world.spawnIn -= world.speed * dt;
  if (world.spawnIn <= 0) spawnHazard(world);

  // Move hazards and corn left; knives also sweep across.
  for (const hazard of world.hazards) {
    hazard.x -= (world.speed + (hazard.speed || 0)) * dt;
    if (!hazard.passed && hazard.x + hazard.width < TURKEY_X - TURKEY.width / 2) {
      hazard.passed = true;
      world.bonus += 5;
    }
  }
  world.hazards = world.hazards.filter((hazard) => hazard.x + hazard.width > -160);
  for (const corn of world.corns) corn.x -= world.speed * dt;
  world.corns = world.corns.filter((corn) => !corn.taken && corn.x > -60);

  // Corn pickups.
  const box = turkeyBox(world);
  for (const corn of world.corns) {
    if (!corn.taken && boxesOverlap(box, { x: corn.x - 22, y: corn.y - 26, width: 44, height: 52 })) {
      corn.taken = true;
      world.bonus += SCORE.corn;
      if (sounds) sounds.corn();
    }
  }

  // Hazard collisions: a stumble costs a life and lets the farmer close in.
  if (turkey.invulnerable <= 0) {
    for (const hazard of world.hazards) {
      const hitBox = {
        x: hazard.x + (hazard.kind === 'knife' ? 8 : 10),
        y: hazard.y + (hazard.kind === 'oven' ? 14 : 4),
        width: hazard.width - (hazard.kind === 'knife' ? 16 : 20),
        height: hazard.height - (hazard.kind === 'oven' ? 14 : 4),
      };
      if (boxesOverlap(box, hitBox)) {
        world.lives -= 1;
        turkey.invulnerable = 1.4;
        world.farmer.gap = Math.max(0, world.farmer.gap - FARMER.gainOnHit);
        world.shake = 1;
        world.flash = 1;
        world.message = hazard.kind === 'knife' ? 'SLICED! The knife caught a feather!' : hazard.kind === 'oven' ? 'TOO HOT! The oven nearly got you!' : 'OUCH! Tripped on the fence!';
        world.messageTime = 1.6;
        if (sounds) sounds.hit();
        break;
      }
    }
  }

  // The farmer catches the turkey when his gap closes, or when the last life is gone.
  if (world.farmer.gap <= FARMER.catchGap || world.lives <= 0) {
    world.phase = PHASE_CAUGHT;
    world.best = Math.max(world.best, world.score);
    if (sounds) sounds.caught();
    return;
  }

  // The forest gate: 1000 metres and the turkey is free.
  if (world.distance >= GOAL_DISTANCE) {
    world.phase = PHASE_ESCAPED;
    world.bonus += SCORE.escapeBonus;
    world.score = Math.floor(world.distanceScore) + world.bonus;
    world.best = Math.max(world.best, world.score);
    if (sounds) sounds.escaped();
  }

  // Level-up toast.
  const newLevel = 1 + Math.floor(world.distance / 250);
  if (newLevel > level) {
    world.message = `LEVEL ${newLevel} — the farmer runs faster!`;
    world.messageTime = 1.8;
  }
}
