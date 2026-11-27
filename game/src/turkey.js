// Farmyard Dash — all the character art, drawn with canvas vector shapes.
// The turkey (player), the farmer (chaser) and the corn pickups. No images, no fonts
// beyond the system stack: every feather is a bezier curve.
export function drawTurkey(ctx, x, y, width, height, runPhase, ducking, invulnerable, dead) {
  ctx.save();
  if (invulnerable && Math.floor(runPhase * 14) % 2 === 0) ctx.globalAlpha = 0.35;
  ctx.translate(x, y);
  const squash = ducking ? 0.62 : 1 + Math.sin(runPhase * 10) * 0.03;
  ctx.scale(1, squash);

  // Fanned tail feathers behind the body.
  const tailColors = ['#b3541e', '#d97b29', '#e8a33d', '#c96a2c', '#a34d16'];
  for (let i = 0; i < 5; i += 1) {
    const angle = (-0.9 + i * 0.45);
    ctx.save();
    ctx.translate(-width * 0.28, -height * 0.42);
    ctx.rotate(angle);
    ctx.fillStyle = tailColors[i];
    ctx.beginPath();
    ctx.ellipse(0, -height * 0.32, width * 0.13, height * 0.36, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // Body: a plump brown oval.
  ctx.fillStyle = '#7a4a21';
  ctx.beginPath();
  ctx.ellipse(0, -height * 0.28, width * 0.42, height * 0.34, 0, 0, Math.PI * 2);
  ctx.fill();
  // Breast feathers.
  ctx.fillStyle = '#8f5a2a';
  ctx.beginPath();
  ctx.ellipse(width * 0.1, -height * 0.22, width * 0.3, height * 0.24, 0, 0, Math.PI * 2);
  ctx.fill();
  // Wing.
  ctx.fillStyle = '#5d3a17';
  ctx.beginPath();
  ctx.ellipse(-width * 0.05, -height * 0.3, width * 0.26, height * 0.2, -0.3 + Math.sin(runPhase * 10) * 0.12, 0, Math.PI * 2);
  ctx.fill();

  // Neck and head.
  ctx.fillStyle = '#7a4a21';
  ctx.fillRect(width * 0.22, -height * 0.78, width * 0.14, height * 0.5);
  ctx.fillStyle = '#c98a4b';
  ctx.beginPath();
  ctx.arc(width * 0.3, -height * 0.82, width * 0.17, 0, Math.PI * 2);
  ctx.fill();
  // Beak.
  ctx.fillStyle = '#e8a33d';
  ctx.beginPath();
  ctx.moveTo(width * 0.42, -height * 0.84);
  ctx.lineTo(width * 0.62, -height * 0.79);
  ctx.lineTo(width * 0.42, -height * 0.74);
  ctx.closePath();
  ctx.fill();
  // Wattle.
  ctx.fillStyle = '#d9382b';
  ctx.beginPath();
  ctx.ellipse(width * 0.4, -height * 0.7, width * 0.06, height * 0.09, 0.3, 0, Math.PI * 2);
  ctx.fill();
  // Eye — wide with panic, or X when caught.
  if (dead) {
    ctx.strokeStyle = '#2b1a0e';
    ctx.lineWidth = 3;
    const ex = width * 0.3;
    const ey = -height * 0.86;
    ctx.beginPath();
    ctx.moveTo(ex - 6, ey - 6); ctx.lineTo(ex + 6, ey + 6);
    ctx.moveTo(ex + 6, ey - 6); ctx.lineTo(ex - 6, ey + 6);
    ctx.stroke();
  } else {
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(width * 0.3, -height * 0.86, width * 0.055, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#1c1006';
    ctx.beginPath();
    ctx.arc(width * 0.32, -height * 0.86, width * 0.028, 0, Math.PI * 2);
    ctx.fill();
  }

  // Running legs.
  ctx.strokeStyle = '#e8a33d';
  ctx.lineWidth = 5;
  ctx.lineCap = 'round';
  const legSwing = Math.sin(runPhase * 12) * 14;
  ctx.beginPath();
  ctx.moveTo(-width * 0.08, -height * 0.04);
  ctx.lineTo(-width * 0.08 + legSwing, 0);
  ctx.moveTo(width * 0.12, -height * 0.04);
  ctx.lineTo(width * 0.12 - legSwing, 0);
  ctx.stroke();
  ctx.restore();
}

export function drawFarmer(ctx, x, y, width, height, runPhase, grabbing) {
  ctx.save();
  ctx.translate(x, y);
  const bob = Math.sin(runPhase * 11) * 3;
  ctx.translate(0, bob);

  // Legs mid-stride, chasing.
  ctx.strokeStyle = '#3a2c1c';
  ctx.lineWidth = 9;
  ctx.lineCap = 'round';
  const swing = Math.sin(runPhase * 11) * 18;
  ctx.beginPath();
  ctx.moveTo(-8, -height * 0.42);
  ctx.lineTo(-8 + swing, 0);
  ctx.moveTo(10, -height * 0.42);
  ctx.lineTo(10 - swing, 0);
  ctx.stroke();

  // Overalls.
  ctx.fillStyle = '#2f5d8a';
  ctx.fillRect(-width * 0.32, -height * 0.72, width * 0.64, height * 0.34);
  // Checked shirt.
  ctx.fillStyle = '#c0392b';
  ctx.fillRect(-width * 0.3, -height * 0.98, width * 0.6, height * 0.3);
  ctx.strokeStyle = '#f5e6c8';
  ctx.lineWidth = 2;
  for (let i = -1; i <= 1; i += 1) {
    ctx.beginPath();
    ctx.moveTo(i * width * 0.18 - width * 0.3, -height * 0.98);
    ctx.lineTo(i * width * 0.18 - width * 0.3, -height * 0.68);
    ctx.stroke();
  }
  // Arms reaching forward for the turkey.
  ctx.strokeStyle = '#e8b98a';
  ctx.lineWidth = 10;
  const reach = grabbing ? 34 : 12 + Math.sin(runPhase * 11) * 6;
  ctx.beginPath();
  ctx.moveTo(width * 0.2, -height * 0.9);
  ctx.lineTo(width * 0.52 + reach, -height * 0.78);
  ctx.moveTo(width * 0.2, -height * 0.82);
  ctx.lineTo(width * 0.5 + reach, -height * 0.62);
  ctx.stroke();

  // Head, beard and straw hat.
  ctx.fillStyle = '#e8b98a';
  ctx.beginPath();
  ctx.arc(width * 0.05, -height * 1.06, width * 0.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#f5e6c8';
  ctx.beginPath();
  ctx.ellipse(width * 0.05, -height * 0.94, width * 0.17, height * 0.1, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#e8c33d';
  ctx.beginPath();
  ctx.ellipse(width * 0.05, -height * 1.2, width * 0.42, height * 0.09, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#d9a92e';
  ctx.beginPath();
  ctx.ellipse(width * 0.05, -height * 1.26, width * 0.2, height * 0.08, 0, 0, Math.PI * 2);
  ctx.fill();
  // Angry eyes under the hat brim.
  ctx.fillStyle = '#1c1006';
  ctx.beginPath();
  ctx.arc(width * 0.14, -height * 1.08, 3.5, 0, Math.PI * 2);
  ctx.arc(width * 0.26, -height * 1.08, 3.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

export function drawCorn(ctx, x, y, size, spin) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(Math.sin(spin) * 0.15);
  // Husk leaves.
  ctx.fillStyle = '#4e8a2f';
  ctx.beginPath();
  ctx.moveTo(-size * 0.5, size * 0.3);
  ctx.quadraticCurveTo(-size * 0.9, size * 0.1, -size * 0.4, -size * 0.5);
  ctx.quadraticCurveTo(-size * 0.2, size * 0.1, -size * 0.5, size * 0.3);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(size * 0.5, size * 0.3);
  ctx.quadraticCurveTo(size * 0.9, size * 0.1, size * 0.4, -size * 0.5);
  ctx.quadraticCurveTo(size * 0.2, size * 0.1, size * 0.5, size * 0.3);
  ctx.closePath();
  ctx.fill();
  // Golden cob.
  ctx.fillStyle = '#f2c230';
  ctx.beginPath();
  ctx.ellipse(0, -size * 0.15, size * 0.42, size * 0.55, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#d9a41f';
  for (let row = -2; row <= 2; row += 1) {
    for (let col = -1; col <= 1; col += 1) {
      ctx.beginPath();
      ctx.arc(col * size * 0.22, row * size * 0.2 - size * 0.15, size * 0.07, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.restore();
}
