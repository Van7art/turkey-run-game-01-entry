// Farmyard Dash — shared constants for the whole game.
// One place for every number that tunes how the escape feels.
export const VIEW = { width: 1280, height: 720 };
export const GROUND_Y = 600;
export const GOAL_DISTANCE = 1000; // metres to the forest gate: escape!
export const TURKEY_X = 230; // the turkey holds this screen position and the world scrolls past

export const TURKEY = {
  width: 92,
  height: 96,
  duckHeight: 52,
  jumpVelocity: -820,
  gravity: 1600,
  runBob: 6,
};

export const FARMER = {
  width: 96,
  height: 132,
  startX: -120, // off the left edge, chasing in
  catchGap: 26, // closer than this to the turkey and the run is over
  gainOnHit: 35, // how far he closes in when the turkey stumbles (three quick stumbles and he grabs you)
};

export const RUN = {
  startSpeed: 300, // world scroll, px per second
  maxSpeed: 640,
  speedPerMetre: 0.22, // speed grows with distance
  spawnGapMin: 340,
  spawnGapMax: 620,
  cornChance: 0.55,
  startLives: 3,
};

export const HAZARDS = {
  oven: { width: 96, height: 92, kind: 'oven' },
  fence: { width: 34, height: 78, kind: 'fence' },
  knife: { width: 118, height: 26, kind: 'knife' }, // flies at head height: duck!
};

export const SCORE = { corn: 10, escapeBonus: 500 }; // plus 1 point per metre run

// A tiny deterministic random source so screenshot states render the same every time.
export function mulberry32(seed) {
  let a = seed >>> 0;
  return function nextRandom() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
