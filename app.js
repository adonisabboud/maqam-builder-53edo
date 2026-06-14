(() => {
  // ==============================
  // 1) Tuning engine (53-EDO Turkish comma system)
  // ==============================
  const C4 = 260.77;
  const COMMA = Math.pow(2, 1/53);
  const HALF_COMMA = Math.sqrt(COMMA);

  const PC = {
    "C": 0, "D": 9, "E": 18, "F": 22, "G": 31, "A": 40, "B": 49,
    "C5": 53
  };

  function commaToFreq(relCommasFromC4){
    return C4 * Math.pow(COMMA, relCommasFromC4);
  }

  function midpointCommas(a, b){ return (a + b) / 2; }

  const MICRO = {
    "Eb_half_rast": midpointCommas(PC["D"], PC["F"]),
    "Eb_half_bayati": midpointCommas(PC["D"], PC["F"]) - 0.5,
    "Eb_half_sikah": midpointCommas(PC["D"], PC["F"]) + 0.5,

    "Bb_half_rast": midpointCommas(PC["A"], PC["C5"]),
    "Bb_half_bayati": midpointCommas(PC["A"], PC["C5"]) - 0.5,
    "Bb_half_sikah": midpointCommas(PC["A"], PC["C5"]) + 0.5,
  };

  // ======================
  // TRANSPOSE LAYER
  // ======================
  let transposeCommas = 0;

  function applyTranspose(absCommas){
    return absCommas + transposeCommas;
  }

  function buildTonicOptions(){
    const CHROM = 5;
    const DIAT  = 4;

    const tonics = [
      { name:"C",  abs: PC["C"] },
      { name:"C♯", abs: PC["C"] + CHROM },
      { name:"D♭", abs: PC["C"] + DIAT },
      { name:"D",  abs: PC["D"] },
      { name:"E♭", abs: PC["E"] - DIAT },
      { name:"E♭½ (Bayātī)", abs: MICRO["Eb_half_bayati"] },
      { name:"E♭½ (Rāst)",   abs: MICRO["Eb_half_rast"] },
      { name:"E♭½ (Sīkāh)",  abs: MICRO["Eb_half_sikah"] },
      { name:"E",  abs: PC["E"] },
      { name:"F",  abs: PC["F"] },
      { name:"F♯", abs: PC["F"] + CHROM },
      { name:"G♭", abs: PC["F"] + DIAT },
      { name:"G",  abs: PC["G"] },
      { name:"A♭", abs: PC["A"] - DIAT },
      { name:"A",  abs: PC["A"] },
      { name:"B♭", abs: PC["B"] - DIAT },
      { name:"B",  abs: PC["B"] },
    ];

    const seen = new Set();
    return tonics.filter(t => (seen.has(t.name) ? false : (seen.add(t.name), true)));
  }

  function prettyName(n){
    return n
      .replace("Eb½", "E♭½")
      .replace("Bb½", "B♭½")
      .replace("Ab", "A♭")
      .replace("Gb", "G♭")
      .replace("F#", "F♯")
      .replace("Bb", "B♭")
      .replace("Eb", "E♭");
  }

  // ==============================
  // Solfège display
  // ==============================
  const SOLFEGE = {
    C: "Do", D: "Re", E: "Mi", F: "Fa", G: "Sol", A: "La", B: "Si",
  };

  function toSolfege(label){
    return label.replace(/\b([A-G])(?=(?:[♭♯]|♭½|½)?\d?\b)/g, (_, p1) => SOLFEGE[p1] || p1);
  }

  // ==============================
  // 2) JINS DEFINITIONS
  // ==============================
  const JINS = {
    "Rast":     { offsets:[0, 9, 15.5, 22], labels:["T", "2", "E♭½ (Rāst)", "4"] },
    "Bayati":   { offsets:[0, 6.0, 13, 22], labels:["T", "E♭½ (Bayātī)", "F", "G"] },
    "Sikah":    { offsets:[0, 6, 15], labels:["T (E♭½ Sīkāh)", "F", "G"] },
    "Hijaz":    { offsets:[0, 4, 18, 22], labels:["T", "E♭", "F♯", "G"] },
    "Kurd":     { offsets:[0, 4, 13, 22], labels:["T", "E♭", "F", "G"] },
    "Nahawand": { offsets:[0, 9, 13, 22], labels:["T", "D", "E♭", "F"] },
    "Ajam":     { offsets:[0, 9, 18, 22], labels:["T", "D", "E", "F"] },
    "Saba":     { offsets:[0, 6.0, 13, 18], labels:["T", "E♭½ (Bayātī)", "F", "G♭"] },
  };

  // ==============================
  // 3) MAQAM TEMPLATES
  // ==============================
  const MAQAM = {
    "Rast on C":        { tonicAbs: PC["C"], tonicName:"C",      lower:"Rast",     upperBaseAbs: PC["G"], upperDefault:"Rast",     upperOptions:["Rast","Bayati","Hijaz","Nahawand"] },
    "Bayati on D":      { tonicAbs: PC["D"], tonicName:"D",      lower:"Bayati",   upperBaseAbs: PC["G"], upperDefault:"Rast",     upperOptions:["Rast","Nahawand","Hijaz"] },
    "Nahawand on C":    { tonicAbs: PC["C"], tonicName:"C",      lower:"Nahawand", upperBaseAbs: PC["G"], upperDefault:"Nahawand", upperOptions:["Rast","Bayati","Hijaz","Nahawand"] },
    "Ajam on C":        { tonicAbs: PC["C"], tonicName:"C",      lower:"Ajam",     upperBaseAbs: PC["G"], upperDefault:"Ajam",     upperOptions:["Ajam"] },
    "Kurd on D":        { tonicAbs: PC["D"], tonicName:"D",      lower:"Kurd",     upperBaseAbs: PC["G"], upperDefault:"Kurd",     upperOptions:["Kurd"] },
    "Hijaz on D":       { tonicAbs: PC["D"], tonicName:"D",      lower:"Hijaz",    upperBaseAbs: PC["G"], upperDefault:"Hijaz",    upperOptions:["Hijaz"] },
    "Saba on D":        { tonicAbs: PC["D"], tonicName:"D",      lower:"Saba",     upperBaseAbs: PC["F"], upperDefault:"Hijaz",    upperOptions:["Hijaz"] },
    "Sikah on E♭½":     { tonicAbs: MICRO["Eb_half_sikah"], tonicName:"Eb½", lower:"Sikah", upperBaseAbs: PC["G"], upperDefault:"Hijaz", upperOptions:["Hijaz"] },
  };

  // ==============================
  // 4) AUDIO ENGINE
  // ==============================
  let audioCtx = null;
  let master = null;
  let droneBus = null;

  const held = new Map();
  const drones = new Map();

  function ensureAudio(){
    if (audioCtx) return;
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    master = audioCtx.createGain();
    master.gain.value = parseFloat(document.getElementById('vol').value);
    master.connect(audioCtx.destination);

    droneBus = audioCtx.createGain();
    droneBus.gain.value = parseFloat(document.getElementById('droneVol').value);
    droneBus.connect(master);
  }

  function setMasterVol(v){ if (master) master.gain.value = v; }
  function setDroneVol(v){ if (droneBus) droneBus.gain.value = v; }

  function buildOscillators(f, outGain, now){
    const mode = document.getElementById('waveSel').value;
    const oscillators = [];
    const gains = [];

    if (mode === "sine") {
      const osc = audioCtx.createOscillator();
      osc.type = "sine";
      osc.frequency.setValueAtTime(f, now);
      osc.connect(outGain);
      oscillators.push(osc);
      return {oscillators, gains};
    }

    if (mode === "qanun") {
      // Qanun timbre (#10): sharp attack, bright harmonics with fast high-partial decay
      const partials = [
        {k: 1, a: 1.00},
        {k: 2, a: 0.50},
        {k: 3, a: 0.35},
        {k: 4, a: 0.20},
        {k: 5, a: 0.15},
        {k: 6, a: 0.08},
        {k: 7, a: 0.04},
      ];
      const sumA = partials.reduce((s,p) => s + p.a, 0);
      for (const p of partials) p.a /= sumA;

      for (const p of partials){
        const osc = audioCtx.createOscillator();
        const g = audioCtx.createGain();
        g.gain.setValueAtTime(p.a, now);
        osc.type = "sine";
        osc.frequency.setValueAtTime(f * p.k, now);
        osc.connect(g);
        g.connect(outGain);
        oscillators.push(osc);
        gains.push(g);
      }
      return {oscillators, gains};
    }

    // "harmonic" mode
    const partials = [
      {k: 1, a: 1.00},
      {k: 2, a: 0.25},
      {k: 3, a: 0.12},
      {k: 4, a: 0.06},
      {k: 5, a: 0.03},
    ];
    const sumA = partials.reduce((s,p)=>s+p.a,0);
    for (const p of partials) p.a /= sumA;

    for (const p of partials){
      const osc = audioCtx.createOscillator();
      const g = audioCtx.createGain();
      g.gain.setValueAtTime(p.a, now);
      osc.type = "sine";
      osc.frequency.setValueAtTime(f * p.k, now);
      osc.connect(g);
      g.connect(outGain);
      oscillators.push(osc);
      gains.push(g);
    }
    return {oscillators, gains};
  }

  function playPluck(f){
    ensureAudio();
    const now = audioCtx.currentTime;
    const mode = document.getElementById('waveSel').value;
    const outGain = audioCtx.createGain();
    outGain.connect(master);

    if (mode === "qanun") {
      // Qanun pluck: very sharp attack, brighter, shorter decay
      outGain.gain.setValueAtTime(0.0001, now);
      outGain.gain.exponentialRampToValueAtTime(1.0, now + 0.002);
      outGain.gain.exponentialRampToValueAtTime(0.3, now + 0.15);
      outGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);

      const {oscillators, gains: partialGains} = buildOscillators(f, outGain, now);
      // High partials decay faster for realism
      for (let i = 0; i < partialGains.length; i++){
        const decay = 0.3 + (i * 0.15);
        const g = partialGains[i];
        const startVal = g.gain.value;
        g.gain.setValueAtTime(startVal, now + 0.01);
        g.gain.exponentialRampToValueAtTime(Math.max(0.0001, startVal * 0.01), now + Math.max(0.2, 1.8 - decay));
      }
      for (const osc of oscillators){
        osc.start(now);
        osc.stop(now + 2.0);
      }
    } else {
      outGain.gain.setValueAtTime(0.0001, now);
      outGain.gain.exponentialRampToValueAtTime(1.0, now + 0.005);
      outGain.gain.exponentialRampToValueAtTime(0.0001, now + 2.2);

      const {oscillators} = buildOscillators(f, outGain, now);
      for (const osc of oscillators){
        osc.start(now);
        osc.stop(now + 2.3);
      }
    }
  }

  function startHold(key, f){
    ensureAudio();
    if (held.has(key)) return;

    const now = audioCtx.currentTime;
    const outGain = audioCtx.createGain();
    outGain.connect(master);
    outGain.gain.setValueAtTime(0.0001, now);
    outGain.gain.exponentialRampToValueAtTime(1.0, now + 0.01);

    const {oscillators, gains} = buildOscillators(f, outGain, now);
    for (const osc of oscillators) osc.start(now);

    held.set(key, {oscillators, gains, outGain});
  }

  function stopHold(key){
    const obj = held.get(key);
    if (!obj) return;
    const now = audioCtx.currentTime;

    try {
      obj.outGain.gain.cancelScheduledValues(now);
      obj.outGain.gain.setValueAtTime(Math.max(0.0001, obj.outGain.gain.value), now);
      obj.outGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);
    } catch(e){}

    setTimeout(() => {
      for (const osc of obj.oscillators){
        try { osc.stop(); } catch(e){}
        try { osc.disconnect(); } catch(e){}
      }
      for (const g of obj.gains){
        try { g.disconnect(); } catch(e){}
      }
      try { obj.outGain.disconnect(); } catch(e){}
    }, 120);

    held.delete(key);
  }

  function startDrone(which, f){
    ensureAudio();
    if (drones.has(which)) return;

    const now = audioCtx.currentTime;
    const outGain = audioCtx.createGain();
    outGain.connect(droneBus);
    outGain.gain.setValueAtTime(0.0001, now);
    outGain.gain.exponentialRampToValueAtTime(0.75, now + 0.02);

    const osc = audioCtx.createOscillator();
    osc.type = "sine";
    osc.frequency.setValueAtTime(f, now);
    osc.connect(outGain);
    osc.start(now);

    drones.set(which, {osc, outGain});
  }

  function stopDrone(which){
    const obj = drones.get(which);
    if (!obj) return;
    const now = audioCtx.currentTime;

    try {
      obj.outGain.gain.cancelScheduledValues(now);
      obj.outGain.gain.setValueAtTime(Math.max(0.0001, obj.outGain.gain.value), now);
      obj.outGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.10);
    } catch(e){}

    setTimeout(() => {
      try { obj.osc.stop(); } catch(e){}
      try { obj.osc.disconnect(); } catch(e){}
      try { obj.outGain.disconnect(); } catch(e){}
    }, 150);

    drones.delete(which);
  }

  function stopAll(){
    for (const k of Array.from(held.keys())) stopHold(k);
    for (const k of Array.from(drones.keys())) stopDrone(k);
    syncDroneUI();
    refreshHeldStyles();
  }

  // ==============================
  // 5) UI BUILD
  // ==============================
  const enableBtn = document.getElementById('enableBtn');
  const stopBtn   = document.getElementById('stopBtn');
  const vol       = document.getElementById('vol');
  const volVal    = document.getElementById('volVal');
  const maqamSel  = document.getElementById('maqamSel');
  const upperSel  = document.getElementById('upperSel');
  const modeSel   = document.getElementById('modeSel');
  const latchEl   = document.getElementById('latch');

  const drone1Btn = document.getElementById('drone1');
  const drone2Btn = document.getElementById('drone2');
  const droneVol  = document.getElementById('droneVol');
  const droneVolVal = document.getElementById('droneVolVal');

  const gridScale = document.getElementById('gridScale');
  const grid1 = document.getElementById('grid1');
  const grid2 = document.getElementById('grid2');
  const scaleText = document.getElementById('scaleText');
  const tonicSel = document.getElementById('tonicSel');
  const tonicInfo = document.getElementById('tonicInfo');
  const j1Text = document.getElementById('j1Text');
  const j2Text = document.getElementById('j2Text');

  // ==============================
  // Theme (light/dark) with persistence
  // ==============================
  const themeToggle = document.getElementById("themeToggle");

  function applyTheme(mode) {
    document.documentElement.setAttribute("data-theme", mode);
    localStorage.setItem("theme", mode);
    if (themeToggle) themeToggle.checked = (mode === "dark");
  }

  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    applyTheme(savedTheme);
  } else {
    const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    applyTheme(prefersDark ? "dark" : "light");
  }

  if (themeToggle) {
    themeToggle.addEventListener("change", () => {
      applyTheme(themeToggle.checked ? "dark" : "light");
    });
  }

  // Accessibility: announce state changes to screen readers
  function srAnnounce(msg){
    const el = document.getElementById("sr-announcer");
    if (!el) return;
    el.textContent = "";
    requestAnimationFrame(() => { el.textContent = msg; });
  }

  const MID_KEYS  = ["a","s","d","f","g","h","j","k"];
  const BASS_KEYS = ["z","x","c","v","b","n","m"];
  const HIGH_KEYS = ["q","w","e","r","t","y","u"];

  let keyboardAbs = new Map();
  const keyDown = new Set();

  let noteKeyToAbs = new Map();
  let noteButtons = new Map();

  function mkNoteCard(noteObj, group){
    const wrap = document.createElement('div');
    wrap.className = "note";

    const b = document.createElement('button');
    b.className = "btn small " + (group === 1 ? "j1" : "j2");
    b.textContent = toSolfege(noteObj.label);
    if (noteObj.isTonic) b.classList.add("tonic");
    if (noteObj.isMicro) b.classList.add("micro");

    const freqLabel = commaToFreq(applyTranspose(noteObj.absCommas)).toFixed(2);
    b.setAttribute("aria-label", `${toSolfege(noteObj.label)}, ${freqLabel} hertz${noteObj.isTonic ? ", tonic" : ""}${noteObj.isMicro ? ", microtone" : ""}`);
    b.setAttribute("role", "button");

    const f = commaToFreq(applyTranspose(noteObj.absCommas));
    const ratio = f / C4;

    const meta = document.createElement('div');
    meta.className = "mono meta";
    meta.textContent = `${f.toFixed(2)} Hz  |  ratio ${ratio.toFixed(6)}`;

    noteButtons.set(noteObj.noteKey, b);

    function doPluck(){ playPluck(commaToFreq(applyTranspose(noteObj.absCommas))); }
    function doHoldStart(){ startHold(noteObj.noteKey, commaToFreq(applyTranspose(noteObj.absCommas))); refreshHeldStyles(); }
    function doHoldStop(){ stopHold(noteObj.noteKey); refreshHeldStyles(); }
    function toggleHold(){ held.has(noteObj.noteKey) ? doHoldStop() : doHoldStart(); }

    b.addEventListener('click', () => {
      if (modeSel.value === "pluck") return doPluck();
      if (latchEl.checked) return toggleHold();
    });

    b.addEventListener('mousedown', (e) => {
      if (modeSel.value !== "hold") return;
      if (latchEl.checked) return;
      e.preventDefault();
      doHoldStart();
    });
    b.addEventListener('mouseup', (e) => {
      if (modeSel.value !== "hold") return;
      if (latchEl.checked) return;
      e.preventDefault();
      doHoldStop();
    });
    b.addEventListener('mouseleave', () => {
      if (modeSel.value !== "hold") return;
      if (latchEl.checked) return;
      doHoldStop();
    });

    b.addEventListener('touchstart', (e) => {
      if (modeSel.value !== "hold") return;
      if (latchEl.checked) return;
      e.preventDefault();
      doHoldStart();
    }, {passive:false});
    b.addEventListener('touchend', (e) => {
      if (modeSel.value !== "hold") return;
      if (latchEl.checked) return;
      e.preventDefault();
      doHoldStop();
    }, {passive:false});

    wrap.appendChild(b);
    wrap.appendChild(meta);
    return wrap;
  }

  function refreshHeldStyles(){
    for (const [noteKey, btn] of noteButtons.entries()){
      const isHeld = held.has(noteKey);
      btn.classList.toggle("holdOn", isHeld);
      btn.setAttribute("aria-pressed", String(isHeld));
    }
    if (typeof refreshQanunActive === 'function') refreshQanunActive();
  }

  function syncDroneUI(){
    const tonicOn = drones.has("tonic");
    const upperOn = drones.has("upper");
    drone1Btn.classList.toggle("holdOn", tonicOn);
    drone2Btn.classList.toggle("holdOn", upperOn);
    drone1Btn.setAttribute("aria-pressed", String(tonicOn));
    drone2Btn.setAttribute("aria-pressed", String(upperOn));
  }

  function buildNotesForJins(jinsName, baseAbsCommas, group, isTonicFirst){
    const defs = JINS[jinsName];
    const OCT = 53;
    const octShifts = [-1, 0, 1];
    const res = [];
    for (const sh of octShifts){
      for (let i=0;i<defs.offsets.length;i++){
        const abs = baseAbsCommas + defs.offsets[i] + sh*OCT;
        if (abs < -53 || abs > 159) continue;
        const octaveLabel = 4 + sh;
        const baseName = (group === "L") ? MAQAM[maqamSel.value].tonicName : upperBaseName(MAQAM[maqamSel.value]);
        const label = toSolfege(prettyName(`${(defs.labels[i].startsWith("T") ? baseName : defs.labels[i])}${octaveLabel}`));
        const noteKey = `${group}:${jinsName}:${i}:${sh}`;
        res.push({
          label,
          absCommas: abs,
          isTonic: isTonicFirst && sh === 0 && i === 0,
          isMicro: label.includes("♭½"),
          noteKey
        });
      }
    }
    return res;
  }

  function fillMaqam(){
    maqamSel.innerHTML = "";
    Object.keys(MAQAM).forEach(m => {
      const opt = document.createElement('option');
      opt.value = m; opt.textContent = m;
      maqamSel.appendChild(opt);
    });
    maqamSel.value = "Rast on C";
  }

  function buildTonicUI(){
    if (!tonicSel) return;
    tonicSel.innerHTML = "";
    const opts = buildTonicOptions();
    for (const o of opts){
      const opt = document.createElement('option');
      opt.value = String(o.abs);
      opt.textContent = toSolfege(prettyName(o.name));
      tonicSel.appendChild(opt);
    }
    tonicSel.value = "0";

    function refreshInfo(){
      if (!tonicInfo) return;
      const v = parseFloat(tonicSel.value || "0");
      const sign = v > 0 ? "+" : "";
      tonicInfo.textContent = `(${sign}${v} c from C4)`;
    }
    refreshInfo();

    tonicSel.onchange = () => {
      transposeCommas = parseFloat(tonicSel.value || "0");
      refreshInfo();
      stopAll();
      rebuild();
    };
  }

  function fillUpper(){
    const m = MAQAM[maqamSel.value];
    upperSel.innerHTML = "";
    m.upperOptions.forEach(u => {
      const opt = document.createElement('option');
      opt.value = u; opt.textContent = u;
      upperSel.appendChild(opt);
    });
    upperSel.value = m.upperDefault;
  }

  function buildScaleOneOctave(m, upperJ){
    const OCT = 53;
    if (m.lower === "Saba") {
      const tonic = m.tonicAbs;
      const rel = [0, 6.0, 13, 17, 31, 35, 44, OCT];
      const absList = rel.map(x => tonic + x);

      function labelFromAbs(abs){
        const relPC = ((abs % OCT) + OCT) % OCT;
        const close = (a,b)=>Math.abs(a-b)<1e-6;

        if (close(relPC, PC["C"])) return "C";
        if (close(relPC, PC["D"])) return "D";
        if (close(relPC, PC["E"])) return "E";
        if (close(relPC, PC["F"])) return "F";
        if (close(relPC, PC["G"])) return "G";
        if (close(relPC, PC["A"])) return "A";
        if (close(relPC, PC["B"])) return "B";

        if (close(relPC, MICRO["Eb_half_bayati"])) return "E♭½ (Bayātī)";

        const Eb = PC["D"] + 4;
        const Ab = PC["G"] + 4;
        const Db = PC["C"] + 4;
        const Gb2 = PC["F"] + 4;
        const Bb2 = PC["A"] + 4;
        if (close(relPC, Eb)) return "E♭";
        if (close(relPC, Ab)) return "A♭";
        if (close(relPC, Db)) return "D♭";
        if (close(relPC, Gb2) || close(relPC, PC["G"] - 4)) return "G♭";
        if (close(relPC, Bb2) || close(relPC, PC["B"] - 4)) return "B♭";

        return `(${relPC.toFixed(1)}c)`;
      }

      return absList.map((abs, i) => ({
        absCommas: abs,
        label: toSolfege(labelFromAbs(abs)),
        isTonic: i === 0,
        isMicro: labelFromAbs(abs).includes("½"),
        noteKey: `S:Saba:${upperJ}:${i}:${abs.toFixed(3)}`
      }));
    }

    const lower = JINS[m.lower];
    const upper = JINS[upperJ];

    const lowerAbs = lower.offsets.map(o => m.tonicAbs + o);
    const upperBase = m.upperBaseAbs;
    const upperAbs = upper.offsets.map(o => upperBase + o);

    const joined = [...lowerAbs];
    const base = upperAbs[0];
    const tol = 1e-9;
    const hasBase = lowerAbs.some(x => Math.abs(x - base) < tol);
    const toAdd = hasBase ? upperAbs.slice(1) : upperAbs;

    for (const x of toAdd){
      if (!joined.some(y => Math.abs(y - x) < tol)) joined.push(x);
    }

    joined.push(m.tonicAbs + OCT);

    const filtered = joined.filter(x => x >= m.tonicAbs - tol && x <= m.tonicAbs + OCT + tol);
    filtered.sort((a,b)=>a-b);

    const uniq = [];
    for (const x of filtered){
      if (!uniq.some(y => Math.abs(y-x) < tol)) uniq.push(x);
    }

    if (m.lower === "Sikah" && upperJ === "Hijaz") {
      const D_abs = PC["D"] + OCT;
      if (D_abs >= m.tonicAbs - tol && D_abs <= m.tonicAbs + OCT + tol) {
        const hasD = uniq.some(x => Math.abs(x - D_abs) < tol);
        if (!hasD) {
          uniq.push(D_abs);
          uniq.sort((a, b) => a - b);
        }
      }
    }

    let result;
    if (uniq.length <= 8) {
      result = uniq.slice(0, 8);
    } else {
      const octaveAbs = m.tonicAbs + OCT;
      const inside = uniq.filter(x => Math.abs(x - octaveAbs) > tol);
      const picked = inside.slice(0, 6);
      const top = inside[inside.length - 1];
      if (!picked.some(y => Math.abs(y - top) < tol)) picked.push(top);
      picked.push(octaveAbs);

      picked.sort((a, b) => a - b);
      result = [];
      for (const x of picked) {
        if (!result.some(y => Math.abs(y - x) < tol)) result.push(x);
      }
      result = result.slice(0, 8);
    }

    function labelFromAbs(abs){
      const rel = ((abs % OCT) + OCT) % OCT;
      const close = (a,b)=>Math.abs(a-b)<1e-6;

      if (close(rel, PC["C"])) return "C";
      if (close(rel, PC["D"])) return "D";
      if (close(rel, PC["E"])) return "E";
      if (close(rel, PC["F"])) return "F";
      if (close(rel, PC["G"])) return "G";
      if (close(rel, PC["A"])) return "A";
      if (close(rel, PC["B"])) return "B";

      const Db = PC["C"] + 4;
      const Csh = PC["D"] - 4;
      const Eb = PC["D"] + 4;
      const Fsh = PC["G"] - 4;
      const Gb = PC["F"] + 4;
      const Ab = PC["G"] + 4;
      const Bb = PC["A"] + 4;

      if (close(rel, Db)) return "D♭";
      if (close(rel, Csh)) return "C♯";
      if (close(rel, Eb)) return "E♭";
      if (close(rel, Fsh)) return "F♯";
      if (close(rel, Gb)) return "G♭";
      if (close(rel, Ab)) return "A♭";
      if (close(rel, Bb)) return "B♭";

      if (close(rel, MICRO["Eb_half_rast"]))   return "E♭½ (Rāst)";
      if (close(rel, MICRO["Eb_half_bayati"])) return "E♭½ (Bayātī)";
      if (close(rel, MICRO["Eb_half_sikah"]))  return "E♭½ (Sīkāh)";

      if (close(rel, MICRO["Bb_half_rast"]))   return "B♭½ (Rāst)";
      if (close(rel, MICRO["Bb_half_bayati"])) return "B♭½ (Bayātī)";
      if (close(rel, MICRO["Bb_half_sikah"]))  return "B♭½ (Sīkāh)";

      return `(${rel.toFixed(1)}c)`;
    }

    return result.map((abs, i) => ({
      absCommas: abs,
      label: labelFromAbs(abs),
      isTonic: i===0,
      isMicro: labelFromAbs(abs).includes("½"),
      noteKey: `S:${m.lower}:${upperJ}:${i}:${abs.toFixed(3)}`
    }));
  }

  function upperBaseName(m){
    if (m.upperBaseAbs === PC["F"]) return "F";
    return "G";
  }

  function rebuild(){
    stopAll();
    noteButtons = new Map();
    noteKeyToAbs = new Map();
    keyboardAbs = new Map();

    const m = MAQAM[maqamSel.value];
    const upperJ = upperSel.value;

    if (j1Text) j1Text.textContent = `Lower jins: ${m.lower} (tonic ${prettyName(m.tonicName)})`;
    if (j2Text) j2Text.textContent = `Upper jins: ${upperJ} (base ${prettyName(upperBaseName(m))})`;

    drone1Btn.textContent = `Drone (tonic: ${prettyName(m.tonicName)})`;
    drone2Btn.textContent = `Drone (upper base: ${prettyName(upperBaseName(m))})`;

    gridScale.innerHTML = "";
    grid1.innerHTML = "";
    grid2.innerHTML = "";

    const scaleNotes = buildScaleOneOctave(m, upperJ);
    scaleText.textContent = `Full scale (1 octave): ${prettyName(m.tonicName)} → ${prettyName(m.tonicName)}`;

    const lowerNotes = buildNotesForJins(m.lower, m.tonicAbs, "L", true);
    const upperNotes = buildNotesForJins(upperJ, m.upperBaseAbs, "U", false);

    scaleNotes.forEach(n => {
      const OCT = 53;
      const sh = Math.round((n.absCommas - m.tonicAbs) / OCT);
      const oct = 4 + sh;
      gridScale.appendChild(mkNoteCard({ ...n, label: prettyName(`${n.label}${oct}`) }, 1));
    });

    const OCT = 53;
    for (let i=0;i<7;i++){
      keyboardAbs.set(MID_KEYS[i],  applyTranspose(scaleNotes[i].absCommas));
      keyboardAbs.set(BASS_KEYS[i], applyTranspose(scaleNotes[i].absCommas) - OCT);
      keyboardAbs.set(HIGH_KEYS[i], applyTranspose(scaleNotes[i].absCommas) + OCT);
    }
    if (scaleNotes.length >= 8) keyboardAbs.set(MID_KEYS[7], scaleNotes[7].absCommas);

    for (const n of [...lowerNotes, ...upperNotes]){
      noteKeyToAbs.set(n.noteKey, n.absCommas);
    }

    lowerNotes.forEach(n => grid1.appendChild(mkNoteCard(n, 1)));
    upperNotes.forEach(n => grid2.appendChild(mkNoteCard(n, 2)));

    // Rebuild qanun visualization
    buildQanun();
  }

  // ==============================
  // 6) QANUN VISUALIZATION
  // ==============================
  const qanunStringsEl = document.getElementById('qanunStrings');
  const qanunLabelsEl  = document.getElementById('qanunLabels');
  const qanunHoverEl   = document.getElementById('qanunHover');

  let qanunNotes = [];
  let qanunStringEls = [];
  let qanunLabelEls  = [];

  function buildQanunNotes(){
    const m = MAQAM[maqamSel.value];
    const upperJ = upperSel.value;
    const scaleNotes = buildScaleOneOctave(m, upperJ);
    const OCT = 53;

    const notes = [];
    for (let sh = 0; sh <= 1; sh++){
      for (let i = 0; i < scaleNotes.length; i++){
        const sn = scaleNotes[i];
        if (i === scaleNotes.length - 1 && sh === 0) continue;
        const abs = sn.absCommas + sh * OCT;
        const oct = 4 + sh;
        const noteKey = `Q:${i}:${sh}:${abs.toFixed(3)}`;
        notes.push({
          absCommas: abs,
          label: toSolfege(prettyName(`${sn.label}${oct}`)),
          isTonic: sn.isTonic,
          isMicro: sn.isMicro,
          noteKey,
          octave: sh,
          scaleIndex: i
        });
      }
    }
    return notes;
  }

  // (#6) Map keyboard abs values to qanun note indices for sync
  function findQanunIndexByAbs(absCommas){
    const tol = 0.01;
    for (let i = 0; i < qanunNotes.length; i++){
      if (Math.abs(applyTranspose(qanunNotes[i].absCommas) - absCommas) < tol) return i;
    }
    return -1;
  }

  function buildQanun(){
    qanunStringsEl.innerHTML = '';
    qanunLabelsEl.innerHTML = '';
    qanunNotes = buildQanunNotes();
    qanunStringEls = [];
    qanunLabelEls = [];

    // Find where octave 1 starts for divider (#5)
    let octaveBoundary = -1;
    for (let i = 0; i < qanunNotes.length; i++){
      if (qanunNotes[i].octave === 1 && (i === 0 || qanunNotes[i-1].octave === 0)){
        octaveBoundary = i;
        break;
      }
    }

    for (let i = 0; i < qanunNotes.length; i++){
      const n = qanunNotes[i];

      // Insert octave divider (#5)
      if (i === octaveBoundary){
        const divS = document.createElement('div');
        divS.className = 'qanun-octave-divider';
        qanunStringsEl.appendChild(divS);

        const divL = document.createElement('div');
        divL.className = 'qanun-label-divider';
        qanunLabelsEl.appendChild(divL);
      }

      // String row
      const row = document.createElement('div');
      row.className = 'qanun-string';
      row.setAttribute('data-octave', String(n.octave));
      row.setAttribute('data-index', String(i));
      if (n.isTonic) row.classList.add('q-tonic');
      if (n.isMicro) row.classList.add('q-micro');

      const line = document.createElement('div');
      line.className = 'qanun-string-line';
      row.appendChild(line);

      // Pluck animation helper
      const vibrateString = () => {
        row.classList.remove('qanun-plucked');
        void row.offsetWidth;
        row.classList.add('qanun-plucked');
        row.classList.add('q-active');
        setTimeout(() => { if (!held.has(n.noteKey)) row.classList.remove('q-active'); }, 400);
      };

      // Click handler: pluck mode or latch toggle
      const playString = () => {
        const f = commaToFreq(applyTranspose(n.absCommas));
        if (modeSel.value === 'pluck') {
          playPluck(f);
          vibrateString();
        } else if (modeSel.value === 'hold' && latchEl.checked) {
          if (held.has(n.noteKey)) {
            stopHold(n.noteKey);
          } else {
            startHold(n.noteKey, f);
          }
          refreshHeldStyles();
          refreshQanunActive();
        }
      };

      const holdStart = () => {
        if (modeSel.value !== 'hold' || latchEl.checked) return;
        const f = commaToFreq(applyTranspose(n.absCommas));
        startHold(n.noteKey, f);
        vibrateString();
        refreshHeldStyles();
        refreshQanunActive();
      };
      const holdStop = () => {
        if (modeSel.value !== 'hold' || latchEl.checked) return;
        stopHold(n.noteKey);
        refreshHeldStyles();
        refreshQanunActive();
      };

      row.addEventListener('click', playString);
      row.addEventListener('mousedown', (e) => { e.preventDefault(); holdStart(); });
      row.addEventListener('mouseup', (e) => { e.preventDefault(); holdStop(); });
      row.addEventListener('mouseleave', holdStop);
      row.addEventListener('touchstart', (e) => { e.preventDefault(); holdStart(); }, {passive:false});
      row.addEventListener('touchend', (e) => { e.preventDefault(); holdStop(); }, {passive:false});

      // Hover info (#4)
      row.addEventListener('mouseenter', () => {
        const f = commaToFreq(applyTranspose(n.absCommas));
        const ratio = f / C4;
        qanunHoverEl.textContent = `${n.label}  —  ${f.toFixed(2)} Hz  |  ratio ${ratio.toFixed(6)}`;
      });
      row.addEventListener('mouseleave', () => {
        if (!held.size) qanunHoverEl.textContent = '';
      });

      qanunStringsEl.appendChild(row);
      qanunStringEls.push(row);

      // Label
      const lbl = document.createElement('div');
      lbl.className = 'qanun-label';
      if (n.isTonic) lbl.classList.add('q-tonic-label');
      if (n.isMicro) lbl.classList.add('q-micro-label');
      lbl.textContent = n.label;
      lbl.addEventListener('click', playString);

      // Hover info from label too (#4)
      lbl.addEventListener('mouseenter', () => {
        const f = commaToFreq(applyTranspose(n.absCommas));
        const ratio = f / C4;
        qanunHoverEl.textContent = `${n.label}  —  ${f.toFixed(2)} Hz  |  ratio ${ratio.toFixed(6)}`;
      });
      lbl.addEventListener('mouseleave', () => {
        if (!held.size) qanunHoverEl.textContent = '';
      });

      qanunLabelsEl.appendChild(lbl);
      qanunLabelEls.push(lbl);
    }
  }

  function refreshQanunActive(){
    for (let i = 0; i < qanunNotes.length; i++){
      const isHeld = held.has(qanunNotes[i].noteKey);
      qanunStringEls[i].classList.toggle('q-active', isHeld);
      qanunLabelEls[i].classList.toggle('q-active-label', isHeld);
    }
  }

  // (#6) Visually vibrate a qanun string by its index
  function vibrateQanunByIndex(idx){
    if (idx < 0 || idx >= qanunStringEls.length) return;
    const row = qanunStringEls[idx];
    row.classList.remove('qanun-plucked');
    void row.offsetWidth;
    row.classList.add('qanun-plucked');
    row.classList.add('q-active');
    setTimeout(() => {
      if (!held.has(qanunNotes[idx].noteKey)){
        row.classList.remove('q-active');
      }
    }, 400);
  }

  // ==============================
  // Events
  // ==============================
  fillMaqam();
  buildTonicUI();
  fillUpper();
  rebuild();

  maqamSel.onchange = () => { fillUpper(); rebuild(); srAnnounce(`Maqām changed to ${maqamSel.value}`); };
  upperSel.onchange = () => { rebuild(); srAnnounce(`Upper jins changed to ${upperSel.value}`); };

  enableBtn.onclick = async () => {
    ensureAudio();
    if (audioCtx.state === "suspended") await audioCtx.resume();
    enableBtn.innerHTML = '<span class="statusDot on" id="audioDot" aria-hidden="true"></span>Audio Enabled';
    enableBtn.setAttribute("aria-label", "Audio enabled");
    srAnnounce("Audio enabled");
  };

  stopBtn.onclick = () => { stopAll(); srAnnounce("All notes stopped"); };

  vol.oninput = (e) => {
    const v = Number(e.target.value).toFixed(2);
    volVal.textContent = v;
    vol.setAttribute("aria-valuenow", v);
    setMasterVol(parseFloat(e.target.value));
  };

  droneVol.oninput = (e) => {
    const v = Number(e.target.value).toFixed(2);
    droneVolVal.textContent = v;
    droneVol.setAttribute("aria-valuenow", v);
    setDroneVol(parseFloat(e.target.value));
  };

  drone1Btn.onclick = () => {
    const m = MAQAM[maqamSel.value];
    const f = commaToFreq(applyTranspose(m.tonicAbs));
    const wasOn = drones.has("tonic");
    wasOn ? stopDrone("tonic") : startDrone("tonic", f);
    syncDroneUI();
    srAnnounce(wasOn ? "Tonic drone off" : "Tonic drone on");
  };

  drone2Btn.onclick = () => {
    const m = MAQAM[maqamSel.value];
    const f = commaToFreq(applyTranspose(m.upperBaseAbs));
    const wasOn = drones.has("upper");
    wasOn ? stopDrone("upper") : startDrone("upper", f);
    syncDroneUI();
    srAnnounce(wasOn ? "Upper base drone off" : "Upper base drone on");
  };

  // (#6) Keyboard playing with qanun string sync
  window.addEventListener('keydown', (e) => {
    if (e.repeat) return;
    const k = e.key.toLowerCase();

    if (k === " ") {
      e.preventDefault();
      stopAll();
      return;
    }

    const abs = keyboardAbs.get(k);
    if (abs === undefined) return;
    if (keyDown.has(k)) return;
    keyDown.add(k);

    const holdKey = `K:${k}`;
    const qIdx = findQanunIndexByAbs(abs);

    if (modeSel.value === "pluck") {
      playPluck(commaToFreq(abs));
      vibrateQanunByIndex(qIdx);
    } else {
      startHold(holdKey, commaToFreq(abs));
      refreshHeldStyles();
      // Light up matching qanun string
      if (qIdx >= 0){
        qanunStringEls[qIdx].classList.add('q-active');
        qanunLabelEls[qIdx].classList.add('q-active-label');
      }
    }
  });

  window.addEventListener('keyup', (e) => {
    const k = e.key.toLowerCase();
    keyDown.delete(k);
    const abs = keyboardAbs.get(k);
    if (abs === undefined) return;
    if (modeSel.value !== "hold") return;
    stopHold(`K:${k}`);
    refreshHeldStyles();

    // (#6) Un-light qanun string
    const qIdx = findQanunIndexByAbs(abs);
    if (qIdx >= 0){
      qanunStringEls[qIdx].classList.remove('q-active');
      qanunLabelEls[qIdx].classList.remove('q-active-label');
    }
  });

  modeSel.onchange = () => { if (modeSel.value !== "hold") stopAll(); };
  latchEl.onchange = () => { if (!latchEl.checked) stopAll(); };
})();
