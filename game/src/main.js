// Farmyard Dash — the game loop: states, timing, and the screenshot hook.
// ?shot=start|play|end&seed=1 renders one deterministic scene with no input needed,
// so the screenshots are reproducible renders of this game's own code.
import { VIEW } from './config.js';
import { createSoundBank } from './audio.js';
import { createInput } from './input.js';
import { renderGame } from './render.js';
import { buildShotWorld } from './shots.js';
import { PHASE_CAUGHT, PHASE_ESCAPED, PHASE_PLAY, PHASE_TITLE, createWorld, startRun, updateWorld } from './world.js';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
canvas.width = VIEW.width;
canvas.height = VIEW.height;

const sounds = createSoundBank();
const params = new URLSearchParams(window.location.search);
const shot = params.get('shot');
const seed = Number(params.get('seed') || '1');

let world;
if (shot) {
  world = buildShotWorld(shot, seed);
} else {
  world = createWorld((Math.random() * 1e9) | 0);
}

const input = createInput(canvas, (action) => {
  sounds.unlock();
  if (action === 'mute') {
    const muted = sounds.toggleMute();
    world.message = muted ? 'Sound off (M to turn back on)' : 'Sound on';
    world.messageTime = 1.2;
    return;
  }
  if (world.phase === PHASE_TITLE && (action === 'start' || action === 'jump')) {
    world = startRun(world, undefined);
    sounds.click();
  } else if ((world.phase === PHASE_CAUGHT || world.phase === PHASE_ESCAPED) && (action === 'restart' || action === 'start' || action === 'jump')) {
    world = startRun(world, undefined);
    sounds.click();
  }
});

function resizeCanvas() {
  const scale = Math.min(window.innerWidth / VIEW.width, window.innerHeight / VIEW.height);
  canvas.style.width = `${Math.floor(VIEW.width * scale)}px`;
  canvas.style.height = `${Math.floor(VIEW.height * scale)}px`;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

let lastTime = performance.now();
function frame(now) {
  const dt = Math.min(0.05, (now - lastTime) / 1000);
  lastTime = now;
  const pressed = input.consume();
  if (!shot && world.phase === PHASE_PLAY) {
    updateWorld(world, { jump: pressed.jump, duck: input.held.duck }, dt, sounds);
  } else if (!shot) {
    updateWorld(world, { jump: false, duck: false }, dt, sounds);
  }
  renderGame(ctx, world);
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
