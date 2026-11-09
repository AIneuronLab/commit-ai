/**
 * The experience globe: a realistic Earth (day colours, night lights, ocean glints, clouds) that turns slowly.
 * Choosing a role (hover or focus on wide screens; scrolling or tapping on phones) brings the globe round to
 * that city: a green pin pulses with sonar ripples, a glowing line runs from the card to the city, and the arcs
 * of the career path light up. Ported from the standalone page (three.js); started by <ExperienceGlobe>, which
 * renders the cards and gets back a function that stops everything.
 */
import * as THREE from 'three';
import type { Place } from '../data/career';
import { LITE_3D } from '../lib/useMedia';

export type GlobeParts = {
  section: HTMLElement; stage: HTMLElement; glc: HTMLCanvasElement; fxc: HTMLCanvasElement;
  label: HTMLElement; gap: HTMLElement; cards: HTMLElement[]; places: Place[]; labels: string[]; spinSpeed: number;
};

/** Below this width the globe sits in a strip pinned above the cards instead of between two columns. */
const NARROW = '(max-width: 1023px)';

export function startGlobe({ section, stage, glc, fxc, label, gap, cards, places, labels, spinSpeed }: GlobeParts): () => void {
  const fx = fxc.getContext('2d')!;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const lite = matchMedia(LITE_3D).matches; // simpler spheres, fewer stars, lower resolution
  const narrow = () => matchMedia(NARROW).matches;

  const R = 200, D2R = Math.PI / 180;
  const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const smooth = (x: number) => x * x * (3 - 2 * x);
  let seed = 5;
  const rnd = () => { seed |= 0; seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  const toVec = (lat: number, lon: number, r = 1) => {
    const phi = (90 - lat) * D2R, th = (lon + 180) * D2R;
    return new THREE.Vector3(-Math.sin(phi) * Math.cos(th), Math.cos(phi), Math.sin(phi) * Math.sin(th)).multiplyScalar(r);
  };
  const faceQuat = (lat: number, lon: number) => new THREE.Quaternion().setFromEuler(new THREE.Euler(lat * D2R, Math.PI / 2 - (lon + 180) * D2R, 0, 'XYZ'));

  // drawn on the band's own night colour rather than a transparent canvas: the glows add light properly over it
  const renderer = new THREE.WebGLRenderer({ canvas: glc, antialias: !lite });
  const scene = new THREE.Scene(); scene.background = new THREE.Color(0x070b12);
  const camera = new THREE.PerspectiveCamera(35, 1, 10, 6000);
  scene.add(new THREE.HemisphereLight(0xd8eeff, 0x0a1828, 0.55));
  const key = new THREE.DirectionalLight(0xffffff, 0.9); scene.add(key);
  const rim = new THREE.DirectionalLight(0x4fc3f7, 0.7); rim.position.set(500, -100, -600); scene.add(rim);

  const globe = new THREE.Group(); scene.add(globe);

  // ---- a realistic Earth: day colours, night lights, ocean glints, clouds (NASA Blue Marble / Black Marble)
  let texLeft = 4;
  const loader = new THREE.TextureLoader();
  const tex = (name: string) => { const t = loader.load(`/earth/${name}.jpg`, () => { texLeft--; }); t.anisotropy = renderer.capabilities.getMaxAnisotropy(); return t; };
  const SUN = new THREE.Vector3(-0.66, 0.36, 0.66).normalize(); // sunlight from the upper left, in front
  key.position.copy(SUN).multiplyScalar(1000);
  const VS = 'varying vec2 vUv; varying vec3 vN; varying vec3 vObj; void main(){ vUv = uv; vObj = normalize(position); vN = normalize(normalMatrix * normal); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }';
  const earthU = { dayMap: { value: tex('day') }, nightMap: { value: tex('lights') }, specMap: { value: tex('specular') }, sunDir: { value: SUN },
    pinDir: { value: new THREE.Vector3(0, 0, 1) }, pinOn: { value: 0 }, fade: { value: 0 } };
  const earth = new THREE.Mesh(new THREE.SphereGeometry(R, lite ? 72 : 128, lite ? 54 : 96), new THREE.ShaderMaterial({ uniforms: earthU, vertexShader: VS, fragmentShader: `
    uniform sampler2D dayMap, nightMap, specMap; uniform vec3 sunDir, pinDir; uniform float pinOn, fade;
    varying vec2 vUv; varying vec3 vN, vObj;
    void main(){
      vec3 n = normalize(vN);
      float d = dot(n, sunDir);
      float dayMix = smoothstep(-0.2, 0.25, d);
      vec3 day = texture2D(dayMap, vUv).rgb * (0.05 + 0.88 * max(d, 0.0));
      vec3 night = texture2D(nightMap, vUv).rgb * vec3(1.0, 0.8, 0.55) * 2.4;
      vec3 col = mix(night, day, dayMix);
      float s = texture2D(specMap, vUv).r;
      vec3 h = normalize(sunDir + vec3(0.0, 0.0, 1.0));
      col += vec3(0.65, 0.82, 1.0) * pow(max(dot(n, h), 0.0), 55.0) * s * 0.55 * dayMix;
      float fr = pow(1.0 - max(dot(n, vec3(0.0, 0.0, 1.0)), 0.0), 2.6);
      col = mix(col, vec3(0.36, 0.64, 1.0) * (0.15 + 0.7 * max(d + 0.25, 0.0)), fr * 0.55);
      float p = dot(normalize(vObj), pinDir);
      col += vec3(0.13, 0.89, 0.60) * (smoothstep(0.98, 1.0, p) * 0.22 + smoothstep(0.9965, 0.9985, p) * 0.2) * pinOn;
      gl_FragColor = vec4(col * fade, 1.0);
    }` }));
  globe.add(earth);
  const cloudU = { cloudMap: { value: tex('clouds') }, sunDir: { value: SUN }, fade: { value: 0 } };
  const clouds = new THREE.Mesh(new THREE.SphereGeometry(R * 1.012, lite ? 56 : 96, lite ? 42 : 72), new THREE.ShaderMaterial({ uniforms: cloudU, transparent: true, depthWrite: false, vertexShader: VS, fragmentShader: `
    uniform sampler2D cloudMap; uniform vec3 sunDir; uniform float fade;
    varying vec2 vUv; varying vec3 vN, vObj;
    void main(){
      vec3 n = normalize(vN); float d = dot(n, sunDir);
      float a = texture2D(cloudMap, vUv).r;
      float lit = 0.04 + 0.8 * smoothstep(-0.2, 0.6, d);
      gl_FragColor = vec4(vec3(lit), a * 0.8 * (0.2 + 0.8 * smoothstep(-0.25, 0.2, d)) * fade);
    }` }));
  globe.add(clouds);
  // the atmosphere: a soft blue rim around the planet, fading in with it
  const atmoU = { fade: { value: 0 } };
  scene.add(new THREE.Mesh(new THREE.SphereGeometry(R * 1.09, lite ? 40 : 64, lite ? 30 : 48), new THREE.ShaderMaterial({
    uniforms: atmoU, side: THREE.BackSide, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false,
    vertexShader: 'varying vec3 vN; void main(){ vN = normalize(normalMatrix * normal); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
    fragmentShader: 'uniform float fade; varying vec3 vN; void main(){ float i = pow(clamp(0.68 - dot(vN, vec3(0.0,0.0,1.0)), 0.0, 1.0), 3.2); gl_FragColor = vec4(0.30,0.62,1.0,1.0) * i * 0.8 * fade; }',
  })));

  const cubeGeo = (() => {
    const h = 0.4, r = 0.12, s = new THREE.Shape();
    s.moveTo(-h + r, -h); s.lineTo(h - r, -h); s.quadraticCurveTo(h, -h, h, -h + r); s.lineTo(h, h - r);
    s.quadraticCurveTo(h, h, h - r, h); s.lineTo(-h + r, h); s.quadraticCurveTo(-h, h, -h, h - r);
    s.lineTo(-h, -h + r); s.quadraticCurveTo(-h, -h, -h + r, -h);
    const g = new THREE.ExtrudeGeometry(s, { depth: 0.6, bevelEnabled: true, bevelThickness: 0.12, bevelSize: 0.1, bevelSegments: 2, curveSegments: 3 });
    g.center(); return g;
  })();

  const dm = new THREE.Object3D();
  const glowTex = (() => {
    const c = document.createElement('canvas'); c.width = c.height = 128; const x = c.getContext('2d')!;
    const g = x.createRadialGradient(64, 64, 0, 64, 64, 64);
    g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(0.3, 'rgba(255,255,255,.4)'); g.addColorStop(1, 'rgba(255,255,255,0)');
    x.fillStyle = g; x.fillRect(0, 0, 128, 128); return new THREE.CanvasTexture(c);
  })();

  // a marker per role
  const MARK = places.map((x) => {
    const g = new THREE.Group(), base = toVec(x.lat, x.lon, R + 2);
    g.position.copy(base); g.lookAt(base.clone().multiplyScalar(2)); globe.add(g);
    const mat = new THREE.MeshStandardMaterial({ color: 0x6cf5be, emissive: 0x14d98a, emissiveIntensity: 0.4, roughness: 0.25 });
    const core = new THREE.Mesh(cubeGeo, mat); core.position.z = 5; g.add(core);
    const beam = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 2.2, 1, 12, 1, true), new THREE.MeshBasicMaterial({ color: 0x22e39a, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false }));
    beam.rotation.x = Math.PI / 2; g.add(beam);
    const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, color: 0x22e39a, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
    glow.position.z = 6; g.add(glow);
    const ringMat = new THREE.MeshStandardMaterial({ color: 0x4cf0ae, emissive: 0x14d98a, emissiveIntensity: 0.4, transparent: true });
    const ringMat2 = ringMat.clone();
    const ring: THREE.Mesh[] = []; for (let i = 0; i < 20; i++) { const m = new THREE.Mesh(cubeGeo, i < 10 ? ringMat : ringMat2); g.add(m); ring.push(m); }
    return { g, core, mat, beam, glow, ring, ringMat, ringMat2, on: 0 };
  });

  // career path: arcs of small cubes with light flowing along them (none between two roles in the same city)
  const ARC_N = 46;
  const ARCS: { mesh: THREE.InstancedMesh; mat: THREE.MeshStandardMaterial; P: { p: THREE.Vector3; q: THREE.Quaternion; s: number; u: number }[]; from: number }[] = [];
  const mtx = new THREE.Matrix4(), vs = new THREE.Vector3();
  for (let i = 0; i < places.length - 1; i++) {
    const a = toVec(places[i].lat, places[i].lon), b = toVec(places[i + 1].lat, places[i + 1].lon);
    const ang = a.angleTo(b); if (ang < 0.01) continue;
    const lift = Math.min(90, 18 + ang * 55);
    const mat = new THREE.MeshStandardMaterial({ color: 0x6ee2fa, emissive: 0x2196f3, emissiveIntensity: 0.35, roughness: 0.3, transparent: true, opacity: 0.75 });
    const mesh = new THREE.InstancedMesh(cubeGeo, mat, ARC_N), P = [];
    const qb = new THREE.Quaternion().setFromUnitVectors(a, b), qa = new THREE.Quaternion();
    for (let k = 0; k < ARC_N; k++) {
      const s = k / (ARC_N - 1);
      qa.identity().slerp(qb, s);
      const p = a.clone().applyQuaternion(qa).multiplyScalar(R + 4 + Math.sin(Math.PI * s) * lift);
      dm.position.copy(p); dm.lookAt(p.clone().multiplyScalar(2)); dm.rotation.z += s * 6;
      P.push({ p, q: dm.quaternion.clone(), s: 2 + Math.sin(Math.PI * s) * 1.1, u: s });
    }
    globe.add(mesh); ARCS.push({ mesh, mat, P, from: i });
  }

  const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, color: 0x2196f3, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false }));
  halo.scale.setScalar(R * 3.4); halo.position.z = -R; scene.add(halo);

  // stars
  const stars = (() => {
    const n = lite ? 900 : 2200, pos = new Float32Array(n * 3), colr = new Float32Array(n * 3), c = new THREE.Color();
    for (let i = 0; i < n; i++) {
      const u = rnd() * 2 - 1, th = rnd() * Math.PI * 2, rr = 2400 + rnd() * 900, q = Math.sqrt(1 - u * u);
      pos.set([Math.cos(th) * q * rr, u * rr, -Math.abs(Math.sin(th) * q * rr) - 200], i * 3);
      c.set(rnd() < 0.15 ? '#9FD4FF' : rnd() < 0.2 ? '#FFE9C9' : '#FFFFFF').multiplyScalar(0.35 + rnd() * 0.65);
      colr.set([c.r, c.g, c.b], i * 3);
    }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(pos, 3)); g.setAttribute('color', new THREE.BufferAttribute(colr, 3));
    return new THREE.Points(g, new THREE.PointsMaterial({ size: 1.8, sizeAttenuation: false, vertexColors: true, transparent: true, opacity: 0, depthWrite: false }));
  })();
  scene.add(stars);

  // the small rounded squares that draw the line between a card and its city
  const sq = (top: string, bot: string) => { const s = document.createElement('canvas'); s.width = s.height = 32; const g = s.getContext('2d')!; const gr = g.createLinearGradient(0, 2, 0, 30); gr.addColorStop(0, top); gr.addColorStop(1, bot); g.fillStyle = gr; g.beginPath(); g.moveTo(9, 2); g.arcTo(30, 2, 30, 30, 7); g.arcTo(30, 30, 2, 30, 7); g.arcTo(2, 30, 2, 2, 7); g.arcTo(2, 2, 30, 2, 7); g.fill(); return s; };
  const LIT = sq('#CFFBE8', '#22E39A'), TRAIL = sq('#9BEEFA', '#2196F3');

  // layout: the globe sits in the middle column (wide screens) or the pinned strip (phones)
  let W = 1, H = 1, gx = 0, gy = 0, dpr = 1;
  function layout() {
    dpr = Math.min(devicePixelRatio || 1, lite ? 1.5 : 2);
    W = stage.clientWidth; H = stage.clientHeight;
    renderer.setPixelRatio(dpr); renderer.setSize(W, H, false);
    fxc.width = Math.round(W * dpr); fxc.height = Math.round(H * dpr);
    let rpx;
    if (narrow()) { gx = W / 2; gy = H / 2; rpx = Math.min(W * 0.4, H * 0.4); }
    else {
      const sr = stage.getBoundingClientRect(), g = gap.getBoundingClientRect();
      gx = g.left - sr.left + g.width / 2; gy = g.top - sr.top + g.height / 2;
      rpx = Math.min(g.width * 0.42, g.height * 0.42, 300);
    }
    const fw = 2 * Math.max(gx, W - gx), fh = 2 * Math.max(gy, H - gy);
    camera.aspect = fw / fh;
    camera.setViewOffset(fw, fh, fw / 2 - gx, fh / 2 - gy, W, H);
    camera.position.set(0, 0, (R * fh) / (2 * Math.tan((35 * D2R) / 2) * rpx));
    camera.lookAt(0, 0, 0); camera.updateProjectionMatrix();
  }

  // which city to show
  const QS = places.map((x) => faceQuat(x.lat, x.lon));
  let qBase = faceQuat(10, 8), spin = 0, active = -1, hoverIdx = -1, idleSince = 0;
  const qT = new THREE.Quaternion(), qSpin = new THREE.Quaternion(), yAxis = new THREE.Vector3(0, 1, 0);
  globe.quaternion.copy(qBase);
  function setActive(i: number) {
    if (i === active) return;
    active = i;
    cards.forEach((c, j) => c.classList.toggle('on', j === i));
    if (i >= 0) { qBase = QS[i]; spin = 0; label.textContent = labels[i]; }
  }
  const off: (() => void)[] = [];
  const on = <K extends keyof HTMLElementEventMap>(el: HTMLElement, type: K, fn: (e: HTMLElementEventMap[K]) => void) => { el.addEventListener(type, fn); off.push(() => el.removeEventListener(type, fn)); };
  cards.forEach((c, i) => {
    on(c, 'mouseenter', () => { if (!narrow()) { hoverIdx = i; setActive(i); } });
    on(c, 'mouseleave', () => { if (hoverIdx === i) { hoverIdx = -1; idleSince = performance.now(); } });
    on(c, 'focus', () => setActive(i));
    on(c, 'click', () => {
      setActive(i);
      if (narrow()) { const r = c.getBoundingClientRect(); scrollTo({ top: scrollY + r.top + r.height / 2 - innerHeight * 0.72, behavior: reduced ? 'auto' : 'smooth' }); }
    });
  });
  let picked = -1;
  function scrollPick() {
    const fy = innerHeight * 0.72; let best = -1, bd = 1e9;
    cards.forEach((c, i) => { const r = c.getBoundingClientRect(), d = Math.abs(r.top + r.height / 2 - fy); if (d < bd) { bd = d; best = i; } });
    if (best !== picked) { picked = best; setActive(best); }
  }

  const wp = new THREE.Vector3(), cp = new THREE.Vector3();
  let pinOnS = 0, visible = true, intro = 0, introStart: number | null = null, last = performance.now(), raf = 0, stopped = false;

  function frame(now: number) {
    if (stopped) return;
    raf = requestAnimationFrame(frame);
    if (!visible || document.hidden) { last = now; return; }
    const rawDt = (now - last) / 1000, dt = Math.min(0.05, rawDt); last = now;
    if (Math.round(stage.clientWidth * dpr) !== fxc.width || Math.round(stage.clientHeight * dpr) !== fxc.height) layout();

    if (narrow()) scrollPick();
    else if (hoverIdx < 0 && active >= 0 && document.activeElement !== cards[active] && now - idleSince > 2600) setActive(-1);

    // keep turning on its axis; a new card brings the globe back to its city
    if (!reduced) spin += Math.min(0.5, rawDt) * spinSpeed * D2R;
    qT.copy(qBase).multiply(qSpin.setFromAxisAngle(yAxis, spin));
    globe.quaternion.slerp(qT, reduced ? 1 : 1 - Math.exp(-dt * 4));

    const t0s = now / 1000;
    if (intro < 1 && texLeft <= 0) { if (introStart === null) introStart = now; intro = reduced ? 1 : clamp((now - introStart) / 1400); }
    const iv = smooth(intro);
    earthU.fade.value = iv; cloudU.fade.value = iv; atmoU.fade.value = iv; globe.scale.setScalar(0.9 + 0.1 * iv);
    clouds.rotation.y += Math.min(0.5, rawDt) * 0.012;
    halo.material.opacity = 0.18 * intro;
    stars.material.opacity = 0.9 * intro; stars.rotation.z = t0s * 0.004;

    const t = now / 1000;
    ARCS.forEach((A) => {
      const hot = active === A.from || active === A.from + 1;
      A.mat.emissiveIntensity += ((hot ? 1.1 : 0.3) - A.mat.emissiveIntensity) * (1 - Math.exp(-dt * 6));
      A.mat.opacity = 0.55 + (hot ? 0.45 : 0);
      A.P.forEach((q, k) => {
        const l = (((q.u - t * 0.35) % 1) + 1) % 1, b = reduced ? 0 : Math.max(0, 1 - Math.abs(l - 0.5) * 10);
        mtx.compose(q.p, q.q, vs.setScalar(q.s * (1 + b * 0.9) * intro));
        A.mesh.setMatrixAt(k, mtx);
      });
      A.mesh.instanceMatrix.needsUpdate = true;
    });

    const pl = reduced ? 0.6 : 0.5 + 0.5 * Math.sin(t * 3.2); // the pin's heartbeat
    MARK.forEach((m, i) => {
      m.on += ((i === active ? 1 : 0) - m.on) * (reduced ? 1 : 1 - Math.exp(-dt * 6));
      const o = m.on;
      m.core.scale.setScalar((5 + 3.5 * o * (0.85 + 0.25 * pl)) * Math.max(0.001, intro)); m.mat.emissiveIntensity = 0.2 + (0.25 + 0.45 * pl) * o;
      m.beam.scale.set(1, 26 + 34 * o, 1); m.beam.position.z = (26 + 34 * o) / 2; (m.beam.material as THREE.MeshBasicMaterial).opacity = (0.08 + 0.2 * o * (0.5 + 0.5 * pl)) * intro;
      m.glow.scale.setScalar(12 + (24 + 26 * pl) * o); m.glow.material.opacity = (0.12 + (0.15 + 0.3 * pl) * o) * intro;
      // two green ripples, like a sonar ping
      const ph1 = reduced ? 0.35 : (t * 0.55) % 1, ph2 = reduced ? 0.75 : (t * 0.55 + 0.5) % 1;
      m.ring.forEach((c, j) => {
        const ph = j < 10 ? ph1 : ph2, an = ((j % 10) / 10) * Math.PI * 2 + t * 0.5, rr = 9 + ph * 30;
        c.position.set(Math.cos(an) * rr, Math.sin(an) * rr, 3); c.rotation.z = an; c.scale.setScalar(2.6 * o + 0.001); c.visible = o > 0.01; // ripples of pins not in focus are skipped
      });
      m.ringMat.opacity = 0.55 * o * (1 - ph1); m.ringMat2.opacity = 0.55 * o * (1 - ph2);
      if (i === active) earthU.pinDir.value.copy(m.g.position).normalize();
    });
    pinOnS += ((active >= 0 ? 1 : 0) - pinOnS) * (1 - Math.exp(-dt * 6));
    earthU.pinOn.value = pinOnS * (0.45 + 0.55 * pl);

    renderer.render(scene, camera);

    // city label and the line from the card to its city
    fx.setTransform(dpr, 0, 0, dpr, 0, 0); fx.clearRect(0, 0, W, H);
    if (active >= 0) {
      const m = MARK[active];
      m.core.getWorldPosition(wp);
      const facing = cp.copy(wp).normalize().dot(cp.copy(camera.position).normalize());
      wp.project(camera);
      const x = (wp.x * 0.5 + 0.5) * W, y = (-wp.y * 0.5 + 0.5) * H;
      label.style.transform = `translate(${Math.round(x - label.offsetWidth / 2)}px, ${Math.round(y - 58)}px)`;
      label.style.opacity = facing > 0.3 && intro >= 1 ? '1' : '0';

      if (!narrow() && facing > 0.3) {
        const card = cards[active], r = card.getBoundingClientRect(), sr = stage.getBoundingClientRect(), side = card.dataset.side;
        const ax = (side === 'left' ? r.right : r.left) - sr.left, ay = r.top + r.height / 2 - sr.top;
        const c1x = (ax + x) / 2, c1y = ay, c2x = c1x, c2y = y;
        const n = Math.max(10, Math.round(Math.hypot(x - ax, y - ay) / 12));
        for (let k = 1; k < n; k++) {
          const u = k / n, iu = 1 - u;
          const px = iu * iu * iu * ax + 3 * iu * iu * u * c1x + 3 * iu * u * u * c2x + u * u * u * x;
          const py = iu * iu * iu * ay + 3 * iu * iu * u * c1y + 3 * iu * u * u * c2y + u * u * u * y;
          const fl = reduced ? 0 : Math.max(0, 1 - Math.abs((((u - t * 0.8) % 1) + 1) % 1 - 0.5) * 8), s = 3 + fl * 3;
          fx.globalAlpha = (0.5 + fl * 0.5) * Math.min(1, (facing - 0.3) * 4);
          fx.drawImage(fl > 0.3 ? LIT : TRAIL, px - s / 2, py - s / 2, s, s);
        }
        fx.globalAlpha = 1;
      }
    } else label.style.opacity = '0';
  }

  const io = new IntersectionObserver((es) => { visible = es[0].isIntersecting; }, { threshold: 0 });
  io.observe(section);
  addEventListener('resize', layout);
  const ro = new ResizeObserver(layout); ro.observe(section);
  layout(); raf = requestAnimationFrame(frame);

  return () => {
    stopped = true;
    cancelAnimationFrame(raf);
    io.disconnect(); ro.disconnect();
    removeEventListener('resize', layout);
    off.forEach((f) => f());
    cards.forEach((c) => c.classList.remove('on'));
    renderer.dispose();
  };
}
