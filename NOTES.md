# Farmyard Dash — variant vA (turkey-run-game-01)

## Design summary
A 2D canvas side-scrolling runner. The turkey auto-runs right through a farmyard at
dusk, chased by the farmer from the left edge. The player jumps ovens and fences
(Space / ArrowUp / W / click / tap) and ducks under flying carving knives
(ArrowDown / S). Corn cobs are score pickups, arced over hazards as a reward for
jumping them. Stumbling costs a life and lets the farmer close in (3 quick stumbles
and he grabs you); running clean lets the turkey pull away. Reach the forest gate
at 1000 m to escape (ESCAPED screen, +500 bonus); get caught and the farmer grabs
the turkey by the drumstick (CAUGHT screen). Both end screens restart with R or a
click. Difficulty ramps: speed grows with distance and levels tick up every 250 m.
All art is canvas vector shapes in an autumn dusk palette (no external assets);
sound is tiny synthesised WebAudio beeps (jump / corn / hit / caught / escaped),
M toggles mute. No network requests, no libraries, no build step.

## Controls
- Jump: Space / ArrowUp / W / click / tap
- Duck (hold): ArrowDown / S
- Start / restart: Enter / Space / R / click
- M: toggle sound

## Files (all written in this session, original code)
- `main.ts` — hand-in program (own lines; copies game/ + screenshots/ to the
  output dir, writes dossier.json via vendor/makefun-game.ts with the starter's caps)
- `serve.ts` — dev static server, copied from kit/starter (dev tool only)
- `vendor/makefun-game.ts` — kit copy, unchanged
- `LICENSE` — MIT, kit/starter text
- `game/index.html` + `game/src/`: `config.js` (tuning + seeded RNG),
  `world.js` (state, spawning, physics, collisions), `render.js` (dusk farmyard,
  hazards, HUD, title/end screens), `turkey.js` (turkey / farmer / corn vector art),
  `input.js` (keyboard + mouse), `audio.js` (WebAudio beeps), `shots.js`
  (deterministic screenshot states + autopilot), `main.js` (loop, `?shot=` hook)
- `screenshots/1-start.jpg` (67,258 B), `2-play.jpg` (50,299 B),
  `3-end.jpg` (50,140 B) — all 1280×720 JPEG, all ≤ 256 KiB
- `shots.json` — the three shot queries (`?shot=start|play|end&seed=1`)

## How the screenshots were taken
Served game/ locally (`node serve.ts --port 8121`), then the VM's headless shell:
`/home/hatch/.cache/ms-playwright/chromium_headless_shell-1255/chrome-headless-shell-linux64/chrome-headless-shell --no-sandbox --disable-gpu --window-size=1280,720 --virtual-time-budget=3000 --screenshot=screenshots/<n>.jpg "http://localhost:8121/?shot=<state>&seed=1"`.
Each shot is a deterministic render of the game's own code: `?shot=play` simulates
9 s of play with a simple autopilot (jump ovens/fences, duck knives); `?shot=end`
runs a clumsy autopilot (never jumps) until the farmer catches the turkey. Every
screenshot was read back and visually verified: title screen (big turkey, title,
controls, start button), gameplay (HUD with score 116, 81 m / 1000 m, level 1,
progress bar, 3 hearts; turkey mid-jump, ovens, fence, corn, farmer chasing at the
left edge), end screen (CAUGHT!, farmer grabbing the turkey, score/distance,
restart button). The plain live URL (no `?shot=`) was also screenshotted and shows
the title screen correctly.

## Verification results
- `mkdir -p out1 out2 && MAKEFUN_OUTPUT_DIR=out1 node main.ts && MAKEFUN_OUTPUT_DIR=out2 node main.ts && diff -r out1 out2` → **identical** (deterministic).
- Output: 14 files, 477,880 bytes total; dossier.json 268,092 bytes (< 1.5 MiB cap).
- `node --check` clean on all 8 game sources.
- No `http(s)://` URLs, no fetch/XHR/WebSocket/dynamic import anywhere in game/;
  every static import resolves to a file under game/; all 8 source files serve HTTP 200.
- Play-testing (headless Node simulation of the real update loop, seeds 1, 3, 7, 11,
  23, 42, 99, 5, 30 s each): the autopilot survives every seed with all 3 lives
  (292 m in 30 s); 9 s play shots are clean on every seed tested. A forced
  near-goal run reaches ESCAPED at 1000.2 m with score 1500 (+500 bonus). The
  clumsy pilot gets CAUGHT, as the end screenshot shows. Restart is wired through
  the same start/restart path as the live game.
- Bugs found and fixed during this session: (1) jump arc too short — the turkey
  landed on hazards (retuned jump to -820 / gravity 1600, autopilot trigger to
  speed*0.4+20); (2) distance score never accumulated (per-frame `Math.floor` of a
  fraction) — now banked fractionally; (3) a duplicated knife push left a second
  knife at ground level that hit ducking turkeys — removed; (4) knives were faster
  than the scroll and caught up to ground hazards — knives now ride the scroll
  (speed 0) and extra room is left after each knife; (5) one stumble used to let
  the farmer catch the turkey immediately (gain 130) — now 35, three quick
  stumbles to get caught, matching the 3 hearts.

## Run record
- Prompt summary: build variant vA of the turkey-run-game-01 entry ("Farmyard
  Dash", side-scrolling runner) in the given workdir, with original code, real
  screenshots of the game's own renders, and the listed verification; no push,
  submit, or repo creation.
- MCP used: none.
- Provider/model: Muse (Muse Spark).
- Effort: single build session, incl. simulation-driven tuning of jump physics,
  hazard spacing, and the farmer chase.
