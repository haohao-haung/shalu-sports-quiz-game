const fs = require("fs");
const path = require("path");
const vm = require("vm");

const projectDir = path.resolve(__dirname, "..");
const storageKey = "chinese-quiz-game-state-v6";
const lessonIds = ["lesson7", "lesson8", "lesson9", "lesson10", "self3", "review"];
const listeners = {};
const storage = new Map();
const gameSource = fs.readFileSync(path.join(projectDir, "game.js"), "utf8");
let activeAudioSrc = "";
let currentScrollY = 0;

const app = {
  innerHTML: "",
  style: { setProperty() {} },
  focus() {}
};

const topbarButton = {
  disabled: false,
  title: "",
  classList: { toggle() {} },
  setAttribute() {}
};

function seedState(extra = {}) {
  const records = {};
  lessonIds.forEach((id) => {
    records[id] = {
      correct: 12,
      total: 15,
      score: 80,
      battlePower: 80,
      avgSeconds: 10,
      totalSeconds: 150,
      passed: true,
      completedAt: "2026/6/6 18:00:00"
    };
  });

  storage.set(storageKey, JSON.stringify({
    name: "測試學生",
    role: "male",
    completedAt: "",
    scores: {},
    records,
    attempts: {},
    mistakes: {},
    pendingResult: null,
    finalRetryUnlocked: false,
    current: null,
    ...extra
  }));
}

function makeButton(dataset) {
  const button = {
    dataset,
    checked: false,
    closest(selector) {
      return selector === "[data-action]" ? button : null;
    }
  };
  return button;
}

function makeInput(dataset, checked) {
  const input = {
    dataset,
    checked,
    value: "",
    matches(selector) {
      return selector === 'input[name="studentRole"]' ? false : false;
    },
    closest(selector) {
      return selector === "[data-action]" ? input : null;
    }
  };
  return input;
}

function makeStartForm(role) {
  return {
    fields: {
      studentName: "測試學生",
      studentRole: role
    },
    matches(selector) {
      return selector === '[data-form="start"]';
    }
  };
}

async function submitStart(role) {
  listeners.submit({
    target: makeStartForm(role),
    preventDefault() {}
  });
  await settle();
}

async function click(dataset) {
  listeners.click({
    target: makeButton(dataset),
    preventDefault() {}
  });
  await settle();
}

async function change(dataset, checked) {
  listeners.change({
    target: makeInput(dataset, checked),
    preventDefault() {}
  });
  await settle();
}

async function endFinalClearVideo() {
  listeners.ended({
    target: {
      matches(selector) {
        return selector === "[data-final-clear-video]";
      }
    }
  });
  await settle();
}

async function endBossIntroVideo() {
  listeners.ended({
    target: {
      matches(selector) {
        return selector === "[data-boss-intro-video]";
      }
    }
  });
  await settle();
}

async function settle() {
  for (let index = 0; index < 5; index += 1) {
    await Promise.resolve();
  }
}

async function waitForHtml(text) {
  for (let index = 0; index < 20; index += 1) {
    if (app.innerHTML.includes(text)) return;
    await settle();
  }
  throw new Error(`Timed out waiting for ${text}`);
}

function fakeQuestion(id, index) {
  return {
    id,
    question: `魔王測試題 ${index + 1}`,
    options: ["正確選項", "錯誤選項", "干擾選項", "干擾選項"],
    paperName: `測試卷 ${index + 1}`
  };
}

const sandbox = {
  console,
  Date,
  Math,
  Number,
  String,
  Boolean,
  Array,
  Object,
  Map,
  JSON,
  encodeURIComponent,
  setTimeout,
  clearTimeout,
  FormData: function FormData(target) {
    this.get = (name) => target.fields?.[name] || "";
  },
  Audio: function Audio() {
    this.paused = true;
    Object.defineProperty(this, "src", {
      get: () => activeAudioSrc,
      set: (value) => {
        activeAudioSrc = value;
      }
    });
    this.pause = () => {
      this.paused = true;
    };
    this.play = () => {
      this.paused = false;
      return Promise.resolve();
    };
    this.addEventListener = () => {};
  },
  localStorage: {
    getItem: (key) => storage.get(key) || null,
    setItem: (key, value) => storage.set(key, String(value)),
    removeItem: (key) => storage.delete(key)
  },
  document: {
    querySelector(selector) {
      if (selector === "#app") return app;
      if (selector === '.top-actions [data-action="mistakes"]') return topbarButton;
      return null;
    },
    addEventListener(type, handler) {
      listeners[type] = handler;
    }
  },
  window: {
    scrollTo(options) {
      currentScrollY = typeof options === "object" ? options.top : 0;
    },
    AudioContext: null,
    webkitAudioContext: null
  },
  fetch: async (url) => {
    const requestUrl = new URL(url);
    const action = requestUrl.searchParams.get("action");

    if (action === "getQuestions") {
      return {
        json: async () => ({
          ok: true,
          questions: Array.from({ length: 10 }, (_, index) => fakeQuestion(`boss-q-${index + 1}`, index))
        })
      };
    }

    if (action === "checkAnswer") {
      return {
        json: async () => ({ ok: true, answerIndex: 0, explanation: "測試解析" })
      };
    }

    throw new Error(`Unexpected fetch: ${url}`);
  }
};

sandbox.window = { ...sandbox.window, ...sandbox };
Object.defineProperty(sandbox.window, "scrollY", {
  get: () => currentScrollY
});
seedState();

vm.createContext(sandbox);
vm.runInContext(fs.readFileSync(path.join(projectDir, "data", "questions.js"), "utf8"), sandbox);
vm.runInContext(gameSource, sandbox);

(async () => {
  for (const relativePath of [
    "assets/reactions/boss/asha-boss-ready.png",
    "assets/reactions/boss/asha-boss-wrong.png",
    "assets/reactions/boss/asha-boss-defeat-screen.png",
    "assets/reactions/boss/lujiang-boss-ready.png",
    "assets/reactions/boss/lujiang-boss-wrong.png",
    "assets/reactions/boss/lujiang-boss-defeat-screen.png",
    "assets/intro/asha-intro.mp4",
    "assets/intro/lujiang-intro.mp4",
    "assets/boss-intro/boss-entrance.mp4",
    "assets/final-clear/asha-clear.mp4",
    "assets/final-clear/lujiang-clear.mp4",
    "assets/final-clear/asha-defeated-boss.png",
    "assets/final-clear/lujiang-defeated-boss.png",
    "assets/complete/asha-final-card-transparent.png",
    "assets/complete/lujiang-final-card-transparent.png",
    "assets/audio/boss-defeat-theme.mp3",
    "assets/audio/sports/basketball-correct.wav",
    "assets/audio/sports/basketball-wrong.wav",
    "assets/audio/sports/baseball-correct.wav",
    "assets/audio/sports/baseball-wrong.wav",
    "assets/audio/sports/badminton-correct.wav",
    "assets/audio/sports/badminton-wrong.wav",
    "assets/audio/sports/track-correct.wav",
    "assets/audio/sports/track-wrong.wav",
    "assets/audio/sports/volleyball-correct.wav",
    "assets/audio/sports/volleyball-wrong.wav",
    "assets/audio/sports/soccer-correct.wav",
    "assets/audio/sports/soccer-wrong.wav"
  ]) {
    if (!gameSource.includes(relativePath) || !fs.existsSync(path.join(projectDir, relativePath))) {
      throw new Error(`Missing boss image reference or file: ${relativePath}`);
    }
  }

  for (let index = 1; index <= 10; index += 1) {
    const relativePath = `assets/reactions/boss/asha-boss-correct-${index}.png`;
    if (!gameSource.includes(relativePath)) {
      throw new Error(`Missing Asha boss correct image reference ${index}.`);
    }
    if (!fs.existsSync(path.join(projectDir, relativePath))) {
      throw new Error(`Missing Asha boss correct image file ${index}.`);
    }
  }
  if (!gameSource.includes("迎接最終挑戰") || !gameSource.includes("boss-intro-start")) {
    throw new Error("Boss intro transition should require the start challenge button.");
  }

  await submitStart("female");
  await waitForHtml("assets/intro/lujiang-intro.mp4");
  if (!app.innerHTML.includes("intro-screen")) {
    throw new Error("Female start should render the intro video screen.");
  }
  await click({ action: "intro-skip" });
  await waitForHtml("map-screen");

  await submitStart("male");
  await waitForHtml("assets/intro/asha-intro.mp4");
  if (!app.innerHTML.includes("intro-screen")) {
    throw new Error("Male start should render the intro video screen.");
  }
  await click({ action: "intro-skip" });
  await waitForHtml("map-screen");

  await click({ action: "dev-final" });
  await waitForHtml("assets/boss-intro/boss-entrance.mp4");
  if (!app.innerHTML.includes("boss-intro-screen")) {
    throw new Error("Design final shortcut should also play the boss entrance video.");
  }
  await endBossIntroVideo();
  await waitForHtml("assets/reactions/boss/asha-boss-ready.png");
  await click({ action: "map" });
  await waitForHtml("map-screen");

  await click({ action: "start-level", level: "final" });
  await waitForHtml("assets/boss-intro/boss-entrance.mp4");
  if (!app.innerHTML.includes("boss-intro-screen")) {
    throw new Error("First final challenge should play the boss entrance video.");
  }
  await endBossIntroVideo();
  await waitForHtml("assets/reactions/boss/asha-boss-ready.png");
  if (!activeAudioSrc.includes("assets/audio/boss-battle-theme.mp3")) {
    throw new Error(`Boss level did not switch to boss music: ${activeAudioSrc}`);
  }
  if (!app.innerHTML.includes("assets/reactions/boss/asha-boss-ready.png")) {
    throw new Error("Boss ready state did not use Asha ready image.");
  }
  if (!app.innerHTML.includes("10/10")) {
    throw new Error("Boss health should start at 10/10.");
  }
  if (!app.innerHTML.includes('data-action="dev-complete-final"')) {
    throw new Error("Boss question screen should include the design complete shortcut.");
  }

  await click({ action: "choose", choice: "0" });
  await click({ action: "confirm-answer" });
  await waitForHtml("assets/reactions/boss/asha-boss-correct-1.png");
  if (!app.innerHTML.includes("assets/reactions/boss/asha-boss-correct-1.png")) {
    throw new Error("First correct answer did not use Asha boss correct image 1.");
  }
  if (!app.innerHTML.includes("9/10")) {
    throw new Error("Boss health did not drop to 9/10 after one correct answer.");
  }

  await click({ action: "next" });
  await click({ action: "choose", choice: "1" });
  await click({ action: "confirm-answer" });
  await waitForHtml("assets/reactions/boss/asha-boss-wrong.png");
  if (!app.innerHTML.includes("assets/reactions/boss/asha-boss-wrong.png")) {
    throw new Error("Wrong answer should first show Asha getting hit in the reaction panel.");
  }
  if (!app.innerHTML.includes('data-action="final-show-defeat"')) {
    throw new Error("Final wrong explanation should show the defeat-screen transition button.");
  }

  await click({ action: "final-show-defeat" });
  await waitForHtml("assets/reactions/boss/asha-boss-defeat-screen.png");
  if (!app.innerHTML.includes("final-defeat-screen") || !app.innerHTML.includes("assets/reactions/boss/asha-boss-defeat-screen.png")) {
    throw new Error("Wrong answer did not enter the Asha boss defeat screen.");
  }
  if (!app.innerHTML.includes('data-action="final-defeat-retry"')) {
    throw new Error("Defeat screen should show the direct retry button.");
  }
  if (!activeAudioSrc.includes("assets/audio/boss-defeat-theme.mp3")) {
    throw new Error(`Defeat screen should switch to defeat music: ${activeAudioSrc}`);
  }

  await click({ action: "final-defeat-retry" });
  await waitForHtml("assets/reactions/boss/asha-boss-ready.png");
  if (!activeAudioSrc.includes("assets/audio/boss-battle-theme.mp3")) {
    throw new Error(`Direct retry should keep boss music: ${activeAudioSrc}`);
  }

  await waitForHtml('data-action="dev-final-one-health"');
  await click({ action: "dev-final-one-health" });
  await waitForHtml("1/10");
  await click({ action: "choose", choice: "0" });
  await click({ action: "confirm-answer" });
  await waitForHtml("使出連續重拳");
  if (app.innerHTML.includes("final-strike-overlay")) {
    throw new Error("Final strike overlay should wait until the combo button is pressed.");
  }
  await click({ action: "show-final-strike" });
  await waitForHtml("final-strike-overlay");
  if (!app.innerHTML.includes("最後一擊")) {
    throw new Error("Perfect final boss answer should show the final strike overlay.");
  }
  for (let index = 1; index <= 10; index += 1) {
    if (!app.innerHTML.includes(`assets/reactions/boss/asha-boss-correct-${index}.png`)) {
      throw new Error(`Final strike overlay should include Asha correct image ${index}.`);
    }
  }
  if (!app.innerHTML.includes("final-strike-button")) {
    throw new Error("Final strike overlay should render a rounded final strike button.");
  }
  await click({ action: "final-strike" });
  await waitForHtml("assets/final-clear/asha-clear.mp4");
  if (!app.innerHTML.includes("final-clear-screen")) {
    throw new Error("Final strike should play the role-specific clear video.");
  }
  await endFinalClearVideo();
  await waitForHtml("assets/final-clear/asha-defeated-boss.png");
  if (!app.innerHTML.includes("final-victory-screen") || !app.innerHTML.includes('data-action="final-victory-review"') || !app.innerHTML.includes("領取讚士證書")) {
    throw new Error("Final clear video should lead to the victory image and review button.");
  }
  await click({ action: "final-victory-review" });
  await waitForHtml("沙鹿讚士");
  if (!app.innerHTML.includes("讚力總結") || !app.innerHTML.includes("595") || !app.innerHTML.includes("assets/complete/asha-final-card-transparent.png") || !activeAudioSrc.includes("assets/audio/shalu-certificate-theme.mp3")) {
    throw new Error("Design complete shortcut did not render the final page with certificate music.");
  }
  if (app.innerHTML.includes("下載讚力證書") || app.innerHTML.includes('data-action="mistakes"') || app.innerHTML.includes('data-action="map"') || app.innerHTML.includes("stats-strip")) {
    throw new Error("Final page should not include removed certificate actions or level recap.");
  }

  seedState({
    records: {
      final: {
        correct: 10,
        total: 10,
        score: 100,
        battlePower: 115,
        avgSeconds: 1,
        totalSeconds: 10,
        passed: true,
        completedAt: "2026/6/6 20:00:00"
      }
    }
  });
  await click({ action: "map" });
  await waitForHtml("魔王綜合拳擊戰");
  if (/data-level="final"[\s\S]*?disabled/.test(app.innerHTML)) {
    throw new Error("Passed final marker should remain clickable instead of locked.");
  }

  console.log("boss flow ok");
})().catch((error) => {
  console.error(error);
  console.error(app.innerHTML.slice(0, 1000));
  process.exit(1);
});
