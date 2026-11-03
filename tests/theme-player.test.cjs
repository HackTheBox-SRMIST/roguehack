const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const ts = require("typescript");

const exportsObject = {};
vm.runInNewContext(ts.transpileModule(
  fs.readFileSync(require.resolve("../lib/theme-player.ts"), "utf8"),
  { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } },
).outputText, { exports: exportsObject, setTimeout, clearTimeout });

function fixture() {
  const sounds = [];
  const statuses = [];
  const player = exportsObject.createThemePlayer((status) => statuses.push(status), (src) => {
    const sound = {
      src, currentTime: 0, duration: 40, volume: 1, muted: false, pauses: 0,
      pending: [],
      play() { return new Promise((resolve, reject) => this.pending.push({ resolve, reject })); },
      pause() { this.pauses += 1; },
      removeAttribute() { this.src = ""; },
      load() {},
    };
    sounds.push(sound);
    return sound;
  });
  return { player, sounds, statuses };
}

const flush = async () => { await Promise.resolve(); await Promise.resolve(); };

test("immediate reduced-motion reveal survives a late unlock completion", async () => {
  const { player, sounds, statuses } = fixture();
  player.prepare("mario.mp3");
  player.play("mario.mp3");
  const sound = sounds[0];
  sound.pending.forEach(({ resolve }) => resolve());
  await flush();
  assert.equal(sound.pauses, 0);
  assert.equal(statuses.at(-1), "playing");
  player.dispose();
});

test("reset cancels pending playback and ignores stale completions", async () => {
  const { player, sounds, statuses } = fixture();
  player.play("shinchan.mp3");
  player.stop();
  sounds[0].pending.forEach(({ resolve }) => resolve());
  await flush();
  assert.equal(statuses.at(-1), "idle");
  assert.equal(sounds[0].src, "");
  assert.equal(sounds[0].onended, null);
  player.dispose();
});

test("switching themes cannot surface an error from the previous theme", async () => {
  const { player, sounds, statuses } = fixture();
  player.play("spiderman.mp3");
  player.play("harry-potter.mp3");
  sounds[0].pending.forEach(({ reject }) => reject(new Error("old request")));
  sounds[1].pending.forEach(({ resolve }) => resolve());
  await flush();
  assert.equal(statuses.at(-1), "playing");
  assert.equal(statuses.includes("unavailable"), false);
  player.dispose();
});

test("cue fades, ends at twelve seconds, and never loops", async () => {
  const { player, sounds, statuses } = fixture();
  player.play("dragon-ball.mp3");
  const sound = sounds[0];
  sound.pending.forEach(({ resolve }) => resolve());
  await flush();
  sound.currentTime = 11.6;
  sound.ontimeupdate();
  assert.ok(sound.volume > 0 && sound.volume < 0.65);
  sound.currentTime = 12;
  sound.ontimeupdate();
  assert.equal(statuses.at(-1), "ended");
  assert.equal(sound.loop, false);
  assert.equal(sound.onended, null);
  player.dispose();
});

test("a theme can request a longer cue with a smooth closing fade", async () => {
  const { player, sounds, statuses } = fixture();
  player.play("harry-potter.mp3", 18);
  const sound = sounds[0];
  sound.pending.forEach(({ resolve }) => resolve());
  await flush();
  sound.currentTime = 16.5;
  sound.ontimeupdate();
  assert.ok(sound.volume > 0 && sound.volume < 1);
  sound.currentTime = 17.99;
  sound.ontimeupdate();
  assert.ok(sound.volume < 0.25);
  sound.currentTime = 18;
  sound.ontimeupdate();
  assert.equal(statuses.at(-1), "ended");
  player.dispose();
});

test("mute persists across themes and a failed source can be retried", async () => {
  const { player, sounds, statuses } = fixture();
  player.setMuted(true);
  player.play("kick.mp3");
  assert.equal(sounds[0].muted, true);
  sounds[0].pending.forEach(({ reject }) => reject(new Error("network")));
  await flush();
  assert.equal(statuses.at(-1), "unavailable");
  player.play("kick.mp3");
  assert.equal(sounds[1].muted, true);
  sounds[1].pending.forEach(({ resolve }) => resolve());
  await flush();
  assert.equal(statuses.at(-1), "playing");
  player.setMuted(false);
  assert.equal(sounds[1].muted, false);
  player.dispose();
});
