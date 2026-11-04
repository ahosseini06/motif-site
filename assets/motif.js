/* Motif — shared kit for the landing-page ideas.
   Components are web ports of the SwiftUI views in Sources/MotifApp:
   ChipView / StabilityChip / PresetChip, ClipCell, MotionGraph. Data comes from assets/data.js. */
(function () {
  const script = document.currentScript;
  const ASSETS = new URL('./', script.src).href;
  const ROOT = new URL('../', script.src).href;
  const DATA = window.MOTIF_DATA || { clips: [] };

  const M = (window.Motif = {});
  M.asset = (p) => ASSETS + p;
  M.root = (p) => ROOT + p;
  M.DMG = ROOT + 'downloads/Motif-0.1.0.dmg';
  M.summary = DATA.summary;
  M.clips = DATA.clips;
  M.byId = Object.fromEntries(DATA.clips.map((c) => [c.id, c]));

  /* ---------- motion vocabulary (MotionTypes.swift, motion-spec.md) ---------- */

  M.CHANNELS = [
    { key: 'pan', unit: '°/s', color: '#2678e6', means: 'camera rotates right' },
    { key: 'tilt', unit: '°/s', color: '#0d948c', means: 'camera rotates up' },
    { key: 'roll', unit: '°/s', color: '#7d57d9', means: 'camera rotates clockwise' },
    { key: 'zoom', unit: 'ln/s', color: '#de4566', means: 'lens zooms in' },
    { key: 'truck', unit: 'depths/s', color: '#e37d1a', means: 'camera moves right' },
    { key: 'pedestal', unit: 'depths/s', color: '#b88f0a', means: 'camera moves up' },
    { key: 'dolly', unit: 'depths/s', color: '#409e38', means: 'camera moves forward' },
  ];
  M.SLOW_BELOW = [6, 6, 4, 0.08, 0.04, 0.04, 0.04];
  M.MEDIUM_BELOW = [20, 20, 12, 0.25, 0.12, 0.12, 0.12];

  /* ---------- icons: Lucide paths (ISC) standing in for the app's SF Symbols ---------- */

  const P = {
    'arrow-left': '<path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>',
    'arrow-right': '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
    'arrow-up': '<path d="m5 12 7-7 7 7"/><path d="M12 19V5"/>',
    'arrow-down': '<path d="M12 5v14"/><path d="m19 12-7 7-7-7"/>',
    'rotate-cw': '<path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/>',
    'rotate-ccw': '<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>',
    'zoom-in': '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/><path d="M11 8v6"/><path d="M8 11h6"/>',
    'zoom-out': '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/><path d="M8 11h6"/>',
    'push-in': '<path d="M4 14h6v6"/><path d="M20 10h-6V4"/><path d="m14 10 7-7"/><path d="m3 21 7-7"/>',
    'pull-out': '<path d="M15 3h6v6"/><path d="M9 21H3v-6"/><path d="m21 3-7 7"/><path d="m3 21 7-7"/>',
    'truck-left': '<path d="M3 19V5"/><path d="m13 6-6 6 6 6"/><path d="M7 12h14"/>',
    'truck-right': '<path d="M17 12H3"/><path d="m11 18 6-6-6-6"/><path d="M21 5v14"/>',
    'ped-up': '<path d="M5 3h14"/><path d="m18 13-6-6-6 6"/><path d="M12 7v14"/>',
    'ped-down': '<path d="M12 17V3"/><path d="m6 11 6 6 6-6"/><path d="M19 21H5"/>',
    'arc-left': '<path d="M9 14 4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11"/>',
    'arc-right': '<path d="m15 14 5-5-5-5"/><path d="M20 9H9.5a5.5 5.5 0 0 0 0 11H13"/>',
    'crane-up': '<path d="M7 7h10v10"/><path d="M7 17 17 7"/>',
    'crane-down': '<path d="m7 7 10 10"/><path d="M17 7v10H7"/>',
    focus: '<circle cx="12" cy="12" r="3"/><path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/>',
    lock: '<rect width="18" height="11" x="3" y="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
    download: '<path d="M12 15V3"/><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/>',
    search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
    'text-search': '<path d="M21 6H3"/><path d="M10 12H3"/><path d="M10 18H3"/><circle cx="17" cy="15" r="3"/><path d="m21 19-1.9-1.9"/>',
    move3d: '<path d="M5 3v16h16"/><path d="m5 19 6-6"/><path d="m2 6 3-3 3 3"/><path d="m18 16 3 3-3 3"/>',
    viewfinder: '<path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/><path d="M8 9.5h8v5H8z"/>',
    scope: '<circle cx="12" cy="12" r="9"/><path d="M22 12h-4"/><path d="M6 12H2"/><path d="M12 6V2"/><path d="M12 22v-4"/>',
    play: '<path d="M7 4.5v15a1 1 0 0 0 1.5.86l12-7.5a1 1 0 0 0 0-1.72l-12-7.5A1 1 0 0 0 7 4.5Z" fill="currentColor" stroke="none"/>',
    pause: '<rect x="6" y="4" width="4" height="16" rx="1" fill="currentColor" stroke="none"/><rect x="14" y="4" width="4" height="16" rx="1" fill="currentColor" stroke="none"/>',
    diamond: '<path d="M2.7 10.3a2.41 2.41 0 0 0 0 3.41l7.59 7.59a2.41 2.41 0 0 0 3.41 0l7.59-7.59a2.41 2.41 0 0 0 0-3.41L13.7 2.71a2.41 2.41 0 0 0-3.41 0Z"/>',
    film: '<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M7 3v18"/><path d="M3 7.5h4"/><path d="M3 12h18"/><path d="M3 16.5h4"/><path d="M17 3v18"/><path d="M17 7.5h4"/><path d="M17 16.5h4"/>',
    folder: '<path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/>',
    drive: '<path d="M22 12H2"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/><path d="M6 16h.01"/><path d="M10 16h.01"/>',
    cloud: '<path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
    hand: '<path d="M18 11V6a2 2 0 0 0-4 0v5"/><path d="M14 10V4a2 2 0 0 0-4 0v6"/><path d="M10 10.5V6a2 2 0 0 0-4 0v8"/><path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"/>',
    key: '<path d="m15.5 7.5 2.3 2.3a1 1 0 0 0 1.4 0l2.1-2.1a1 1 0 0 0 0-1.4L19 4"/><path d="m21 2-9.6 9.6"/><circle cx="7.5" cy="15.5" r="5.5"/>',
    cpu: '<rect width="16" height="16" x="4" y="4" rx="2"/><rect width="6" height="6" x="9" y="9" rx="1"/><path d="M15 2v2"/><path d="M15 20v2"/><path d="M2 15h2"/><path d="M2 9h2"/><path d="M20 15h2"/><path d="M20 9h2"/><path d="M9 2v2"/><path d="M9 20v2"/>',
    'chev-left': '<path d="m15 18-6-6 6-6"/>',
    'chev-right': '<path d="m9 18 6-6-6-6"/>',
  };
  M.icon = (name, attrs = '') =>
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ${attrs}>${P[name] || P.lock}</svg>`;

  const CHIP_ICON = {
    'pan left': 'arrow-left', 'pan right': 'arrow-right', 'tilt up': 'arrow-up', 'tilt down': 'arrow-down',
    'roll clockwise': 'rotate-cw', 'roll counter-clockwise': 'rotate-ccw', 'zoom in': 'zoom-in', 'zoom out': 'zoom-out',
    'push-in': 'push-in', 'pull-out': 'pull-out', 'truck left': 'truck-left', 'truck right': 'truck-right',
    'pedestal up': 'ped-up', 'pedestal down': 'ped-down', 'arc left': 'arc-left', 'arc right': 'arc-right',
    'crane up': 'crane-up', 'crane down': 'crane-down', 'dolly zoom in': 'focus', 'dolly zoom out': 'focus', static: 'lock',
  };
  M.chipIcon = (title) => CHIP_ICON[title] || 'lock';

  /** Distinct chips across a clip's segments, in order, plus its stability. */
  M.chipsOf = (clip) => {
    const seen = new Map();
    for (const s of clip.segs) for (const c of s.chips) if (!seen.has(c.t)) seen.set(c.t, c);
    const stabs = clip.segs.map((s) => s.stab);
    const stab = stabs.includes('handheld') ? 'handheld' : stabs.includes('stabilised') ? 'stabilised' : 'locked-off';
    return { chips: [...seen.values()], stab };
  };

  M.chip = (c, { lg = false } = {}) =>
    `<span class="chip${c.t === 'static' ? ' chip--static' : ''}${lg ? ' chip--lg' : ''}">${M.icon(M.chipIcon(c.t))}<span>${c.t}</span>${c.s ? `<span class="spd">${c.s}</span>` : ''}</span>`;
  M.stab = (s, { lg = false } = {}) => `<span class="chip chip--stab${lg ? ' chip--lg' : ''}">${s}</span>`;
  M.chipRow = (clip, opts) => {
    const { chips, stab } = M.chipsOf(clip);
    return `<div class="chips">${chips.map((c) => M.chip(c, opts)).join('')}${M.stab(stab, opts)}</div>`;
  };

  M.timecode = (s) => {
    const n = Math.round(s);
    return `${Math.floor(n / 60)}:${String(n % 60).padStart(2, '0')}`;
  };

  /* ---------- descriptions: authored for the synthetic set (no Gemini call was made) ---------- */

  M.DESC = {
    arc_right: 'Camera circles right around a cluster of patterned crates and spheres on a magenta floor, holding the centre box in frame.',
    dolly_neg: 'Pulls back from a mottled sphere and crates, letting more of the magenta floor and green backdrop into frame.',
    dolly_pos: 'Moves forward between patterned crates toward a green sphere and the violet column behind it.',
    dolly_zoom: 'Pushes in while the lens zooms out: the centre crates hold their size as the green backdrop swells behind them.',
    pan_endbump: 'Slow pan right across crates and spheres; the camera takes one knock as the move ends.',
    pan_fast: 'Fast pan right that sweeps past the crates and a tall blue-violet column, smearing the patterned backdrop.',
    pan_handheld: 'Handheld pan right across the set, with visible shake over the crates and spheres.',
    pan_neg: 'Pans left across the set, from the violet column back over the crates and a green sphere.',
    pan_pos: 'Pans right past patterned crates; a blue-violet column swings through the right of frame.',
    pan_slow: 'Slow, even pan right across crates and spheres on a magenta floor.',
    pan_subject: 'Pans left while a large patterned box crosses the foreground.',
    pan_tilt: 'Pans right and tilts down at once, drifting from the green backdrop toward the magenta floor.',
    pedestal_neg: 'Camera lowers straight down; the crates rise in frame against the green backdrop.',
    pedestal_pos: 'Camera rises a few centimetres on a pedestal; the framing barely changes.',
    pushin_slow: 'Slow push-in toward the cluster of crates and spheres at the centre of the set.',
    pushin_subject: 'Pushes in while a large box slides through the foreground and fills a third of the frame.',
    pushin_tiltup: 'Pushes forward and tilts up, from the magenta floor toward the green backdrop.',
    roll_neg: 'The horizon turns as the camera rolls counter-clockwise; crates and spheres rotate in frame.',
    roll_pos: 'Camera rolls clockwise over the set, tipping the crates and the column off level.',
    static: 'Locked-off wide of the set: crates, spheres and a violet column on a magenta floor.',
    static_endbump: 'Locked-off wide; a single knock near the end, like a record-button press.',
    static_handheld: 'Handheld on a static view of the crates; the frame jitters but never travels.',
    static_subject: 'Locked-off while a green patterned box moves through the foreground.',
    tilt_neg: 'Tilts down from the green backdrop onto the crates and the magenta floor.',
    tilt_pos: 'Tilts up from the magenta floor over the crates to the green backdrop.',
    truck_neg: 'Camera slides left past the crates; a near object fills the frame late in the move.',
    truck_pos: 'Camera slides right along the set; near crates pass faster than the backdrop.',
    zoom_neg: 'Zooms out from the centre crates to a wide of the whole set, with no parallax.',
    zoom_pos: 'Zooms in on the centre crates; everything scales evenly, with no parallax.',
  };

  /* ---------- clip cell (ClipCell.swift) ---------- */

  M.cell = (clip, { desc, name, match, selectable = false } = {}) => {
    const { chips } = M.chipsOf(clip);
    const first = chips[0];
    const d = desc === undefined ? M.DESC[clip.id] : desc;
    return `<div class="cell" data-clip="${clip.id}"${selectable ? ' role="option" aria-selected="false" tabindex="0"' : ''}>
      <div class="thumb" data-hoverplay="${clip.id}">
        <img src="${M.asset('clips/' + clip.id + '.webp')}" alt="" loading="lazy" decoding="async" width="640" height="360">
        ${first ? `<span class="glyph">${M.icon(M.chipIcon(first.t))}</span>` : ''}
        ${match ? `<span class="match">${M.icon('scope')}${match}</span>` : ''}
        <span class="tc">${M.timecode(clip.dur)}</span>
        <span class="scrub"></span>
      </div>
      <div class="cell-body">
        <div class="cell-name">${name || clip.id + '.mp4'}</div>
        ${d === null ? '' : `<div class="cell-desc${d && d.startsWith('~') ? ' is-muted' : ''}">${d ? d.replace(/^~/, '') : ''}</div>`}
        ${M.chipRow(clip)}
      </div>
    </div>`;
  };

  /** One muted player per hovered cell, after a 160 ms dwell — skimming across cells shouldn't spin up decoders. */
  M.hoverPlay = (root = document) => {
    root.querySelectorAll('[data-hoverplay]').forEach((thumb) => {
      if (thumb._wired) return;
      thumb._wired = true;
      let timer, video;
      const id = thumb.dataset.hoverplay;
      const scrub = thumb.querySelector('.scrub');
      const start = () => {
        clearTimeout(timer);
        timer = setTimeout(() => {
          if (!video) {
            video = document.createElement('video');
            Object.assign(video, { muted: true, loop: true, playsInline: true, preload: 'auto' });
            video.setAttribute('muted', '');
            video.src = M.asset('clips/' + id + '.mp4');
            video.addEventListener('playing', () => thumb.classList.add('is-playing'));
            thumb.insertBefore(video, thumb.children[1]);
          }
          video.currentTime = 0;
          video.play().catch(() => {});
        }, 160);
      };
      const stop = () => {
        clearTimeout(timer);
        thumb.classList.remove('is-playing');
        if (video) video.pause();
      };
      thumb.addEventListener('pointerenter', (e) => e.pointerType === 'mouse' && start());
      thumb.addEventListener('pointerleave', (e) => e.pointerType === 'mouse' && stop());
      thumb.addEventListener('pointermove', (e) => {
        if (!scrub) return;
        const r = thumb.getBoundingClientRect();
        scrub.style.transform = `translateX(${Math.max(0, Math.min(r.width - 2, e.clientX - r.left))}px)`;
      });
      thumb.addEventListener('click', (e) => {
        if (e.pointerType === 'mouse' || thumb.closest('[data-nohoverclick]')) return;
        thumb.classList.contains('is-playing') ? stop() : start();
      });
    });
  };

  /* ---------- motion graph (MotionGraph.swift) ---------- */

  M.tracksOf = (clip) => ({
    tracks: [{ start: 0, end: clip.rows.length / 8, rows: clip.rows }],
    duration: clip.dur,
    bounds: clip.segs.slice(1).map((s) => s.a),
  });

  /**
   * Seven lanes, one per channel, across the clip's timeline. Each lane is centred on zero and soft-clipped
   * (tanh over 1.2 × the channel's "slow" threshold) so a slow move is clearly visible and a whip pan still fits.
   */
  M.graph = (host, { labelWidth = 58, dark = false, onScrub, labels = true, gain = 1, lineWidth = 1.4, autoscale = false } = {}) => {
    host.classList.add('graph');
    host.innerHTML = `<canvas></canvas>${labels ? `<div class="graph-labels" style="width:${labelWidth - 8}px;grid-template-rows:repeat(7,1fr)">${M.CHANNELS.map((c) => `<span style="color:${c.color}">${c.key}</span>`).join('')}</div>` : ''}`;
    const cv = host.querySelector('canvas');
    const ctx = cv.getContext('2d');
    const st = { tracks: [], duration: 1, bounds: [], time: 0, loop: null, lw: labels ? labelWidth : 0 };
    let w = 0, h = 0;

    const resize = () => {
      const r = cv.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      w = r.width; h = r.height;
      cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw();
    };
    const draw = () => {
      if (!w) return;
      ctx.clearRect(0, 0, w, h);
      const plotX = st.lw, plotW = Math.max(1, w - st.lw), lane = h / 7, d = st.duration || 1;
      const x = (t) => plotX + (t / d) * plotW;
      if (st.loop) {
        ctx.fillStyle = dark ? 'rgba(255,194,75,0.10)' : 'rgba(94,106,210,0.08)';
        ctx.fillRect(x(st.loop[0]), 0, x(st.loop[1]) - x(st.loop[0]), h);
      }
      ctx.lineWidth = 1;
      ctx.strokeStyle = dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.07)';
      for (let c = 0; c < 7; c++) {
        const mid = Math.round((c + 0.5) * lane) + 0.5;
        ctx.beginPath(); ctx.moveTo(plotX, mid); ctx.lineTo(plotX + plotW, mid); ctx.stroke();
      }
      ctx.setLineDash([2, 3]);
      ctx.strokeStyle = dark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.16)';
      for (const b of st.bounds) { const bx = Math.round(x(b)) + 0.5; ctx.beginPath(); ctx.moveTo(bx, 0); ctx.lineTo(bx, h); ctx.stroke(); }
      ctx.setLineDash([]);

      M.CHANNELS.forEach((ch, c) => {
        const mid = (c + 0.5) * lane, half = lane / 2 - 3;
        // autoscale: linear, each lane fitted to this clip's own range (with a floor so sensor noise isn't blown up)
        let scale = (M.SLOW_BELOW[c] * 1.2) / gain, shape = Math.tanh;
        if (autoscale) {
          let m = 0; for (const tr of st.tracks) for (const row of tr.rows) m = Math.max(m, Math.abs(row[c]));
          scale = Math.max(m * 1.08, M.SLOW_BELOW[c] * 0.3); shape = (v) => Math.max(-1, Math.min(1, v));
        }
        const pts = [];
        for (const tr of st.tracks) {
          if (!tr.rows.length) continue;
          const step = (tr.end - tr.start) / tr.rows.length;
          tr.rows.forEach((row, i) => pts.push([x(tr.start + (i + 0.5) * step), mid - shape(row[c] / scale) * half]));
        }
        if (!pts.length) return;
        ctx.beginPath(); ctx.moveTo(pts[0][0], mid);
        pts.forEach((p) => ctx.lineTo(p[0], p[1]));
        ctx.lineTo(pts[pts.length - 1][0], mid); ctx.closePath();
        ctx.globalAlpha = dark ? 0.2 : 0.13; ctx.fillStyle = ch.color; ctx.fill(); ctx.globalAlpha = 1;
        ctx.beginPath(); pts.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])));
        ctx.strokeStyle = ch.color; ctx.lineWidth = lineWidth; ctx.lineJoin = 'round'; ctx.stroke();
      });

      const px = Math.round(x(Math.min(st.time, d))) + 0.5;
      ctx.strokeStyle = dark ? 'rgba(255,255,255,0.85)' : 'rgba(28,29,31,0.8)'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(px, 0); ctx.lineTo(px, h); ctx.stroke();
    };

    new ResizeObserver(resize).observe(cv);
    if (onScrub) {
      const scrubAt = (e) => {
        const r = cv.getBoundingClientRect();
        const t = ((e.clientX - r.left - st.lw) / Math.max(1, r.width - st.lw)) * st.duration;
        onScrub(Math.max(0, Math.min(st.duration, t)));
      };
      host.addEventListener('pointerdown', (e) => { host.setPointerCapture(e.pointerId); scrubAt(e); });
      host.addEventListener('pointermove', (e) => host.hasPointerCapture(e.pointerId) && scrubAt(e));
    } else host.style.cursor = 'default';

    return {
      set(o) { Object.assign(st, o); draw(); },
      setTime(t) { st.time = t; draw(); },
      setLoop(l) { st.loop = l; draw(); },
      get state() { return st; },
    };
  };

  /* ---------- brand mark: the app icon's three stacked frames ---------- */

  M.mark = (size = 26) => `<img src="${M.asset('icon.png')}" width="${size}" height="${size}" alt="">`;

  /* ---------- shared close + review switcher ---------- */

  M.closer = (title = 'Find the shot by how the camera moves.') => `
    <section class="closer"><div class="wrap">
      <div class="closer-row">
        <h2>${title}</h2>
        <div class="closer-actions">
          <a class="btn btn--primary btn--lg" href="${M.DMG}" download>${M.icon('download')}Download for Mac</a>
          <span class="dl-meta">Version 0.1.0 · 5.5 MB</span>
        </div>
      </div>
      <div class="closer-fine">
        <span><b>Requires</b> macOS 26 on Apple Silicon</span>
        <span><b>First launch</b> System Settings → Privacy &amp; Security → Open Anyway</span>
        <span><b>Descriptions</b> bring your own Gemini key, or keep a project on-device only</span>
        <span>${document.body.dataset.footage || "Footage on this page: Motif's synthetic test renders, with known camera paths"}</span>
      </div>
    </div></section>`;

  M.mountChrome = () => {
    document.querySelectorAll('[data-closer]').forEach((el) => (el.outerHTML = M.closer(el.dataset.closer || undefined)));
    document.querySelectorAll('[data-mark]').forEach((el) => (el.innerHTML = M.mark(+el.dataset.mark || 26)));
    document.querySelectorAll('[data-icon]').forEach((el) => el.insertAdjacentHTML('afterbegin', M.icon(el.dataset.icon)));
    document.querySelectorAll('a[data-dmg]').forEach((a) => { a.href = M.DMG; a.setAttribute('download', ''); });
    const n = +document.body.dataset.idea;
    if (!n) return;
    const nav = document.createElement('nav');
    nav.className = 'ideas' + (document.body.dataset.theme === 'dark' ? ' is-dark' : '');
    nav.setAttribute('aria-label', 'Landing page ideas');
    const href = (i) => M.root(i + '/');
    const COUNT = 11, prev = n === 1 ? COUNT : n - 1, next = n === COUNT ? 1 : n + 1;
    nav.innerHTML = `<a class="nav-arrow" href="${href(prev)}" aria-label="Previous idea">${M.icon('chev-left', 'width="14" height="14"')}</a>` +
      Array.from({ length: COUNT }, (_, i) => `<a href="${href(i + 1)}"${i + 1 === n ? ' aria-current="page"' : ''}>${i + 1}</a>`).join('') +
      `<a class="nav-arrow" href="${href(next)}" aria-label="Next idea">${M.icon('chev-right', 'width="14" height="14"')}</a>`;
    document.body.appendChild(nav);
    addEventListener('keydown', (e) => {
      if (e.target.closest('input, textarea')) return;
      if (e.key === ']') location.href = href(next);
      if (e.key === '[') location.href = href(prev);
    });
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', M.mountChrome);
  else M.mountChrome();
})();
