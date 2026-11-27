// Farmyard Dash — keyboard and mouse input.
// Jump: Space / ArrowUp / W / click / tap. Duck: ArrowDown / S (hold).
// Start and restart: Enter / Space / R / click. M toggles sound.
export function createInput(canvas, onAction) {
  const held = { jump: false, duck: false };
  const pressed = { jump: false, duck: false, start: false, restart: false, mute: false };

  function markJump() { held.jump = true; pressed.jump = true; onAction('jump'); }
  function markDuck(down) { held.duck = down; if (down) { pressed.duck = true; onAction('duck'); } }

  function onKeyDown(event) {
    if (event.repeat) return;
    switch (event.code) {
      case 'Space':
      case 'ArrowUp':
      case 'KeyW':
        event.preventDefault();
        markJump();
        break;
      case 'ArrowDown':
      case 'KeyS':
        event.preventDefault();
        markDuck(true);
        break;
      case 'Enter':
        pressed.start = true;
        onAction('start');
        break;
      case 'KeyR':
        pressed.restart = true;
        onAction('restart');
        break;
      case 'KeyM':
        pressed.mute = true;
        onAction('mute');
        break;
      default:
        break;
    }
  }

  function onKeyUp(event) {
    switch (event.code) {
      case 'Space':
      case 'ArrowUp':
      case 'KeyW':
        held.jump = false;
        break;
      case 'ArrowDown':
      case 'KeyS':
        held.duck = false;
        break;
      default:
        break;
    }
  }

  function onPointerDown(event) {
    event.preventDefault();
    markJump();
    onAction('start');
  }

  window.addEventListener('keydown', onKeyDown);
  window.addEventListener('keyup', onKeyUp);
  canvas.addEventListener('pointerdown', onPointerDown);

  return {
    held,
    // Consume the edge-triggered presses since the last frame; the loop reads these once.
    consume() {
      const snapshot = { ...pressed };
      pressed.jump = false;
      pressed.duck = false;
      pressed.start = false;
      pressed.restart = false;
      pressed.mute = false;
      return snapshot;
    },
  };
}
