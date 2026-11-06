/**
 * The opening scene: the logo's blocks fly in from all sides, collide into the "C" mark with a flash and a burst,
 * then "Commit·AI" assembles letter by letter in 3D. Afterwards the logo tilts toward the pointer, its blocks are
 * pushed by the cursor, a click makes it implode and re-form, and scrolling scatters everything.
 * Ported from the standalone hero (three.js); started by <LogoScene>, which passes the elements and gets back a
 * function that stops everything.
 */
import * as THREE from 'three';

export function startLogoScene(host: HTMLElement, canvas: HTMLCanvasElement, hint: HTMLElement): () => void {
  const T = 2.4, INTRO_END = 4.6, LOOP_AT = 5.8, FOV = 32;
  const FONT = 'Inter, "Helvetica Neue", Helvetica, Arial, sans-serif';
  const BG = 0x070b12, WORD = [0xffffff, 0x7f97b5], BLUE = [0x2196f3, 0x0f5da8];
  const CORE = [323, 300];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // the blocks of the mark: x, y, size, colour, ring (0 outer, 2 inner), in the logo's own pixel space
  const RAW: [number, number, number, string, number][] = [
    [276, 160, 34, '#4AA8EC', 0], [327, 150, 32, '#4BA9DE', 0], [378, 161, 23, '#4AA3D3', 0], [427, 185, 19, '#4A9CC5', 0],
    [228, 183, 34, '#3FA6F2', 0], [190, 220, 34, '#3DA3F2', 0], [176, 273, 32, '#3BA0F0', 0], [171, 327, 34, '#3999EC', 0],
    [195, 375, 32, '#3591E6', 0], [228, 417, 30, '#2E86DE', 0], [274, 444, 28, '#2B7DD4', 0], [327, 451, 28, '#2A72C6', 0],
    [378, 438, 26, '#2C66B2', 0], [423, 410, 19, '#2F5C99', 0],
    [312, 183, 24, '#3B7FAE', 1], [358, 193, 22, '#3E83AE', 1], [266, 200, 24, '#3B87BE', 1], [230, 231, 28, '#3784C2', 1],
    [213, 276, 27, '#3A80BC', 1], [211, 323, 26, '#3678B4', 1], [232, 366, 28, '#3170AC', 1], [268, 396, 25, '#2D64A2', 1],
    [312, 409, 25, '#2B5891', 1], [358, 407, 22, '#29528A', 1], [398, 217, 18, '#3F7FA6', 1], [400, 385, 16, '#2A4C7C', 1],
    [291, 227, 18, '#2E5F86', 2], [337, 217, 16, '#2D5A80', 2], [378, 240, 12, '#2C5070', 2], [256, 256, 20, '#2F628E', 2],
    [245, 300, 20, '#2E5C88', 2], [256, 344, 20, '#2C547F', 2], [290, 374, 17, '#284A72', 2], [336, 379, 14, '#26446A', 2],
    [378, 360, 12, '#233E60', 2],
  ];

  let seed = 21;
  const rnd = () => { seed |= 0; seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
  const eOut = (x: number) => 1 - Math.pow(1 - x, 3);
  const eIn = (x: number) => x * x * x;
  const eInOut = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
  const eBack = (x: number) => { const c1 = 1.6, c3 = c1 + 1; return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2); };
  const P = 4;
  // a pulse that travels outward through the mark every few seconds once it has settled
  const bump = (lt: number, d: number) => { if (lt < 0) return 0; const l = ((((lt / P) - d / 700) % 1) + 1) % 1; return l < 0.4 ? Math.pow(Math.sin((Math.PI * l) / 0.4), 2) : 0; };

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  const scene = new THREE.Scene(); scene.background = new THREE.Color(BG);
  const fog = new THREE.Fog(BG, 1800, 4200); scene.fog = fog;
  const camera = new THREE.PerspectiveCamera(FOV, 1, 10, 9000);

  scene.add(new THREE.HemisphereLight(0xd8eeff, BG, 0.5));
  const key = new THREE.DirectionalLight(0xffffff, 0.85); key.position.set(-700, 900, 1200); scene.add(key);
  const rim = new THREE.DirectionalLight(0x4fc3f7, 0.7); rim.position.set(600, -300, -900); scene.add(rim);

  const cubeGeo = (() => {
    const h = 0.4, r = 0.12, s = new THREE.Shape();
    s.moveTo(-h + r, -h); s.lineTo(h - r, -h); s.quadraticCurveTo(h, -h, h, -h + r); s.lineTo(h, h - r);
    s.quadraticCurveTo(h, h, h - r, h); s.lineTo(-h + r, h); s.quadraticCurveTo(-h, h, -h, h - r);
    s.lineTo(-h, -h + r); s.quadraticCurveTo(-h, -h, -h + r, -h);
    const g = new THREE.ExtrudeGeometry(s, { depth: 0.6, bevelEnabled: true, bevelThickness: 0.12, bevelSize: 0.1, bevelSegments: 3, curveSegments: 5 });
    g.center(); return g;
  })();

  const logo = new THREE.Group(); scene.add(logo);
  const mark = new THREE.Group(); logo.add(mark);

  const SQ = RAW.map(([x, y, s, c, ring]) => {
    const dx = x - CORE[0], dy = -(y - CORE[1]), d = Math.hypot(dx, dy);
    const mat = new THREE.MeshStandardMaterial({ color: c, roughness: 0.32, metalness: 0.12, emissive: c, emissiveIntensity: 0.05 });
    const mesh = new THREE.Mesh(cubeGeo, mat); mark.add(mesh);
    const th = Math.atan2(dy, dx) + (rnd() - 0.5) * 1.2, R = 650 + rnd() * 700;
    const sc = new THREE.Vector3(dx, dy, (rnd() - 0.3) * 260).normalize();
    return {
      mesh, mat, s, d, fx: dx, fy: dy, fz: -ring * 30,
      sx: Math.cos(th) * R, sy: Math.sin(th) * R * 0.6, sz: -900 + rnd() * 1700,
      cx: dx * 0.2 + (rnd() - 0.5) * 10, cy: dy * 0.2 + (rnd() - 0.5) * 10, cz: (rnd() - 0.5) * 30,
      st: 0.1 + rnd() * 0.7, scat: sc, scatR: 500 + rnd() * 700,
      r0: [rnd() * 6.28, rnd() * 6.28, rnd() * 6.28], sp: [(rnd() - 0.5) * 10, (rnd() - 0.5) * 10, (rnd() - 0.5) * 10],
      ox: 0, oy: 0, oz: 0,
    };
  });

  const coreMat = new THREE.MeshStandardMaterial({ color: 0x9beefa, emissive: 0x5fd6f2, emissiveIntensity: 0.9, roughness: 0.2 });
  const core = new THREE.Mesh(cubeGeo, coreMat); mark.add(core);
  const coreLight = new THREE.PointLight(0x6ee2fa, 0, 420, 2); mark.add(coreLight);

  const glowTex = (() => {
    const c = document.createElement('canvas'); c.width = c.height = 256; const x = c.getContext('2d')!;
    const g = x.createRadialGradient(128, 128, 0, 128, 128, 128);
    g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(0.25, 'rgba(255,255,255,.45)'); g.addColorStop(1, 'rgba(255,255,255,0)');
    x.fillStyle = g; x.fillRect(0, 0, 256, 256); return new THREE.CanvasTexture(c);
  })();
  const sprite = (color: number) => { const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, color, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true })); mark.add(s); return s; };
  const glow = sprite(0x6ee2fa), flash = sprite(0xddf8ff), halo = sprite(0x4aa8ec);

  // burst particles
  const BIT_COLORS = ['#6EE2FA', '#8BEAF8', '#4AA8EC', '#2196F3', '#2E86DE', '#B4F2FC'];
  const BITS: { mesh: THREE.Mesh; mat: THREE.MeshStandardMaterial; dir: THREE.Vector3; reach: number; delay: number; life: number; s: number; rot: number; spin: number }[] = [];
  for (const [n, delay, reach, life] of [[70, 0, 780, 1.35], [40, 0.12, 460, 1.1]]) {
    for (let i = 0; i < n; i++) {
      const yv = 1 - (2 * (i + 0.5)) / n, rr = Math.sqrt(1 - yv * yv), ph = i * 2.39996 + rnd() * 0.3;
      const c = BIT_COLORS[Math.floor(rnd() * BIT_COLORS.length)];
      const mat = new THREE.MeshStandardMaterial({ color: c, emissive: c, emissiveIntensity: 0.5, roughness: 0.3, transparent: true });
      const mesh = new THREE.Mesh(cubeGeo, mat); mesh.visible = false; mark.add(mesh);
      BITS.push({ mesh, mat, dir: new THREE.Vector3(Math.cos(ph) * rr, yv * 0.8, Math.sin(ph) * rr), reach: reach * (0.7 + rnd() * 0.5),
        delay: delay + rnd() * 0.06, life: life * (0.85 + rnd() * 0.3), s: 6 + rnd() * 10, rot: rnd() * 6, spin: (rnd() - 0.5) * 10 });
    }
  }

  // floating background dust
  const DUST_N = 170;
  const dust = new THREE.InstancedMesh(cubeGeo, new THREE.MeshStandardMaterial({ roughness: 0.4, emissive: 0x0f2a4a, emissiveIntensity: 0.6 }), DUST_N);
  const DUST: { x: number; y: number; z: number; s: number; ph: number; sp: number; r: number }[] = [];
  const dm = new THREE.Object3D(), dcol = new THREE.Color();
  for (let i = 0; i < DUST_N; i++) {
    DUST.push({ x: (rnd() - 0.5) * 3600, y: (rnd() - 0.5) * 2000, z: -2600 + rnd() * 2300, s: 4 + rnd() * 12, ph: rnd() * 6.28, sp: 0.15 + rnd() * 0.35, r: rnd() * 6 });
    dust.setColorAt(i, dcol.set(rnd() < 0.35 ? '#6EE2FA' : rnd() < 0.5 ? '#2196F3' : '#2A4C7C'));
  }
  scene.add(dust);

  // extruded letters: each glyph is a stack of textured planes
  const LAYERS = 14, GAP = 1.7, TEX = 3;
  function makeGlyph(draw: (c: CanvasRenderingContext2D) => void, adv: number, colors: number[]) {
    const pad = 30, w = adv + pad * 2, h = 240;
    const cvs = document.createElement('canvas'); cvs.width = Math.ceil(w * TEX); cvs.height = h * TEX;
    const c = cvs.getContext('2d')!; c.scale(TEX, TEX); c.translate(pad, h / 2); c.fillStyle = '#fff'; draw(c);
    const tex = new THREE.CanvasTexture(cvs); tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
    const geo = new THREE.PlaneGeometry(w, h), grp = new THREE.Group();
    for (let i = LAYERS - 1; i >= 0; i--) {
      const m = new THREE.MeshBasicMaterial({ map: tex, color: i === 0 ? colors[0] : colors[1], alphaTest: 0.5, side: THREE.DoubleSide });
      const mesh = new THREE.Mesh(geo, m); mesh.position.z = -i * GAP; grp.add(mesh);
    }
    grp.visible = false; logo.add(grp); return grp;
  }

  type Item = { left: number; adv: number; dot?: boolean; g: THREE.Group; sx: number; sy: number; srot: number };
  let L: { items: Item[]; commitX: number; right: number; dotC: number } | null = null;
  function buildWord() {
    const m = document.createElement('canvas').getContext('2d')!;
    m.font = `700 200px ${FONT}`;
    const capH = m.measureText('H').actualBoundingBoxAscent || 144, F = (200 * 140) / capH;
    m.font = `700 ${F}px ${FONT}`;
    const word = 'Commit', commitX = 250, items: Item[] = [];
    const add = (it: Omit<Item, 'sx' | 'sy' | 'srot'>) => items.push({ ...it, sx: 0, sy: 0, srot: 0 });
    for (let i = 0; i < word.length; i++) {
      const ch = word[i], left = commitX + m.measureText(word.slice(0, i)).width, adv = m.measureText(ch).width;
      add({ left, adv, g: makeGlyph((c) => { c.font = `700 ${F}px ${FONT}`; c.fillText(ch, 0, 70); }, adv, WORD) });
    }
    const dotC = commitX + m.measureText(word).width + 30, ax = dotC + 22, right = ax + 158;
    add({ left: dotC - 19, adv: 38, dot: true, g: makeGlyph((c) => { c.beginPath(); c.arc(19, 12, 19, 0, Math.PI * 2); c.fill(); }, 38, BLUE) });
    add({ left: ax, adv: 118, g: makeGlyph((c) => {
      c.beginPath(); c.moveTo(0, 70); c.lineTo(38, -70); c.lineTo(80, -70); c.lineTo(118, 70); c.lineTo(90, 70);
      c.lineTo(81, 33); c.lineTo(37, 33); c.lineTo(28, 70); c.closePath();
      c.moveTo(41, 15); c.lineTo(59, -55); c.lineTo(77, 15); c.closePath(); c.fill('evenodd');
    }, 118, BLUE) });
    add({ left: ax + 130, adv: 28, g: makeGlyph((c) => c.fillRect(0, -70, 28, 140), 28, BLUE) });
    items.forEach((it, i) => { it.sx = (i - items.length / 2) * 90 + (rnd() - 0.5) * 80; it.sy = 200 + rnd() * 300; it.srot = (rnd() - 0.5) * 2; });
    L = { items, commitX, right, dotC };
  }

  // layout: side by side on wide screens, stacked on tall ones
  let LY: { markF: { x: number; y: number }; pos: { x: number; y: number }[]; D: number; dotX: number; ms: number } | null = null;
  function layout(aspect: number) {
    if (!L) return;
    const tan = Math.tan((FOV * Math.PI) / 360);
    const stack = aspect < 0.95;
    let markF, pos, needW, needH, dotX, ms;
    if (!stack) {
      const off = -(-172 + L.right) / 2;
      markF = { x: off, y: 0 };
      pos = L.items.map((it) => ({ x: off + it.left + it.adv / 2, y: 0 }));
      dotX = L.dotC; needW = 1900; needH = 700; ms = 1;
    } else {
      const tw = L.right - L.commitX;
      markF = { x: 0, y: 270 }; ms = 1.5;
      pos = L.items.map((it) => ({ x: it.left - L!.commitX - tw / 2 + it.adv / 2, y: -200 }));
      dotX = 600; needW = tw + 140; needH = 1150;
    }
    const D = Math.max(needW / (2 * tan * aspect), needH / (2 * tan));
    LY = { markF, pos, D, dotX, ms };
    fog.near = D * 1.3 + 300; fog.far = D * 1.3 + 2800;
  }

  let needsDraw = true;
  function resize() {
    const w = host.clientWidth, h = host.clientHeight;
    renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix();
    layout(w / h); if (reduced) needsDraw = true;
  }

  // input
  const ptr = { tx: 0, ty: 0, x: 0, y: 0, inside: false, ndc: new THREE.Vector2() };
  const onMove = (e: PointerEvent) => {
    const r = host.getBoundingClientRect();
    ptr.ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    ptr.tx = ptr.ndc.x; ptr.ty = ptr.ndc.y; ptr.inside = true;
  };
  const onLeave = () => { ptr.tx = 0; ptr.ty = 0; ptr.inside = false; };
  let clickT = -99;
  const onClick = () => { const t = now(); if (t > INTRO_END && t - clickT > 1.2) clickT = t; };
  host.addEventListener('pointermove', onMove);
  host.addEventListener('pointerleave', onLeave);
  host.addEventListener('click', onClick);

  const ray = new THREE.Raycaster(), plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), hit = new THREE.Vector3(), local = new THREE.Vector3();

  let t0 = performance.now(), last = t0, visible = true, raf = 0, stopped = false;
  const now = () => (reduced ? 9 : (performance.now() - t0) / 1000);

  function render() {
    if (!L || !LY) return;
    const t = now(), tn = performance.now(), dt = Math.min(0.05, (tn - last) / 1000); last = tn;
    const r = host.getBoundingClientRect();
    const sc = reduced ? 0 : clamp(-r.top / (r.height * 0.85));
    const interact = reduced ? 0 : clamp((t - INTRO_END) / 1);
    hint.classList.toggle('on', t > INTRO_END + 0.5 && sc < 0.04);

    const k = 1 - Math.exp(-dt * 4);
    ptr.x += (ptr.tx - ptr.x) * k; ptr.y += (ptr.ty - ptr.y) * k;

    const amp = clamp((t - LOOP_AT) / 1.2), lt = t - LOOP_AT, b0 = amp * bump(lt, 0);
    const mk = eInOut(clamp((t - (T + 0.3)) / 1.2));
    mark.position.set(lerp(0, LY.markF.x, mk), lerp(0, LY.markF.y, mk), 0);
    mark.scale.setScalar(lerp(1, LY.ms, mk));

    // camera: swing in, then a gentle parallax with the pointer
    const ci = eInOut(clamp(t / 4.2));
    const yaw = lerp(0.75, 0, ci) + ptr.x * 0.06 * interact, pitch = lerp(0.32, 0.02, ci) + ptr.y * 0.05 * interact;
    const D = lerp(LY.D * 1.25, LY.D, ci);
    const st = clamp((t - T) / 0.4), sa = t >= T && st < 1 && !reduced ? 14 * Math.pow(1 - st, 2) : 0;
    camera.position.set(Math.sin(yaw) * D * Math.cos(pitch) + sa * Math.sin(t * 90), Math.sin(pitch) * D + sa * Math.cos(t * 71), Math.cos(yaw) * D * Math.cos(pitch));
    camera.lookAt(0, -sc * 120, 0);

    // the logo tilts toward the pointer and drifts up as you scroll
    logo.rotation.set(-ptr.y * 0.22 * interact + sc * 0.35, ptr.x * 0.32 * interact, 0);
    logo.position.set(0, sc * 260, -sc * 300);

    // pointer position in the mark's own space
    let mx = 1e9, my = 1e9;
    if (ptr.inside && interact > 0) {
      ray.setFromCamera(ptr.ndc, camera);
      if (ray.ray.intersectPlane(plane, hit)) { mark.updateMatrixWorld(); local.copy(hit); mark.worldToLocal(local); mx = local.x; my = local.y; }
    }

    // click: implode and re-collide
    const tc = t - clickT;
    const imp = tc < 0 || tc > 1.4 ? 0 : tc < 0.3 ? eIn(tc / 0.3) : 1 - eBack(clamp((tc - 0.3) / 0.9));
    const burstAt = tc >= 0.3 && tc < 2 ? clickT + 0.3 : T;
    const sk = 1 - Math.exp(-dt * 8);

    for (const q of SQ) {
      let x, y, z, kk, rx, ry, rz;
      if (t < T) {
        const p = clamp((t - q.st) / (T - q.st)), e = Math.pow(p, 2.3);
        x = lerp(q.sx, q.cx, e); y = lerp(q.sy, q.cy, e); z = lerp(q.sz, q.cz, e); kk = p > 0 ? 0.85 : 0;
        [rx, ry, rz] = q.r0.map((r0, i) => r0 + q.sp[i] * p);
      } else {
        const rr = clamp((t - T) / 1), e = eBack(rr), s = 1 - eOut(rr);
        x = lerp(q.cx, q.fx, e); y = lerp(q.cy, q.fy, e); z = lerp(q.cz, q.fz, e); kk = lerp(0.85, 1, eOut(rr));
        [rx, ry, rz] = q.r0.map((r0, i) => (r0 + q.sp[i]) * s);
      }
      // magnetic push from the pointer
      let tx = 0, ty = 0, tz = 0;
      if (mx < 1e8) {
        const dx = q.fx - mx, dy = q.fy - my, d = Math.hypot(dx, dy) || 1, f = Math.pow(Math.max(0, 1 - d / 200), 2);
        tx = (dx / d) * f * 120; ty = (dy / d) * f * 120; tz = f * 140;
      }
      q.ox += (tx - q.ox) * sk; q.oy += (ty - q.oy) * sk; q.oz += (tz - q.oz) * sk;
      const pull = 1 - 0.8 * imp;
      const sp = eOut(sc) * q.scatR;
      const b = amp * bump(lt, q.d);
      q.mesh.position.set(x * pull + q.ox + q.scat.x * sp, y * pull + q.oy + q.scat.y * sp, z + q.oz + 18 * b + q.scat.z * sp);
      const spin = sc * 3 + Math.min(1, Math.hypot(q.ox, q.oy) / 120) * 0.6;
      q.mesh.rotation.set(rx + q.sp[0] * 0.1 * spin, ry + q.sp[1] * 0.1 * spin, rz);
      q.mesh.scale.setScalar(q.s * kk * (1 + 0.08 * b)); q.mesh.visible = kk > 0;
      q.mat.emissiveIntensity = 0.05 + 0.55 * b + 0.4 * Math.min(1, q.oz / 140);
    }

    // core, glow and burst
    const pc = clamp((t - T) / 0.5), gl = eOut(pc) * (0.85 + 0.45 * b0) * (1 - sc * 0.6);
    const tb = t - burstAt;
    core.visible = pc > 0; core.scale.setScalar(Math.max(0.001, 46 * eBack(pc) * (1 + 0.06 * b0) * (1 - 0.25 * imp))); core.position.z = 10;
    coreMat.emissiveIntensity = 0.7 + 0.5 * b0 + (tb >= 0 ? 1.5 * Math.pow(1 - clamp(tb / 0.8), 2) : 0);
    coreLight.intensity = 0.9 * gl + (tb >= 0 ? 6 * Math.pow(1 - clamp(tb / 0.7), 2) : 0);
    glow.scale.setScalar(300 * Math.max(0.001, gl)); glow.material.opacity = 0.75 * gl; glow.position.z = 20;
    const fp = clamp(tb / 0.6);
    flash.visible = tb >= 0 && fp < 1 && !reduced; flash.scale.setScalar(200 + 700 * eOut(fp)); flash.material.opacity = Math.pow(1 - fp, 1.5);
    halo.scale.setScalar(620); halo.material.opacity = 0.24 * clamp(t / T) * (1 - sc * 0.5); halo.position.z = -60;
    for (const c of BITS) {
      const rr = clamp((tb - c.delay) / c.life);
      c.mesh.visible = rr > 0 && rr < 1 && !reduced; if (!c.mesh.visible) continue;
      c.mesh.position.copy(c.dir).multiplyScalar(20 + eOut(rr) * c.reach);
      c.mesh.rotation.set(c.rot + c.spin * rr, c.rot * 0.7 + c.spin * rr * 0.8, 0);
      c.mesh.scale.setScalar(c.s * (1 - rr * 0.6)); c.mat.opacity = Math.pow(1 - rr, 1.3);
    }

    // letters
    const base = T + 0.25;
    L.items.forEach((it, i) => {
      const p = clamp((t - base - i * 0.08) / 0.8), g = it.g;
      g.visible = p > 0; if (!g.visible) return;
      const e = eOut(p), tp = LY!.pos[i], ss = eOut(sc);
      let kk = Math.max(0.001, eBack(p));
      if (it.dot) kk *= 1 + 0.3 * amp * bump(lt, LY!.dotX + 300);
      g.position.set(lerp(mark.position.x + 60, tp.x, e) + it.sx * ss, lerp(mark.position.y, tp.y, e) + it.sy * ss, lerp(-260, 0, e) - 500 * ss);
      g.rotation.set(lerp(0.6, 0, e) + it.srot * ss, lerp(Math.PI * 1.3, 0, e) + it.srot * ss, 0);
      g.scale.setScalar(kk);
    });

    // dust
    const dIn = clamp(t / 2);
    for (let i = 0; i < DUST_N; i++) {
      const d = DUST[i];
      dm.position.set(d.x + Math.sin(t * d.sp + d.ph) * 40, d.y + Math.cos(t * d.sp * 0.8 + d.ph) * 30 + sc * 400 * (1 + d.z / 2600), d.z);
      dm.rotation.set(d.r + t * d.sp, d.r * 0.6 + t * d.sp * 0.7, 0);
      dm.scale.setScalar(d.s * dIn); dm.updateMatrix(); dust.setMatrixAt(i, dm.matrix);
    }
    dust.instanceMatrix.needsUpdate = true;

    renderer.render(scene, camera);
  }

  function loop() {
    if (stopped) return;
    if (visible && !document.hidden && (!reduced || needsDraw)) { render(); needsDraw = false; }
    raf = requestAnimationFrame(loop);
  }

  const io = new IntersectionObserver((es) => { visible = es[0].isIntersecting; last = performance.now(); }, { threshold: 0 });
  io.observe(host);
  window.addEventListener('resize', resize);

  // the letters are drawn with Inter: wait for it (at most 1.5 s) so they are not built with a fallback font
  const fontReady = document.fonts
    ? Promise.race([document.fonts.load('700 100px Inter'), new Promise((r) => setTimeout(r, 1500))]).catch(() => {})
    : Promise.resolve();
  fontReady.finally(() => {
    if (stopped) return;
    buildWord(); resize(); t0 = performance.now(); last = t0; raf = requestAnimationFrame(loop);
  });

  return () => {
    stopped = true;
    cancelAnimationFrame(raf);
    io.disconnect();
    window.removeEventListener('resize', resize);
    host.removeEventListener('pointermove', onMove);
    host.removeEventListener('pointerleave', onLeave);
    host.removeEventListener('click', onClick);
    renderer.dispose();
  };
}
