(function () {
  const data = window.QUIZ_DATA;
  const STORAGE_KEY = "chinese-quiz-game-state-v6";
  const GAS_API_URL = "https://script.google.com/macros/s/AKfycbxdNr1kVY1aO0vP_B263G6f5OgX_HdqC6h4s0qaVbyHPWlhEmg0kMMATWaq0kWxFDFkTg/exec";
  const OLD_STORAGE_KEYS = [
    "chinese-quiz-game-state-v1",
    "chinese-quiz-game-state-v2",
    "chinese-quiz-game-state-v3",
    "chinese-quiz-game-state-v4",
    "chinese-quiz-game-state-v5"
  ];
  const letters = ["A", "B", "C", "D", "E", "F"];
  const roleNames = {
    male: "阿沙",
    female: "鹿醬"
  };
  const sportThemes = {
    lesson7: {
      sport: "籃球",
      icon: "🏀",
      quotaIconClass: "basketball-hoop",
      venue: "校園籃球場",
      action: "投籃",
      correct: "漂亮命中，這球進了。",
      wrong: "這球偏了一點，看看教練提示再調整。"
    },
    lesson8: {
      sport: "棒球",
      icon: "⚾",
      quotaIconClass: "baseball-bat",
      venue: "棒球打擊區",
      action: "揮棒",
      correct: "擊出安打，跑者向前推進。",
      wrong: "這次揮空了，讀完解析再站上打擊區。"
    },
    lesson9: {
      sport: "羽球",
      icon: "🏸",
      quotaIconClass: "badminton-racket",
      venue: "羽球館",
      action: "殺球",
      correct: "殺球成功，節奏掌握得很好。",
      wrong: "這球被接住了，先看清楚落點。"
    },
    lesson10: {
      sport: "田徑",
      icon: "🏃",
      quotaIconClass: "starter-pistol",
      venue: "操場跑道",
      action: "衝刺",
      correct: "向終點推進一大步。",
      wrong: "步伐亂了一下，調整呼吸再出發。"
    },
    self3: {
      sport: "排球",
      icon: "🏐",
      quotaIconClass: "volleyball-net",
      venue: "排球場",
      action: "扣殺",
      correct: "扣殺得分，團隊氣勢起來了。",
      wrong: "這球被攔下，回看提示再組織下一波。"
    },
    review: {
      sport: "足球",
      icon: "⚽",
      quotaIcon: "🥅",
      venue: "足球場",
      action: "射門",
      correct: "射門得分，漂亮進球。",
      wrong: "球擦柱而出，讀完解析再補上一腳。"
    },
    final: {
      sport: "魔王拳擊",
      icon: "🏆",
      quotaIcon: "🥊",
      venue: "魔王拳擊擂台",
      action: "魔王對戰",
      correct: "正拳命中，魔王的防線開始動搖。",
      wrong: "這一拳被擋下了，讀完解析再找破綻。"
    }
  };
  const mapSpots = {
    lesson7: { x: 62, y: 63 },
    lesson8: { x: 42, y: 20 },
    lesson9: { x: 79, y: 50 },
    lesson10: { x: 48, y: 51 },
    self3: { x: 20, y: 67 },
    review: { x: 35, y: 64 },
    final: { x: 82, y: 21 }
  };
  const levelBackgrounds = {
    lesson7: "assets/level-bg/lesson7-basketball.jpg",
    lesson8: "assets/level-bg/lesson8-baseball.jpg",
    lesson9: "assets/level-bg/lesson9-badminton.jpg",
    lesson10: "assets/level-bg/lesson10-track.jpg",
    self3: "assets/level-bg/self3-volleyball.jpg",
    review: "assets/level-bg/review-soccer-new.png",
    final: "assets/level-bg/final-boss-boxing.png"
  };
  const finalDefeatScreens = {
    male: "assets/reactions/boss/asha-boss-defeat-screen.png",
    female: "assets/reactions/boss/lujiang-boss-defeat-screen.png"
  };
  const introVideos = {
    male: "assets/intro/asha-intro.mp4",
    female: "assets/intro/lujiang-intro.mp4"
  };
  const finalClearVideos = {
    male: "assets/final-clear/asha-clear.mp4",
    female: "assets/final-clear/lujiang-clear.mp4"
  };
  const sportResultSounds = {
    lesson7: {
      correct: "assets/audio/sports/basketball-correct.wav",
      wrong: "assets/audio/sports/basketball-wrong.wav"
    },
    lesson8: {
      correct: "assets/audio/sports/baseball-correct.wav",
      wrong: "assets/audio/sports/baseball-wrong.wav"
    },
    lesson9: {
      correct: "assets/audio/sports/badminton-correct.wav",
      wrong: "assets/audio/sports/badminton-wrong.wav"
    },
    lesson10: {
      correct: "assets/audio/sports/track-correct.wav",
      wrong: "assets/audio/sports/track-wrong.wav"
    },
    self3: {
      correct: "assets/audio/sports/volleyball-correct.wav",
      wrong: "assets/audio/sports/volleyball-wrong.wav"
    },
    review: {
      correct: "assets/audio/sports/soccer-correct.wav",
      wrong: "assets/audio/sports/soccer-wrong.wav"
    }
  };
  const finalVictoryImages = {
    male: "assets/final-clear/asha-defeated-boss.png",
    female: "assets/final-clear/lujiang-defeated-boss.png"
  };
  const certificateImages = {
    male: "assets/complete/asha-final-card-transparent.png",
    female: "assets/complete/lujiang-final-card-transparent.png"
  };
  const bossIntroVideo = "assets/boss-intro/boss-entrance.mp4";

  const reactionImages = {
    lesson7: {
      male: {
        ready: "assets/reactions/basketball/asha-basketball-ready.png",
        correct: "assets/reactions/basketball/asha-basketball-correct-v2.png",
        wrong: "assets/reactions/basketball/asha-basketball-wrong.png"
      },
      female: {
        ready: "assets/reactions/basketball/lujiang-basketball-ready.png",
        correct: "assets/reactions/basketball/lujiang-basketball-correct.png",
        wrong: "assets/reactions/basketball/lujiang-basketball-wrong.png"
      }
    },
    lesson8: {
      male: {
        ready: "assets/reactions/baseball/asha-baseball-ready.png",
        correct: "assets/reactions/baseball/asha-baseball-correct.png",
        wrong: "assets/reactions/baseball/asha-baseball-wrong.png"
      },
      female: {
        ready: "assets/reactions/baseball/lujiang-baseball-ready.png",
        correct: "assets/reactions/baseball/lujiang-baseball-correct.png",
        wrong: "assets/reactions/baseball/lujiang-baseball-wrong.png"
      }
    },
    lesson9: {
      male: {
        ready: "assets/reactions/badminton/asha-badminton-ready.png",
        correct: "assets/reactions/badminton/asha-badminton-correct.png",
        wrong: "assets/reactions/badminton/asha-badminton-wrong.png"
      },
      female: {
        ready: "assets/reactions/badminton/lujiang-badminton-ready.png",
        correct: "assets/reactions/badminton/lujiang-badminton-correct.png",
        wrong: "assets/reactions/badminton/lujiang-badminton-wrong.png"
      }
    },
    lesson10: {
      male: {
        ready: "assets/reactions/track/asha-track-ready.png",
        correct: "assets/reactions/track/asha-track-correct.png",
        wrong: "assets/reactions/track/asha-track-wrong.png"
      },
      female: {
        ready: "assets/reactions/track/lujiang-track-ready.png",
        correct: "assets/reactions/track/lujiang-track-correct.png",
        wrong: "assets/reactions/track/lujiang-track-wrong.png"
      }
    },
    self3: {
      male: {
        ready: "assets/reactions/volleyball/asha-volleyball-ready.png",
        correct: "assets/reactions/volleyball/asha-volleyball-correct.png",
        wrong: "assets/reactions/volleyball/asha-volleyball-wrong.png"
      },
      female: {
        ready: "assets/reactions/volleyball/lujiang-volleyball-ready.png",
        correct: "assets/reactions/volleyball/lujiang-volleyball-correct.png",
        wrong: "assets/reactions/volleyball/lujiang-volleyball-wrong.png"
      }
    },
    review: {
      male: {
        ready: "assets/reactions/soccer/asha-soccer-ready.png",
        correct: "assets/reactions/soccer/asha-soccer-correct.png",
        wrong: "assets/reactions/soccer/asha-soccer-wrong.png"
      },
      female: {
        ready: "assets/reactions/soccer/lujiang-soccer-ready.png",
        correct: "assets/reactions/soccer/lujiang-soccer-correct.png",
        wrong: "assets/reactions/soccer/lujiang-soccer-wrong.png"
      }
    },
    final: {
      male: {
        ready: "assets/reactions/boss/asha-boss-ready.png",
        correct: [
          "assets/reactions/boss/asha-boss-correct-new-1.png",
          "assets/reactions/boss/asha-boss-correct-new-2.png",
          "assets/reactions/boss/asha-boss-correct-new-3.png",
          "assets/reactions/boss/asha-boss-correct-new-4.png",
          "assets/reactions/boss/asha-boss-correct-new-5.png",
          "assets/reactions/boss/asha-boss-correct-new-6.png",
          "assets/reactions/boss/asha-boss-correct-new-7.png",
          "assets/reactions/boss/asha-boss-correct-new-8.png",
          "assets/reactions/boss/asha-boss-correct-new-9.png",
          "assets/reactions/boss/asha-boss-correct-new-10.png"
        ],
        wrong: "assets/reactions/boss/asha-boss-wrong.png"
      },
      female: {
        ready: "assets/reactions/boss/lujiang-boss-ready.png",
        correct: [
          "assets/reactions/boss/lujiang-boss-correct-new-1.png",
          "assets/reactions/boss/lujiang-boss-correct-new-2.png",
          "assets/reactions/boss/lujiang-boss-correct-new-3.png",
          "assets/reactions/boss/lujiang-boss-correct-new-4.png",
          "assets/reactions/boss/lujiang-boss-correct-new-5.png",
          "assets/reactions/boss/lujiang-boss-correct-new-6.png",
          "assets/reactions/boss/lujiang-boss-correct-new-7.png",
          "assets/reactions/boss/lujiang-boss-correct-new-8.png",
          "assets/reactions/boss/lujiang-boss-correct-new-9.png",
          "assets/reactions/boss/lujiang-boss-correct-new-10.png"
        ],
        wrong: "assets/reactions/boss/lujiang-boss-wrong.png"
      }
    }
  };

  const app = document.querySelector("#app");
  const state = loadState();
  let audioContext = null;
  let backgroundMusic = null;
  let backgroundMusicTrack = "";
  let backgroundMusicVolume = 0.24;
  let introTransitioning = false;
  let mistakesReturnView = null;

  function defaultState() {
    return {
      name: "",
      role: "male",
      completedAt: "",
      musicMuted: false,
      scores: {},
      records: {},
      attempts: {},
      latestResults: {},
      mistakes: {},
      pendingResult: null,
      finalRetryUnlocked: false,
      current: null
    };
  }

  function loadState() {
    try {
      OLD_STORAGE_KEYS.forEach((key) => localStorage.removeItem(key));
      return { ...defaultState(), ...(JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}) };
    } catch (error) {
      return defaultState();
    }
  }

  function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function getAudioContext() {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return null;
    if (!audioContext) audioContext = new AudioContextClass();
    if (audioContext.state === "suspended") audioContext.resume();
    return audioContext;
  }

  function playBackgroundMusic(src, volume = 0.24) {
    if (!backgroundMusic) {
      backgroundMusic = new Audio();
      backgroundMusic.loop = true;
      backgroundMusic.preload = "auto";
    }
    if (backgroundMusicTrack !== src) {
      backgroundMusic.pause();
      backgroundMusic.src = src;
      backgroundMusic.currentTime = 0;
      backgroundMusicTrack = src;
    }
    backgroundMusicVolume = volume;
    backgroundMusic.volume = state.musicMuted ? 0 : volume;
    if (state.musicMuted || !backgroundMusic.paused) return;
    backgroundMusic.play().catch(() => {});
  }

  function startBackgroundMusic() {
    playBackgroundMusic("assets/audio/shalu-zanchang-main-theme.mp3", 0.24);
  }

  function startCertificateMusic() {
    playBackgroundMusic("assets/audio/shalu-certificate-theme.mp3", 0.28);
  }

  function startQuizMusic() {
    playBackgroundMusic("assets/audio/shalu-zanchang-main-theme.mp3", 0.1);
  }

  function startBossMusic() {
    playBackgroundMusic("assets/audio/boss-battle-theme.mp3", 0.24);
  }

  function startDefeatMusic() {
    playBackgroundMusic("assets/audio/boss-defeat-theme.mp3", 0.3);
  }

  function pauseBackgroundMusic() {
    if (backgroundMusic) backgroundMusic.pause();
  }

  function updateMusicVolume() {
    if (backgroundMusic) backgroundMusic.volume = state.musicMuted ? 0 : backgroundMusicVolume;
  }

  function toggleMute() {
    state.musicMuted = !state.musicMuted;
    saveState();
    updateMusicVolume();
    if (!state.musicMuted && backgroundMusic && backgroundMusicTrack && backgroundMusic.paused) {
      backgroundMusic.play().catch(() => {});
    }
    syncTopbarState();
  }

  function playEffect(src, volume = 0.68) {
    if (!window.Audio) return;
    const effect = new Audio(src);
    effect.volume = volume;
    effect.play().catch(() => {});
  }

  function playBoxingHitSound() {
    playEffect("assets/audio/boxing-hit.mp3", 0.72);
  }

  function playSportResultSound(levelId, correct) {
    const sound = sportResultSounds[levelId]?.[correct ? "correct" : "wrong"];
    if (sound) playEffect(sound, 1);
  }

  function playFinalStrikeSequenceSounds() {
    Array.from({ length: 10 }, (_, index) => {
      window.setTimeout(playBoxingHitSound, index * 300);
    });
  }

  function playTone({ frequency, startTime, duration, type = "sine", volume = 0.08 }) {
    const context = getAudioContext();
    if (!context) return;

    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, startTime);
    gain.gain.setValueAtTime(0.0001, startTime);
    gain.gain.exponentialRampToValueAtTime(volume, startTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);
    oscillator.connect(gain).connect(context.destination);
    oscillator.start(startTime);
    oscillator.stop(startTime + duration + 0.03);
  }

  function playRoleSelectSound() {
    const context = getAudioContext();
    if (!context) return;
    const now = context.currentTime;
    playTone({ frequency: 660, startTime: now, duration: 0.08, type: "triangle", volume: 0.07 });
    playTone({ frequency: 880, startTime: now + 0.08, duration: 0.1, type: "triangle", volume: 0.08 });
  }

  function playChallengeStartSound() {
    const context = getAudioContext();
    if (!context) return;
    const now = context.currentTime;
    playTone({ frequency: 196, startTime: now, duration: 0.12, type: "sawtooth", volume: 0.05 });
    playTone({ frequency: 294, startTime: now + 0.09, duration: 0.12, type: "sawtooth", volume: 0.055 });
    playTone({ frequency: 392, startTime: now + 0.18, duration: 0.16, type: "sawtooth", volume: 0.06 });
    playTone({ frequency: 784, startTime: now + 0.3, duration: 0.18, type: "triangle", volume: 0.08 });
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function getLessons() {
    return data.lessons;
  }

  function shuffle(items) {
    const copied = [...items];
    for (let index = copied.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(Math.random() * (index + 1));
      [copied[index], copied[swapIndex]] = [copied[swapIndex], copied[index]];
    }
    return copied;
  }

  function buildFinalQuestions() {
    const bySource = new Map();
    getLessons().forEach((lesson) => {
      filterPlayableQuestions(lesson.questions).forEach((question) => {
        const source = question.source || lesson.subtitle;
        if (!bySource.has(source)) bySource.set(source, []);
        bySource.get(source).push({ ...question, sourceTitle: lesson.subtitle });
      });
    });

    return shuffle([...bySource.entries()].map(([source, questions]) => {
      const picked = questions[Math.floor(Math.random() * questions.length)];
      return { ...picked, id: `final-${picked.id}`, source };
    })).slice(0, 10);
  }

  function getLevelById(levelId) {
    if (levelId === "final") {
      return {
        id: "final",
        title: "最終挑戰",
        subtitle: "魔王綜合拳擊戰",
        description: "從六關共十二張考卷中抽出 10 題，每張考卷最多 1 題，必須全對才算過關。",
        questions: buildFinalQuestions()
      };
    }
    return getLessons().find((lesson) => lesson.id === levelId);
  }

  function pickQuestions(level) {
    const questions = filterPlayableQuestions(level.questions);
    return level.id === "final" ? questions : shuffle(questions).slice(0, 15);
  }

  function filterPlayableQuestions(questions) {
    return questions.filter((question) => !requiresQuestionImage(question));
  }

  function requiresQuestionImage(question) {
    if (!question) return false;
    const imageFields = ["image", "imageUrl", "imageURL", "img", "figure", "figureUrl", "picture", "pictureUrl"];
    if (imageFields.some((field) => Boolean(question[field]))) return true;
    const text = [
      question.question,
      question.stem,
      question.prompt,
      question.passage,
      question.source
    ].filter(Boolean).join(" ");
    return /(看圖|下圖|上圖|左圖|右圖|圖中|附圖|圖片|照片|示意圖|依圖|如圖|根據圖|由圖)/.test(text);
  }

  function passCountFor(levelId) {
    return levelId === "final" ? 10 : 12;
  }

  function recordFor(levelId) {
    return state.records[levelId] || null;
  }

  function scoreFor(levelId) {
    return recordFor(levelId)?.score || state.scores[levelId] || 0;
  }

  function latestResultFor(levelId) {
    return state.latestResults?.[levelId] || recordFor(levelId) || null;
  }

  function hasPassed(levelId) {
    const record = recordFor(levelId);
    return Boolean(record && record.correct >= passCountFor(levelId));
  }

  function allLessonsPassed() {
    return getLessons().every((lesson) => hasPassed(lesson.id));
  }

  function canOpen(levelId) {
    return levelId === "final" ? allLessonsPassed() || state.finalRetryUnlocked || hasPassed("final") : Boolean(getLevelById(levelId));
  }

  function themeFor(levelId) {
    return sportThemes[levelId] || sportThemes.final;
  }

  function levelBackgroundFor(levelId) {
    return levelBackgrounds[levelId] || levelBackgrounds.final;
  }

  function roleImage(role = state.role) {
    return role === "female" ? "assets/athlete-female.png" : "assets/athlete-male-new.png";
  }

  function introVideoFor(role = state.role) {
    return introVideos[role] || introVideos.male;
  }

  function finalClearVideoFor(role = state.role) {
    return finalClearVideos[role] || finalClearVideos.male;
  }

  function finalVictoryImageFor(role = state.role) {
    return finalVictoryImages[role] || finalVictoryImages.male;
  }

  function certificateImageFor(role = state.role) {
    return certificateImages[role] || certificateImages.male;
  }

  function finalStrikeImagesFor(role = state.role) {
    const assets = reactionImages.final?.[role]?.correct || reactionImages.final?.male?.correct || [];
    return assets.slice(0, 10);
  }

  function reactionImageFor(levelId, status, sequenceIndex = 0) {
    const roleAssets = levelId === "final"
      ? (reactionImages.final?.[state.role] || reactionImages.final?.female)
      : reactionImages[levelId]?.[state.role];
    const asset = roleAssets?.[status];
    if (Array.isArray(asset)) {
      const index = Math.max(0, Math.min(sequenceIndex, asset.length - 1));
      return asset[index] || roleImage();
    }
    return asset || roleImage();
  }

  function finalDefeatScreenFor(role = state.role) {
    return finalDefeatScreens[role] || finalDefeatScreens.female;
  }

  function countCorrectAnswers(current) {
    if (!current) return 0;
    return current.questions.reduce((sum, question, index) => {
      if (!current.confirmed[index] || question.answer === null || question.answer === undefined) return sum;
      return sum + (current.answers[index] === question.answer ? 1 : 0);
    }, 0);
  }

  function renderBossHealth(current) {
    const hits = countCorrectAnswers(current);
    const remaining = Math.max(0, 10 - hits);
    const icons = Array.from({ length: 10 }, (_, index) => `
      <span class="boss-health-icon ${index >= 10 - hits ? "is-lost" : ""}" aria-hidden="true">♥</span>
    `).join("");

    return `
      <div class="boss-health" aria-label="魔王剩餘血量 ${remaining} 顆">
        <span class="boss-health-label">魔王血量</span>
        <span class="boss-health-icons">${icons}</span>
        <span class="boss-health-count">${remaining}/10</span>
      </div>
    `;
  }

  function formatSeconds(seconds) {
    if (!Number.isFinite(seconds)) return "0 秒";
    if (seconds < 60) return `${Math.round(seconds)} 秒`;
    return `${Math.floor(seconds / 60)} 分 ${Math.round(seconds % 60)} 秒`;
  }

  function calculateBattlePower(correct, total, avgSeconds, levelId) {
    const accuracy = correct / total;
    const speedBonus = Math.max(0, Math.min(1, (90 - avgSeconds) / 70));
    const base = Math.round(accuracy * 70 + speedBonus * 30);
    const perfectBonus = correct === total ? 5 : 0;
    const finalBonus = levelId === "final" && correct === total ? 10 : 0;
    return Math.min(115, base + perfectBonus + finalBonus);
  }

  function shouldReplaceRecord(oldRecord, nextRecord) {
    if (!oldRecord) return true;
    if (nextRecord.correct !== oldRecord.correct) return nextRecord.correct > oldRecord.correct;
    return nextRecord.battlePower > oldRecord.battlePower;
  }

  function focusApp() {
    syncTopbarState();
    app.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function syncTopbarState() {
    const mapButton = document.querySelector('.top-actions [data-action="map"]');
    const mistakesButton = document.querySelector('.top-actions [data-action="mistakes"]');
    const musicButton = document.querySelector('.top-actions [data-action="toggle-mute"]');
    const screen = app.firstElementChild;
    const isHomeLocked = Boolean(screen?.classList.contains("cover-screen") || screen?.classList.contains("hero"));
    const isMapScreen = Boolean(screen?.classList.contains("map-screen"));

    const isQuizActive = Boolean(state.current);
    if (mapButton) {
      mapButton.disabled = isHomeLocked;
      mapButton.classList.toggle("is-disabled", isHomeLocked);
      mapButton.title = isHomeLocked ? "開始挑戰後開放讚場地圖" : "讚場地圖";
      mapButton.setAttribute("aria-label", mapButton.title);
    }
    if (mistakesButton) {
      const lockMistakes = isHomeLocked || (isQuizActive && !isMapScreen);
      mistakesButton.disabled = lockMistakes;
      mistakesButton.classList.toggle("is-disabled", lockMistakes);
      mistakesButton.title = isHomeLocked ? "開始挑戰後開放錯題回顧" : lockMistakes ? "答題中不能查看錯題回顧" : "錯題回顧";
      mistakesButton.setAttribute("aria-label", mistakesButton.title);
    }
    if (musicButton) {
      musicButton.classList.toggle("is-muted", state.musicMuted);
      musicButton.title = state.musicMuted ? "取消靜音" : "音樂靜音";
      musicButton.setAttribute("aria-label", musicButton.title);
      musicButton.querySelector("span").textContent = state.musicMuted ? "♪̸" : "♪";
    }
  }

  function renderCover() {
    pauseBackgroundMusic();
    app.innerHTML = `
      <section class="cover-screen" aria-label="沙鹿讚場封面">
        <button class="cover-entry" type="button" data-action="enter-home" aria-label="點擊後進入讚場"></button>
      </section>
    `;
    focusApp();
  }

  function renderHome() {
    startBackgroundMusic();
    app.innerHTML = `
      <section class="hero hero-form" aria-label="輸入姓名與選擇角色">
        <form class="hero-panel" data-form="start">
          <div class="field-label form-step-heading role-heading">
            <span class="form-step-number">1</span>
            <span class="form-step-copy">
              <strong>選擇角色</strong>
            </span>
          </div>
          <div class="role-select" aria-label="選擇角色">
            <label class="role-card">
              <input type="radio" name="studentRole" value="male" ${state.role === "male" ? "checked" : ""}>
              <img class="role-portrait" src="assets/athlete-male-new.png" alt="" aria-hidden="true">
              <span>
                <strong>阿沙</strong>
              </span>
            </label>
            <label class="role-card">
              <input type="radio" name="studentRole" value="female" ${state.role === "female" ? "checked" : ""}>
              <img class="role-portrait" src="assets/athlete-female.png" alt="" aria-hidden="true">
              <span>
                <strong>鹿醬</strong>
              </span>
            </label>
          </div>
          <label class="field-label form-step-heading" for="student-name">
            <span class="form-step-number">2</span>
            <span class="form-step-copy">
              <strong>輸入姓名</strong>
            </span>
          </label>
          <input class="name-input" id="student-name" name="studentName" type="text" maxlength="24" autocomplete="name" value="${escapeHtml(state.name)}" required>
          <div class="button-row">
            <button class="primary-button" type="submit">開始挑戰</button>
          </div>
        </form>
      </section>
    `;
    focusApp();
  }

  function renderIntroVideo() {
    introTransitioning = false;
    pauseBackgroundMusic();
    const videoSrc = introVideoFor();
    app.innerHTML = `
      <section class="intro-screen" aria-label="開場動畫">
        <div class="intro-map-preview" aria-hidden="true">
          <img src="assets/campus-sports-map.png" alt="">
        </div>
        <video class="intro-video" src="${videoSrc}" autoplay playsinline data-intro-video></video>
        <button class="intro-skip-button" type="button" data-action="intro-skip">略過動畫</button>
      </section>
    `;

    setTimeout(() => {
      const video = app.querySelector?.("[data-intro-video]");
      if (!video) return;
      const playPromise = video.play?.();
      if (playPromise?.catch) {
        playPromise.catch(() => {
          video.setAttribute("controls", "");
        });
      }
    }, 0);
    focusApp();
  }

  function shouldPlayBossIntro(levelId, options = {}) {
    return levelId === "final"
      && !options.skipBossIntro
      && (!options.allowLocked || options.forceBossIntro)
      && !state.finalRetryUnlocked
      && !hasPassed("final");
  }

  function renderBossIntroVideo() {
    pauseBackgroundMusic();
    app.innerHTML = `
      <section class="boss-intro-screen" aria-label="魔王登場動畫">
        <video class="boss-intro-video" src="${bossIntroVideo}" autoplay playsinline data-boss-intro-video></video>
        <button class="intro-skip-button" type="button" data-action="boss-intro-skip">略過動畫</button>
      </section>
    `;

    setTimeout(() => {
      const video = app.querySelector?.("[data-boss-intro-video]");
      if (!video) return;
      const playPromise = video.play?.();
      if (playPromise?.catch) {
        playPromise.catch(() => {
          video.setAttribute("controls", "");
        });
      }
    }, 0);
    focusApp();
  }

  function renderBossIntroTransition() {
    const mapScreen = app.querySelector?.(".map-screen");
    if (!mapScreen) {
      renderBossIntroVideo();
      return;
    }

    mapScreen.classList.add("boss-intro-pending");
    if (!mapScreen.querySelector?.("[data-action='boss-intro-start']")) {
      mapScreen.insertAdjacentHTML("beforeend", `
        <button class="boss-intro-start-button" type="button" data-action="boss-intro-start">
          <span class="button-icon ring-icon" aria-hidden="true"></span>
          <span>迎接最終挑戰</span>
        </button>
      `);
    }
  }

  function enterBossAfterIntro() {
    startLevel("final", { allowLocked: true, skipBossIntro: true });
  }

  function enterMapFromIntro() {
    if (introTransitioning) return;
    introTransitioning = true;

    const intro = app.querySelector?.(".intro-screen");
    const video = app.querySelector?.("[data-intro-video]");
    video?.pause?.();

    if (!intro) {
      introTransitioning = false;
      renderMap({ entering: true });
      return;
    }

    intro.classList.add("is-leaving");
    setTimeout(() => {
      introTransitioning = false;
      renderMap({ entering: true });
    }, 760);
  }

  function renderMap({ entering = false } = {}) {
    startBackgroundMusic();
    const showFinal = allLessonsPassed() || state.finalRetryUnlocked || hasPassed("final");
    const finalRetryAvailable = state.finalRetryUnlocked && !hasPassed("final");
    const finalLevel = {
        id: "final",
        title: finalRetryAvailable ? "再次挑戰魔王" : "最終挑戰",
        subtitle: finalRetryAvailable ? "再次挑戰魔王" : "魔王綜合拳擊戰",
        retryAvailable: finalRetryAvailable,
        description: "完成六大關後解鎖。從 12 張考卷中抽 10 題，每張考卷最多 1 題，必須全對。"
      };
    const levels = showFinal ? [...getLessons(), finalLevel] : getLessons();

    app.innerHTML = `
      <section class="map-screen ${entering ? "map-entering" : ""}" aria-label="讚場地圖">
        <div class="campus-map-wrap">
          <div class="campus-map" role="list" aria-label="讚場地圖">
            <img class="campus-map-image" src="assets/campus-sports-map.png" alt="校園運動地圖">
            <div class="map-hud" aria-label="通關標準">
              <div class="map-hud-stats">
                <div><b>15</b><span>每場比賽題數</span></div>
                <div><b>12</b><span>正式晉級門檻</span></div>
              </div>
              <button class="map-power-help-button" type="button" data-action="open-power-help">
                <span aria-hidden="true">?</span>
                <span>讚力怎麼算？</span>
              </button>
            </div>
            <img class="campus-map-athlete role-${escapeHtml(state.role)}" src="${roleImage()}" alt="" aria-hidden="true">
            <div class="map-name-badge">${escapeHtml(state.name || "同學")}的讚場地圖</div>
            ${levels.map(renderMapMarker).join("")}
          </div>
        </div>
        <div class="map-power-help" data-power-help hidden>
          <button class="map-power-help-backdrop" type="button" data-action="close-power-help" aria-label="關閉讚力說明"></button>
          <section class="map-power-help-panel" role="dialog" aria-modal="true" aria-labelledby="power-help-title">
            <button class="map-power-help-close" type="button" data-action="close-power-help" title="關閉" aria-label="關閉">×</button>
            <div class="map-power-help-heading">
              <span class="map-power-help-icon" aria-hidden="true">讚</span>
              <h2 id="power-help-title">讚力怎麼算？</h2>
            </div>
            <ul>
              <li><strong>答對越多</strong>，讚力越高</li>
              <li><strong>作答越快</strong>，可獲得速度加分</li>
              <li><strong>全部答對</strong>，再加 5 點讚力</li>
              <li>重新挑戰時，會<strong>保留更好的紀錄</strong></li>
            </ul>
            <button class="primary-button" type="button" data-action="close-power-help">知道了</button>
          </section>
        </div>
      </section>
    `;
    focusApp();
  }

  function togglePowerHelp(show) {
    const help = app.querySelector?.("[data-power-help]");
    if (!help) return;
    help.hidden = !show;
    if (show) {
      help.querySelector?.('[data-action="close-power-help"].primary-button')?.focus();
    }
  }

  function renderMapMarker(level) {
    const locked = !canOpen(level.id);
    const passed = hasPassed(level.id);
    const theme = themeFor(level.id);
    const spot = mapSpots[level.id] || { x: 50, y: 50 };
    const retryingFinal = level.id === "final" && level.retryAvailable && !passed;
    const latest = latestResultFor(level.id);
    const showLatest = level.id !== "final" && latest;
    const status = locked ? "鎖定" : passed ? "完成" : showLatest ? "再加油" : retryingFinal ? "再次挑戰" : "挑戰";
    const latestText = showLatest
      ? passed
        ? `${latest.correct}/${latest.total}題`
        : `${latest.correct}/${latest.total}題`
      : "";

    return `
      <button
        class="map-marker ${passed ? "passed" : ""} ${locked ? "locked" : ""} ${retryingFinal ? "retry-final" : ""}"
        type="button"
        role="listitem"
        data-action="start-level"
        data-level="${escapeHtml(level.id)}"
        style="left:${spot.x}%; top:${spot.y}%"
        ${locked ? "disabled" : ""}
      >
        <span class="marker-title">${escapeHtml(level.subtitle)}</span>
        <span class="marker-sport">
          <span class="marker-icon" aria-hidden="true">${escapeHtml(theme.icon)}</span>
          <span>${escapeHtml(theme.sport)}</span>
        </span>
        ${level.id === "final" && !retryingFinal ? `<span class="marker-note">破關標準：10 題全對</span>` : ""}
        <span class="marker-status-row">
          <span class="marker-status">${status}</span>
          ${latestText ? `<span class="marker-score ${passed ? "passed-score" : "retry-score"}">${escapeHtml(latestText)}</span>` : ""}
        </span>
      </button>
    `;
  }

  function renderLevelCard(level) {
    const locked = !canOpen(level.id);
    const passed = hasPassed(level.id);
    const record = recordFor(level.id);
    const theme = themeFor(level.id);
    const total = level.id === "final" ? 10 : 15;
    const badge = locked
      ? '<span class="badge lock">尚未解鎖</span>'
      : passed
        ? '<span class="badge pass">正式完成</span>'
        : '<span class="badge">可挑戰</span>';

    return `
      <article class="level-card ${locked ? "locked" : ""}">
        <div class="level-kicker">${escapeHtml(theme.venue)}</div>
        <h2>${escapeHtml(level.subtitle)}</h2>
        <p><strong>${escapeHtml(theme.sport)}挑戰：</strong>${escapeHtml(level.description)}</p>
        <p class="answer-line"><strong>最佳紀錄：</strong>${record ? `${record.correct}/${record.total}，讚力 ${record.battlePower}` : `尚未正式完成，門檻 ${passCountFor(level.id)}/${total}`}</p>
        <div class="button-row">
          ${badge}
          <button class="${locked ? "secondary-button" : "primary-button"}" type="button" data-action="start-level" data-level="${escapeHtml(level.id)}" ${locked ? "disabled" : ""}>${passed ? "再次挑戰" : "開始"}</button>
        </div>
      </article>
    `;
  }

  function startLevel(levelId, options = {}) {
    const level = getLevelById(levelId);
    if (!level || (!options.allowLocked && !canOpen(levelId))) {
      renderMap();
      return;
    }

    if (shouldPlayBossIntro(levelId, options)) {
      renderBossIntroTransition();
      return;
    }

    if (levelId === "final") {
      startBossMusic();
    } else {
      startQuizMusic();
    }

    startGasLevel({
      levelId,
      levelTitle: level.title,
      levelSubtitle: level.subtitle,
      count: levelId === "final" ? 10 : 15
    });
  }

  async function startGasLevel({ levelId, levelTitle, levelSubtitle, count }) {
    app.style.setProperty("--level-bg", `url('${levelBackgroundFor(levelId)}')`);
    const loadingContent = levelId === "final"
      ? `
          <h1 class="screen-title">魔王綜合拳擊戰</h1>
          <p class="screen-lead">魔王登場中</p>
        `
      : `
          <p class="level-kicker">${escapeHtml(levelSubtitle)}</p>
          <h1 class="screen-title">${escapeHtml(levelSubtitle)}</h1>
          <p class="screen-lead">挑戰準備中</p>
        `;
    app.innerHTML = `
      <section class="quiz-stage" style="--level-bg: url('${levelBackgroundFor(levelId)}')">
        <div class="quiz-panel loading-panel">
          ${loadingContent}
        </div>
      </section>
    `;
    focusApp();

    try {
      const requestCount = levelId === "final" ? Math.max(count, 20) : Math.max(count, 30);
      const url = `${GAS_API_URL}?action=getQuestions&levelId=${encodeURIComponent(levelId)}&count=${requestCount}`;
      const response = await fetch(url);
      const payload = await response.json();

      if (!payload.ok) {
        throw new Error(payload.error || "GAS 題目載入失敗");
      }

      const questions = filterPlayableQuestions(payload.questions).slice(0, count).map((question) => ({
        ...question,
        source: question.paperName,
        answer: null,
        explanation: ""
      }));
      const now = Date.now();

      state.current = {
        levelId,
        levelTitle,
        levelSubtitle,
        sourceMode: "gas",
        sportTheme: themeFor(levelId),
        questions,
        index: 0,
        selected: null,
        answers: Array(questions.length).fill(null),
        confirmed: Array(questions.length).fill(false),
        questionTimes: Array(questions.length).fill(0),
        questionStartedAt: now,
        finalStrikeReady: false,
        finalStrikeSoundsPlayed: false
      };
      state.pendingResult = null;
      saveState();
      renderQuestion();
    } catch (error) {
      app.innerHTML = `
        <section class="result-panel">
          <h1 class="screen-title">關卡載入失敗</h1>
          <p class="screen-lead">${escapeHtml(error.message)}</p>
          <div class="button-row">
            <button class="primary-button" type="button" data-action="start-level" data-level="${escapeHtml(levelId)}">重新載入關卡</button>
            <button class="secondary-button" type="button" data-action="map">回地圖</button>
          </div>
        </section>
      `;
      focusApp();
    }
  }

  function renderSportProgress(current) {
    if (!current || current.levelId === "final") return "";
    const theme = current.sportTheme || themeFor(current.levelId);
    const correctCount = countCorrectAnswers(current);
    const total = current.questions.length;
    const pulseIndex = current.correctPulseIndex;
    const icons = Array.from({ length: total }, (_, index) => `
      <span class="sport-progress-icon ${index < correctCount ? "is-lit" : ""} ${index === pulseIndex ? "is-just-lit" : ""}" aria-hidden="true">${escapeHtml(theme.icon)}</span>
    `).join("");

    return `
      <div class="sport-progress" aria-label="答對進度 ${correctCount}/${total}">
        <span class="sport-progress-label">答對進度</span>
        <span class="sport-progress-icons">${icons}</span>
        <span class="sport-progress-count">${correctCount}/${total}</span>
      </div>
    `;
  }

  function renderAnswerQuota(current) {
    if (!current || current.levelId === "final") return "";
    const theme = current.sportTheme || themeFor(current.levelId);
    const quotaIcon = theme.quotaIcon || theme.icon;
    const quotaIconClass = theme.quotaIconClass || "";
    const icons = Array.from({ length: current.questions.length }, (_, index) => `
      <span class="answer-quota-icon ${quotaIconClass ? `quota-${quotaIconClass}` : ""} ${current.confirmed[index] ? "is-used" : ""}" aria-hidden="true">${quotaIconClass ? "" : escapeHtml(quotaIcon)}</span>
    `).join("");

    return `
      <div class="answer-quota" aria-label="剩餘作答題數">
        <span class="answer-quota-label">剩餘題數</span>
        <span class="answer-quota-icons">${icons}</span>
      </div>
    `;
  }

  function renderQuestion(options = {}) {
    const current = state.current;
    if (!current) {
      renderMap();
      return;
    }

    const question = current.questions[current.index];
    const theme = current.sportTheme || themeFor(current.levelId);
    const confirmed = current.confirmed[current.index];
    const selected = confirmed ? current.answers[current.index] : current.selected;
    const checking = Boolean(current.checking);
    const correct = confirmed && current.answers[current.index] === question.answer;
    const finalWrong = current.levelId === "final" && confirmed && !correct;
    const actionText = current.levelId === "final"
      ? `${roleNames[state.role] || roleNames.male}正在與魔王對戰`
      : `${roleNames[state.role] || roleNames.male}正在進行${theme.action}`;
    const bossHealth = current.levelId === "final" ? renderBossHealth(current) : "";
    const sportProgress = renderSportProgress(current);
    const answerQuota = renderAnswerQuota(current);
    const secondaryControl = finalWrong
      ? ""
      : '<button class="secondary-button" type="button" data-action="map">離開</button>';
    const finalComboReady = current.levelId === "final"
      && confirmed
      && correct
      && current.index === current.questions.length - 1
      && countCorrectAnswers(current) >= 10;
    const finalPerfectStrike = finalComboReady && current.finalStrikeReady;
    const sportStatus = current.levelId === "final"
      ? ""
      : `
            <div class="sport-status">
              <span class="sport-chip">${escapeHtml(theme.venue)}</span>
              <strong>${escapeHtml(actionText)}</strong>
            </div>`;
    const isFinalLastCorrect = finalComboReady && !current.finalStrikeReady;
    const confirmedButton = finalWrong
      ? '<button class="primary-button" type="button" data-action="final-show-defeat">看完錯題解析</button>'
      : `<button class="primary-button ${isFinalLastCorrect ? "final-combo-button" : ""}" type="button" data-action="${isFinalLastCorrect ? "show-final-strike" : current.index === current.questions.length - 1 ? "submit" : "next"}">${isFinalLastCorrect ? "使出連續重拳" : current.index === current.questions.length - 1 ? "查看結果" : "我看完了，下一題"}</button>`;
    const finalStrikeOverlay = finalPerfectStrike
      ? `
        <div class="final-strike-overlay" aria-label="最後一擊">
          <div class="final-strike-ring" aria-hidden="true">
            ${finalStrikeImagesFor().map((src, index) => `
              <img class="final-strike-image final-strike-image-${index + 1}" src="${src}" alt="" style="--strike-index: ${index};">
            `).join("")}
          </div>
          <button class="final-strike-button" type="button" data-action="final-strike">
            <span class="button-icon glove-icon" aria-hidden="true"></span>
            <span>最後一擊</span>
          </button>
        </div>`
      : "";
    app.style.setProperty("--level-bg", `url('${levelBackgroundFor(current.levelId)}')`);

    app.innerHTML = `
      <section class="quiz-stage" style="--level-bg: url('${levelBackgroundFor(current.levelId)}')">
        <div class="quiz-layout">
          <div class="quiz-panel" aria-labelledby="question-title">
            <div class="quiz-meta">
              <span>${escapeHtml(theme.sport)}｜${escapeHtml(current.levelSubtitle)}</span>
              <span>第 ${current.index + 1} 題 / 共 ${current.questions.length} 題</span>
            </div>
            ${answerQuota}
            ${bossHealth}
            ${sportProgress}
            ${sportStatus}
            <h1 class="question-text" id="question-title">${escapeHtml(question.question)}</h1>
            <div class="choices" role="list">
              ${question.options.map((option, index) => renderChoice(question, index, option, selected, confirmed)).join("")}
            </div>
            <div class="quiz-controls">
              ${secondaryControl}
              <div class="button-row">
                ${confirmed && current.levelId === "final"
                  ? confirmedButton
                  : `<button class="primary-button" type="button" data-action="confirm-answer" ${selected === null || checking || confirmed ? "disabled" : ""}>${checking ? "檢查中..." : "確認作答"}</button>`}
              </div>
            </div>
          </div>
          ${renderReactionPanel(question, selected, confirmed, correct, theme, { checking, confirmedButton })}
        </div>
        ${finalStrikeOverlay}
      </section>
    `;
    if (options.scrollToTop) {
      syncTopbarState();
      app.focus({ preventScroll: true });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (options.preserveScroll) {
      syncTopbarState();
      app.focus({ preventScroll: true });
    } else {
      focusApp();
    }
    if (finalPerfectStrike && !current.finalStrikeSoundsPlayed) {
      current.finalStrikeSoundsPlayed = true;
      saveState();
      playFinalStrikeSequenceSounds();
    }
  }

  function renderChoice(question, index, option, selected, confirmed) {
    const classes = ["choice-button"];
    if (selected === index) classes.push("selected");
    if (confirmed && question.answer === index) classes.push("choice-correct");
    if (confirmed && selected === index && question.answer !== index) classes.push("choice-wrong");

    return `
      <button class="${classes.join(" ")}" type="button" data-action="choose" data-choice="${index}" ${confirmed ? "disabled" : ""}>
        <span class="choice-letter">${letters[index]}</span>
        <span>${escapeHtml(option)}</span>
      </button>
    `;
  }

  function renderFeedback(question, studentAnswer, correct) {
    const current = state.current;
    const theme = current?.sportTheme || themeFor(current?.levelId || "final");
    return `
      <section class="feedback-panel ${correct ? "correct-panel" : "wrong-panel"}" aria-live="polite">
        <h2>${correct ? "答對了" : "答錯了"}</h2>
        <p class="sport-feedback"><strong>${escapeHtml(correct ? theme.correct : theme.wrong)}</strong></p>
        <p><strong>你的答案：</strong>${formatAnswer(question, studentAnswer)}</p>
        <p><strong>正確答案：</strong>${formatAnswer(question, question.answer)}</p>
        <p><strong>講解：</strong>${escapeHtml(question.explanation || "這題目前沒有解析，請回到課文與選項重新比對。")}</p>
      </section>
    `;
  }

  function renderReactionPanel(question, studentAnswer, confirmed, correct, theme, options = {}) {
    const current = state.current;
    const levelId = current?.levelId || "final";
    const checking = Boolean(options.checking);
    const reactionStatus = !confirmed ? "ready" : correct ? "correct" : "wrong";
    const sequenceIndex = levelId === "final" && correct ? countCorrectAnswers(current) - 1 : 0;
    const reactionImage = reactionImageFor(levelId, reactionStatus, sequenceIndex);

    if (checking && levelId !== "final") {
      return `
        <aside class="reaction-panel checking-reaction checking-${escapeHtml(levelId)}" aria-live="polite">
          <div class="checking-card">
            <strong>檢查中...</strong>
          </div>
        </aside>
      `;
    }

    if (!confirmed) {
      const readyTitle = levelId === "final" ? "準備出拳" : levelId === "lesson7" ? "角色正在準備灌籃" : "準備挑戰";
      const reactionKicker = levelId === "final" ? "" : `<p class="reaction-kicker">${escapeHtml(theme.venue)}</p>`;
      const bossWarning = levelId === "final" ? '<p class="boss-warning-text">小心作答，魔王一拳就 KO 你</p>' : "";
      return `
        <aside class="reaction-panel idle-reaction" aria-label="角色狀態">
          <div class="reaction-card ${levelId === "final" ? "boss-ready-card" : ""}">
            ${reactionKicker}
            <h2>${escapeHtml(readyTitle)}</h2>
            <p>${escapeHtml(state.name || "同學")}，選好答案後按下確認作答。</p>
            ${bossWarning}
          </div>
          <img class="reaction-athlete ${levelId === "final" ? "boss-reaction-athlete" : ""}" src="${reactionImage}" alt="" aria-hidden="true">
        </aside>
      `;
    }

    return `
      <aside class="reaction-panel ${correct ? "correct-reaction" : "wrong-reaction"} ${levelId === "final" ? "" : "has-next-action"}" aria-live="polite">
        <section class="feedback-panel ${correct ? "correct-panel" : "wrong-panel"}">
          <h2>${correct ? "答對了" : "答錯了"}</h2>
          <p class="sport-feedback"><strong>${escapeHtml(correct ? theme.correct : theme.wrong)}</strong></p>
          <p><strong>你的答案：</strong>${formatAnswer(question, studentAnswer)}</p>
          <p><strong>正確答案：</strong>${formatAnswer(question, question.answer)}</p>
          <p><strong>講解：</strong>${escapeHtml(question.explanation || "這題目前沒有解析，請回到課文與選項重新比對。")}</p>
        </section>
        ${levelId === "final" ? "" : `<div class="reaction-next-action">${options.confirmedButton || ""}</div>`}
        <img class="reaction-athlete ${levelId === "final" ? "boss-reaction-athlete" : ""}" src="${reactionImage}" alt="" aria-hidden="true">
      </aside>
    `;
  }

  function updateMistakeForAnswer(current, question, studentAnswer) {
    if (studentAnswer !== question.answer) {
      state.mistakes[question.id] = {
        levelId: current.levelId,
        levelTitle: current.levelSubtitle,
        question,
        studentAnswer
      };
    } else {
      delete state.mistakes[question.id];
    }
  }

  async function confirmAnswer() {
    const current = state.current;
    if (!current || current.selected === null || current.confirmed[current.index] || current.checking) return;

    const now = Date.now();
    const question = current.questions[current.index];

    if (current.sourceMode === "gas" && question.answer === null) {
      try {
        current.checking = true;
        saveState();
        renderQuestion(current.levelId === "final" ? { preserveScroll: true } : { scrollToTop: true });

        const answerLetter = letters[current.selected];
        const url = `${GAS_API_URL}?action=checkAnswer&id=${encodeURIComponent(question.id)}&answer=${encodeURIComponent(answerLetter)}`;
        const response = await fetch(url);
        const payload = await response.json();

        if (!payload.ok) {
          throw new Error(payload.error || "GAS 答案查核失敗");
        }

        question.answer = Number(payload.answerIndex);
        question.explanation = payload.explanation || "";
        current.checking = false;
      } catch (error) {
        current.checking = false;
        saveState();
        app.innerHTML = `
          <section class="result-panel">
            <h1 class="screen-title">答案查核失敗</h1>
            <p class="screen-lead">${escapeHtml(error.message)}</p>
            <div class="button-row">
              <button class="primary-button" type="button" data-action="resume-current">回到正在作答</button>
              <button class="secondary-button" type="button" data-action="map">回地圖</button>
            </div>
          </section>
        `;
        focusApp();
        return;
      }
    }

    current.answers[current.index] = current.selected;
    current.confirmed[current.index] = true;
    current.questionTimes[current.index] += Math.max(1, Math.round((now - current.questionStartedAt) / 1000));
    updateMistakeForAnswer(current, question, current.selected);
    current.correctPulseIndex = current.selected === question.answer ? countCorrectAnswers(current) - 1 : null;
    if (current.levelId === "final" && current.selected === question.answer) {
      playBoxingHitSound();
    } else if (current.levelId === "final") {
      playBoxingHitSound();
    } else if (current.levelId !== "final") {
      playSportResultSound(current.levelId, current.selected === question.answer);
    }
    if (current.levelId === "final" && current.selected !== question.answer) {
      state.finalRetryUnlocked = true;
    }
    saveState();
    renderQuestion(current.levelId === "final" ? { preserveScroll: true } : { scrollToTop: true });
  }

  function showFinalStrike() {
    const current = state.current;
    if (!current || current.levelId !== "final") return;
    const allAnswered = current.confirmed.every(Boolean);
    if (!allAnswered || countCorrectAnswers(current) < 10) return;
    current.finalStrikeReady = true;
    current.finalStrikeSoundsPlayed = false;
    saveState();
    renderQuestion();
  }

  function renderFinalDefeatScreen() {
    const current = state.current;
    if (!current || current.levelId !== "final") {
      renderMap();
      return;
    }

    startDefeatMusic();
    const defeatImage = finalDefeatScreenFor();
    app.style.setProperty("--final-defeat-bg", `url('${defeatImage}')`);
    app.innerHTML = `
      <section class="final-defeat-screen" aria-label="魔王關挑戰失敗">
        <img class="final-defeat-image" src="${defeatImage}" alt="" aria-hidden="true">
        <button class="final-defeat-retry-button" type="button" data-action="final-defeat-retry">重新挑戰魔王</button>
      </section>
    `;
    focusApp();
  }

  function renderFinalClearVideo() {
    pauseBackgroundMusic();
    const videoSrc = finalClearVideoFor();
    app.innerHTML = `
      <section class="final-clear-screen" aria-label="魔王關破關動畫">
        <video class="final-clear-video" src="${videoSrc}" autoplay playsinline data-final-clear-video></video>
      </section>
    `;

    setTimeout(() => {
      const video = app.querySelector?.("[data-final-clear-video]");
      if (!video) return;
      const playPromise = video.play?.();
      if (playPromise?.catch) {
        playPromise.catch(() => {
          video.setAttribute("controls", "");
        });
      }
    }, 0);
    focusApp();
  }

  function renderFinalVictoryScreen() {
    startBackgroundMusic();
    const victoryImage = finalVictoryImageFor();
    app.style.setProperty("--final-victory-bg", `url('${victoryImage}')`);
    app.innerHTML = `
      <section class="final-victory-screen" aria-label="擊敗魔王">
        <img class="final-victory-image" src="${victoryImage}" alt="" aria-hidden="true">
        <button class="final-victory-review-button" type="button" data-action="final-victory-review">領取讚士證書</button>
      </section>
    `;
    focusApp();
  }

  function completeFinalStrike() {
    const current = state.current;
    if (!current || current.levelId !== "final") return;
    if (current.confirmed.some((confirmed) => !confirmed) || countCorrectAnswers(current) < 10) {
      submitCurrent();
      return;
    }

    const correctCount = countCorrectAnswers(current);
    const total = current.questions.length;
    const score = Math.round((correctCount / total) * 100);
    const totalSeconds = current.questionTimes.reduce((sum, value) => sum + value, 0);
    const avgSeconds = totalSeconds / total;
    const battlePower = calculateBattlePower(correctCount, total, avgSeconds, current.levelId);
    const completedAt = new Date().toLocaleString("zh-TW", { hour12: false });
    const record = { correct: correctCount, total, score, battlePower, avgSeconds, totalSeconds, passed: true, completedAt };

    current.questions.forEach((question, index) => {
      updateMistakeForAnswer(current, question, current.answers[index]);
    });

    if (shouldReplaceRecord(recordFor("final"), record)) {
      state.records.final = record;
      state.scores.final = score;
    }
    state.attempts.final = (state.attempts.final || 0) + 1;
    state.completedAt = completedAt;
    state.finalRetryUnlocked = false;
    state.current = null;
    state.pendingResult = null;
    saveState();
    renderFinalClearVideo();
  }

  function retryFinalFromDefeat() {
    if (state.current?.levelId === "final") {
      state.current = null;
      state.pendingResult = null;
      state.finalRetryUnlocked = true;
      saveState();
    }
    startLevel("final", { allowLocked: true });
  }

  function goNextQuestion() {
    const current = state.current;
    if (!current) {
      renderMap();
      return;
    }

    current.index = Math.min(current.questions.length - 1, current.index + 1);
    current.selected = current.confirmed[current.index] ? current.answers[current.index] : null;
    current.correctPulseIndex = null;
    current.questionStartedAt = Date.now();
    saveState();
    renderQuestion();
  }

  function reviewFinalFailure() {
    const current = state.current;
    if (!current || current.levelId !== "final") {
      renderMistakes();
      return;
    }

    current.questions.forEach((question, index) => {
      const studentAnswer = current.answers[index];
      if (studentAnswer !== null && studentAnswer !== undefined) {
        updateMistakeForAnswer(current, question, studentAnswer);
      }
    });

    state.finalRetryUnlocked = true;
    current.finalFailureAcknowledged = current.questions.map((question, index) => {
      const studentAnswer = current.answers[index];
      return !current.confirmed[index] || studentAnswer === question.answer;
    });
    state.pendingResult = null;
    saveState();
    renderFinalFailureReview();
  }

  function renderFinalFailureReview(options = {}) {
    const current = state.current;
    if (!current || current.levelId !== "final") {
      renderMistakes();
      return;
    }

    startBossMusic();
    const scrollTop = window.scrollY;
    const wrongItems = finalFailureWrongItems(current);
    const canLeave = canLeaveFinalFailureReview(current);

    app.innerHTML = `
      <section class="review-panel final-failure-review" aria-labelledby="final-failure-title">
        <div class="screen-header">
          <div>
            <p class="level-kicker">魔王綜合拳擊戰</p>
            <h1 class="screen-title" id="final-failure-title">魔王關錯題回顧</h1>
            <p class="screen-lead">這次挑戰已結束。請勾選已看過的錯題講解，全部完成後就可以回地圖再次挑戰魔王。</p>
          </div>
          <div class="button-row">
            <button class="primary-button" type="button" data-action="final-failure-map" ${canLeave ? "" : "disabled"}>回地圖，再次挑戰魔王</button>
          </div>
        </div>
        <div class="review-list">
          ${wrongItems.length ? wrongItems.map((item) => renderFinalFailureItem(item)).join("") : '<div class="empty-state">這次沒有可回顧的錯題。</div>'}
        </div>
      </section>
    `;
    if (options.preserveScroll) {
      window.scrollTo({ top: scrollTop });
    } else {
      focusApp();
    }
  }

  function renderFinalFailureItem(item) {
    return `
      <article class="review-item ${item.acknowledged ? "review-dimmed" : "review-focus"}">
        <p class="answer-state wrong">答錯</p>
        <h3>${item.index + 1}. ${escapeHtml(item.question.question)}</h3>
        <p class="answer-line"><strong>你的答案：</strong>${formatAnswer(item.question, item.studentAnswer)}</p>
        <p class="answer-line"><strong>正確答案：</strong>${formatAnswer(item.question, item.question.answer)}</p>
        <p class="answer-line"><strong>講解：</strong>${escapeHtml(item.question.explanation || "這題目前沒有解析，請回到課文與選項重新比對。")}</p>
        <label class="correction-check">
          <input type="checkbox" data-action="acknowledge-final-failure" data-index="${item.index}" ${item.acknowledged ? "checked" : ""}>
          <span>我已看過這一題的正確答案與講解</span>
        </label>
      </article>
    `;
  }

  function finalFailureWrongItems(current) {
    return current.questions
      .map((question, index) => ({
        question,
        index,
        studentAnswer: current.answers[index],
        confirmed: current.confirmed[index],
        correct: current.answers[index] === question.answer,
        acknowledged: current.finalFailureAcknowledged?.[index] || false
      }))
      .filter((item) => item.confirmed && !item.correct);
  }

  function canLeaveFinalFailureReview(current) {
    const wrongItems = finalFailureWrongItems(current);
    return wrongItems.length > 0 && wrongItems.every((item) => item.acknowledged);
  }

  function acknowledgeFinalFailure(index, checked) {
    const current = state.current;
    if (!current || current.levelId !== "final") return;
    if (!current.finalFailureAcknowledged) {
      current.finalFailureAcknowledged = current.questions.map((question, questionIndex) => {
        const studentAnswer = current.answers[questionIndex];
        return !current.confirmed[questionIndex] || studentAnswer === question.answer;
      });
    }
    current.finalFailureAcknowledged[index] = checked;
    saveState();
    renderFinalFailureReview({ preserveScroll: true });
  }

  function finishFinalFailureReview() {
    if (state.current?.levelId === "final") {
      if (!canLeaveFinalFailureReview(state.current)) {
        renderFinalFailureReview({ preserveScroll: true });
        return;
      }
      state.current = null;
      state.pendingResult = null;
      state.finalRetryUnlocked = true;
      saveState();
    }
    renderMap();
  }

  function submitCurrent() {
    const current = state.current;
    if (!current) {
      renderMap();
      return;
    }

    if (current.confirmed.some((confirmed) => !confirmed)) {
      const firstUnanswered = current.confirmed.findIndex((confirmed) => !confirmed);
      current.index = firstUnanswered;
      current.selected = null;
      current.questionStartedAt = Date.now();
      saveState();
      renderQuestion();
      return;
    }

    const correctCount = countCorrectAnswers(current);
    const total = current.questions.length;
    const score = Math.round((correctCount / total) * 100);
    const totalSeconds = current.questionTimes.reduce((sum, value) => sum + value, 0);
    const avgSeconds = totalSeconds / total;
    const battlePower = calculateBattlePower(correctCount, total, avgSeconds, current.levelId);
    const passed = correctCount >= passCountFor(current.levelId);
    const completedAt = new Date().toLocaleString("zh-TW", { hour12: false });
    const record = { correct: correctCount, total, score, battlePower, avgSeconds, totalSeconds, passed, completedAt };
    if (current.levelId !== "final") {
      state.latestResults = state.latestResults || {};
      state.latestResults[current.levelId] = record;
    }

    current.questions.forEach((question, index) => {
      const studentAnswer = current.answers[index];
      updateMistakeForAnswer(current, question, studentAnswer);
    });

    const result = {
      levelId: current.levelId,
      levelTitle: current.levelSubtitle,
      correctCount,
      total,
      score,
      battlePower,
      avgSeconds,
      totalSeconds,
      passed,
      record,
      acknowledged: current.questions.map((question, index) => current.answers[index] === question.answer),
      answers: current.answers,
      questions: current.questions
    };

    state.current = null;
    state.pendingResult = result;
    saveState();
    renderResult(result);
  }

  function renderResult(result = state.pendingResult, options = {}) {
    if (!result) {
      renderMap();
      return;
    }

    const scrollTop = window.scrollY;
    const needed = passCountFor(result.levelId);
    const wrongCount = result.acknowledged.filter((done) => !done).length;
    const reviewItems = buildResultReviewItems(result);
    const canComplete = result.passed && result.acknowledged.every(Boolean);
    const canRetry = result.acknowledged.every(Boolean);
    const resultLead = result.passed
      ? wrongCount
        ? `已達過關標準，請勾選下方 ${wrongCount} 題錯題，代表已經看過講解，才會正式完成關卡。`
        : "錯題已確認完成，可以正式完成這一關。"
      : `這次需要答對 ${needed} 題才算達標。請先回顧錯題，再重新挑戰。`;

    app.style.setProperty("--level-bg", `url('${levelBackgroundFor(result.levelId)}')`);
    app.parentElement?.style.setProperty("--level-bg", `url('${levelBackgroundFor(result.levelId)}')`);
    app.innerHTML = `
      <section class="result-panel level-result-panel" style="--level-bg: url('${levelBackgroundFor(result.levelId)}')" aria-labelledby="result-title">
        <p class="level-kicker">${escapeHtml(result.levelTitle)}</p>
        <h1 class="screen-title" id="result-title">${result.passed ? "達標，等待錯題確認" : "尚未過關"}</h1>
        <p class="score-number">${result.correctCount}/${result.total}</p>
        <p class="screen-lead">${escapeHtml(resultLead)} 讚力分數 ${result.battlePower}，平均每題 ${formatSeconds(result.avgSeconds)}。</p>
        <div class="button-row">
          ${result.passed ? `<button class="primary-button" type="button" data-action="complete-result" ${canComplete ? "" : "disabled"}>${result.levelId === "final" ? "正式完成最終挑戰" : "正式完成這一關"}</button>` : `<button class="primary-button" type="button" data-action="map" ${canRetry ? "" : "disabled"}>回地圖再挑戰</button>`}
          <button class="secondary-button" type="button" data-action="start-level" data-level="${escapeHtml(result.levelId)}" ${canRetry ? "" : "disabled"}>再次挑戰</button>
        </div>
        <div class="review-list">
          ${reviewItems.length ? reviewItems.map((item) => renderAnsweredItem(item.question, item.studentAnswer, item.index, item.acknowledged)).join("") : '<div class="empty-state">這次沒有錯題，可以直接正式完成這一關。</div>'}
        </div>
      </section>
    `;
    if (options.preserveScroll) {
      window.scrollTo({ top: scrollTop });
    } else {
      focusApp();
    }
  }

  function buildResultReviewItems(result) {
    return result.questions
      .map((question, index) => ({
        question,
        index,
        studentAnswer: result.answers[index],
        acknowledged: result.acknowledged[index],
        correct: result.answers[index] === question.answer
      }))
      .filter((item) => !item.correct)
      .sort((a, b) => a.index - b.index);
  }

  function renderAnsweredItem(question, studentAnswer, index, acknowledged) {
    const correct = studentAnswer === question.answer;
    const isDimmed = correct || acknowledged;
    return `
      <article class="review-item ${isDimmed ? "review-dimmed" : "review-focus"}">
        <p class="answer-state ${correct ? "correct" : "wrong"}">${correct ? "答對" : "答錯"}</p>
        <h3>${index + 1}. ${escapeHtml(question.question)}</h3>
        <p class="answer-line"><strong>你的答案：</strong>${formatAnswer(question, studentAnswer)}</p>
        <p class="answer-line"><strong>正確答案：</strong>${formatAnswer(question, question.answer)}</p>
        <p class="answer-line"><strong>講解：</strong>${escapeHtml(question.explanation || "這題目前沒有解析，請回到課文與選項重新比對。")}</p>
        ${correct ? "" : `
          <label class="correction-check">
            <input type="checkbox" data-action="acknowledge-mistake" data-index="${index}" ${acknowledged ? "checked" : ""}>
            <span>我已看過這一題的正確答案與講解</span>
          </label>
        `}
      </article>
    `;
  }

  function acknowledgeMistake(index, checked) {
    const result = state.pendingResult;
    if (!result) return;
    result.acknowledged[index] = checked;
    saveState();
    renderResult(result, { preserveScroll: true });
  }

  function completePendingResult() {
    const result = state.pendingResult;
    if (!result || !result.passed || !result.acknowledged.every(Boolean)) return;

    if (shouldReplaceRecord(recordFor(result.levelId), result.record)) {
      state.records[result.levelId] = result.record;
      state.scores[result.levelId] = result.score;
    }
    state.attempts[result.levelId] = (state.attempts[result.levelId] || 0) + 1;
    if (result.levelId === "final") {
      state.completedAt = result.record.completedAt;
      state.finalRetryUnlocked = false;
    }

    state.pendingResult = null;
    saveState();
    if (result.levelId === "final") renderComplete();
    else renderMap();
  }

  function formatAnswer(question, answerIndex) {
    if (answerIndex === null || answerIndex === undefined) return "尚未作答";
    return `${letters[answerIndex]}. ${escapeHtml(question.options[answerIndex])}`;
  }

  function renderMistakes() {
    if (!state.current || state.current.levelId !== "final") startBackgroundMusic();
    const mistakes = Object.values(state.mistakes);
    app.innerHTML = `
      <section class="review-panel mistakes-review" aria-labelledby="mistakes-title">
        <div class="screen-header">
          <div>
            <h1 class="screen-title" id="mistakes-title">錯題回顧</h1>
            <p class="screen-lead">${state.current ? "你目前有一場測驗正在進行中，可以看完錯題後回到原本的題目繼續作答。" : "這裡會保留目前答錯過、且尚未再次答對的題目，方便學生複習。"}</p>
          </div>
          <div class="button-row">
            <button class="secondary-button" type="button" data-action="leave-mistakes">離開</button>
          </div>
        </div>
        ${mistakes.length ? `<div class="review-list">${mistakes.map((item, index) => renderMistakeItem(item, index)).join("")}</div>` : '<div class="empty-state">目前沒有錯題。</div>'}
      </section>
    `;
    focusApp();
  }

  function openMistakes() {
    mistakesReturnView = {
      html: app.innerHTML,
      scrollY: window.scrollY,
      musicTrack: backgroundMusicTrack,
      musicVolume: backgroundMusicVolume
    };
    renderMistakes();
  }

  function leaveMistakes() {
    if (!mistakesReturnView) {
      renderMap();
      return;
    }

    const returnView = mistakesReturnView;
    mistakesReturnView = null;
    app.innerHTML = returnView.html;
    syncTopbarState();
    if (returnView.musicTrack) playBackgroundMusic(returnView.musicTrack, returnView.musicVolume);
    requestAnimationFrame(() => window.scrollTo({ top: returnView.scrollY, behavior: "auto" }));
  }

  function renderMistakeItem(item, index) {
    return `
      <article class="review-item">
        <p class="level-kicker">${escapeHtml(item.levelTitle)}</p>
        <h3>${index + 1}. ${escapeHtml(item.question.question)}</h3>
        <p class="answer-line"><strong>你的答案：</strong>${formatAnswer(item.question, item.studentAnswer)}</p>
        <p class="answer-line"><strong>正確答案：</strong>${formatAnswer(item.question, item.question.answer)}</p>
        <p class="answer-line"><strong>講解：</strong>${escapeHtml(item.question.explanation || "這題目前沒有解析，請回到課文與選項重新比對。")}</p>
      </article>
    `;
  }

  function totalBattlePower() {
    const lessonPower = getLessons().reduce((sum, lesson) => sum + (recordFor(lesson.id)?.battlePower || 0), 0);
    return lessonPower + (recordFor("final")?.battlePower || 0);
  }

  function renderPowerStat(levelId, label) {
    const record = recordFor(levelId);
    const value = record ? record.battlePower : 0;
    const detail = record ? `${record.correct}/${record.total}，${formatSeconds(record.avgSeconds)}/題` : "尚未完成";
    return `<div class="stat"><b>${value}</b><span>${escapeHtml(label)}<br>${escapeHtml(detail)}</span></div>`;
  }

  function renderComplete() {
    if (!hasPassed("final")) {
      renderMap();
      return;
    }

    startCertificateMusic();
    app.innerHTML = `
      <section class="complete-screen" aria-label="沙鹿讚士">
        <div class="certificate" data-certificate>
          <img class="complete-hero-image" src="${certificateImageFor()}" alt="沙鹿讚士">
          <div class="student-name">${escapeHtml(state.name || "未填姓名")}</div>
          <div class="total-praise" aria-label="讚力總結">讚力總結 <b>${totalBattlePower()}</b></div>
          <p class="complete-time">完成時間：${escapeHtml(state.completedAt || new Date().toLocaleString("zh-TW", { hour12: false }))}</p>
        </div>
      </section>
    `;
    focusApp();
  }

  function resetGame() {
    if (!confirm("確定要清除姓名、破關紀錄與錯題紀錄嗎？")) return;
    Object.assign(state, defaultState());
    [...OLD_STORAGE_KEYS, STORAGE_KEY].forEach((key) => localStorage.removeItem(key));
    saveState();
    renderHome();
  }

  document.addEventListener("submit", (event) => {
    if (!event.target.matches('[data-form="start"]')) return;
    event.preventDefault();
    playChallengeStartSound();
    const formData = new FormData(event.target);
    state.name = String(formData.get("studentName") || "").trim();
    state.role = String(formData.get("studentRole") || "male");
    saveState();
    renderIntroVideo();
  });

  document.addEventListener("click", (event) => {
    const button = event.target.closest("[data-action]");
    if (!button) return;

    const action = button.dataset.action;
    if (action === "home") renderCover();
    if (action === "enter-home") {
      startBackgroundMusic();
      renderHome();
    }
    if (action === "toggle-mute") toggleMute();
    if (action === "map") {
      if (button.closest('[data-form="start"]')) playChallengeStartSound();
      if (!state.current) state.pendingResult = null;
      saveState();
      renderMap();
    }
    if (action === "intro-skip") enterMapFromIntro();
    if (action === "boss-intro-start") renderBossIntroVideo();
    if (action === "boss-intro-skip") enterBossAfterIntro();
    if (action === "open-power-help") togglePowerHelp(true);
    if (action === "close-power-help") togglePowerHelp(false);
    if (action === "mistakes") {
      const isMapScreen = app.firstElementChild?.classList.contains("map-screen");
      if (state.current && !isMapScreen) return;
      openMistakes();
    }
    if (action === "leave-mistakes") leaveMistakes();
    if (action === "resume-current") renderQuestion();
    if (action === "complete") renderComplete();
    if (action === "reset") resetGame();
    if (action === "start-level") startLevel(button.dataset.level);
    if (action === "choose" && state.current && !state.current.confirmed[state.current.index]) {
      state.current.selected = Number(button.dataset.choice);
      saveState();
      renderQuestion({ preserveScroll: true });
    }
    if (action === "confirm-answer") confirmAnswer();
    if (action === "next") goNextQuestion();
    if (action === "show-final-strike") showFinalStrike();
    if (action === "final-strike") completeFinalStrike();
    if (action === "final-victory-review") renderComplete();
    if (action === "final-show-defeat") renderFinalDefeatScreen();
    if (action === "final-failed-review") reviewFinalFailure();
    if (action === "final-defeat-retry") retryFinalFromDefeat();
    if (action === "final-failure-map") finishFinalFailureReview();
    if (action === "submit") submitCurrent();
    if (action === "complete-result") completePendingResult();
  });

  document.addEventListener("change", (event) => {
    if (event.target.matches('input[name="studentRole"]')) {
      state.role = event.target.value;
      saveState();
      playRoleSelectSound();
      return;
    }

    const target = event.target.closest("[data-action]");
    if (!target) return;
    if (target.dataset.action === "acknowledge-mistake") {
      acknowledgeMistake(Number(target.dataset.index), target.checked);
    }
    if (target.dataset.action === "acknowledge-final-failure") {
      acknowledgeFinalFailure(Number(target.dataset.index), target.checked);
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    const help = app.querySelector?.("[data-power-help]");
    if (help && !help.hidden) togglePowerHelp(false);
  });

  document.addEventListener("ended", (event) => {
    if (event.target.matches("[data-intro-video]")) enterMapFromIntro();
    if (event.target.matches("[data-boss-intro-video]")) enterBossAfterIntro();
    if (event.target.matches("[data-final-clear-video]")) renderFinalVictoryScreen();
  }, true);

  document.addEventListener("error", (event) => {
    if (event.target.matches("[data-intro-video]")) enterMapFromIntro();
    if (event.target.matches("[data-boss-intro-video]")) enterBossAfterIntro();
    if (event.target.matches("[data-final-clear-video]")) renderFinalVictoryScreen();
  }, true);

  renderCover();
})();
