// Farmyard Dash — the deterministic screenshot states behind ?shot=start|play|end.
// Each scene plays the real rules forward from a fresh world for a fixed number of
// fixed steps, steered by a simple autopilot, so the frame is what a real game looks
// like and the same seed always gives the same frame.
import { GROUND_Y, TURKEY, TURKEY_X } from './config.js';
import { PHASE_CAUGHT, PHASE_PLAY, PHASE_TITLE, createWorld, startRun, updateWorld } from './world.js';

const STEP = 1 / 60;
const PLAY_SECONDS = 9;
const END_LIMIT_SECONDS = 60;

/** The nearest hazard ahead of the turkey, if any. */
function nearestHazard(world) {
  let best = null;
  for (const hazard of world.hazards) {
    if (hazard.x + hazard.width < TURKEY_X - 40) continue;
    if (best === null || hazard.x < best.x) best = hazard;
  }
  return best;
}

/** The nearest ground hazard (oven or fence) ahead of the turkey, if any. */
function nearestGroundHazard(world) {
  let best = null;
  for (const hazard of world.hazards) {
    if (hazard.kind === 'knife' || hazard.x + hazard.width < TURKEY_X - 40) continue;
    if (best === null || hazard.x < best.x) best = hazard;
  }
  return best;
}

/**
 * A simple autopilot: jump the ovens and fences, duck the knives, grab corn on the way.
 * `skill` is how far ahead it reacts — a sharp pilot (play scene) or a clumsy one
 * (end scene, which never jumps at all and gets caught, as a hurried player would).
 */
export function autopilot(world, skill) {
  const input = { jump: false, duck: false };
  if (skill <= 0) return input;
  const hazard = nearestHazard(world);
  if (hazard === null) return input;
  const gap = hazard.x - TURKEY_X;
  // Jump so the turkey is mid-air when the hazard passes under it: the jump lasts
  // ~1 s, so trigger when the hazard is about half a jump away.
  if (hazard.kind === 'knife') {
    // A fence or oven close behind the knife changes the answer: jumping the ground
    // hazard carries the turkey over the knife too, while ducking runs into the fence.
    // But a knife already on top of the turkey must be ducked first — jumping into it
    // is worse — and the ground hazard is jumped the moment the knife has passed.
    // (Under ~70 px the knife arrives before the jump climbs clear of its blade.)
    const ground = nearestGroundHazard(world);
    if (gap < 70) {
      input.duck = true;
    } else if (ground !== null && ground.x - TURKEY_X < world.speed * 0.4 + 20 && world.turkey.onGround) {
      input.jump = true;
    } else if (gap < world.speed * 0.5) {
      input.duck = true;
    }
  } else if (gap < world.speed * 0.4 + 20 && world.turkey.onGround) {
    input.jump = true;
  }
  return input;
}

function simulate(world, seconds, skill, sounds) {
  const steps = Math.floor(seconds / STEP);
  for (let step = 0; step < steps; step += 1) {
    if (world.phase !== PHASE_PLAY) break;
    updateWorld(world, autopilot(world, skill), STEP, sounds);
  }
  return world;
}

export function buildShotWorld(shot, seed) {
  const parsedSeed = Number.isFinite(seed) ? seed : 1;
  if (shot === 'play') {
    const world = startRun(createWorld(parsedSeed), parsedSeed);
    return simulate(world, PLAY_SECONDS, 1, null);
  }
  if (shot === 'end') {
    const world = startRun(createWorld(parsedSeed), parsedSeed);
    simulate(world, END_LIMIT_SECONDS, 0, null);
    // If the clumsy pilot somehow survived the whole minute, force the caught screen:
    // the farmer finally corners the turkey.
    if (world.phase === PHASE_PLAY) {
      world.lives = 0;
      world.phase = PHASE_CAUGHT;
    }
    return world;
  }
  // Title screen by default (also for ?shot=start).
  const world = createWorld(parsedSeed);
  world.phase = PHASE_TITLE;
  world.time = 0.6;
  world.best = 1250;
  // A few corn and a fence on the title backdrop so the farmyard reads at a glance.
  world.corns.push({ x: 980, y: GROUND_Y - 150, taken: false });
  world.corns.push({ x: 1030, y: GROUND_Y - 170, taken: false });
  return world;
}

export { PHASE_CAUGHT, PHASE_PLAY, PHASE_TITLE, TURKEY };
