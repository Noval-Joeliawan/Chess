/**
 * ============================================================================
 * Grandmaster Web Chess — Lead Game Developer & UI/UX Masterpiece Edition
 * ============================================================================
 */

/* ----------------------------------------------------------------------------
   1. Modul Audio Sintetis Berlapis berbasis Web Audio API (Multi Sound Packs)
   ---------------------------------------------------------------------------- */
class SoundEngine {
  constructor() {
    this.ctx = null;
    this.enabled = true;
    this.pack = "wood"; // 'wood' | 'arcade' | 'scifi'
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

  playTone(freq, duration, type = "sine", gainLevel = 0.15, delay = 0, pitchEnd = null) {
    if (!this.enabled) return;
    this.init();

    const startTime = this.ctx.currentTime + delay;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, startTime);
    if (pitchEnd !== null) {
      osc.frequency.exponentialRampToValueAtTime(Math.max(10, pitchEnd), startTime + duration);
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
    osc.frequency.exponentialRampToValueAtTime(freq * 0.45, startTime + duration);

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
        this.playTone(320, 0.05, "square", 0.18, 0, 580);
        break;
      case "scifi":
        this.playTone(1100, 0.07, "sine", 0.2, 0, 350);
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
        this.playTone(450, 0.12, "sawtooth", 0.25, 0, 80);
        this.playTone(200, 0.08, "square", 0.2, 0.04, 50);
        break;
      case "scifi":
        this.playTone(850, 0.12, "sawtooth", 0.24, 0, 140);
        this.playTone(1400, 0.09, "sine", 0.18, 0.02, 600);
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
    switch (this.pack) {
      case "arcade":
        this.playTone(300, 0.06, "square", 0.18, 0, 480);
        this.playTone(480, 0.09, "square", 0.2, 0.07, 720);
        break;
      case "scifi":
        this.playTone(400, 0.12, "sine", 0.22, 0, 950);
        this.playTone(950, 0.14, "sine", 0.2, 0.08, 400);
        break;
      case "wood":
      default:
        this.playWoodThud(220, 0.06, 0.25, 0);
        this.playWoodThud(190, 0.07, 0.25, 0.08);
        break;
    }
  }

  check() {
    if (!this.enabled) return;
    switch (this.pack) {
      case "arcade":
        this.playTone(660, 0.1, "square", 0.22, 0);
        this.playTone(880, 0.15, "square", 0.25, 0.09);
        break;
      case "scifi":
        this.playTone(980, 0.12, "sawtooth", 0.25, 0, 1200);
        this.playTone(1300, 0.2, "sawtooth", 0.25, 0.08, 1600);
        break;
      case "wood":
      default:
        this.playTone(520, 0.15, "sine", 0.22, 0);
        this.playTone(690, 0.25, "sine", 0.22, 0.08);
        break;
    }
  }

  gameOver() {
    if (!this.enabled) return;
    switch (this.pack) {
      case "arcade":
        this.playTone(440, 0.12, "square", 0.22, 0);
        this.playTone(550, 0.12, "square", 0.22, 0.12);
        this.playTone(660, 0.14, "square", 0.22, 0.24);
        this.playTone(880, 0.35, "square", 0.25, 0.36);
        break;
      case "scifi":
        this.playTone(800, 0.2, "sine", 0.22, 0, 300);
        this.playTone(500, 0.25, "sine", 0.22, 0.15, 180);
        this.playTone(320, 0.45, "triangle", 0.24, 0.35, 80);
        break;
      case "wood":
      default:
        this.playWoodThud(340, 0.18, 0.3, 0);
        this.playWoodThud(280, 0.2, 0.3, 0.15);
        this.playWoodThud(200, 0.35, 0.35, 0.32);
        break;
    }
  }

  puzzleSuccess() {
    if (!this.enabled) return;
    this.playTone(523.25, 0.12, "triangle", 0.22, 0);
    this.playTone(659.25, 0.14, "triangle", 0.22, 0.1);
    this.playTone(783.99, 0.16, "triangle", 0.24, 0.2);
    this.playTone(1046.5, 0.4, "sine", 0.28, 0.32);
  }

  puzzleError() {
    if (!this.enabled) return;
    this.playTone(280, 0.15, "sawtooth", 0.24, 0, 160);
    this.playTone(180, 0.25, "sawtooth", 0.25, 0.12, 100);
  }
}

/* ----------------------------------------------------------------------------
   2. Sistem Partikel Efek Visual Kustom (HTML5 Canvas Particle Engine)
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

  spawnSparks(x, y, theme = "wood", count = 35) {
    this.resize();
    const palettes = {
      wood: ["#fbbf24", "#f59e0b", "#d97706", "#fed7aa", "#ffffff"],
      cyberpunk: ["#06b6d4", "#22d3ee", "#ec4899", "#f472b6", "#a855f7"],
      marble: ["#ffd700", "#fef08a", "#d4af37", "#ffffff", "#94a3b8"],
      midnight: ["#6366f1", "#818cf8", "#38bdf8", "#c084fc", "#ffffff"],
    };
    const colors = palettes[theme] || palettes.wood;

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 6.5;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1.2,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 2.2 + Math.random() * 3.8,
        alpha: 1,
        decay: 0.02 + Math.random() * 0.03,
        gravity: 0.16,
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
      maxRadius: 65,
      color: "rgba(239, 68, 68, ",
      alpha: 0.9,
      decay: 0.035,
      isWave: true,
    });
    if (!this.isRunning) this.startLoop();
  }

  spawnVictoryCelebration(theme = "wood") {
    this.resize();
    const rect = this.canvas.parentElement.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;

    for (let burst = 0; burst < 4; burst++) {
      setTimeout(() => {
        const bx = w * 0.2 + Math.random() * w * 0.6;
        const by = h * 0.2 + Math.random() * h * 0.6;
        this.spawnSparks(bx, by, theme, 50);
      }, burst * 220);
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
        p.radius += 2.2;
        p.alpha -= p.decay;
        if (p.alpha <= 0 || p.radius >= p.maxRadius) {
          this.particles.splice(i, 1);
          continue;
        }
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        this.ctx.strokeStyle = `${p.color}${Math.max(0, p.alpha)})`;
        this.ctx.lineWidth = 4;
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
   3. Basis Data Opening Explorer (Real-time Opening Detection)
   ---------------------------------------------------------------------------- */
const OPENING_BOOK = [
  { moves: ["e4", "c5", "Nf3", "d6", "d4", "cxd4", "Nxd4", "Nf6", "Nc3", "a6"], eco: "B90", name: "Sicilian Defense: Najdorf", desc: "Variasi legendaris Fischer & Kasparov dengan serangan balik tajam." },
  { moves: ["e4", "c5", "Nf3", "Nc6", "d4", "cxd4", "Nxd4"], eco: "B32", name: "Sicilian Defense: Open", desc: "Pertempuran terbuka memperebutkan sayap menteri dan pusat." },
  { moves: ["e4", "c5"], eco: "B20", name: "Sicilian Defense", desc: "Respon paling tajam dan agresif dalam menghadapi 1.e4." },
  { moves: ["e4", "e5", "Nf3", "Nc6", "Bb5", "a6"], eco: "C70", name: "Ruy Lopez: Morphy Defense", desc: "Sistem utama Ruy Lopez yang paling sering dimainkan di level dunia." },
  { moves: ["e4", "e5", "Nf3", "Nc6", "Bb5"], eco: "C60", name: "Ruy Lopez (Spanish Opening)", desc: "Pembukaan klasik FIDE mengontrol struktur bidak jangka panjang." },
  { moves: ["e4", "e5", "Nf3", "Nc6", "Bc4", "Bc5"], eco: "C50", name: "Italian Game: Giuoco Piano", desc: "Perkembangan perwira harmonis dengan kontrol petak pusat." },
  { moves: ["e4", "e5", "Nf3", "Nc6", "Bc4", "Nf6"], eco: "C55", name: "Two Knights Defense", desc: "Serangan balik aktif hitam mengincar inisiatif taktis." },
  { moves: ["e4", "e5", "Nf3", "Nc6", "Bc4"], eco: "C50", name: "Italian Game", desc: "Mengembangkan gajah ke c4 menekan titik lemah f7." },
  { moves: ["e4", "e6", "d4", "d5"], eco: "C01", name: "French Defense: Main Line", desc: "Membangun benteng pertahanan kokoh di sayap raja." },
  { moves: ["e4", "e6"], eco: "C00", name: "French Defense", desc: "Pertahanan solid mengincar serangan balik ke rantai pion." },
  { moves: ["e4", "c6", "d4", "d5"], eco: "B12", name: "Caro-Kann Defense: Main Line", desc: "Struktur bidak kokoh menjaga gajah c8 tetap bebas bergerak." },
  { moves: ["e4", "c6"], eco: "B10", name: "Caro-Kann Defense", desc: "Pertahanan sangat solid tanpa mengorbankan keselamatan raja." },
  { moves: ["d4", "d5", "c4", "dxc4"], eco: "D20", name: "Queen's Gambit Accepted", desc: "Hitam menerima tantangan pengorbanan pion sementara." },
  { moves: ["d4", "d5", "c4", "e6"], eco: "D30", name: "Queen's Gambit Declined", desc: "Sistem ortodoks ultra-kokoh favorit para juara dunia." },
  { moves: ["d4", "d5", "c4", "c6"], eco: "D10", name: "Slav Defense", desc: "Memperkuat petak d5 sambil mempertahankan kelincahan gajah." },
  { moves: ["d4", "d5", "c4"], eco: "D06", name: "Queen's Gambit", desc: "Pengorbanan sayap menteri untuk dominasi petak pusat d4 & e4." },
  { moves: ["d4", "Nf6", "c4", "g6", "Nc3", "Bg7"], eco: "E60", name: "King's Indian Defense", desc: "Sistem hipermodern dengan badai serangan sayap raja." },
  { moves: ["d4", "Nf6", "c4", "e6", "Nc3", "Bb4"], eco: "E20", name: "Nimzo-Indian Defense", desc: "Menyemat kuda putih c3 untuk mengontrol petak e4." },
  { moves: ["d4", "Nf6", "c4", "e6", "Nf3", "b6"], eco: "E12", name: "Queen's Indian Defense", desc: "Mengontrol petak e4 melalui fianchetto gajah di b7." },
  { moves: ["d4", "Nf6", "Nf3", "d5", "Bf4"], eco: "D02", name: "London System", desc: "Skema fleksibel dan solid yang digemari Magnus Carlsen." },
  { moves: ["d4", "d5", "Bf4"], eco: "D00", name: "London System", desc: "Sistem pembukaan populer dengan kontrol kokoh jalur f4-c7." },
  { moves: ["e4", "d5"], eco: "B01", name: "Scandinavian Defense", desc: "Tantangan langsung terhadap pion e4 di langkah pertama." },
  { moves: ["e4", "Nf6"], eco: "B02", name: "Alekhine's Defense", desc: "Memancing pion putih maju untuk dieksploitasi kemudian." },
  { moves: ["c4"], eco: "A10", name: "English Opening", desc: "Penguasaan sayap fleksibel yang mengendalikan petak d5." },
  { moves: ["Nf3"], eco: "A04", name: "Réti Opening", desc: "Strategi hipermodern mengendalikan pusat tanpa dorongan pion awal." },
  { moves: ["f4"], eco: "A02", name: "Bird's Opening", desc: "Langkah sayap agresif yang mengincar kendali petak e5." },
  { moves: ["e4", "e5", "f4"], eco: "C30", name: "King's Gambit", desc: "Pengorbanan romantis klasik penuh kombinasi tajam." },
  { moves: ["e4", "e5", "Nf3", "Nf6"], eco: "C42", name: "Petrov's Defense", desc: "Pertahanan simetris terkenal tahan banting." },
  { moves: ["e4", "e5", "Nf3", "Nc6", "Nc3", "Nf6"], eco: "C47", name: "Four Knights Game", desc: "Perkembangan seimbang dari seluruh empat kuda." },
  { moves: ["d4", "f5"], eco: "A80", name: "Dutch Defense", desc: "Pendekatan asimetris tajam mengontrol sayap raja." },
  { moves: ["d4", "Nf6"], eco: "A45", name: "Indian Defense", desc: "Permulaan fleksibel menghadapi langkah pertama d4." },
  { moves: ["e4", "e5"], eco: "C20", name: "Open Game (King's Pawn)", desc: "Pertempuran klasik memperebutkan petak sentral e4 dan e5." },
  { moves: ["d4", "d5"], eco: "D00", name: "Closed Game (Queen's Pawn)", desc: "Perebutan posisi berbasis struktur bidak tertutup." },
  { moves: ["e4"], eco: "B00", name: "King's Pawn Opening", desc: "Langkah pembuka terpopuler membuka menteri dan gajah." },
  { moves: ["d4"], eco: "A40", name: "Queen's Pawn Opening", desc: "Langkah kokoh mendominasi pusat dan menjaga keamanan raja." },
];

function detectOpening(sans) {
  if (!sans || sans.length === 0) {
    return { eco: "A00", name: "Posisi Awal", desc: "Langkah pembuka standar catur" };
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

  return bestMatch || { eco: "A00", name: "Variasi Tidak Umum", desc: "Langkah di luar jalur buku standar" };
}

/* ----------------------------------------------------------------------------
   4. Basis Data Daily Chess Puzzle (Tantangan Taktis Skakmat 2 Langkah)
   ---------------------------------------------------------------------------- */
const DAILY_PUZZLES = [
  {
    id: 0,
    title: "Teka-teki 1: Skakmat Koridor Belakang (Back-Rank)",
    desc: "Putih melangkah! Posisi pertahanan raja hitam di baris ke-8 rapuh. Korbankan Ratu untuk mengalihkan benteng lalu tuntaskan dengan benteng di e8!",
    fen: "5rk1/ppp2ppp/8/8/8/8/4QPPP/4R1K1 w - - 0 1",
    playerColor: "w",
    moves: [
      { from: "e2", to: "e8", san: "Qe8+" },
      { from: "f8", to: "e8", san: "Rxe8", reply: true },
      { from: "e1", to: "e8", san: "Rxe8#" },
    ],
    hint: "Langkahkan Ratu ke e8 (Qe8+) untuk mengalihkan benteng lawan!",
  },
  {
    id: 1,
    title: "Teka-teki 2: Paul Morphy Opera Game Mate",
    desc: "Mahakarya Paul Morphy (1858)! Korbankan Ratu di petak b8 untuk memancing kuda hitam, lalu selesaikan dengan benteng di d8!",
    fen: "4kb1r/p2n1ppp/4q3/4p1B1/4P3/1Q6/PPP2PPP/2KR4 w k - 0 1",
    playerColor: "w",
    moves: [
      { from: "b3", to: "b8", san: "Qb8+" },
      { from: "d7", to: "b8", san: "Nxb8", reply: true },
      { from: "d1", to: "d8", san: "Rd8#" },
    ],
    hint: "Korbankan Ratu langsung ke b8 (Qb8+)!",
  },
  {
    id: 2,
    title: "Teka-teki 3: Philidor Smothered Mate (Skakmat Tercekik)",
    desc: "Raja hitam terjepit bidaknya sendiri. Luncurkan pengorbanan Ratu di g8 lalu akhiri dengan garpu Kuda di f7!",
    fen: "5r1k/6pp/4Q2N/8/8/8/8/6K1 w - - 0 1",
    playerColor: "w",
    moves: [
      { from: "e6", to: "g8", san: "Qg8+" },
      { from: "f8", to: "g8", san: "Rxg8", reply: true },
      { from: "h6", to: "f7", san: "Nf7#" },
    ],
    hint: "Umpan Ratu langsung ke petak g8 (Qg8+)!",
  },
  {
    id: 3,
    title: "Teka-teki 4: Arabian Mate (Kuda & Benteng)",
    desc: "Kombinasi Kuda di f6 dan Benteng. Buat manuver benteng ke baris ke-7 mengunci raja hitam yang berujung skakmat!",
    fen: "7k/7p/5N2/8/8/8/5PPP/R5K1 w - - 0 1",
    playerColor: "w",
    moves: [
      { from: "a1", to: "a7", san: "Ra7" },
      { from: "h7", to: "h6", san: "h6", reply: true },
      { from: "a7", to: "h7", san: "Rh7#" },
    ],
    hint: "Kunci pergerakan raja dengan meluncurkan Benteng ke baris ke-7 (Ra7)!",
  },
  {
    id: 4,
    title: "Teka-teki 5: Vukovic King Hunt",
    desc: "Raja hitam terjebak di sudut h8 dengan pion g6 mengunci ruang gerak. Selesaikan permainan dengan benteng di baris ke-8!",
    fen: "7k/R3N1pp/6P1/8/8/8/8/6K1 w - - 0 1",
    playerColor: "w",
    moves: [
      { from: "a7", to: "a8", san: "Ra8#" },
    ],
    hint: "Luncurkan benteng ke petak a8 (Ra8#)!",
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
    if (chess.in_draw() || chess.in_stalemate() || chess.in_threefold_repetition()) return 0;

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
      let scoreA = 0, scoreB = 0;
      if (a.captured) scoreA += 10 * this.pieceValues[a.captured] - this.pieceValues[a.piece];
      if (a.promotion) scoreA += this.pieceValues[a.promotion];
      if (b.captured) scoreB += 10 * this.pieceValues[b.captured] - this.pieceValues[b.piece];
      if (b.promotion) scoreB += this.pieceValues[b.promotion];
      return scoreB - scoreA;
    });
  }

  minimax(chess, depth, alpha, beta, isMaximizing, aiColor) {
    if (depth === 0 || chess.game_over()) return this.evaluateBoard(chess, aiColor);
    const legalMoves = this.orderMoves(chess.moves({ verbose: true }));

    if (isMaximizing) {
      let maxEval = -Infinity;
      for (const move of legalMoves) {
        chess.move(move);
        const evaluation = this.minimax(chess, depth - 1, alpha, beta, false, aiColor);
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
        const evaluation = this.minimax(chess, depth - 1, alpha, beta, true, aiColor);
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
        const score = this.evaluateBoard(chess, aiColor) + (Math.random() - 0.5) * 60;
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
      const boardValue = this.minimax(chess, searchDepth - 1, alpha, beta, false, aiColor);
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
   6. Generator Vektor SVG Bidak Catur Adaptif Tema
   ---------------------------------------------------------------------------- */
function createPieceSVG(type, color, theme = "wood") {
  const isWhite = color === "w";
  let fill, stroke, innerStroke, filter = "";

  switch (theme) {
    case "cyberpunk":
      if (isWhite) {
        fill = "#083344";
        stroke = "#06b6d4";
        innerStroke = "#22d3ee";
        filter = "drop-shadow(0 0 4px rgba(6, 182, 212, 0.8))";
      } else {
        fill = "#500724";
        stroke = "#ec4899";
        innerStroke = "#f472b6";
        filter = "drop-shadow(0 0 4px rgba(236, 72, 153, 0.8))";
      }
      break;

    case "marble":
      if (isWhite) {
        fill = "#ffffff";
        stroke = "#d4af37";
        innerStroke = "#fef08a";
        filter = "drop-shadow(0 2px 4px rgba(212, 175, 55, 0.4))";
      } else {
        fill = "#0f172a";
        stroke = "#e2e8f0";
        innerStroke = "#94a3b8";
        filter = "drop-shadow(0 3px 5px rgba(0, 0, 0, 0.7))";
      }
      break;

    case "midnight":
      if (isWhite) {
        fill = "#e0e7ff";
        stroke = "#4338ca";
        innerStroke = "#6366f1";
        filter = "drop-shadow(0 2px 4px rgba(79, 70, 229, 0.4))";
      } else {
        fill = "#030712";
        stroke = "#818cf8";
        innerStroke = "#4f46e5";
        filter = "drop-shadow(0 3px 6px rgba(0, 0, 0, 0.8))";
      }
      break;

    case "wood":
    default:
      if (isWhite) {
        fill = "#fffbeb";
        stroke = "#78350f";
        innerStroke = "#b45309";
        filter = "drop-shadow(0 2px 3px rgba(120, 53, 15, 0.35))";
      } else {
        fill = "#451a03";
        stroke = "#fef3c7";
        innerStroke = "#fde68a";
        filter = "drop-shadow(0 3px 4px rgba(0, 0, 0, 0.5))";
      }
      break;
  }

  let shape = "";
  switch (type) {
    case "p":
      shape = `<circle cx="50" cy="30" r="13" /><path d="M 36 46 Q 50 40 64 46 L 68 74 L 32 74 Z" /><rect x="24" y="76" width="52" height="10" rx="4" />`;
      break;
    case "r":
      shape = `<path d="M 28 22 L 28 36 L 72 36 L 72 22 L 63 22 L 63 28 L 55 28 L 55 22 L 45 22 L 45 28 L 37 28 L 37 22 Z" /><rect x="33" y="38" width="34" height="34" /><rect x="23" y="74" width="54" height="12" rx="4" />`;
      break;
    case "n":
      shape = `<path d="M 30 74 L 34 42 L 26 36 L 34 20 L 48 24 Q 68 26 68 48 L 66 74 Z" /><circle cx="42" cy="31" r="3" fill="${stroke}" /><rect x="23" y="74" width="54" height="12" rx="4" />`;
      break;
    case "b":
      shape = `<circle cx="50" cy="18" r="5" /><path d="M 50 25 C 32 35 32 58 34 74 L 66 74 C 68 58 68 35 50 25 Z" /><line x1="43" y1="44" x2="57" y2="44" stroke="${innerStroke}" stroke-width="4" stroke-linecap="round" /><line x1="50" y1="37" x2="50" y2="51" stroke="${innerStroke}" stroke-width="4" stroke-linecap="round" /><rect x="23" y="74" width="54" height="12" rx="4" />`;
      break;
    case "q":
      shape = `<circle cx="22" cy="28" r="4" /><circle cx="39" cy="20" r="4" /><circle cx="61" cy="20" r="4" /><circle cx="78" cy="28" r="4" /><path d="M 24 34 L 38 56 L 40 26 L 50 56 L 60 26 L 62 56 L 76 34 L 68 74 L 32 74 Z" /><rect x="23" y="74" width="54" height="12" rx="4" />`;
      break;
    case "k":
      shape = `<line x1="50" y1="12" x2="50" y2="26" stroke="${stroke}" stroke-width="5" stroke-linecap="round" /><line x1="43" y1="18" x2="57" y2="18" stroke="${stroke}" stroke-width="5" stroke-linecap="round" /><path d="M 30 38 C 30 26 70 26 70 38 L 66 74 L 34 74 Z" /><rect x="23" y="74" width="54" height="12" rx="4" />`;
      break;
  }

  const styleAttr = filter ? `style="filter: ${filter};"` : "";
  return `<svg viewBox="0 0 100 100" class="chess-piece" draggable="false" ${styleAttr}><g fill="${fill}" stroke="${stroke}" stroke-width="4.5" stroke-linejoin="round">${shape}</g></svg>`;
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

    // Update highlight tombol navigasi aktif
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
        btn.classList.add("text-emerald-400", "font-bold", "bg-slate-800", "border", "border-emerald-500/30");
        btn.classList.remove("text-slate-300");
      } else {
        btn.classList.remove("text-emerald-400", "font-bold", "bg-slate-800", "border", "border-emerald-500/30");
        btn.classList.add("text-slate-300");
      }
    });

    window.scrollTo({ top: 0, behavior: "smooth" });

    // Refresh resize canvas partikel saat layar game ditampilkan
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
    // Nav Brand & Home Links
    document.getElementById("nav-brand").addEventListener("click", () => this.showScreen("landing"));
    document.getElementById("nav-btn-home").addEventListener("click", () => this.showScreen("landing"));
    document.getElementById("nav-btn-game").addEventListener("click", () => this.showScreen("game"));
    document.getElementById("nav-btn-legends").addEventListener("click", () => this.showScreen("legends"));
    document.getElementById("nav-btn-history").addEventListener("click", () => this.showScreen("history"));
    document.getElementById("nav-btn-settings").addEventListener("click", () => this.openSettings());

    // Back Buttons
    document.getElementById("btn-back-landing").addEventListener("click", () => this.showScreen("landing"));
    document.querySelectorAll(".btn-back-home").forEach((btn) => {
      btn.addEventListener("click", () => this.showScreen("landing"));
    });
    document.querySelectorAll(".btn-go-play").forEach((btn) => {
      btn.addEventListener("click", () => this.showScreen("game"));
    });

    // Landing Page Cards & CTA Buttons
    document.getElementById("hero-btn-play").addEventListener("click", () => this.showScreen("game"));
    document.getElementById("hero-btn-puzzle").addEventListener("click", () => {
      this.showScreen("game");
      this.app.switchTab("puzzle");
    });

    document.getElementById("card-menu-play").addEventListener("click", () => this.showScreen("game"));
    document.getElementById("card-menu-legends").addEventListener("click", () => this.showScreen("legends"));
    document.getElementById("card-menu-history").addEventListener("click", () => this.showScreen("history"));
    document.getElementById("card-menu-settings").addEventListener("click", () => this.openSettings());

    // Modal Settings Controls
    document.getElementById("btn-close-settings").addEventListener("click", () => this.closeSettings());
    this.modalSettings.addEventListener("click", (e) => {
      if (e.target === this.modalSettings) this.closeSettings();
    });

    document.getElementById("btn-apply-settings").addEventListener("click", () => {
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
    this.activeTab = "arena"; // 'arena' | 'puzzle'

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

    // Timer & Jam Catur
    this.baseTime = 300 * 1000;
    this.increment = 0;
    this.timers = { w: this.baseTime, b: this.baseTime };
    this.clockInterval = null;
    this.lastTick = null;
    this.isTimeout = false;
    this.timeoutWinner = null;

    // Puzzle State
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
      if (this.activeHint) this.renderHintArrow(this.activeHint.from, this.activeHint.to);
    });

    this.btnMute.addEventListener("click", () => {
      this.sound.enabled = !this.sound.enabled;
      this.btnMute.textContent = `Suara: ${this.sound.enabled ? "Aktif" : "Mati"}`;
      this.btnMute.className = `col-span-3 py-2 rounded-lg text-xs font-semibold transition border border-slate-700/60 ${
        this.sound.enabled ? "bg-slate-800 text-slate-200" : "bg-rose-950/40 text-rose-300 border-rose-800/40"
      }`;
    });

    this.btnHint.addEventListener("click", () => this.requestHint());

    this.btnFirst.addEventListener("click", () => this.jumpToMove(0));
    this.btnPrev.addEventListener("click", () => this.jumpToMove(this.viewIndex - 1));
    this.btnNext.addEventListener("click", () => this.jumpToMove(this.viewIndex + 1));
    this.btnLast.addEventListener("click", () => this.jumpToMove(this.historySnapshots.length - 1));

    this.puzzleSelect.addEventListener("change", (e) => {
      this.currentPuzzleIndex = parseInt(e.target.value, 10);
      this.loadPuzzle(this.currentPuzzleIndex);
    });

    this.btnNextPuzzle.addEventListener("click", () => {
      this.currentPuzzleIndex = (this.currentPuzzleIndex + 1) % DAILY_PUZZLES.length;
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
      this.tabArena.className = "px-3 sm:px-4 py-1.5 rounded-lg transition duration-200 bg-emerald-600 text-white shadow";
      this.tabPuzzle.className = "px-3 sm:px-4 py-1.5 rounded-lg transition duration-200 text-slate-400 hover:text-white";
      this.puzzlePanel.classList.add("hidden");
      this.panelTitle.textContent = "Arena Pertandingan";
      this.startNewGame();
    } else {
      this.tabPuzzle.className = "px-3 sm:px-4 py-1.5 rounded-lg transition duration-200 bg-amber-600 text-white shadow";
      this.tabArena.className = "px-3 sm:px-4 py-1.5 rounded-lg transition duration-200 text-slate-400 hover:text-white";
      this.puzzlePanel.classList.remove("hidden");
      this.panelTitle.textContent = "Daily Chess Puzzle Challenge";
      this.loadPuzzle(this.currentPuzzleIndex);
    }
  }

  /* --------------------------------------------------------------------------
     Daily Chess Puzzle Handler
     -------------------------------------------------------------------------- */
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
    this.puzzleFeedback.textContent = "Cari langkah pertama...";
    this.puzzleFeedback.className = "text-amber-400 font-semibold";
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

    this.topNameEl.textContent = "Lawan (Taktik)";
    this.bottomNameEl.textContent = "Anda (Pemecah Puzzle)";
    this.topClockEl.textContent = "--:--";
    this.bottomClockEl.textContent = "--:--";
    this.arenaModeBadge.textContent = "Mode Puzzle Taktis";

    this.syncPlayerPanels();
    this.renderBoard();
    this.updateMoveLog();
    this.updateEvalBar();
    this.updateOpeningDisplay();
    this.statusEl.textContent = `${puzzle.title} — Giliran Anda!`;
    this.alertBanner.classList.add("hidden");
  }

  handlePuzzleMove(from, to, san) {
    const puzzle = DAILY_PUZZLES[this.currentPuzzleIndex];
    const expectedMove = puzzle.moves[this.puzzleStep];

    if (!expectedMove || expectedMove.from !== from || expectedMove.to !== to) {
      this.sound.puzzleError();
      this.triggerScreenShake("subtle");
      this.puzzleFeedback.textContent = "❌ Langkah belum tepat! Coba cari taktik lain.";
      this.puzzleFeedback.className = "text-rose-400 font-bold animate-pulse";

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

      this.puzzleFeedback.textContent = "🎉 Skakmat Sempurna! Anda berhasil memecahkan teka-teki!";
      this.puzzleFeedback.className = "text-emerald-400 font-extrabold";
      this.btnNextPuzzle.classList.remove("hidden");
      this.showBanner(
        "🎉 Taktik Berhasil! Skakmat sempurna dalam 2 langkah. Lanjutkan ke teka-teki berikutnya!",
        "bg-emerald-900/90 text-emerald-200 border border-emerald-500 shadow-lg",
      );
      return true;
    }

    const replyMove = puzzle.moves[this.puzzleStep];
    if (replyMove && replyMove.reply) {
      this.puzzleFeedback.textContent = "Langkah brilian! Sekarang tuntaskan skakmat...";
      this.puzzleFeedback.className = "text-sky-300 font-bold";

      setTimeout(() => {
        this.puzzleStep++;
        this.executeMove(replyMove.from, replyMove.to, "q", false);

        if (this.puzzleStep >= puzzle.moves.length) {
          this.puzzleSolved = true;
          this.sound.puzzleSuccess();
          this.triggerScreenShake("heavy");
          this.particles.spawnVictoryCelebration(this.currentTheme);
          this.puzzleFeedback.textContent = "🎉 Skakmat Sempurna! Anda berhasil memecahkan teka-teki!";
          this.puzzleFeedback.className = "text-emerald-400 font-extrabold";
          this.btnNextPuzzle.classList.remove("hidden");
        }
      }, 350);
    }

    return true;
  }

  /* --------------------------------------------------------------------------
     Sistem Evaluasi Bar Keunggulan Real-time
     -------------------------------------------------------------------------- */
  updateEvalBar() {
    const currentFen = this.historySnapshots[this.viewIndex]?.fen || this.game.fen();
    const tempBoard = new Chess(currentFen);

    let score = this.ai.evaluateBoard(tempBoard, "w");
    let whitePercent = 50;
    let scoreText = "0.0";

    if (tempBoard.in_checkmate()) {
      if (tempBoard.turn() === "w") {
        whitePercent = 0;
        scoreText = "M0 (Hitam Menang)";
      } else {
        whitePercent = 100;
        scoreText = "M0 (Putih Menang)";
      }
    } else if (tempBoard.in_draw() || tempBoard.in_stalemate()) {
      whitePercent = 50;
      scoreText = "0.0";
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
      this.evalBarScore.style.bottom = "8px";
      this.evalBarScore.style.top = "auto";
      this.evalBarScore.className = "eval-bar-score text-slate-900";
    } else {
      this.evalBarScore.style.top = "8px";
      this.evalBarScore.style.bottom = "auto";
      this.evalBarScore.className = "eval-bar-score text-slate-100";
    }
  }

  /* --------------------------------------------------------------------------
     Sistem Panah Rekomendasi Hint AI
     -------------------------------------------------------------------------- */
  requestHint() {
    if (this.isReviewMode() || this.isGameEnded() || this.isAIThinking || !this.isHumanTurn()) return;

    if (this.activeTab === "puzzle") {
      const puzzle = DAILY_PUZZLES[this.currentPuzzleIndex];
      const nextMove = puzzle.moves[this.puzzleStep];
      if (nextMove) {
        this.renderHintArrow(nextMove.from, nextMove.to);
        this.showBanner(`Petunjuk Taktik: ${puzzle.hint}`, "bg-amber-900/80 text-amber-200 border border-amber-500");
      }
      return;
    }

    const bestMove = this.ai.getHintMove(this.game.fen(), this.game.turn());
    if (bestMove) {
      this.activeHint = bestMove;
      this.renderHintArrow(bestMove.from, bestMove.to);
      const turnName = this.game.turn() === "w" ? "Putih" : "Hitam";
      this.showBanner(
        `💡 Saran AI untuk ${turnName}: ${bestMove.san} (${bestMove.from.toUpperCase()} ➜ ${bestMove.to.toUpperCase()})`,
        "bg-amber-950/80 text-amber-300 border border-amber-500/80 shadow-md",
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

    const headLength = 22;
    const headAngle = Math.PI / 6;

    const hx1 = targetX - headLength * Math.cos(angle - headAngle);
    const hy1 = targetY - headLength * Math.sin(angle - headAngle);
    const hx2 = targetX - headLength * Math.cos(angle + headAngle);
    const hy2 = targetY - headLength * Math.sin(angle + headAngle);

    this.arrowOverlay.innerHTML = `
      <defs>
        <filter id="glow-green" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="0" stdDeviation="4" flood-color="#22c55e" flood-opacity="0.9"/>
        </filter>
      </defs>
      <path d="M ${x1} ${y1} L ${targetX} ${targetY}" class="hint-arrow" />
      <polygon points="${x2},${y2} ${hx1},${hy1} ${hx2},${hy2}" fill="#22c55e" filter="url(#glow-green)" />
    `;
  }

  triggerScreenShake(intensity = "subtle") {
    const shakeClass = intensity === "heavy" ? "shake-heavy" : "shake-subtle";
    this.boardWrapper.classList.remove("shake-subtle", "shake-heavy");
    void this.boardWrapper.offsetWidth;
    this.boardWrapper.classList.add(shakeClass);
    setTimeout(() => {
      this.boardWrapper.classList.remove(shakeClass);
    }, intensity === "heavy" ? 520 : 300);
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
      "ai-hard": "vs AI (Susah)",
    };
    this.arenaModeBadge.textContent = modeLabels[this.gameMode] || "Arena Catur";

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

  /* --------------------------------------------------------------------------
     Rendering Papan Catur & FLIP System Animation
     -------------------------------------------------------------------------- */
  renderBoard(animConfig = null) {
    this.boardEl.innerHTML = "";
    const snapshot = this.historySnapshots[this.viewIndex] || { fen: this.game.fen() };
    const tempBoard = new Chess(snapshot.fen);
    const boardState = tempBoard.board();
    const inCheck = tempBoard.in_check();
    const turnColor = tempBoard.turn();

    const ranks = this.isFlipped ? [0, 1, 2, 3, 4, 5, 6, 7] : [7, 6, 5, 4, 3, 2, 1, 0];
    const files = this.isFlipped ? [7, 6, 5, 4, 3, 2, 1, 0] : [0, 1, 2, 3, 4, 5, 6, 7];
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
          (snapshot.lastMove.from === squareName || snapshot.lastMove.to === squareName)
        ) {
          sqEl.classList.add("highlight-move");
        }

        if (this.selectedSquare === squareName && !this.isReviewMode()) {
          sqEl.classList.add("sq-selected");
        }

        if (inCheck && piece && piece.type === "k" && piece.color === turnColor) {
          sqEl.classList.add("sq-check");
        }

        if (this.activeHint) {
          if (this.activeHint.from === squareName) sqEl.classList.add("sq-hint-from");
          if (this.activeHint.to === squareName) sqEl.classList.add("sq-hint-to");
        }

        // Label Baris & Kolom FIDE
        if (visualCol === 0) {
          const rankLabel = document.createElement("span");
          rankLabel.className = "absolute top-0.5 left-1 text-[10px] font-bold leading-none pointer-events-none opacity-80";
          rankLabel.textContent = rIdx + 1;
          sqEl.appendChild(rankLabel);
        }

        if (visualRow === 7) {
          const fileLabel = document.createElement("span");
          fileLabel.className = "absolute bottom-0.5 right-1 text-[10px] font-bold leading-none pointer-events-none opacity-80";
          fileLabel.textContent = fileLetters[fIdx];
          sqEl.appendChild(fileLabel);
        }

        // Animasi Ghost Bidak yang ditangkap
        if (animConfig && animConfig.captured && animConfig.captured.square === squareName) {
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
                { transform: "scale(1)", opacity: 0.95 },
                { transform: "scale(0.3) rotate(15deg)", opacity: 0 },
              ],
              { duration: 220, easing: "ease-out", fill: "forwards" },
            );
            ghostAnim.onfinish = () => ghostEl.remove();
          } else {
            ghostEl.remove();
          }
        }

        // Render Bidak
        if (piece) {
          const pieceWrapper = document.createElement("div");
          pieceWrapper.className = "piece-wrapper";
          if (this.draggingSquare === squareName) {
            pieceWrapper.classList.add("is-origin-hidden");
          }
          pieceWrapper.innerHTML = createPieceSVG(piece.type, piece.color, this.currentTheme);

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

          // FLIP Animation System (First-Last-Invert-Play)
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
                  { transform: `translate(${deltaX}%, ${deltaY}%) scale(1.08)` },
                  { transform: "translate(0%, 0%) scale(1)" },
                ],
                { duration: 240, easing: "cubic-bezier(0.22, 1, 0.36, 1)" },
              );
              slideAnim.onfinish = () => pieceWrapper.classList.remove("animating");
            }
          }

          if (animConfig && animConfig.snapSquare === squareName && pieceWrapper.animate) {
            pieceWrapper.animate(
              [{ transform: "scale(1.18)" }, { transform: "scale(1)" }],
              { duration: 150, easing: "ease-out" },
            );
          }
        }

        // Indikator Titik Bantu Langkah Legal
        if (!this.isReviewMode() && !this.isAIThinking) {
          const legalMove = this.legalMoves.find((m) => m.to === squareName);
          if (legalMove) {
            const indicator = document.createElement("div");
            const isCapture = Boolean(piece) || legalMove.flags.includes("e");
            indicator.className = isCapture ? "legal-capture absolute" : "legal-dot absolute";
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

  /* --------------------------------------------------------------------------
     Pointer Events Drag & Drop System
     -------------------------------------------------------------------------- */
  onPointerDown(e, squareName, pieceWrapper) {
    if (this.isReviewMode() || this.isGameEnded() || this.isAIThinking || !this.isHumanTurn()) return;
    e.stopPropagation();

    this.clearHint();

    const startX = e.clientX;
    const startY = e.clientY;
    let isDragging = false;

    // Hitung legal moves & seleksi petak
    this.selectedSquare = squareName;
    this.legalMoves = this.game.moves({ square: squareName, verbose: true });
    this.renderBoard();

    const onPointerMove = (moveEvent) => {
      const dx = moveEvent.clientX - startX;
      const dy = moveEvent.clientY - startY;

      if (!isDragging && (Math.abs(dx) > 3 || Math.abs(dy) > 3)) {
        isDragging = true;
        this.draggingSquare = squareName;

        // Sembunyikan bidak di petak asal secara instan di DOM aktif
        const liveOriginPiece = this.boardEl.querySelector(`[data-square="${squareName}"] .piece-wrapper`);
        if (liveOriginPiece) {
          liveOriginPiece.classList.add("is-origin-hidden");
        }

        // Buat ghost melayang mengikuti kursor/jari dengan ukuran proporsional
        const ghost = document.createElement("div");
        ghost.id = "active-drag-ghost";
        ghost.className = "piece-floating-ghost";
        ghost.innerHTML = liveOriginPiece ? liveOriginPiece.innerHTML : pieceWrapper.innerHTML;

        const sqEl = this.boardEl.querySelector(`[data-square="${squareName}"]`);
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
        const liveOriginPiece = this.boardEl.querySelector(`[data-square="${squareName}"] .piece-wrapper`);
        if (liveOriginPiece) {
          liveOriginPiece.classList.remove("is-origin-hidden");
        }

        const elemBelow = document.elementFromPoint(upEvent.clientX, upEvent.clientY);
        const targetSquareEl = elemBelow ? elemBelow.closest("[data-square]") : null;

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
    if (this.isReviewMode() || this.isGameEnded() || this.isAIThinking || !this.isHumanTurn()) return;

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
    const matchingMoves = this.legalMoves.filter((m) => m.from === from && m.to === to);
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

  /* --------------------------------------------------------------------------
     Eksekusi Langkah FIDE & Pemicu Efek Visual Audio
     -------------------------------------------------------------------------- */
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
    const activeSlides = isDrag ? [] : [{ from: moveResult.from, to: moveResult.to }];

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
    const isCapture = moveResult.flags.includes("c") || moveResult.flags.includes("e");
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
      this.particles.spawnSparks(sparkX, sparkY, this.currentTheme, 35);
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
        this.particles.spawnCheckPulse(kCoord.col * sqSize + sqSize / 2, kCoord.row * sqSize + sqSize / 2);
      }
    } else if (moveResult.flags.includes("k") || moveResult.flags.includes("q")) {
      this.sound.castle();
    } else if (isCapture) {
      this.sound.capture();
    } else {
      this.sound.move();
    }

    if (!this.clockInterval && !this.game.game_over() && this.activeTab === "arena") {
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
      const bestMove = this.ai.getBestMove(this.game.fen(), this.gameMode, aiColor);

      this.isAIThinking = false;
      this.aiBadgeEl.classList.add("hidden");

      if (bestMove) {
        this.executeMove(bestMove.from, bestMove.to, bestMove.promotion || "q", false);
      }
    }, delay);
  }

  /* --------------------------------------------------------------------------
     Manajemen Waktu & Jam Pertandingan
     -------------------------------------------------------------------------- */
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
      "font-mono text-xl font-bold px-3 py-1 rounded-lg bg-emerald-950 text-emerald-300 border border-emerald-500 shadow-inner";
    const inactiveStyle =
      "font-mono text-xl font-bold px-3 py-1 rounded-lg bg-slate-950 text-slate-400 border border-slate-800 shadow-inner";

    this.topClockEl.className =
      activeTurn === topColor && !this.isGameEnded() ? activeStyle : inactiveStyle;
    this.bottomClockEl.className =
      activeTurn === bottomColor && !this.isGameEnded() ? activeStyle : inactiveStyle;
  }

  getPlayerLabel(color) {
    if (this.activeTab === "puzzle") {
      return color === this.humanColor ? "Anda (Solver)" : "Taktik Puzzle";
    }
    const colorName = color === "w" ? "Putih" : "Hitam";
    if (!this.isVsAI()) return `Pemain ${colorName}`;
    if (color === this.humanColor) return `Anda (${colorName})`;
    const levelNames = {
      "ai-normal": "AI Normal",
      "ai-medium": "AI Sedang",
      "ai-hard": "AI Susah",
    };
    return `${levelNames[this.gameMode]} (${colorName})`;
  }

  syncPlayerPanels() {
    const topColor = this.isFlipped ? "w" : "b";
    const bottomColor = this.isFlipped ? "b" : "w";

    this.topNameEl.textContent = this.getPlayerLabel(topColor);
    this.bottomNameEl.textContent = this.getPlayerLabel(bottomColor);

    const whiteAvatarClass =
      "w-8 h-8 rounded-lg bg-slate-100 text-slate-900 border border-slate-400 flex items-center justify-center font-bold text-sm shadow";
    const blackAvatarClass =
      "w-8 h-8 rounded-lg bg-slate-950 text-slate-100 border border-slate-700 flex items-center justify-center font-bold text-sm shadow-inner";

    this.topAvatarEl.textContent = topColor === "w" ? "W" : "B";
    this.topAvatarEl.className = topColor === "w" ? whiteAvatarClass : blackAvatarClass;

    this.bottomAvatarEl.textContent = bottomColor === "w" ? "W" : "B";
    this.bottomAvatarEl.className = bottomColor === "w" ? whiteAvatarClass : blackAvatarClass;

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
      for (let i = 0; i < missingBlack; i++) capturedByWhite.push(symbols[type]);

      const missingWhite = Math.max(0, startCounts[type] - current.w[type]);
      for (let i = 0; i < missingWhite; i++) capturedByBlack.push(symbols[type]);
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
      tr.className = "hover:bg-slate-800/60 transition";

      const tdNum = document.createElement("td");
      tdNum.className = "py-1.5 px-2 text-slate-500 font-medium";
      tdNum.textContent = `${moveNumber}.`;

      const tdWhite = document.createElement("td");
      tdWhite.className = `py-1.5 px-2 cursor-pointer rounded ${
        this.viewIndex === i ? "bg-emerald-600/30 text-emerald-300 font-bold" : "text-slate-200"
      }`;
      tdWhite.textContent = whiteSnap.san;
      tdWhite.addEventListener("click", () => this.jumpToMove(i));

      const tdBlack = document.createElement("td");
      tdBlack.className = `py-1.5 px-2 cursor-pointer rounded ${
        this.viewIndex === i + 1 ? "bg-emerald-600/30 text-emerald-300 font-bold" : "text-slate-200"
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
      const prevTransitions = this.historySnapshots[this.viewIndex].transitions || [];
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
      this.statusEl.textContent = `Waktu Habis — ${this.timeoutWinner} Menang!`;
      this.showBanner(
        `Permainan Berakhir: ${this.timeoutWinner} menang karena waktu lawan habis.`,
        "bg-rose-900/80 text-rose-200 border border-rose-600",
      );
      return;
    }

    if (this.game.in_checkmate()) {
      this.statusEl.textContent = `Skakmat! ${winnerName} Menang.`;
      this.showBanner(
        `Skakmat! ${winnerName} memenangkan pertandingan.`,
        "bg-emerald-900/80 text-emerald-200 border border-emerald-500",
      );
      return;
    }

    if (this.game.in_draw()) {
      let reason = "Kesepakatan / Aturan 50 Langkah";
      if (this.game.in_stalemate()) reason = "Stalemate (Tidak ada langkah legal)";
      else if (this.game.in_threefold_repetition()) reason = "Pengulangan Posisi 3 Kali";
      else if (this.game.insufficient_material()) reason = "Materi Tidak Cukup (Draw)";
      this.statusEl.textContent = `Remis — ${reason}`;
      this.showBanner(
        `Permainan Berakhir Remis: ${reason}`,
        "bg-amber-900/80 text-amber-200 border border-amber-500",
      );
      return;
    }

    if (this.isReviewMode()) {
      this.showBanner(
        'Mode Tinjauan Riwayat: Klik tombol ">>|" untuk kembali ke giliran saat ini.',
        "bg-sky-900/80 text-sky-200 border border-sky-500",
      );
    }

    if (this.isAIThinking) {
      this.statusEl.textContent = `AI (${turnName}) sedang menghitung langkah...`;
    } else if (this.game.in_check()) {
      this.statusEl.textContent = `Giliran ${turnName} — Raja dalam posisi SKAK!`;
    } else {
      this.statusEl.textContent = `Giliran ${turnName} Melangkah`;
    }
  }

  showBanner(message, classes) {
    this.alertBanner.textContent = message;
    this.alertBanner.className = `mt-2 px-3 py-2 rounded-xl text-xs font-semibold text-center ${classes}`;
    this.alertBanner.classList.remove("hidden");
  }
}

window.addEventListener("DOMContentLoaded", () => {
  new ChessApp();
});
