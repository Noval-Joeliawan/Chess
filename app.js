/**
 * ============================================================================
 * Grandmaster Web Chess — FIDE Editorial & Tournament Edition
 * ============================================================================
 */

/* ----------------------------------------------------------------------------
   1. Modul Audio Sintetis Berlapis berbasis Web Audio API
   ---------------------------------------------------------------------------- */
class SoundEngine {
  constructor() {
    this.ctx = null;
    this.enabled = true;
    this.pack = "wood";
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  setPack(packName) {
    if (["wood", "arcade", "scifi"].includes(packName)) {
      this.pack = packName;
    }
  }

  playTone(
    freq,
    duration,
    type = "sine",
    gainLevel = 0.15,
    delay = 0,
    pitchEnd = null,
  ) {
    if (!this.enabled) return;
    this.init();

    const startTime = this.ctx.currentTime + delay;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, startTime);
    if (pitchEnd !== null) {
      osc.frequency.exponentialRampToValueAtTime(
        Math.max(10, pitchEnd),
        startTime + duration,
      );
    }

    gain.gain.setValueAtTime(gainLevel, startTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + duration);
  }

  playWoodThud(freq, duration = 0.07, gain = 0.25, delay = 0) {
    if (!this.enabled) return;
    this.init();

    const startTime = this.ctx.currentTime + delay;
    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gainNode = this.ctx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(freq, startTime);
    osc.frequency.exponentialRampToValueAtTime(
      freq * 0.45,
      startTime + duration,
    );

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(380, startTime);
    filter.Q.setValueAtTime(2, startTime);

    gainNode.gain.setValueAtTime(gain, startTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

    osc.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + duration);
  }

  move() {
    if (!this.enabled) return;
    switch (this.pack) {
      case "arcade":
        this.playTone(320, 0.05, "square", 0.14, 0, 520);
        break;
      case "scifi":
        this.playTone(780, 0.06, "sine", 0.16, 0, 320);
        break;
      case "wood":
      default:
        this.playWoodThud(210, 0.06, 0.28);
        break;
    }
  }

  capture() {
    if (!this.enabled) return;
    switch (this.pack) {
      case "arcade":
        this.playTone(420, 0.1, "sawtooth", 0.2, 0, 90);
        break;
      case "scifi":
        this.playTone(650, 0.1, "sine", 0.2, 0, 180);
        break;
      case "wood":
      default:
        this.playWoodThud(170, 0.08, 0.35, 0);
        this.playWoodThud(280, 0.05, 0.25, 0.02);
        break;
    }
  }

  castle() {
    if (!this.enabled) return;
    this.playWoodThud(220, 0.06, 0.25, 0);
    this.playWoodThud(190, 0.07, 0.25, 0.08);
  }

  check() {
    if (!this.enabled) return;
    this.playTone(520, 0.14, "sine", 0.2, 0);
    this.playTone(680, 0.22, "sine", 0.2, 0.08);
  }

  gameOver() {
    if (!this.enabled) return;
    this.playWoodThud(320, 0.18, 0.3, 0);
    this.playWoodThud(260, 0.2, 0.3, 0.15);
    this.playWoodThud(190, 0.35, 0.35, 0.32);
  }

  puzzleSuccess() {
    if (!this.enabled) return;
    this.playTone(440, 0.12, "triangle", 0.2, 0);
    this.playTone(554.37, 0.14, "triangle", 0.2, 0.1);
    this.playTone(659.25, 0.28, "sine", 0.22, 0.2);
  }

  puzzleError() {
    if (!this.enabled) return;
    this.playTone(240, 0.15, "sawtooth", 0.18, 0, 150);
  }
}

/* ----------------------------------------------------------------------------
   2. Sistem Partikel Efek Visual Halus (Subtle Capture Dust)
   ---------------------------------------------------------------------------- */
class ParticleSystem {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.particles = [];
    this.isRunning = false;
    this.resize();
    window.addEventListener("resize", () => this.resize());
  }

  resize() {
    const rect = this.canvas.parentElement.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;
    this.scale = dpr;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  spawnSparks(x, y, theme = "wood", count = 20) {
    this.resize();
    const palettes = {
      wood: ["#c59b57", "#e6dac8", "#9c7444"],
      cyberpunk: ["#d97706", "#f59e0b", "#78350f"],
      marble: ["#d6d3cd", "#a3824c", "#78716c"],
      midnight: ["#c59b57", "#8c8881", "#57544f"],
    };
    const colors = palettes[theme] || palettes.wood;

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.5 + Math.random() * 4.5;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 0.8,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 1.8 + Math.random() * 2.5,
        alpha: 0.85,
        decay: 0.028 + Math.random() * 0.025,
        gravity: 0.12,
      });
    }

    if (!this.isRunning) this.startLoop();
  }

  spawnCheckPulse(x, y) {
    this.resize();
    this.particles.push({
      x,
      y,
      radius: 8,
      maxRadius: 56,
      color: "rgba(184, 93, 59, ",
      alpha: 0.8,
      decay: 0.04,
      isWave: true,
    });
    if (!this.isRunning) this.startLoop();
  }

  spawnVictoryCelebration(theme = "wood") {
    this.resize();
    const rect = this.canvas.parentElement.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;

    for (let burst = 0; burst < 3; burst++) {
      setTimeout(() => {
        const bx = w * 0.25 + Math.random() * w * 0.5;
        const by = h * 0.25 + Math.random() * h * 0.5;
        this.spawnSparks(bx, by, theme, 32);
      }, burst * 200);
    }
  }

  startLoop() {
    this.isRunning = true;
    const tick = () => {
      this.updateAndDraw();
      if (this.particles.length > 0) {
        requestAnimationFrame(tick);
      } else {
        this.isRunning = false;
        const rect = this.canvas.parentElement.getBoundingClientRect();
        this.ctx.clearRect(0, 0, rect.width, rect.height);
      }
    };
    requestAnimationFrame(tick);
  }

  updateAndDraw() {
    const rect = this.canvas.parentElement.getBoundingClientRect();
    this.ctx.clearRect(0, 0, rect.width, rect.height);

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];

      if (p.isWave) {
        p.radius += 2;
        p.alpha -= p.decay;
        if (p.alpha <= 0 || p.radius >= p.maxRadius) {
          this.particles.splice(i, 1);
          continue;
        }
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        this.ctx.strokeStyle = `${p.color}${Math.max(0, p.alpha)})`;
        this.ctx.lineWidth = 3;
        this.ctx.stroke();
        this.ctx.restore();
      } else {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.vx *= 0.96;
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          this.particles.splice(i, 1);
          continue;
        }

        this.ctx.save();
        this.ctx.globalAlpha = Math.max(0, p.alpha);
        this.ctx.fillStyle = p.color;
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.restore();
      }
    }
  }
}

/* ----------------------------------------------------------------------------
   3. Basis Data Opening Explorer (ECO Standard)
   ---------------------------------------------------------------------------- */
const OPENING_BOOK = [
  {
    moves: ["e4", "c5", "Nf3", "d6", "d4", "cxd4", "Nxd4", "Nf6", "Nc3", "a6"],
    eco: "B90",
    name: "Sicilian Defense: Najdorf",
    desc: "Variasi legendaris Fischer & Kasparov dengan serangan balik tajam.",
  },
  {
    moves: ["e4", "c5", "Nf3", "Nc6", "d4", "cxd4", "Nxd4"],
    eco: "B32",
    name: "Sicilian Defense: Open",
    desc: "Pertempuran terbuka memperebutkan sayap menteri dan pusat.",
  },
  {
    moves: ["e4", "c5"],
    eco: "B20",
    name: "Sicilian Defense",
    desc: "Respon asimetris tajam dalam menghadapi 1.e4.",
  },
  {
    moves: ["e4", "e5", "Nf3", "Nc6", "Bb5", "a6"],
    eco: "C70",
    name: "Ruy Lopez: Morphy Defense",
    desc: "Sistem utama Ruy Lopez di kejuaraan dunia.",
  },
  {
    moves: ["e4", "e5", "Nf3", "Nc6", "Bb5"],
    eco: "C60",
    name: "Ruy Lopez (Spanish Opening)",
    desc: "Pembukaan klasik FIDE menekan struktur pusat jangka panjang.",
  },
  {
    moves: ["e4", "e5", "Nf3", "Nc6", "Bc4", "Bc5"],
    eco: "C50",
    name: "Italian Game: Giuoco Piano",
    desc: "Perkembangan perwira harmonis dengan kontrol petak d4.",
  },
  {
    moves: ["e4", "e5", "Nf3", "Nc6", "Bc4", "Nf6"],
    eco: "C55",
    name: "Two Knights Defense",
    desc: "Serangan balik aktif hitam mengincar inisiatif taktis.",
  },
  {
    moves: ["e4", "e5", "Nf3", "Nc6", "Bc4"],
    eco: "C50",
    name: "Italian Game",
    desc: "Mengembangkan gajah ke c4 menekan titik lemah f7.",
  },
  {
    moves: ["e4", "e6", "d4", "d5"],
    eco: "C01",
    name: "French Defense: Main Line",
    desc: "Membangun rantai pion kokoh dengan serangan balik c5.",
  },
  {
    moves: ["e4", "e6"],
    eco: "C00",
    name: "French Defense",
    desc: "Pertahanan solid mengincar serangan balik terhadap d4.",
  },
  {
    moves: ["e4", "c6", "d4", "d5"],
    eco: "B12",
    name: "Caro-Kann Defense: Main Line",
    desc: "Struktur bidak kokoh menjaga diagonal gajah c8 tetap terbuka.",
  },
  {
    moves: ["e4", "c6"],
    eco: "B10",
    name: "Caro-Kann Defense",
    desc: "Pertahanan struktural ultra-solid.",
  },
  {
    moves: ["d4", "d5", "c4", "dxc4"],
    eco: "D20",
    name: "Queen's Gambit Accepted",
    desc: "Hitam menerima pengorbanan pion sayap menteri sementara.",
  },
  {
    moves: ["d4", "d5", "c4", "e6"],
    eco: "D30",
    name: "Queen's Gambit Declined",
    desc: "Sistem ortodoks kokoh mempertahankan titik sentral d5.",
  },
  {
    moves: ["d4", "d5", "c4", "c6"],
    eco: "D10",
    name: "Slav Defense",
    desc: "Memperkuat petak d5 dengan pion c6.",
  },
  {
    moves: ["d4", "d5", "c4"],
    eco: "D06",
    name: "Queen's Gambit",
    desc: "Pengorbanan pion sayap untuk dominasi petak pusat.",
  },
  {
    moves: ["d4", "Nf6", "c4", "g6", "Nc3", "Bg7"],
    eco: "E60",
    name: "King's Indian Defense",
    desc: "Sistem hipermodern dengan manuver serangan sayap raja.",
  },
  {
    moves: ["d4", "Nf6", "c4", "e6", "Nc3", "Bb4"],
    eco: "E20",
    name: "Nimzo-Indian Defense",
    desc: "Menyemat kuda putih c3 untuk mengendalikan petak pusat e4.",
  },
  {
    moves: ["d4", "Nf6", "c4", "e6", "Nf3", "b6"],
    eco: "E12",
    name: "Queen's Indian Defense",
    desc: "Kontrol hipermodern petak e4 melalui fianchetto b7.",
  },
  {
    moves: ["d4", "Nf6", "Nf3", "d5", "Bf4"],
    eco: "D02",
    name: "London System",
    desc: "Skema solid dengan penempatan gajah gelap di f4.",
  },
  {
    moves: ["d4", "d5", "Bf4"],
    eco: "D00",
    name: "London System",
    desc: "Sistem pembukaan skematis dengan struktur piramida d4-c3-e3.",
  },
  {
    moves: ["e4", "d5"],
    eco: "B01",
    name: "Scandinavian Defense",
    desc: "Tantangan langsung terhadap pion e4 sejak langkah pertama.",
  },
  {
    moves: ["e4", "Nf6"],
    eco: "B02",
    name: "Alekhine's Defense",
    desc: "Memancing dorongan pion pusat putih untuk diserang balik.",
  },
  {
    moves: ["c4"],
    eco: "A10",
    name: "English Opening",
    desc: "Pembukaan sayap fleksibel memperebutkan petak d5.",
  },
  {
    moves: ["Nf3"],
    eco: "A04",
    name: "Réti Opening",
    desc: "Strategi hipermodern menguasai pusat dari jarak jauh.",
  },
  {
    moves: ["f4"],
    eco: "A02",
    name: "Bird's Opening",
    desc: "Pendekatan sayap agresif mengontrol petak e5.",
  },
  {
    moves: ["e4", "e5", "f4"],
    eco: "C30",
    name: "King's Gambit",
    desc: "Pembukaan era Romantis penuh pengorbanan taktis.",
  },
  {
    moves: ["e4", "e5", "Nf3", "Nf6"],
    eco: "C42",
    name: "Petrov's Defense",
    desc: "Pertahanan Rusia yang simetris dan sangat solid.",
  },
  {
    moves: ["e4", "e5", "Nf3", "Nc6", "Nc3", "Nf6"],
    eco: "C47",
    name: "Four Knights Game",
    desc: "Perkembangan simetris keempat perwira kuda.",
  },
  {
    moves: ["d4", "f5"],
    eco: "A80",
    name: "Dutch Defense",
    desc: "Perebutan asimetris atas petak sentral e4.",
  },
  {
    moves: ["d4", "Nf6"],
    eco: "A45",
    name: "Indian Defense",
    desc: "Respon hipermodern fleksibel terhadap 1.d4.",
  },
  {
    moves: ["e4", "e5"],
    eco: "C20",
    name: "Open Game (King's Pawn)",
    desc: "Pertempuran klasik memperebutkan pusat terbuka.",
  },
  {
    moves: ["d4", "d5"],
    eco: "D00",
    name: "Closed Game (Queen's Pawn)",
    desc: "Perebutan posisi berbasis manuver strategis.",
  },
  {
    moves: ["e4"],
    eco: "B00",
    name: "King's Pawn Opening",
    desc: "Langkah pembuka membebaskan diagonal Menteri dan Gajah.",
  },
  {
    moves: ["d4"],
    eco: "A40",
    name: "Queen's Pawn Opening",
    desc: "Langkah pembuka kokoh dengan perlindungan langsung atas d4.",
  },
];

function detectOpening(sans) {
  if (!sans || sans.length === 0) {
    return {
      eco: "A00",
      name: "Posisi Awal",
      desc: "Langkah pembuka standar catur",
    };
  }
  let bestMatch = null;
  let maxLen = -1;

  for (const entry of OPENING_BOOK) {
    if (entry.moves.length <= sans.length) {
      let match = true;
      for (let i = 0; i < entry.moves.length; i++) {
        if (entry.moves[i] !== sans[i]) {
          match = false;
          break;
        }
      }
      if (match && entry.moves.length > maxLen) {
        maxLen = entry.moves.length;
        bestMatch = entry;
      }
    }
  }

  return (
    bestMatch || {
      eco: "A00",
      name: "Variasi Non-Kanonik",
      desc: "Langkah di luar jalur buku pembukaan utama",
    }
  );
}

/* ----------------------------------------------------------------------------
   4. Basis Data Studi Taktis (Daily Chess Puzzles)
   ---------------------------------------------------------------------------- */
const DAILY_PUZZLES = [
  {
    id: 0,
    title: "Problem 01: Back-Rank Deflection",
    desc: "Putih melangkah. Pertahanan baris ke-8 hitam bergantung pada satu benteng. Korbankan Menteri untuk mengalihkan penjagaan.",
    fen: "5rk1/ppp2ppp/8/8/8/8/4QPPP/4R1K1 w - - 0 1",
    playerColor: "w",
    moves: [
      { from: "e2", to: "e8", san: "Qe8+" },
      { from: "f8", to: "e8", san: "Rxe8", reply: true },
      { from: "e1", to: "e8", san: "Rxe8#" },
    ],
    hint: "Langkahkan Menteri ke e8 (Qe8+) untuk memaksa benteng f8 memukul.",
  },
  {
    id: 1,
    title: "Problem 02: Paul Morphy Opera Mate (1858)",
    desc: "Kombinasi abadi Paul Morphy di Paris. Korbankan Menteri di b8 untuk menarik kuda hitam dari penjagaan petak d8.",
    fen: "4kb1r/p2n1ppp/4q3/4p1B1/4P3/1Q6/PPP2PPP/2KR4 w k - 0 1",
    playerColor: "w",
    moves: [
      { from: "b3", to: "b8", san: "Qb8+" },
      { from: "d7", to: "b8", san: "Nxb8", reply: true },
      { from: "d1", to: "d8", san: "Rd8#" },
    ],
    hint: "Korbankan Menteri ke b8 (Qb8+) diikuti Benteng ke d8.",
  },
  {
    id: 2,
    title: "Problem 03: Philidor Smothered Mate",
    desc: "Raja hitam terkurung di sudut papan. Paksa benteng hitam menutup ruang gerak rajanya sendiri di g8, lalu akhiri dengan Kuda.",
    fen: "5r1k/6pp/4Q2N/8/8/8/8/6K1 w - - 0 1",
    playerColor: "w",
    moves: [
      { from: "e6", to: "g8", san: "Qg8+" },
      { from: "f8", to: "g8", san: "Rxg8", reply: true },
      { from: "h6", to: "f7", san: "Nf7#" },
    ],
    hint: "Korbankan Menteri di g8 (Qg8+) lalu lompatkan Kuda ke f7.",
  },
  {
    id: 3,
    title: "Problem 04: Arabian Mate",
    desc: "Sinergi klasik antara Kuda dan Benteng di sudut papan. Batasi ruang raja hitam dengan menguasai baris ke-7.",
    fen: "7k/7p/5N2/8/8/8/5PPP/R5K1 w - - 0 1",
    playerColor: "w",
    moves: [
      { from: "a1", to: "a7", san: "Ra7" },
      { from: "h7", to: "h6", san: "h6", reply: true },
      { from: "a7", to: "h7", san: "Rh7#" },
    ],
    hint: "Luncurkan Benteng ke a7 (Ra7) mengancam Rh7#.",
  },
  {
    id: 4,
    title: "Problem 05: Vukovic Mate",
    desc: "Raja hitam terkunci oleh jaringan Kuda e7 dan pion g6. Tuntaskan dengan langkah Benteng ke baris terakhir.",
    fen: "7k/R3N1pp/6P1/8/8/8/8/6K1 w - - 0 1",
    playerColor: "w",
    moves: [{ from: "a7", to: "a8", san: "Ra8#" }],
    hint: "Gerakkan Benteng ke petak a8 (Ra8#).",
  },
];

/* ----------------------------------------------------------------------------
   5. Mesin Kecerdasan Buatan (Chess AI & Evaluator)
   ---------------------------------------------------------------------------- */
class ChessAI {
  constructor() {
    this.pieceValues = { p: 100, n: 320, b: 330, r: 500, q: 900, k: 20000 };
    this.pst = {
      p: [
        [0, 0, 0, 0, 0, 0, 0, 0],
        [50, 50, 50, 50, 50, 50, 50, 50],
        [10, 10, 20, 30, 30, 20, 10, 10],
        [5, 5, 10, 25, 25, 10, 5, 5],
        [0, 0, 0, 20, 20, 0, 0, 0],
        [5, -5, -10, 0, 0, -10, -5, 5],
        [5, 10, 10, -20, -20, 10, 10, 5],
        [0, 0, 0, 0, 0, 0, 0, 0],
      ],
      n: [
        [-50, -40, -30, -30, -30, -30, -40, -50],
        [-40, -20, 0, 0, 0, 0, -20, -40],
        [-30, 0, 10, 15, 15, 10, 0, -30],
        [-30, 5, 15, 20, 20, 15, 5, -30],
        [-30, 0, 15, 20, 20, 15, 0, -30],
        [-30, 5, 10, 15, 15, 10, 5, -30],
        [-40, -20, 0, 5, 5, 0, -20, -40],
        [-50, -40, -30, -30, -30, -30, -40, -50],
      ],
      b: [
        [-20, -10, -10, -10, -10, -10, -10, -20],
        [-10, 0, 0, 0, 0, 0, 0, -10],
        [-10, 0, 5, 10, 10, 5, 0, -10],
        [-10, 5, 5, 10, 10, 5, 5, -10],
        [-10, 0, 10, 10, 10, 10, 0, -10],
        [-10, 10, 10, 10, 10, 10, 10, -10],
        [-10, 5, 0, 0, 0, 0, 5, -10],
        [-20, -10, -10, -10, -10, -10, -10, -20],
      ],
      r: [
        [0, 0, 0, 0, 0, 0, 0, 0],
        [5, 10, 10, 10, 10, 10, 10, 5],
        [-5, 0, 0, 0, 0, 0, 0, -5],
        [-5, 0, 0, 0, 0, 0, 0, -5],
        [-5, 0, 0, 0, 0, 0, 0, -5],
        [-5, 0, 0, 0, 0, 0, 0, -5],
        [-5, 0, 0, 0, 0, 0, 0, -5],
        [0, 0, 0, 5, 5, 0, 0, 0],
      ],
      q: [
        [-20, -10, -10, -5, -5, -10, -10, -20],
        [-10, 0, 0, 0, 0, 0, 0, -10],
        [-10, 0, 5, 5, 5, 5, 0, -10],
        [-5, 0, 5, 5, 5, 5, 0, -5],
        [0, 0, 5, 5, 5, 5, 0, -5],
        [-10, 5, 5, 5, 5, 5, 0, -10],
        [-10, 0, 5, 0, 0, 0, 0, -10],
        [-20, -10, -10, -5, -5, -10, -10, -20],
      ],
      k: [
        [-30, -40, -40, -50, -50, -40, -40, -30],
        [-30, -40, -40, -50, -50, -40, -40, -30],
        [-30, -40, -40, -50, -50, -40, -40, -30],
        [-30, -40, -40, -50, -50, -40, -40, -30],
        [-20, -30, -30, -40, -40, -30, -30, -20],
        [-10, -20, -20, -20, -20, -20, -20, -10],
        [20, 20, 0, 0, 0, 0, 20, 20],
        [20, 30, 10, 0, 0, 10, 30, 20],
      ],
    };
  }

  evaluateBoard(chess, aiColor = "w") {
    if (chess.in_checkmate()) return chess.turn() === aiColor ? -99999 : 99999;
    if (
      chess.in_draw() ||
      chess.in_stalemate() ||
      chess.in_threefold_repetition()
    )
      return 0;

    const board = chess.board();
    let totalScore = 0;
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const piece = board[r][c];
        if (!piece) continue;
        const baseVal = this.pieceValues[piece.type];
        const tableRow = piece.color === "w" ? r : 7 - r;
        const positionalVal = this.pst[piece.type][tableRow][c];
        const score = baseVal + positionalVal;
        if (piece.color === aiColor) totalScore += score;
        else totalScore -= score;
      }
    }
    return totalScore;
  }

  orderMoves(moves) {
    return moves.sort((a, b) => {
      let scoreA = 0,
        scoreB = 0;
      if (a.captured)
        scoreA += 10 * this.pieceValues[a.captured] - this.pieceValues[a.piece];
      if (a.promotion) scoreA += this.pieceValues[a.promotion];
      if (b.captured)
        scoreB += 10 * this.pieceValues[b.captured] - this.pieceValues[b.piece];
      if (b.promotion) scoreB += this.pieceValues[b.promotion];
      return scoreB - scoreA;
    });
  }

  minimax(chess, depth, alpha, beta, isMaximizing, aiColor) {
    if (depth === 0 || chess.game_over())
      return this.evaluateBoard(chess, aiColor);
    const legalMoves = this.orderMoves(chess.moves({ verbose: true }));

    if (isMaximizing) {
      let maxEval = -Infinity;
      for (const move of legalMoves) {
        chess.move(move);
        const evaluation = this.minimax(
          chess,
          depth - 1,
          alpha,
          beta,
          false,
          aiColor,
        );
        chess.undo();
        maxEval = Math.max(maxEval, evaluation);
        alpha = Math.max(alpha, evaluation);
        if (beta <= alpha) break;
      }
      return maxEval;
    } else {
      let minEval = Infinity;
      for (const move of legalMoves) {
        chess.move(move);
        const evaluation = this.minimax(
          chess,
          depth - 1,
          alpha,
          beta,
          true,
          aiColor,
        );
        chess.undo();
        minEval = Math.min(minEval, evaluation);
        beta = Math.min(beta, evaluation);
        if (beta <= alpha) break;
      }
      return minEval;
    }
  }

  getBestMove(fen, difficulty = "ai-normal", aiColor = "b") {
    const chess = new Chess(fen);
    const legalMoves = this.orderMoves(chess.moves({ verbose: true }));
    if (legalMoves.length === 0) return null;

    if (difficulty === "ai-normal") {
      let bestMove = legalMoves[0];
      let bestScore = -Infinity;
      for (const move of legalMoves) {
        chess.move(move);
        const score =
          this.evaluateBoard(chess, aiColor) + (Math.random() - 0.5) * 60;
        chess.undo();
        if (score > bestScore) {
          bestScore = score;
          bestMove = move;
        }
      }
      return bestMove;
    }

    const searchDepth = difficulty === "ai-hard" ? 3 : 2;
    let bestMove = legalMoves[0];
    let bestValue = -Infinity;
    let alpha = -Infinity;
    let beta = Infinity;

    for (const move of legalMoves) {
      chess.move(move);
      const boardValue = this.minimax(
        chess,
        searchDepth - 1,
        alpha,
        beta,
        false,
        aiColor,
      );
      chess.undo();
      if (boardValue > bestValue) {
        bestValue = boardValue;
        bestMove = move;
      }
      alpha = Math.max(alpha, boardValue);
    }
    return bestMove;
  }

  getHintMove(fen, turn) {
    const chess = new Chess(fen);
    const legalMoves = this.orderMoves(chess.moves({ verbose: true }));
    if (legalMoves.length === 0) return null;

    let bestMove = legalMoves[0];
    let bestValue = -Infinity;
    let alpha = -Infinity;
    let beta = Infinity;

    for (const move of legalMoves) {
      chess.move(move);
      const boardValue = this.minimax(chess, 2, alpha, beta, false, turn);
      chess.undo();
      if (boardValue > bestValue) {
        bestValue = boardValue;
        bestMove = move;
      }
      alpha = Math.max(alpha, boardValue);
    }
    return bestMove;
  }
}

/* ----------------------------------------------------------------------------
   6. Generator Vektor SVG Bidak Catur (Refined Staunton Silhouette)
   ---------------------------------------------------------------------------- */
function createPieceSVG(type, color, theme = "wood") {
  const isWhite = color === "w";
  let fill, stroke, innerStroke;

  switch (theme) {
    case "cyberpunk":
      if (isWhite) {
        fill = "#f59e0b";
        stroke = "#291805";
        innerStroke = "#78350f";
      } else {
        fill = "#1c1610";
        stroke = "#d97706";
        innerStroke = "#b45309";
      }
      break;

    case "marble":
      if (isWhite) {
        fill = "#f8f7f4";
        stroke = "#262523";
        innerStroke = "#78716c";
      } else {
        fill = "#1f1e1c";
        stroke = "#d6d3cd";
        innerStroke = "#a8a29e";
      }
      break;

    case "midnight":
      if (isWhite) {
        fill = "#e6e2d8";
        stroke = "#181715";
        innerStroke = "#57544f";
      } else {
        fill = "#141311";
        stroke = "#c59b57";
        innerStroke = "#8c6d3b";
      }
      break;

    case "wood":
    default:
      if (isWhite) {
        fill = "#f7f2e7";
        stroke = "#362214";
        innerStroke = "#7c5846";
      } else {
        fill = "#26170e";
        stroke = "#e6dac8";
        innerStroke = "#c59b57";
      }
      break;
  }

  let shape = "";
  switch (type) {
    case "p":
      shape = `
        <circle cx="50" cy="27" r="12" />
        <path d="M 38 41 C 38 38 62 38 62 41 C 59 53 64 64 69 73 L 31 73 C 36 64 41 53 38 41 Z" />
        <rect x="24" y="74" width="52" height="9" rx="2" />
        <line x1="36" y1="41" x2="64" y2="41" stroke="${innerStroke}" stroke-width="2.5" />
      `;
      break;
    case "r":
      shape = `
        <path d="M 28 21 L 28 36 L 72 36 L 72 21 L 63 21 L 63 28 L 55 28 L 55 21 L 45 21 L 45 28 L 37 28 L 37 21 Z" />
        <path d="M 34 36 L 31 73 L 69 73 L 66 36 Z" />
        <rect x="23" y="74" width="54" height="9" rx="2" />
        <line x1="34" y1="67" x2="66" y2="67" stroke="${innerStroke}" stroke-width="2.5" />
      `;
      break;
    case "n":
      shape = `
        <path d="M 30 73 C 31 54 37 46 43 42 C 36 42 29 45 26 40 C 23 36 29 25 38 20 L 42 15 L 47 20 C 62 21 71 35 69 54 L 68 73 Z" />
        <circle cx="38" cy="28" r="2.5" fill="${stroke}" />
        <rect x="23" y="74" width="54" height="9" rx="2" />
      `;
      break;
    case "b":
      shape = `
        <circle cx="50" cy="16" r="4.5" />
        <path d="M 50 22 C 33 32 32 54 34 73 L 66 73 C 68 54 67 32 50 22 Z" />
        <line x1="43" y1="42" x2="57" y2="42" stroke="${innerStroke}" stroke-width="3.5" stroke-linecap="round" />
        <line x1="50" y1="35" x2="50" y2="49" stroke="${innerStroke}" stroke-width="3.5" stroke-linecap="round" />
        <rect x="23" y="74" width="54" height="9" rx="2" />
      `;
      break;
    case "q":
      shape = `
        <circle cx="21" cy="27" r="3.5" />
        <circle cx="38" cy="19" r="3.5" />
        <circle cx="50" cy="16" r="3.5" />
        <circle cx="62" cy="19" r="3.5" />
        <circle cx="79" cy="27" r="3.5" />
        <path d="M 23 32 L 35 55 L 39 24 L 47 54 L 50 21 L 53 54 L 61 24 L 65 55 L 77 32 L 69 73 L 31 73 Z" />
        <line x1="32" y1="67" x2="68" y2="67" stroke="${innerStroke}" stroke-width="2.5" />
        <rect x="23" y="74" width="54" height="9" rx="2" />
      `;
      break;
    case "k":
      shape = `
        <line x1="50" y1="10" x2="50" y2="24" stroke="${stroke}" stroke-width="4.5" stroke-linecap="round" />
        <line x1="43" y1="16" x2="57" y2="16" stroke="${stroke}" stroke-width="4.5" stroke-linecap="round" />
        <path d="M 30 37 C 30 24 70 24 70 37 L 67 73 L 33 73 Z" />
        <path d="M 38 49 L 62 49" stroke="${innerStroke}" stroke-width="3" stroke-linecap="round" />
        <rect x="23" y="74" width="54" height="9" rx="2" />
      `;
      break;
  }

  return `<svg viewBox="0 0 100 100" class="chess-piece" draggable="false"><g fill="${fill}" stroke="${stroke}" stroke-width="4" stroke-linejoin="round">${shape}</g></svg>`;
}

/* ----------------------------------------------------------------------------
   7. Pengelola Layar Multi-Screen (SPA View Manager)
   ---------------------------------------------------------------------------- */
class ScreenManager {
  constructor(app) {
    this.app = app;
    this.screens = {
      landing: document.getElementById("screen-landing"),
      game: document.getElementById("screen-game"),
      legends: document.getElementById("screen-legends"),
      history: document.getElementById("screen-history"),
    };
    this.modalSettings = document.getElementById("modal-settings");
    this.bindNavigation();
  }

  showScreen(targetName) {
    Object.keys(this.screens).forEach((name) => {
      const el = this.screens[name];
      if (name === targetName) {
        el.classList.remove("hidden");
      } else {
        el.classList.add("hidden");
      }
    });

    const navMap = {
      landing: document.getElementById("nav-btn-home"),
      game: document.getElementById("nav-btn-game"),
      legends: document.getElementById("nav-btn-legends"),
      history: document.getElementById("nav-btn-history"),
    };
    Object.keys(navMap).forEach((key) => {
      const btn = navMap[key];
      if (!btn) return;
      if (key === targetName) {
        btn.classList.add("text-brass", "border-b", "border-brass");
        btn.classList.remove("text-muted");
      } else {
        btn.classList.remove("text-brass", "border-b", "border-brass");
        btn.classList.add("text-muted");
      }
    });

    window.scrollTo({ top: 0, behavior: "smooth" });

    if (targetName === "game" && this.app.particles) {
      setTimeout(() => this.app.particles.resize(), 60);
    }
  }

  openSettings() {
    this.modalSettings.classList.remove("hidden");
  }

  closeSettings() {
    this.modalSettings.classList.add("hidden");
  }

  bindNavigation() {
    document
      .getElementById("nav-brand")
      .addEventListener("click", () => this.showScreen("landing"));
    document
      .getElementById("nav-btn-home")
      .addEventListener("click", () => this.showScreen("landing"));
    document
      .getElementById("nav-btn-game")
      .addEventListener("click", () => this.showScreen("game"));
    document
      .getElementById("nav-btn-legends")
      .addEventListener("click", () => this.showScreen("legends"));
    document
      .getElementById("nav-btn-history")
      .addEventListener("click", () => this.showScreen("history"));
    document
      .getElementById("nav-btn-settings")
      .addEventListener("click", () => this.openSettings());

    document
      .getElementById("btn-back-landing")
      .addEventListener("click", () => this.showScreen("landing"));
    document.querySelectorAll(".btn-back-home").forEach((btn) => {
      btn.addEventListener("click", () => this.showScreen("landing"));
    });
    document.querySelectorAll(".btn-go-play").forEach((btn) => {
      btn.addEventListener("click", () => this.showScreen("game"));
    });

    document
      .getElementById("hero-btn-play")
      .addEventListener("click", () => this.showScreen("game"));
    document.getElementById("hero-btn-puzzle").addEventListener("click", () => {
      this.showScreen("game");
      this.app.switchTab("puzzle");
    });

    document
      .getElementById("card-menu-play")
      .addEventListener("click", () => this.showScreen("game"));
    document
      .getElementById("card-menu-legends")
      .addEventListener("click", () => this.showScreen("legends"));
    document
      .getElementById("card-menu-history")
      .addEventListener("click", () => this.showScreen("history"));
    document
      .getElementById("card-menu-settings")
      .addEventListener("click", () => this.openSettings());

    document
      .getElementById("btn-close-settings")
      .addEventListener("click", () => this.closeSettings());
    this.modalSettings.addEventListener("click", (e) => {
      if (e.target === this.modalSettings) this.closeSettings();
    });

    document
      .getElementById("btn-apply-settings")
      .addEventListener("click", () => {
        this.closeSettings();
        this.app.applySettingsAndRestart();
        this.showScreen("game");
      });
  }
}

/* ----------------------------------------------------------------------------
   8. Kelas Utama Pengelola Aplikasi Catur (ChessApp Master)
   ---------------------------------------------------------------------------- */
class ChessApp {
  constructor() {
    this.game = new Chess();
    this.sound = new SoundEngine();
    this.ai = new ChessAI();

    this.currentTheme = "wood";
    this.activeTab = "arena";

    this.gameMode = "ai-normal";
    this.humanColor = "w";
    this.isAIThinking = false;
    this.aiTimeoutId = null;

    this.isFlipped = false;
    this.selectedSquare = null;
    this.legalMoves = [];
    this.pendingPromotion = null;
    this.activeHint = null;
    this.draggingSquare = null;

    this.historySnapshots = [];
    this.viewIndex = 0;

    this.baseTime = 300 * 1000;
    this.increment = 0;
    this.timers = { w: this.baseTime, b: this.baseTime };
    this.clockInterval = null;
    this.lastTick = null;
    this.isTimeout = false;
    this.timeoutWinner = null;

    this.currentPuzzleIndex = 0;
    this.puzzleStep = 0;
    this.puzzleSolved = false;

    this.initDOM();
    this.particles = new ParticleSystem(this.particleCanvas);
    this.screenManager = new ScreenManager(this);
    this.bindEvents();
    this.startNewGame();
  }

  initDOM() {
    this.boardEl = document.getElementById("chessboard");
    this.boardWrapper = document.getElementById("board-wrapper");
    this.particleCanvas = document.getElementById("board-particles");
    this.arrowOverlay = document.getElementById("board-arrow-overlay");

    this.statusEl = document.getElementById("game-status");
    this.panelTitle = document.getElementById("panel-title");
    this.arenaModeBadge = document.getElementById("arena-mode-badge");
    this.alertBanner = document.getElementById("alert-banner");
    this.moveLogBody = document.getElementById("move-log-body");
    this.moveLogContainer = document.getElementById("move-log-container");

    this.evalBarFill = document.getElementById("eval-bar-fill");
    this.evalBarScore = document.getElementById("eval-bar-score");

    this.openingNameEl = document.getElementById("opening-name");
    this.openingEcoEl = document.getElementById("opening-eco");
    this.openingDescEl = document.getElementById("opening-desc");

    this.tabArena = document.getElementById("tab-arena");
    this.tabPuzzle = document.getElementById("tab-puzzle");
    this.puzzlePanel = document.getElementById("puzzle-panel");
    this.puzzleSelect = document.getElementById("puzzle-select");
    this.puzzleDesc = document.getElementById("puzzle-desc");
    this.puzzleFeedback = document.getElementById("puzzle-feedback");
    this.btnNextPuzzle = document.getElementById("btn-next-puzzle");

    this.boardThemeSelect = document.getElementById("board-theme-select");
    this.soundPackSelect = document.getElementById("sound-pack-select");
    this.gameModeSelect = document.getElementById("game-mode");
    this.playerSideSelect = document.getElementById("player-side");
    this.timeControlSelect = document.getElementById("time-control");
    this.aiBadgeEl = document.getElementById("ai-thinking-badge");

    this.topClockEl = document.getElementById("top-clock");
    this.bottomClockEl = document.getElementById("bottom-clock");
    this.topNameEl = document.getElementById("top-player-name");
    this.bottomNameEl = document.getElementById("bottom-player-name");
    this.topAvatarEl = document.getElementById("top-avatar");
    this.bottomAvatarEl = document.getElementById("bottom-avatar");
    this.topCapturedEl = document.getElementById("top-captured");
    this.bottomCapturedEl = document.getElementById("bottom-captured");

    this.promoModal = document.getElementById("promotion-modal");
    this.promoButtons = document.querySelectorAll(".promo-btn");

    this.btnFirst = document.getElementById("btn-first");
    this.btnPrev = document.getElementById("btn-prev");
    this.btnNext = document.getElementById("btn-next");
    this.btnLast = document.getElementById("btn-last");
    this.btnHint = document.getElementById("btn-hint");
    this.btnFlip = document.getElementById("btn-flip");
    this.btnMute = document.getElementById("btn-mute");
    this.btnNewGame = document.getElementById("btn-new-game");
  }

  bindEvents() {
    this.btnNewGame.addEventListener("click", () => {
      if (this.activeTab === "puzzle") {
        this.loadPuzzle(this.currentPuzzleIndex);
      } else {
        this.startNewGame();
      }
    });

    this.tabArena.addEventListener("click", () => this.switchTab("arena"));
    this.tabPuzzle.addEventListener("click", () => this.switchTab("puzzle"));

    this.boardThemeSelect.addEventListener("change", (e) => {
      this.currentTheme = e.target.value;
      this.boardEl.setAttribute("data-theme", this.currentTheme);
      this.renderBoard();
    });

    this.soundPackSelect.addEventListener("change", (e) => {
      this.sound.setPack(e.target.value);
    });

    this.btnFlip.addEventListener("click", () => {
      this.isFlipped = !this.isFlipped;
      this.syncPlayerPanels();
      this.renderBoard();
      this.updateEvalBar();
      if (this.activeHint)
        this.renderHintArrow(this.activeHint.from, this.activeHint.to);
    });

    this.btnMute.addEventListener("click", () => {
      this.sound.enabled = !this.sound.enabled;
      this.btnMute.textContent = `Suara: ${this.sound.enabled ? "On" : "Off"}`;
      this.btnMute.className = `col-span-3 py-2 text-[11px] uppercase tracking-wider transition border ${
        this.sound.enabled
          ? "bg-obsidian text-muted border-line"
          : "bg-terracotta/20 text-parchment border-terracotta"
      }`;
    });

    this.btnHint.addEventListener("click", () => this.requestHint());

    this.btnFirst.addEventListener("click", () => this.jumpToMove(0));
    this.btnPrev.addEventListener("click", () =>
      this.jumpToMove(this.viewIndex - 1),
    );
    this.btnNext.addEventListener("click", () =>
      this.jumpToMove(this.viewIndex + 1),
    );
    this.btnLast.addEventListener("click", () =>
      this.jumpToMove(this.historySnapshots.length - 1),
    );

    this.puzzleSelect.addEventListener("change", (e) => {
      this.currentPuzzleIndex = parseInt(e.target.value, 10);
      this.loadPuzzle(this.currentPuzzleIndex);
    });

    this.btnNextPuzzle.addEventListener("click", () => {
      this.currentPuzzleIndex =
        (this.currentPuzzleIndex + 1) % DAILY_PUZZLES.length;
      this.puzzleSelect.value = String(this.currentPuzzleIndex);
      this.loadPuzzle(this.currentPuzzleIndex);
    });

    this.promoButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const piece = btn.getAttribute("data-piece");
        if (this.pendingPromotion) {
          const { from, to } = this.pendingPromotion;
          this.pendingPromotion = null;
          this.promoModal.classList.add("hidden");
          this.executeMove(from, to, piece, false);
        }
      });
    });
  }

  applySettingsAndRestart() {
    this.currentTheme = this.boardThemeSelect.value;
    this.boardEl.setAttribute("data-theme", this.currentTheme);
    this.sound.setPack(this.soundPackSelect.value);
    this.startNewGame();
  }

  switchTab(tab) {
    this.activeTab = tab;
    this.clearHint();

    if (tab === "arena") {
      this.tabArena.className =
        "px-4 py-1.5 transition bg-parchment text-obsidian font-semibold";
      this.tabPuzzle.className =
        "px-4 py-1.5 transition text-muted hover:text-parchment";
      this.puzzlePanel.classList.add("hidden");
      this.panelTitle.textContent = "Meja Pertandingan";
      this.startNewGame();
    } else {
      this.tabPuzzle.className =
        "px-4 py-1.5 transition bg-brass text-obsidian font-semibold";
      this.tabArena.className =
        "px-4 py-1.5 transition text-muted hover:text-parchment";
      this.puzzlePanel.classList.remove("hidden");
      this.panelTitle.textContent = "Studi Problem Taktis";
      this.loadPuzzle(this.currentPuzzleIndex);
    }
  }

  loadPuzzle(index) {
    this.stopClock();
    if (this.aiTimeoutId) {
      clearTimeout(this.aiTimeoutId);
      this.aiTimeoutId = null;
    }

    const puzzle = DAILY_PUZZLES[index];
    this.currentPuzzleIndex = index;
    this.puzzleStep = 0;
    this.puzzleSolved = false;
    this.btnNextPuzzle.classList.add("hidden");
    this.puzzleFeedback.textContent = "Temukan langkah pembuka...";
    this.puzzleFeedback.className = "font-mono text-brass";
    this.puzzleDesc.textContent = puzzle.desc;

    this.game.load(puzzle.fen);
    this.humanColor = puzzle.playerColor;
    this.isFlipped = this.humanColor === "b";

    this.historySnapshots = [
      { fen: this.game.fen(), lastMove: null, san: null, transitions: [] },
    ];
    this.viewIndex = 0;

    this.selectedSquare = null;
    this.legalMoves = [];
    this.pendingPromotion = null;
    this.clearHint();

    this.topNameEl.textContent = "Komposisi Lawan";
    this.bottomNameEl.textContent = "Anda (Analis)";
    this.topClockEl.textContent = "--:--";
    this.bottomClockEl.textContent = "--:--";
    this.arenaModeBadge.textContent = "Studi Taktis";

    this.syncPlayerPanels();
    this.renderBoard();
    this.updateMoveLog();
    this.updateEvalBar();
    this.updateOpeningDisplay();
    this.statusEl.textContent = `${puzzle.title} — Giliran Anda`;
    this.alertBanner.classList.add("hidden");
  }

  handlePuzzleMove(from, to, san) {
    const puzzle = DAILY_PUZZLES[this.currentPuzzleIndex];
    const expectedMove = puzzle.moves[this.puzzleStep];

    if (!expectedMove || expectedMove.from !== from || expectedMove.to !== to) {
      this.sound.puzzleError();
      this.triggerScreenShake("subtle");
      this.puzzleFeedback.textContent =
        "Langkah kurang akurat. Evaluasi kembali.";
      this.puzzleFeedback.className = "font-mono text-terracotta font-semibold";

      setTimeout(() => {
        this.game.load(puzzle.fen);
        this.puzzleStep = 0;
        this.historySnapshots = [
          { fen: this.game.fen(), lastMove: null, san: null, transitions: [] },
        ];
        this.viewIndex = 0;
        this.selectedSquare = null;
        this.legalMoves = [];
        this.renderBoard();
        this.updateMoveLog();
        this.updateEvalBar();
      }, 700);
      return false;
    }

    this.puzzleStep++;
    if (this.puzzleStep >= puzzle.moves.length) {
      this.puzzleSolved = true;
      this.sound.puzzleSuccess();
      this.triggerScreenShake("heavy");
      this.particles.spawnVictoryCelebration(this.currentTheme);

      this.puzzleFeedback.textContent = "Solusi Tepat — Skakmat Terverifikasi.";
      this.puzzleFeedback.className = "font-mono text-brass font-bold";
      this.btnNextPuzzle.classList.remove("hidden");
      this.showBanner(
        "Solusi Taktis Terverifikasi. Silakan lanjut ke problem berikutnya.",
        "bg-obsidian text-brass border border-brass",
      );
      return true;
    }

    const replyMove = puzzle.moves[this.puzzleStep];
    if (replyMove && replyMove.reply) {
      this.puzzleFeedback.textContent =
        "Langkah tepat. Menunggu respon lawan...";
      this.puzzleFeedback.className = "font-mono text-parchment";

      setTimeout(() => {
        this.puzzleStep++;
        this.executeMove(replyMove.from, replyMove.to, "q", false);

        if (this.puzzleStep >= puzzle.moves.length) {
          this.puzzleSolved = true;
          this.sound.puzzleSuccess();
          this.triggerScreenShake("heavy");
          this.particles.spawnVictoryCelebration(this.currentTheme);
          this.puzzleFeedback.textContent =
            "Solusi Tepat — Skakmat Terverifikasi.";
          this.puzzleFeedback.className = "font-mono text-brass font-bold";
          this.btnNextPuzzle.classList.remove("hidden");
        }
      }, 350);
    }

    return true;
  }

  updateEvalBar() {
    const currentFen =
      this.historySnapshots[this.viewIndex]?.fen || this.game.fen();
    const tempBoard = new Chess(currentFen);

    let score = this.ai.evaluateBoard(tempBoard, "w");
    let whitePercent = 50;
    let scoreText = "0.0";

    if (tempBoard.in_checkmate()) {
      if (tempBoard.turn() === "w") {
        whitePercent = 0;
        scoreText = "0-1";
      } else {
        whitePercent = 100;
        scoreText = "1-0";
      }
    } else if (tempBoard.in_draw() || tempBoard.in_stalemate()) {
      whitePercent = 50;
      scoreText = "½-½";
    } else {
      const sigmoid = 1 / (1 + Math.exp(-score / 350));
      whitePercent = Math.min(97, Math.max(3, sigmoid * 100));

      const pawnDiff = (score / 100).toFixed(1);
      scoreText = score > 0 ? `+${pawnDiff}` : pawnDiff;
    }

    const visualHeight = this.isFlipped ? 100 - whitePercent : whitePercent;
    this.evalBarFill.style.height = `${visualHeight}%`;
    this.evalBarScore.textContent = scoreText;

    if (visualHeight > 50) {
      this.evalBarScore.style.bottom = "6px";
      this.evalBarScore.style.top = "auto";
      this.evalBarScore.className = "eval-bar-score text-obsidian";
    } else {
      this.evalBarScore.style.top = "6px";
      this.evalBarScore.style.bottom = "auto";
      this.evalBarScore.className = "eval-bar-score text-parchment";
    }
  }

  requestHint() {
    if (
      this.isReviewMode() ||
      this.isGameEnded() ||
      this.isAIThinking ||
      !this.isHumanTurn()
    )
      return;

    if (this.activeTab === "puzzle") {
      const puzzle = DAILY_PUZZLES[this.currentPuzzleIndex];
      const nextMove = puzzle.moves[this.puzzleStep];
      if (nextMove) {
        this.renderHintArrow(nextMove.from, nextMove.to);
        this.showBanner(
          `Petunjuk: ${puzzle.hint}`,
          "bg-obsidian text-brass border border-brass/60",
        );
      }
      return;
    }

    const bestMove = this.ai.getHintMove(this.game.fen(), this.game.turn());
    if (bestMove) {
      this.activeHint = bestMove;
      this.renderHintArrow(bestMove.from, bestMove.to);
      const turnName = this.game.turn() === "w" ? "Putih" : "Hitam";
      this.showBanner(
        `Rekomendasi Engine (${turnName}): ${bestMove.san} [${bestMove.from.toUpperCase()} → ${bestMove.to.toUpperCase()}]`,
        "bg-obsidian text-brass border border-brass/60",
      );
    }
  }

  clearHint() {
    this.activeHint = null;
    this.arrowOverlay.innerHTML = "";
    document.querySelectorAll(".sq-hint-from, .sq-hint-to").forEach((sq) => {
      sq.classList.remove("sq-hint-from", "sq-hint-to");
    });
  }

  renderHintArrow(fromSq, toSq) {
    this.clearHint();
    this.activeHint = { from: fromSq, to: toSq };

    const fromCoord = this.squareToVisualCoords(fromSq);
    const toCoord = this.squareToVisualCoords(toSq);

    const fromEl = this.boardEl.querySelector(`[data-square="${fromSq}"]`);
    const toEl = this.boardEl.querySelector(`[data-square="${toSq}"]`);
    if (fromEl) fromEl.classList.add("sq-hint-from");
    if (toEl) toEl.classList.add("sq-hint-to");

    const squareSize = 100;
    const x1 = fromCoord.col * squareSize + squareSize / 2;
    const y1 = fromCoord.row * squareSize + squareSize / 2;
    const x2 = toCoord.col * squareSize + squareSize / 2;
    const y2 = toCoord.row * squareSize + squareSize / 2;

    const angle = Math.atan2(y2 - y1, x2 - x1);
    const shortenHead = 24;
    const targetX = x2 - Math.cos(angle) * shortenHead;
    const targetY = y2 - Math.sin(angle) * shortenHead;

    const headLength = 20;
    const headAngle = Math.PI / 6;

    const hx1 = targetX - headLength * Math.cos(angle - headAngle);
    const hy1 = targetY - headLength * Math.sin(angle - headAngle);
    const hx2 = targetX - headLength * Math.cos(angle + headAngle);
    const hy2 = targetY - headLength * Math.sin(angle + headAngle);

    this.arrowOverlay.innerHTML = `
      <path d="M ${x1} ${y1} L ${targetX} ${targetY}" class="hint-arrow" />
      <polygon points="${x2},${y2} ${hx1},${hy1} ${hx2},${hy2}" fill="#c59b57" />
    `;
  }

  triggerScreenShake(intensity = "subtle") {
    const shakeClass = intensity === "heavy" ? "shake-heavy" : "shake-subtle";
    this.boardWrapper.classList.remove("shake-subtle", "shake-heavy");
    void this.boardWrapper.offsetWidth;
    this.boardWrapper.classList.add(shakeClass);
    setTimeout(
      () => {
        this.boardWrapper.classList.remove(shakeClass);
      },
      intensity === "heavy" ? 450 : 250,
    );
  }

  updateOpeningDisplay() {
    const sans = this.historySnapshots
      .slice(1, this.viewIndex + 1)
      .map((s) => s.san)
      .filter(Boolean);

    const detected = detectOpening(sans);
    this.openingEcoEl.textContent = detected.eco;
    this.openingNameEl.textContent = detected.name;
    this.openingDescEl.textContent = detected.desc;
  }

  isVsAI() {
    if (this.activeTab === "puzzle") return false;
    return this.gameMode !== "pvp";
  }

  getAIColor() {
    return this.humanColor === "w" ? "b" : "w";
  }

  isHumanTurn() {
    if (this.activeTab === "puzzle") {
      return this.game.turn() === this.humanColor;
    }
    if (!this.isVsAI()) return true;
    return this.game.turn() === this.humanColor;
  }

  squareToVisualCoords(sq) {
    const fileIndex = sq.charCodeAt(0) - 97;
    const rankIndex = parseInt(sq[1], 10) - 1;
    return {
      row: this.isFlipped ? rankIndex : 7 - rankIndex,
      col: this.isFlipped ? 7 - fileIndex : fileIndex,
    };
  }

  startNewGame() {
    this.stopClock();
    if (this.aiTimeoutId) {
      clearTimeout(this.aiTimeoutId);
      this.aiTimeoutId = null;
    }

    this.game.reset();
    this.gameMode = this.gameModeSelect.value;
    this.humanColor = this.playerSideSelect.value;

    const modeLabels = {
      pvp: "2 Pemain (Lokal)",
      "ai-normal": "vs AI (Normal)",
      "ai-medium": "vs AI (Sedang)",
      "ai-hard": "vs AI (Master)",
    };
    this.arenaModeBadge.textContent =
      modeLabels[this.gameMode] || "Arena Catur";

    if (this.isVsAI()) this.isFlipped = this.humanColor === "b";
    else this.isFlipped = false;

    const [seconds, inc] = this.timeControlSelect.value.split(",").map(Number);
    this.baseTime = seconds * 1000;
    this.increment = inc * 1000;
    this.timers = { w: this.baseTime, b: this.baseTime };
    this.isTimeout = false;
    this.timeoutWinner = null;
    this.isAIThinking = false;
    this.aiBadgeEl.classList.add("hidden");

    this.selectedSquare = null;
    this.legalMoves = [];
    this.pendingPromotion = null;
    this.promoModal.classList.add("hidden");
    this.clearHint();

    this.historySnapshots = [
      { fen: this.game.fen(), lastMove: null, san: null, transitions: [] },
    ];
    this.viewIndex = 0;

    this.boardEl.setAttribute("data-theme", this.currentTheme);
    this.syncPlayerPanels();
    this.renderBoard();
    this.updateMoveLog();
    this.updateStatus();
    this.updateClockUI();
    this.updateEvalBar();
    this.updateOpeningDisplay();

    if (this.isVsAI() && this.humanColor === "b") {
      this.triggerAIMove();
    }
  }

  isReviewMode() {
    return this.viewIndex < this.historySnapshots.length - 1;
  }

  isGameEnded() {
    return this.isTimeout || this.game.game_over();
  }

  renderBoard(animConfig = null) {
    this.boardEl.innerHTML = "";
    const snapshot = this.historySnapshots[this.viewIndex] || {
      fen: this.game.fen(),
    };
    const tempBoard = new Chess(snapshot.fen);
    const boardState = tempBoard.board();
    const inCheck = tempBoard.in_check();
    const turnColor = tempBoard.turn();

    const ranks = this.isFlipped
      ? [0, 1, 2, 3, 4, 5, 6, 7]
      : [7, 6, 5, 4, 3, 2, 1, 0];
    const files = this.isFlipped
      ? [7, 6, 5, 4, 3, 2, 1, 0]
      : [0, 1, 2, 3, 4, 5, 6, 7];
    const fileLetters = ["a", "b", "c", "d", "e", "f", "g", "h"];

    ranks.forEach((rIdx, visualRow) => {
      files.forEach((fIdx, visualCol) => {
        const squareName = `${fileLetters[fIdx]}${rIdx + 1}`;
        const isLight = (rIdx + fIdx) % 2 !== 0;
        const piece = boardState[7 - rIdx][fIdx];

        const sqEl = document.createElement("div");
        sqEl.dataset.square = squareName;
        sqEl.className = `relative flex items-center justify-center select-none ${isLight ? "sq-light" : "sq-dark"}`;

        if (
          snapshot.lastMove &&
          (snapshot.lastMove.from === squareName ||
            snapshot.lastMove.to === squareName)
        ) {
          sqEl.classList.add("highlight-move");
        }

        if (this.selectedSquare === squareName && !this.isReviewMode()) {
          sqEl.classList.add("sq-selected");
        }

        if (
          inCheck &&
          piece &&
          piece.type === "k" &&
          piece.color === turnColor
        ) {
          sqEl.classList.add("sq-check");
        }

        if (this.activeHint) {
          if (this.activeHint.from === squareName)
            sqEl.classList.add("sq-hint-from");
          if (this.activeHint.to === squareName)
            sqEl.classList.add("sq-hint-to");
        }

        if (visualCol === 0) {
          const rankLabel = document.createElement("span");
          rankLabel.className =
            "absolute top-1 left-1 text-[9px] font-mono font-semibold leading-none pointer-events-none opacity-75";
          rankLabel.textContent = rIdx + 1;
          sqEl.appendChild(rankLabel);
        }

        if (visualRow === 7) {
          const fileLabel = document.createElement("span");
          fileLabel.className =
            "absolute bottom-1 right-1 text-[9px] font-mono font-semibold leading-none pointer-events-none opacity-75";
          fileLabel.textContent = fileLetters[fIdx];
          sqEl.appendChild(fileLabel);
        }

        if (
          animConfig &&
          animConfig.captured &&
          animConfig.captured.square === squareName
        ) {
          const ghostEl = document.createElement("div");
          ghostEl.className = "piece-captured-ghost";
          ghostEl.innerHTML = createPieceSVG(
            animConfig.captured.type,
            animConfig.captured.color,
            this.currentTheme,
          );
          sqEl.appendChild(ghostEl);

          if (ghostEl.animate) {
            const ghostAnim = ghostEl.animate(
              [
                { transform: "scale(1)", opacity: 0.9 },
                { transform: "scale(0.35)", opacity: 0 },
              ],
              { duration: 200, easing: "ease-out", fill: "forwards" },
            );
            ghostAnim.onfinish = () => ghostEl.remove();
          } else {
            ghostEl.remove();
          }
        }

        if (piece) {
          const pieceWrapper = document.createElement("div");
          pieceWrapper.className = "piece-wrapper";
          if (this.draggingSquare === squareName) {
            pieceWrapper.classList.add("is-origin-hidden");
          }
          pieceWrapper.innerHTML = createPieceSVG(
            piece.type,
            piece.color,
            this.currentTheme,
          );

          const canInteract =
            !this.isReviewMode() &&
            !this.isGameEnded() &&
            !this.isAIThinking &&
            this.isHumanTurn() &&
            piece.color === this.game.turn();

          if (canInteract) {
            pieceWrapper.addEventListener("pointerdown", (e) =>
              this.onPointerDown(e, squareName, pieceWrapper),
            );
          }

          sqEl.appendChild(pieceWrapper);

          if (animConfig && animConfig.moves && pieceWrapper.animate) {
            const moveEntry = animConfig.moves.find((m) => m.to === squareName);
            if (moveEntry) {
              const fromCoord = this.squareToVisualCoords(moveEntry.from);
              const toCoord = this.squareToVisualCoords(moveEntry.to);
              const deltaX = (fromCoord.col - toCoord.col) * 100;
              const deltaY = (fromCoord.row - toCoord.row) * 100;

              pieceWrapper.classList.add("animating");
              const slideAnim = pieceWrapper.animate(
                [
                  {
                    transform: `translate(${deltaX}%, ${deltaY}%) scale(1.06)`,
                  },
                  { transform: "translate(0%, 0%) scale(1)" },
                ],
                { duration: 220, easing: "cubic-bezier(0.22, 1, 0.36, 1)" },
              );
              slideAnim.onfinish = () =>
                pieceWrapper.classList.remove("animating");
            }
          }

          if (
            animConfig &&
            animConfig.snapSquare === squareName &&
            pieceWrapper.animate
          ) {
            pieceWrapper.animate(
              [{ transform: "scale(1.14)" }, { transform: "scale(1)" }],
              { duration: 140, easing: "ease-out" },
            );
          }
        }

        if (!this.isReviewMode() && !this.isAIThinking) {
          const legalMove = this.legalMoves.find((m) => m.to === squareName);
          if (legalMove) {
            const indicator = document.createElement("div");
            const isCapture = Boolean(piece) || legalMove.flags.includes("e");
            indicator.className = isCapture
              ? "legal-capture absolute"
              : "legal-dot absolute";
            sqEl.appendChild(indicator);
          }
        }

        sqEl.addEventListener("click", () => this.onSquareClick(squareName));
        this.boardEl.appendChild(sqEl);
      });
    });

    this.updateCapturedPieces(snapshot.fen);
    this.updateNavButtons();
  }

  onPointerDown(e, squareName, pieceWrapper) {
    if (
      this.isReviewMode() ||
      this.isGameEnded() ||
      this.isAIThinking ||
      !this.isHumanTurn()
    )
      return;
    e.stopPropagation();

    this.clearHint();

    const startX = e.clientX;
    const startY = e.clientY;
    let isDragging = false;

    this.selectedSquare = squareName;
    this.legalMoves = this.game.moves({ square: squareName, verbose: true });
    this.renderBoard();

    const onPointerMove = (moveEvent) => {
      const dx = moveEvent.clientX - startX;
      const dy = moveEvent.clientY - startY;

      if (!isDragging && (Math.abs(dx) > 3 || Math.abs(dy) > 3)) {
        isDragging = true;
        this.draggingSquare = squareName;

        const liveOriginPiece = this.boardEl.querySelector(
          `[data-square="${squareName}"] .piece-wrapper`,
        );
        if (liveOriginPiece) {
          liveOriginPiece.classList.add("is-origin-hidden");
        }

        const ghost = document.createElement("div");
        ghost.id = "active-drag-ghost";
        ghost.className = "piece-floating-ghost";
        ghost.innerHTML = liveOriginPiece
          ? liveOriginPiece.innerHTML
          : pieceWrapper.innerHTML;

        const sqEl = this.boardEl.querySelector(
          `[data-square="${squareName}"]`,
        );
        if (sqEl) {
          const sqRect = sqEl.getBoundingClientRect();
          ghost.style.width = `${sqRect.width}px`;
          ghost.style.height = `${sqRect.height}px`;
        }

        ghost.style.left = `${moveEvent.clientX}px`;
        ghost.style.top = `${moveEvent.clientY}px`;
        document.body.appendChild(ghost);
      }

      if (isDragging) {
        const ghost = document.getElementById("active-drag-ghost");
        if (ghost) {
          ghost.style.left = `${moveEvent.clientX}px`;
          ghost.style.top = `${moveEvent.clientY}px`;
        }
      }
    };

    const onPointerUp = (upEvent) => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);

      const ghost = document.getElementById("active-drag-ghost");
      if (ghost) ghost.remove();

      const wasDragging = isDragging;
      this.draggingSquare = null;

      if (wasDragging) {
        const liveOriginPiece = this.boardEl.querySelector(
          `[data-square="${squareName}"] .piece-wrapper`,
        );
        if (liveOriginPiece) {
          liveOriginPiece.classList.remove("is-origin-hidden");
        }

        const elemBelow = document.elementFromPoint(
          upEvent.clientX,
          upEvent.clientY,
        );
        const targetSquareEl = elemBelow
          ? elemBelow.closest("[data-square]")
          : null;

        if (targetSquareEl) {
          const targetSquare = targetSquareEl.dataset.square;
          const validMove = this.legalMoves.find((m) => m.to === targetSquare);
          if (validMove) {
            this.tryMove(squareName, targetSquare, true);
            return;
          }
        }
        this.renderBoard();
      }
    };

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
  }

  onSquareClick(squareName) {
    if (
      this.isReviewMode() ||
      this.isGameEnded() ||
      this.isAIThinking ||
      !this.isHumanTurn()
    )
      return;

    this.clearHint();

    const validMove = this.legalMoves.find((m) => m.to === squareName);
    if (this.selectedSquare && validMove) {
      this.tryMove(this.selectedSquare, squareName, false);
      return;
    }

    const piece = this.game.get(squareName);
    if (piece && piece.color === this.game.turn()) {
      if (this.selectedSquare === squareName) this.clearSelection();
      else this.selectSquare(squareName);
    } else {
      this.clearSelection();
    }
  }

  selectSquare(squareName) {
    this.selectedSquare = squareName;
    this.legalMoves = this.game.moves({ square: squareName, verbose: true });
    this.renderBoard();
  }

  clearSelection() {
    this.selectedSquare = null;
    this.legalMoves = [];
    this.renderBoard();
  }

  tryMove(from, to, isDrag = false) {
    const matchingMoves = this.legalMoves.filter(
      (m) => m.from === from && m.to === to,
    );
    if (matchingMoves.length === 0) return;

    const isPromotion = matchingMoves.some((m) => m.flags.includes("p"));
    if (isPromotion) {
      this.pendingPromotion = { from, to };
      this.showPromotionModal(this.game.turn());
    } else {
      this.executeMove(from, to, "q", isDrag);
    }
  }

  showPromotionModal(color) {
    this.promoButtons.forEach((btn) => {
      const pieceType = btn.getAttribute("data-piece");
      btn.innerHTML = `<div class="w-12 h-12 flex items-center justify-center">${createPieceSVG(pieceType, color, this.currentTheme)}</div>`;
    });
    this.promoModal.classList.remove("hidden");
  }

  executeMove(from, to, promotion = "q", isDrag = false) {
    const movingColor = this.game.turn();
    const opponentColor = movingColor === "w" ? "b" : "w";
    const moveResult = this.game.move({ from, to, promotion });

    if (!moveResult) return;

    if (this.activeTab === "puzzle" && movingColor === this.humanColor) {
      const isCorrect = this.handlePuzzleMove(from, to, moveResult.san);
      if (!isCorrect) {
        return;
      }
    }

    if (this.historySnapshots.length > 1) {
      this.timers[movingColor] += this.increment;
    }

    const transitions = [{ from: moveResult.from, to: moveResult.to }];
    const activeSlides = isDrag
      ? []
      : [{ from: moveResult.from, to: moveResult.to }];

    const rank = movingColor === "w" ? "1" : "8";
    if (moveResult.flags.includes("k")) {
      const rookSlide = { from: `h${rank}`, to: `f${rank}` };
      transitions.push(rookSlide);
      activeSlides.push(rookSlide);
    } else if (moveResult.flags.includes("q")) {
      const rookSlide = { from: `a${rank}`, to: `d${rank}` };
      transitions.push(rookSlide);
      activeSlides.push(rookSlide);
    }

    let capturedData = null;
    const isCapture =
      moveResult.flags.includes("c") || moveResult.flags.includes("e");
    if (moveResult.captured) {
      let capSquare = moveResult.to;
      if (moveResult.flags.includes("e")) {
        const capRank = movingColor === "w" ? "5" : "4";
        capSquare = `${moveResult.to[0]}${capRank}`;
      }
      capturedData = {
        square: capSquare,
        type: moveResult.captured,
        color: opponentColor,
      };

      const targetCoord = this.squareToVisualCoords(capSquare);
      const rect = this.boardEl.getBoundingClientRect();
      const sqSize = rect.width / 8;
      const sparkX = targetCoord.col * sqSize + sqSize / 2;
      const sparkY = targetCoord.row * sqSize + sqSize / 2;
      this.particles.spawnSparks(sparkX, sparkY, this.currentTheme, 18);
      this.triggerScreenShake("subtle");
    }

    this.historySnapshots.push({
      fen: this.game.fen(),
      lastMove: { from: moveResult.from, to: moveResult.to },
      san: moveResult.san,
      transitions,
    });
    this.viewIndex = this.historySnapshots.length - 1;

    this.selectedSquare = null;
    this.legalMoves = [];
    this.clearHint();

    if (this.game.in_checkmate()) {
      this.sound.gameOver();
      this.stopClock();
      this.triggerScreenShake("heavy");
      this.particles.spawnVictoryCelebration(this.currentTheme);
    } else if (this.game.in_draw()) {
      this.sound.gameOver();
      this.stopClock();
    } else if (this.game.in_check()) {
      this.sound.check();
      const kingSquare = this.findKingSquare(this.game.turn());
      if (kingSquare) {
        const kCoord = this.squareToVisualCoords(kingSquare);
        const rect = this.boardEl.getBoundingClientRect();
        const sqSize = rect.width / 8;
        this.particles.spawnCheckPulse(
          kCoord.col * sqSize + sqSize / 2,
          kCoord.row * sqSize + sqSize / 2,
        );
      }
    } else if (
      moveResult.flags.includes("k") ||
      moveResult.flags.includes("q")
    ) {
      this.sound.castle();
    } else if (isCapture) {
      this.sound.capture();
    } else {
      this.sound.move();
    }

    if (
      !this.clockInterval &&
      !this.game.game_over() &&
      this.activeTab === "arena"
    ) {
      this.startClock();
    }

    this.renderBoard({
      moves: activeSlides,
      captured: capturedData,
      snapSquare: isDrag ? moveResult.to : null,
    });
    this.updateMoveLog();
    this.updateStatus();
    this.updateClockUI();
    this.updateEvalBar();
    this.updateOpeningDisplay();

    if (
      !this.isGameEnded() &&
      this.activeTab === "arena" &&
      this.isVsAI() &&
      !this.isHumanTurn()
    ) {
      this.triggerAIMove();
    }
  }

  findKingSquare(color) {
    const board = this.game.board();
    const files = ["a", "b", "c", "d", "e", "f", "g", "h"];
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const p = board[r][c];
        if (p && p.type === "k" && p.color === color) {
          return `${files[c]}${8 - r}`;
        }
      }
    }
    return null;
  }

  triggerAIMove() {
    this.isAIThinking = true;
    this.aiBadgeEl.classList.remove("hidden");
    this.updateStatus();

    const delay = this.gameMode === "ai-hard" ? 220 : 320;
    this.aiTimeoutId = setTimeout(() => {
      if (this.isGameEnded()) return;

      const aiColor = this.getAIColor();
      const bestMove = this.ai.getBestMove(
        this.game.fen(),
        this.gameMode,
        aiColor,
      );

      this.isAIThinking = false;
      this.aiBadgeEl.classList.add("hidden");

      if (bestMove) {
        this.executeMove(
          bestMove.from,
          bestMove.to,
          bestMove.promotion || "q",
          false,
        );
      }
    }, delay);
  }

  startClock() {
    this.lastTick = performance.now();
    this.clockInterval = setInterval(() => {
      if (this.isGameEnded()) {
        this.stopClock();
        return;
      }

      const now = performance.now();
      const delta = now - this.lastTick;
      this.lastTick = now;

      const activeTurn = this.game.turn();
      this.timers[activeTurn] = Math.max(0, this.timers[activeTurn] - delta);

      this.updateClockUI();

      if (this.timers[activeTurn] <= 0) {
        this.isTimeout = true;
        this.timeoutWinner = activeTurn === "w" ? "Hitam" : "Putih";
        this.stopClock();
        this.sound.gameOver();
        this.updateStatus();
        this.renderBoard();
      }
    }, 100);
  }

  stopClock() {
    if (this.clockInterval) {
      clearInterval(this.clockInterval);
      this.clockInterval = null;
    }
  }

  formatTime(ms) {
    const totalSeconds = Math.ceil(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }

  updateClockUI() {
    if (this.activeTab === "puzzle") return;

    const topColor = this.isFlipped ? "w" : "b";
    const bottomColor = this.isFlipped ? "b" : "w";
    const activeTurn = this.game.turn();

    this.topClockEl.textContent = this.formatTime(this.timers[topColor]);
    this.bottomClockEl.textContent = this.formatTime(this.timers[bottomColor]);

    const activeStyle =
      "font-mono text-xl font-semibold px-3 py-1 bg-obsidian text-brass border border-brass";
    const inactiveStyle =
      "font-mono text-xl font-semibold px-3 py-1 bg-obsidian text-muted border border-line";

    this.topClockEl.className =
      activeTurn === topColor && !this.isGameEnded()
        ? activeStyle
        : inactiveStyle;
    this.bottomClockEl.className =
      activeTurn === bottomColor && !this.isGameEnded()
        ? activeStyle
        : inactiveStyle;
  }

  getPlayerLabel(color) {
    if (this.activeTab === "puzzle") {
      return color === this.humanColor ? "Anda (Analis)" : "Komposisi Lawan";
    }
    const colorName = color === "w" ? "Putih" : "Hitam";
    if (!this.isVsAI()) return `Pemain ${colorName}`;
    if (color === this.humanColor) return `Anda (${colorName})`;
    const levelNames = {
      "ai-normal": "AI Normal",
      "ai-medium": "AI Sedang",
      "ai-hard": "AI Master",
    };
    return `${levelNames[this.gameMode]} (${colorName})`;
  }

  syncPlayerPanels() {
    const topColor = this.isFlipped ? "w" : "b";
    const bottomColor = this.isFlipped ? "b" : "w";

    this.topNameEl.textContent = this.getPlayerLabel(topColor);
    this.bottomNameEl.textContent = this.getPlayerLabel(bottomColor);

    const whiteAvatarClass =
      "w-8 h-8 bg-parchment text-obsidian border border-line flex items-center justify-center font-mono font-bold text-xs";
    const blackAvatarClass =
      "w-8 h-8 bg-obsidian text-parchment border border-line flex items-center justify-center font-mono font-bold text-xs";

    this.topAvatarEl.textContent = topColor === "w" ? "W" : "B";
    this.topAvatarEl.className =
      topColor === "w" ? whiteAvatarClass : blackAvatarClass;

    this.bottomAvatarEl.textContent = bottomColor === "w" ? "W" : "B";
    this.bottomAvatarEl.className =
      bottomColor === "w" ? whiteAvatarClass : blackAvatarClass;

    this.updateClockUI();
  }

  updateCapturedPieces(fen) {
    const startCounts = { p: 8, n: 2, b: 2, r: 2, q: 1 };
    const current = {
      w: { p: 0, n: 0, b: 0, r: 0, q: 0 },
      b: { p: 0, n: 0, b: 0, r: 0, q: 0 },
    };

    const temp = new Chess(fen);
    temp.board().forEach((row) => {
      row.forEach((p) => {
        if (p && p.type !== "k") current[p.color][p.type]++;
      });
    });

    const symbols = { q: "♕", r: "♖", b: "♗", n: "♘", p: "♙" };
    const capturedByWhite = [];
    const capturedByBlack = [];

    ["q", "r", "b", "n", "p"].forEach((type) => {
      const missingBlack = Math.max(0, startCounts[type] - current.b[type]);
      for (let i = 0; i < missingBlack; i++)
        capturedByWhite.push(symbols[type]);

      const missingWhite = Math.max(0, startCounts[type] - current.w[type]);
      for (let i = 0; i < missingWhite; i++)
        capturedByBlack.push(symbols[type]);
    });

    const whiteStr = capturedByWhite.join("");
    const blackStr = capturedByBlack.join("");

    if (this.isFlipped) {
      this.topCapturedEl.textContent = whiteStr;
      this.bottomCapturedEl.textContent = blackStr;
    } else {
      this.topCapturedEl.textContent = blackStr;
      this.bottomCapturedEl.textContent = whiteStr;
    }
  }

  updateMoveLog() {
    this.moveLogBody.innerHTML = "";
    for (let i = 1; i < this.historySnapshots.length; i += 2) {
      const moveNumber = Math.ceil(i / 2);
      const whiteSnap = this.historySnapshots[i];
      const blackSnap = this.historySnapshots[i + 1];

      const tr = document.createElement("tr");
      tr.className = "hover:bg-charcoal transition";

      const tdNum = document.createElement("td");
      tdNum.className = "py-1.5 px-2 text-muted";
      tdNum.textContent = `${moveNumber}.`;

      const tdWhite = document.createElement("td");
      tdWhite.className = `py-1.5 px-2 cursor-pointer ${
        this.viewIndex === i
          ? "bg-brass/20 text-brass font-bold"
          : "text-parchment"
      }`;
      tdWhite.textContent = whiteSnap.san;
      tdWhite.addEventListener("click", () => this.jumpToMove(i));

      const tdBlack = document.createElement("td");
      tdBlack.className = `py-1.5 px-2 cursor-pointer ${
        this.viewIndex === i + 1
          ? "bg-brass/20 text-brass font-bold"
          : "text-parchment"
      }`;
      if (blackSnap) {
        tdBlack.textContent = blackSnap.san;
        tdBlack.addEventListener("click", () => this.jumpToMove(i + 1));
      }

      tr.appendChild(tdNum);
      tr.appendChild(tdWhite);
      tr.appendChild(tdBlack);
      this.moveLogBody.appendChild(tr);
    }
    this.moveLogContainer.scrollTop = this.moveLogContainer.scrollHeight;
  }

  jumpToMove(targetIndex) {
    if (targetIndex < 0 || targetIndex >= this.historySnapshots.length) return;

    let animMoves = null;
    if (targetIndex === this.viewIndex + 1) {
      animMoves = this.historySnapshots[targetIndex].transitions || [];
      this.sound.move();
    } else if (targetIndex === this.viewIndex - 1) {
      const prevTransitions =
        this.historySnapshots[this.viewIndex].transitions || [];
      animMoves = prevTransitions.map((t) => ({ from: t.to, to: t.from }));
      this.sound.move();
    }

    this.viewIndex = targetIndex;
    this.selectedSquare = null;
    this.legalMoves = [];
    this.clearHint();

    this.renderBoard(animMoves ? { moves: animMoves } : null);
    this.updateMoveLog();
    this.updateStatus();
    this.updateEvalBar();
    this.updateOpeningDisplay();
  }

  updateNavButtons() {
    this.btnFirst.disabled = this.viewIndex === 0;
    this.btnPrev.disabled = this.viewIndex === 0;
    this.btnNext.disabled = this.viewIndex >= this.historySnapshots.length - 1;
    this.btnLast.disabled = this.viewIndex >= this.historySnapshots.length - 1;
  }

  updateStatus() {
    const turnName = this.game.turn() === "w" ? "Putih" : "Hitam";
    const winnerName = this.game.turn() === "w" ? "Hitam" : "Putih";

    this.alertBanner.classList.add("hidden");

    if (this.isTimeout) {
      this.statusEl.textContent = `Waktu Habis — ${this.timeoutWinner} Menang`;
      this.showBanner(
        `Pertandingan Selesai: ${this.timeoutWinner} menang atas waktu.`,
        "bg-terracotta/20 text-parchment border border-terracotta",
      );
      return;
    }

    if (this.game.in_checkmate()) {
      this.statusEl.textContent = `Skakmat — ${winnerName} Menang`;
      this.showBanner(
        `Skakmat. ${winnerName} memenangkan pertandingan.`,
        "bg-obsidian text-brass border border-brass",
      );
      return;
    }

    if (this.game.in_draw()) {
      let reason = "Kesepakatan / Aturan 50 Langkah";
      if (this.game.in_stalemate()) reason = "Stalemate";
      else if (this.game.in_threefold_repetition())
        reason = "Pengulangan Posisi 3 Kali";
      else if (this.game.insufficient_material()) reason = "Materi Tidak Cukup";
      this.statusEl.textContent = `Remis (${reason})`;
      this.showBanner(
        `Pertandingan Berakhir Remis: ${reason}`,
        "bg-obsidian text-muted border border-line",
      );
      return;
    }

    if (this.isReviewMode()) {
      this.showBanner(
        'Mode Tinjauan Arsip: Klik ">|" untuk kembali ke posisi aktif.',
        "bg-obsidian text-parchment border border-line",
      );
    }

    if (this.isAIThinking) {
      this.statusEl.textContent = `Mesin AI (${turnName}) sedang mengalkulasi...`;
    } else if (this.game.in_check()) {
      this.statusEl.textContent = `Giliran ${turnName} — Posisi Skak`;
    } else {
      this.statusEl.textContent = `Giliran ${turnName} Melangkah`;
    }
  }

  showBanner(message, classes) {
    this.alertBanner.textContent = message;
    this.alertBanner.className = `mt-2 px-3 py-2 font-mono text-xs text-center ${classes}`;
    this.alertBanner.classList.remove("hidden");
  }
}

window.addEventListener("DOMContentLoaded", () => {
  new ChessApp();
});
