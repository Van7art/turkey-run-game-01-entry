// Farmyard Dash — everything drawn on the canvas: the dusk farmyard, the hazards,
// the HUD, and the title and end screens. All art is vector shapes in an autumn palette.
import { FARMER, GOAL_DISTANCE, GROUND_Y, TURKEY, TURKEY_X, VIEW } from './config.js';
import { PHASE_CAUGHT, PHASE_ESCAPED, PHASE_PLAY, PHASE_TITLE } from './world.js';
import { drawCorn, drawFarmer, drawTurkey } from './turkey.js';

const SKY_TOP = '#2c1e4e';
const SKY_MID = '#b3543f';
const SKY_LOW = '#e8a33d';

function roundRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + width, y, x + width, y + height, radius);
  ctx.arcTo(x + width, y + height, x, y + height, radius);
  ctx.arcTo(x, y + height, x, y, radius);
  ctx.arcTo(x, y, x + width, y, radius);
  ctx.closePath();
}

function drawSky(ctx, time) {
  const sky = ctx.createLinearGradient(0, 0, 0, GROUND_Y);
  sky.addColorStop(0, SKY_TOP);
  sky.addColorStop(0.55, SKY_MID);
  sky.addColorStop(1, SKY_LOW);
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, VIEW.width, GROUND_Y + 2);
  // Low autumn sun.
  const sun = ctx.createRadialGradient(1020, 190, 10, 1020, 190, 150);
  sun.addColorStop(0, 'rgba(255, 214, 120, 0.95)');
  sun.addColorStop(0.4, 'rgba(255, 170, 80, 0.55)');
  sun.addColorStop(1, 'rgba(255, 170, 80, 0)');
  ctx.fillStyle = sun;
  ctx.fillRect(840, 10, 360, 360);
  ctx.fillStyle = '#ffd678';
  ctx.beginPath();
  ctx.arc(1020, 190, 52, 0, Math.PI * 2);
  ctx.fill();
  // Drifting clouds.
  ctx.fillStyle = 'rgba(245, 220, 190, 0.5)';
  for (let i = 0; i < 4; i += 1) {
    const cx = ((i * 340 + time * 12) % 1500) - 110;
    const cy = 70 + i * 46;
    ctx.beginPath();
    ctx.ellipse(cx, cy, 70, 20, 0, 0, Math.PI * 2);
    ctx.ellipse(cx + 44, cy + 6, 52, 16, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  // Falling leaves.
  ctx.fillStyle = 'rgba(217, 123, 41, 0.85)';
  for (let i = 0; i < 14; i += 1) {
    const lx = ((i * 173 + time * 30) % 1360) - 40;
    const ly = ((i * 97 + time * 46) % 560) + 20;
    ctx.save();
    ctx.translate(lx, ly);
    ctx.rotate(time * 0.8 + i);
    ctx.beginPath();
    ctx.ellipse(0, 0, 7, 4, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

function drawDistantFarm(ctx, scroll) {
  // Rolling hills.
  ctx.fillStyle = '#5d3a56';
  ctx.beginPath();
  ctx.moveTo(0, GROUND_Y);
  for (let x = 0; x <= VIEW.width; x += 40) {
    ctx.lineTo(x, GROUND_Y - 70 - Math.sin((x + scroll * 0.3) * 0.004) * 34);
  }
  ctx.lineTo(VIEW.width, GROUND_Y);
  ctx.closePath();
  ctx.fill();
  // The red barn, far off.
  const barnX = 980 - (scroll * 0.3 % 1600);
  ctx.fillStyle = '#8a2f24';
  ctx.fillRect(barnX, GROUND_Y - 150, 150, 96);
  ctx.fillStyle = '#6e241b';
  ctx.beginPath();
  ctx.moveTo(barnX - 12, GROUND_Y - 150);
  ctx.lineTo(barnX + 75, GROUND_Y - 205);
  ctx.lineTo(barnX + 162, GROUND_Y - 150);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#f5e6c8';
  ctx.fillRect(barnX + 58, GROUND_Y - 96, 34, 42);
  ctx.strokeStyle = '#f5e6c8';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(barnX + 58, GROUND_Y - 96); ctx.lineTo(barnX + 92, GROUND_Y - 54);
  ctx.moveTo(barnX + 92, GROUND_Y - 96); ctx.lineTo(barnX + 58, GROUND_Y - 54);
  ctx.stroke();
  // Hay bales and pumpkins.
  ctx.fillStyle = '#d9a92e';
  ctx.beginPath();
  ctx.arc(barnX - 90, GROUND_Y - 34, 26, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#d97b29';
  for (let i = 0; i < 3; i += 1) {
    ctx.beginPath();
    ctx.ellipse(barnX + 190 + i * 44, GROUND_Y - 16, 18, 14, 0, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawGround(ctx, scroll) {
  ctx.fillStyle = '#6b4423';
  ctx.fillRect(0, GROUND_Y, VIEW.width, VIEW.height - GROUND_Y);
  ctx.fillStyle = '#7d5230';
  ctx.fillRect(0, GROUND_Y, VIEW.width, 10);
  // Dirt clods and grass tufts scrolling past.
  ctx.fillStyle = '#5d3a17';
  for (let i = 0; i < 26; i += 1) {
    const gx = ((i * 211 - scroll) % 1400 + 1400) % 1400 - 60;
    ctx.beginPath();
    ctx.ellipse(gx, GROUND_Y + 34 + (i % 4) * 22, 12, 5, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.strokeStyle = '#4e8a2f';
  ctx.lineWidth = 3;
  for (let i = 0; i < 18; i += 1) {
    const gx = ((i * 277 - scroll) % 1400 + 1400) % 1400 - 60;
    ctx.beginPath();
    ctx.moveTo(gx, GROUND_Y + 4);
    ctx.lineTo(gx - 5, GROUND_Y - 10);
    ctx.moveTo(gx + 4, GROUND_Y + 4);
    ctx.lineTo(gx + 9, GROUND_Y - 8);
    ctx.stroke();
  }
}

function drawOven(ctx, hazard) {
  const { x, y, width, height } = hazard;
  // A black farmhouse oven, door glowing, fire licking out of it.
  ctx.fillStyle = '#1c1c22';
  roundRect(ctx, x, y, width, height, 10);
  ctx.fill();
  ctx.fillStyle = '#2e2e36';
  roundRect(ctx, x + 6, y + 6, width - 12, 18, 6);
  ctx.fill();
  // Open door with fire.
  ctx.fillStyle = '#ff7a1a';
  roundRect(ctx, x + 18, y + 34, width - 36, height - 44, 8);
  ctx.fill();
  ctx.fillStyle = '#ffd23d';
  ctx.beginPath();
  ctx.moveTo(x + width / 2, y + 40);
  ctx.quadraticCurveTo(x + width * 0.72, y + height * 0.6, x + width / 2, y + height - 12);
  ctx.quadraticCurveTo(x + width * 0.28, y + height * 0.6, x + width / 2, y + 40);
  ctx.fill();
  // Chimney with a wisp of smoke.
  ctx.fillStyle = '#33333c';
  ctx.fillRect(x + width - 26, y - 26, 18, 28);
  ctx.fillStyle = 'rgba(220, 220, 220, 0.5)';
  ctx.beginPath();
  ctx.arc(x + width - 16, y - 40, 8, 0, Math.PI * 2);
  ctx.arc(x + width - 24, y - 56, 11, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#ff3b1f';
  ctx.font = 'bold 15px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('HOT!', x + width / 2, y - 34);
}

function drawFence(ctx, hazard) {
  const { x, y, width, height } = hazard;
  ctx.fillStyle = '#8a5a2b';
  ctx.fillRect(x - 4, y, 10, height);
  ctx.fillRect(x + width - 6, y, 10, height);
  ctx.fillStyle = '#a06a33';
  ctx.fillRect(x - 12, y + 12, width + 24, 12);
  ctx.fillRect(x - 12, y + 40, width + 24, 12);
  ctx.fillStyle = '#c98a4b';
  ctx.beginPath();
  ctx.moveTo(x + 1, y);
  ctx.lineTo(x + 1, y - 12);
  ctx.lineTo(x + width - 1, y - 12);
  ctx.lineTo(x + width - 1, y);
  ctx.closePath();
  ctx.fill();
}

function drawKnife(ctx, hazard, time) {
  const { x, y, width, height } = hazard;
  ctx.save();
  ctx.translate(x + width / 2, y + height / 2);
  ctx.rotate(Math.sin(time * 6) * 0.12);
  // Blade.
  const blade = ctx.createLinearGradient(-width / 2, 0, width / 2, 0);
  blade.addColorStop(0, '#dfe6ee');
  blade.addColorStop(1, '#9aa5b1');
  ctx.fillStyle = blade;
  ctx.beginPath();
  ctx.moveTo(-width / 2, -height / 2 + 4);
  ctx.lineTo(width * 0.28, -height / 2 + 4);
  ctx.lineTo(width / 2, 0);
  ctx.lineTo(width * 0.28, height / 2 - 4);
  ctx.lineTo(-width / 2, height / 2 - 4);
  ctx.closePath();
  ctx.fill();
  // Handle.
  ctx.fillStyle = '#3a2415';
  roundRect(ctx, -width / 2 - 26, -height / 2 + 1, 30, height - 2, 5);
  ctx.fill();
  ctx.fillStyle = '#c9a227';
  ctx.fillRect(-width / 2 - 4, -height / 2 + 1, 5, height - 2);
  ctx.restore();
  // Motion streaks.
  ctx.strokeStyle = 'rgba(255,255,255,0.55)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(x + width + 14, y + 6);
  ctx.lineTo(x + width + 44, y + 6);
  ctx.moveTo(x + width + 8, y + height - 6);
  ctx.lineTo(x + width + 34, y + height - 6);
  ctx.stroke();
}

function drawForestGate(ctx, world) {
  // The escape: a gap in the pine trees at the end of the farmyard, with a sign.
  // It only slides into view in the last stretch, so it never crowds the early run.
  const remaining = Math.max(0, GOAL_DISTANCE - world.distance);
  const gateX = 1180 - remaining * 1.1;
  if (gateX < 300 || remaining <= 0) return;
  ctx.fillStyle = '#1e4d2b';
  for (let i = 0; i < 4; i += 1) {
    const tx = gateX - 120 + i * 46;
    ctx.beginPath();
    ctx.moveTo(tx, GROUND_Y - 210);
    ctx.lineTo(tx - 34, GROUND_Y - 110);
    ctx.lineTo(tx + 34, GROUND_Y - 110);
    ctx.closePath();
    ctx.fill();
    ctx.fillRect(tx - 6, GROUND_Y - 112, 12, 112);
  }
  ctx.fillStyle = '#8a5a2b';
  ctx.fillRect(gateX - 150, GROUND_Y - 130, 300, 14);
  ctx.fillStyle = '#f5e6c8';
  ctx.font = 'bold 20px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('FOREST — FREEDOM!', gateX, GROUND_Y - 142);
}

function drawHud(ctx, world) {
  const level = 1 + Math.floor(world.distance / 250);
  ctx.fillStyle = 'rgba(20, 12, 8, 0.55)';
  roundRect(ctx, 16, 14, 560, 64, 12);
  ctx.fill();
  ctx.fillStyle = '#ffd678';
  ctx.font = 'bold 26px sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(`SCORE ${world.score}`, 32, 40);
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 22px sans-serif';
  ctx.fillText(`${Math.floor(world.distance)} m / ${GOAL_DISTANCE} m`, 32, 66);
  // Progress bar to the forest.
  ctx.fillStyle = 'rgba(255,255,255,0.25)';
  roundRect(ctx, 300, 24, 240, 16, 8);
  ctx.fill();
  ctx.fillStyle = '#4e8a2f';
  roundRect(ctx, 300, 24, Math.max(8, 240 * (world.distance / GOAL_DISTANCE)), 16, 8);
  ctx.fill();
  ctx.fillStyle = '#ffd678';
  ctx.font = 'bold 18px sans-serif';
  ctx.fillText(`LEVEL ${level}`, 300, 62);
  // Lives as hearts, top right.
  for (let i = 0; i < 3; i += 1) {
    const hx = VIEW.width - 46 - i * 52;
    const hy = 46;
    ctx.fillStyle = i < world.lives ? '#e63946' : 'rgba(255,255,255,0.25)';
    ctx.beginPath();
    ctx.moveTo(hx, hy + 10);
    ctx.bezierCurveTo(hx - 18, hy - 6, hx - 8, hy - 20, hx, hy - 8);
    ctx.bezierCurveTo(hx + 8, hy - 20, hx + 18, hy - 6, hx, hy + 10);
    ctx.fill();
  }
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 16px sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText('LIVES', VIEW.width - 46 - 3 * 52 - 12, 52);
  ctx.textAlign = 'left';
  // Danger toast.
  if (world.messageTime > 0) {
    ctx.globalAlpha = Math.min(1, world.messageTime);
    ctx.fillStyle = '#ff5a3c';
    ctx.font = 'bold 30px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(world.message, VIEW.width / 2, 150);
    ctx.globalAlpha = 1;
    ctx.textAlign = 'left';
  }
  // Controls reminder, bottom.
  ctx.fillStyle = 'rgba(255,255,255,0.75)';
  ctx.font = '16px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('SPACE / CLICK — jump      ↓ / S — duck      M — sound', VIEW.width / 2, VIEW.height - 16);
  ctx.textAlign = 'left';
}

function drawTitle(ctx, world) {
  ctx.fillStyle = 'rgba(20, 10, 6, 0.45)';
  ctx.fillRect(0, 0, VIEW.width, VIEW.height);
  // Big friendly turkey on the title screen.
  drawTurkey(ctx, 640, 500, 200, 210, world.time, false, false, false);
  ctx.textAlign = 'center';
  ctx.fillStyle = '#ffd678';
  ctx.font = 'bold 84px sans-serif';
  ctx.fillText('FARMYARD DASH', 640, 130);
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 34px sans-serif';
  ctx.fillText('Escape Thanksgiving!', 640, 180);
  ctx.font = '22px sans-serif';
  ctx.fillStyle = '#ffe9b0';
  ctx.fillText('The farmer is coming for you — run 1000 m to the forest gate.', 640, 220);
  ctx.fillText('Jump the ovens and fences. Duck the carving knives. Grab the corn.', 640, 252);
  ctx.fillStyle = '#1e4d2b';
  roundRect(ctx, 440, 520, 400, 64, 14);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 28px sans-serif';
  ctx.fillText('▶  CLICK or press SPACE to run', 640, 561);
  ctx.fillStyle = '#ffffff';
  ctx.font = '18px sans-serif';
  ctx.fillText('SPACE / ↑ / W / click — jump      ↓ / S — duck      M — sound', 640, 630);
  if (world.best > 0) {
    ctx.fillStyle = '#ffd678';
    ctx.font = 'bold 20px sans-serif';
    ctx.fillText(`Best score so far: ${world.best}`, 640, 668);
  }
  ctx.textAlign = 'left';
}

function drawEnd(ctx, world) {
  const escaped = world.phase === PHASE_ESCAPED;
  ctx.fillStyle = escaped ? 'rgba(10, 40, 16, 0.55)' : 'rgba(40, 8, 4, 0.6)';
  ctx.fillRect(0, 0, VIEW.width, VIEW.height);
  ctx.textAlign = 'center';
  if (escaped) {
    ctx.fillStyle = '#8dff6a';
    ctx.font = 'bold 88px sans-serif';
    ctx.fillText('ESCAPED!', 640, 170);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 30px sans-serif';
    ctx.fillText('You reached the forest gate — no Thanksgiving dinner for you!', 640, 222);
    drawTurkey(ctx, 640, 500, 220, 230, world.time, false, false, false);
  } else {
    ctx.fillStyle = '#ff5a3c';
    ctx.font = 'bold 88px sans-serif';
    ctx.fillText('CAUGHT!', 640, 170);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 30px sans-serif';
    ctx.fillText('The farmer grabbed you by the drumstick…', 640, 222);
    ctx.font = '22px sans-serif';
    ctx.fillText('Thanksgiving dinner is served. Better luck next run!', 640, 256);
    drawFarmer(ctx, 560, 542, 150, 205, world.time, true);
    drawTurkey(ctx, 730, 542, 150, 156, world.time, false, false, true);
  }
  ctx.fillStyle = '#ffd678';
  ctx.font = 'bold 32px sans-serif';
  ctx.fillText(`SCORE ${world.score}      DISTANCE ${Math.floor(world.distance)} m`, 640, 610);
  ctx.fillStyle = '#1e4d2b';
  roundRect(ctx, 440, 640, 400, 56, 14);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 26px sans-serif';
  ctx.fillText('Press R or CLICK to run again', 640, 676);
  ctx.textAlign = 'left';
}

export function renderGame(ctx, world) {
  ctx.save();
  if (world.shake > 0) {
    ctx.translate((Math.random() - 0.5) * world.shake * 10, (Math.random() - 0.5) * world.shake * 10);
  }
  const scroll = world.distance * 34;
  drawSky(ctx, world.time);
  drawDistantFarm(ctx, scroll);
  drawGround(ctx, scroll);
  drawForestGate(ctx, world);

  for (const corn of world.corns) {
    drawCorn(ctx, corn.x, corn.y, 26, world.time * 2 + corn.x * 0.01);
  }
  for (const hazard of world.hazards) {
    if (hazard.kind === 'oven') drawOven(ctx, hazard);
    else if (hazard.kind === 'fence') drawFence(ctx, hazard);
    else drawKnife(ctx, hazard, world.time);
  }

  // The farmer chases from the left and the turkey runs at its fixed spot — but only
  // while a run is in play: the title and end screens draw their own scenes.
  if (world.phase === PHASE_PLAY) {
    const farmer = world.farmer;
    drawFarmer(ctx, farmer.x + FARMER.width / 2, GROUND_Y, FARMER.width, FARMER.height, world.runPhase, false);
    const turkey = world.turkey;
    const height = turkey.ducking ? TURKEY.duckHeight : TURKEY.height;
    drawTurkey(ctx, TURKEY_X, turkey.y, TURKEY.width, height, world.runPhase, turkey.ducking, turkey.invulnerable > 0, false);
  }

  if (world.phase === PHASE_PLAY) drawHud(ctx, world);
  if (world.phase === PHASE_TITLE) drawTitle(ctx, world);
  if (world.phase === PHASE_CAUGHT || world.phase === PHASE_ESCAPED) drawEnd(ctx, world);

  if (world.flash > 0) {
    ctx.fillStyle = `rgba(255, 60, 30, ${world.flash * 0.25})`;
    ctx.fillRect(0, 0, VIEW.width, VIEW.height);
  }
  ctx.restore();
}
