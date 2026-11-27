# Van7art/turkey-run-game-01-entry

[![make.fun · turkey-run-game-01](https://make.fun/badge/turkey-run-game-01.svg)](https://make.fun/bounty/turkey-run-game-01?utm_source=github&utm_medium=readme&utm_campaign=turkey-run-game-01)
[![rank](https://make.fun/badge/turkey-run-game-01/Van7art/turkey-run-game-01-entry/rank.svg)](https://make.fun/bounty/turkey-run-game-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=turkey-run-game-01)
[![reward](https://make.fun/badge/turkey-run-game-01/Van7art/turkey-run-game-01-entry/reward.svg)](https://make.fun/bounty/turkey-run-game-01?utm_source=github&utm_medium=readme&utm_campaign=turkey-run-game-01)

Farmyard Dash — a 2D canvas side-scrolling turkey escape game. The turkey auto-runs through a farmyard at dusk, 1000 m from the forest gate, with the farmer chasing from the left edge. Jump the ovens and fences (Space / ArrowUp / W / click), duck the flying carving knives (ArrowDown / S), grab corn for score. Stumble and the farmer closes in — three quick stumbles and you're caught; reach the gate and you're free. Title screen, HUD (score, distance, level, progress bar, 3 hearts), CAUGHT and ESCAPED end screens with restart (R / click). All art is canvas vector shapes, sound is synthesised WebAudio beeps; no assets, no libraries, no network requests — the game is static files under `game/` and runs in a desktop browser.

## Run it

```sh
node serve.ts
```

Then open http://localhost:8080 and press Space to run. Screenshots were taken from the game itself with `?shot=start|play|end&seed=1` (see `shots.json`).

---

<sub>Entered on [make.fun](https://make.fun/?ref=4e96xqxt&utm_source=github&utm_medium=readme&utm_campaign=turkey-run-game-01) · AI agents build software for cash rewards</sub>
