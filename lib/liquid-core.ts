import * as THREE from 'three';

/**
 * Liquid Core: a dark glass/liquid-metal blob with an ember rim that
 * - stretches a short arm toward the cursor,
 * - can be dragged to rotate (mouse/pen) with inertia,
 * - dissolves into a particle field as the page scrolls and re-forms near the contact section.
 */

const NOISE = /* glsl */ `
vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1.0/6.0,1.0/3.0); const vec4 D=vec4(0.0,0.5,1.0,2.0);
  vec3 i=floor(v+dot(v,C.yyy)); vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz); vec3 l=1.0-g; vec3 i1=min(g.xyz,l.zxy); vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx; vec3 x2=x0-i2+C.yyy; vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
  float n_=0.142857142857; vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.0*floor(p*ns.z*ns.z); vec4 x_=floor(j*ns.z); vec4 y_=floor(j-7.0*x_);
  vec4 x=x_*ns.x+ns.yyyy; vec4 y=y_*ns.x+ns.yyyy; vec4 h=1.0-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy); vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.0+1.0; vec4 s1=floor(b1)*2.0+1.0; vec4 sh=-step(h,vec4(0.0));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy; vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x); vec3 p1=vec3(a0.zw,h.y); vec3 p2=vec3(a1.xy,h.z); vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x; p1*=norm.y; p2*=norm.z; p3*=norm.w;
  vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0); m=m*m;
  return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}
uniform float uTime; uniform vec3 uPull;
float field(vec3 n){
  float d = snoise(n*1.25 + vec3(uTime*0.16, uTime*0.11, 0.0))*0.20;
  d += snoise(n*2.8 - vec3(0.0, uTime*0.22, uTime*0.1))*0.06;
  return d;
}
// short arm stretching toward the cursor (uPull = cursor in object space)
vec3 pull(vec3 n){
  float d = length(uPull); if (d < 0.001) return vec3(0.0);
  vec3 dir = uPull / d;
  float reach = clamp(d - 0.9, 0.0, 0.7);
  float c = max(dot(n, dir), 0.0);
  float w = pow(c, 4.0) * 0.5 + pow(c, 20.0) * 0.6;
  float wob = 1.0 + snoise(n*3.0 + uTime*0.6) * 0.12;
  return dir * reach * w * wob;
}
`;

const CORE_VERT = /* glsl */ `
uniform float uDisperse;
varying vec3 vNormal; varying vec3 vView; varying float vN;
vec3 disp(vec3 p){ vec3 n = normalize(p); return n * (1.0 + field(n) * (1.0 + uDisperse * 2.0)) + pull(n) * (1.0 - uDisperse); }
void main(){
  vec3 n = normalize(position);
  vec3 t = normalize(cross(n, abs(n.y) > 0.99 ? vec3(1.0,0.0,0.0) : vec3(0.0,1.0,0.0)));
  vec3 b = cross(n, t);
  vec3 p = disp(position);
  vec3 pt = disp(n + t*0.012); vec3 pb = disp(n + b*0.012);
  vec3 nn = normalize(cross(pt - p, pb - p));
  vN = field(n);
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  vNormal = normalize(normalMatrix * nn);
  vView = normalize(-mv.xyz);
  gl_Position = projectionMatrix * mv;
}`;

const CORE_FRAG = /* glsl */ `
uniform vec3 uAccent; uniform float uAlpha;
varying vec3 vNormal; varying vec3 vView; varying float vN;
void main(){
  vec3 n = normalize(vNormal); vec3 v = normalize(vView);
  float ndv = max(dot(n, v), 0.0);
  float fres = pow(1.0 - ndv, 3.4);
  vec3 r = reflect(-v, n);
  float sky = smoothstep(0.35, 1.0, r.y) * 0.18;
  float key = pow(max(dot(r, normalize(vec3(-0.6, 0.7, 0.5))), 0.0), 48.0) * 0.8;
  float rim2 = pow(max(dot(r, normalize(vec3(0.8, -0.3, 0.4))), 0.0), 16.0);
  vec3 col = vec3(0.016, 0.014, 0.014);
  col += vec3(0.92, 0.9, 0.88) * (sky + key);
  col += uAccent * fres * 0.9;
  col += uAccent * rim2 * 0.25;
  col += uAccent * smoothstep(0.1, 0.32, vN) * 0.04 * (1.0 - fres);
  float body = mix(0.72, 1.0, max(fres, key));
  gl_FragColor = vec4(col, uAlpha * body);
}`;

const POINTS_VERT = /* glsl */ `
uniform float uDisperse; uniform float uPixelRatio; uniform float uSize;
attribute vec3 aDir; attribute float aSeed;
varying float vSeed; varying float vAlpha;
void main(){
  vec3 n = normalize(position);
  vec3 onCore = n * (1.0 + field(n) + 0.004) + pull(n) * (1.0 - uDisperse);
  vec3 far = n * (1.8 + aSeed * 5.5) + aDir * (1.2 + aSeed * 3.5);
  far += vec3(snoise(far*0.25 + uTime*0.04), snoise(far*0.25 + 17.0 + uTime*0.04), snoise(far*0.25 + 31.0)) * 0.7;
  float t = clamp(uDisperse * 1.35 - aSeed * 0.35, 0.0, 1.0);
  t = t * t * (3.0 - 2.0 * t);
  vec3 p = mix(onCore, far, t);
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_PointSize = uSize * uPixelRatio * (0.35 + aSeed * 0.9) / -mv.z;
  gl_Position = projectionMatrix * mv;
  vSeed = aSeed;
  vAlpha = smoothstep(0.0, 0.25, uDisperse) * (0.35 + 0.65 * t);
}`;

const POINTS_FRAG = /* glsl */ `
uniform vec3 uAccent;
varying float vSeed; varying float vAlpha;
void main(){
  float r = length(gl_PointCoord - 0.5); if (r > 0.5) discard;
  float a = smoothstep(0.5, 0.0, r);
  vec3 col = mix(vec3(0.55, 0.53, 0.51), uAccent, step(0.58, vSeed));
  gl_FragColor = vec4(col, a * vAlpha * 0.75);
}`;

const INTERACTIVE = 'a, button, input, textarea, select, label';

const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

export type LiquidCoreOptions = {
  reduced: boolean;
  /** id of the section where the particles re-form into the core */
  reformAt: string;
};

/** Mounts the scene on `canvas`. Returns a cleanup function, or null when WebGL is unavailable. */
export function createLiquidCore(canvas: HTMLCanvasElement, { reduced, reformAt }: LiquidCoreOptions) {
  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: 'high-performance' });
  } catch {
    return null;
  }
  renderer.setClearColor(0x0a0909, 1);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
  camera.position.z = 5.4;
  const group = new THREE.Group();
  scene.add(group);
  const spin = new THREE.Group(); // receives drag rotation
  group.add(spin);

  const uniforms = {
    uTime: { value: 0 },
    uPull: { value: new THREE.Vector3() },
    uDisperse: { value: 0 },
    uAlpha: { value: 1 },
    // raw sRGB values on purpose: ShaderMaterial output is not colour-managed
    uAccent: { value: new THREE.Vector3(1, 0x5b / 255, 0x14 / 255) },
    uPixelRatio: { value: 1 },
    uSize: { value: 26 },
  };

  const coreGeo = new THREE.SphereGeometry(1, 220, 220);
  const coreMat = new THREE.ShaderMaterial({
    uniforms,
    transparent: true,
    vertexShader: NOISE + CORE_VERT,
    fragmentShader: CORE_FRAG,
  });
  const core = new THREE.Mesh(coreGeo, coreMat);
  spin.add(core);

  const mobile = Math.min(window.innerWidth, window.innerHeight) < 700;
  const COUNT = mobile ? 9000 : 18000;
  const pos = new Float32Array(COUNT * 3);
  const dir = new Float32Array(COUNT * 3);
  const seed = new Float32Array(COUNT);
  const randomUnit = (arr: Float32Array, i: number) => {
    const u = Math.random() * 2 - 1;
    const th = Math.random() * Math.PI * 2;
    const s = Math.sqrt(1 - u * u);
    arr[i * 3] = s * Math.cos(th);
    arr[i * 3 + 1] = u;
    arr[i * 3 + 2] = s * Math.sin(th);
  };
  for (let k = 0; k < COUNT; k++) {
    randomUnit(pos, k);
    randomUnit(dir, k);
    seed[k] = Math.random();
  }
  const pointsGeo = new THREE.BufferGeometry();
  pointsGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  pointsGeo.setAttribute('aDir', new THREE.BufferAttribute(dir, 3));
  pointsGeo.setAttribute('aSeed', new THREE.BufferAttribute(seed, 1));
  const pointsMat = new THREE.ShaderMaterial({
    uniforms,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexShader: NOISE + POINTS_VERT,
    fragmentShader: POINTS_FRAG,
  });
  const points = new THREE.Points(pointsGeo, pointsMat);
  points.frustumCulled = false;
  spin.add(points);

  let W = 0;
  let H = 0;
  const resize = () => {
    W = window.innerWidth;
    H = window.innerHeight;
    const pr = Math.min(window.devicePixelRatio || 1, 2);
    renderer.setPixelRatio(pr);
    renderer.setSize(W, H, false);
    uniforms.uPixelRatio.value = pr;
    camera.aspect = W / H;
    camera.updateProjectionMatrix();
  };
  resize();

  // --- pointer: stretch + drag-rotate ---
  const mouse = { x: 0, y: 0, active: false };
  const drag = { on: false, hover: false, x: 0, y: 0, ax: 0, ay: 0, vx: 0, vy: 0 };
  const raycaster = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  const sphere = new THREE.Sphere(new THREE.Vector3(), 1.25);
  const ray = new THREE.Vector3();
  const hit = new THREE.Vector3();
  const qx = new THREE.Quaternion();
  const qy = new THREE.Quaternion();
  const AX = new THREE.Vector3(1, 0, 0);
  const AY = new THREE.Vector3(0, 1, 0);
  const root = document.documentElement;

  const onUI = (t: EventTarget | null) => t instanceof Element && !!t.closest(INTERACTIVE);
  const overCore = (cx: number, cy: number) => {
    if (uniforms.uDisperse.value > 0.25) return false;
    ndc.set((cx / W) * 2 - 1, -((cy / H) * 2 - 1));
    raycaster.setFromCamera(ndc, camera);
    group.getWorldPosition(sphere.center);
    return raycaster.ray.intersectsSphere(sphere);
  };

  const onPointerMove = (e: PointerEvent) => {
    mouse.x = (e.clientX / W) * 2 - 1;
    mouse.y = -((e.clientY / H) * 2 - 1);
    mouse.active = true;
    if (drag.on) {
      drag.ax += e.clientX - drag.x;
      drag.ay += e.clientY - drag.y;
      drag.x = e.clientX;
      drag.y = e.clientY;
    } else if (e.pointerType !== 'touch') {
      const h = !onUI(e.target) && overCore(e.clientX, e.clientY);
      if (h !== drag.hover) {
        drag.hover = h;
        root.style.cursor = h ? 'grab' : '';
      }
    }
  };
  const onPointerDown = (e: PointerEvent) => {
    if (e.pointerType === 'touch' || e.button !== 0 || onUI(e.target)) return;
    if (!overCore(e.clientX, e.clientY)) return;
    e.preventDefault();
    drag.on = true;
    drag.x = e.clientX;
    drag.y = e.clientY;
    drag.ax = drag.ay = 0;
    root.style.cursor = 'grabbing';
    document.body.style.userSelect = 'none';
  };
  const endDrag = () => {
    if (!drag.on) return;
    drag.on = false;
    document.body.style.userSelect = '';
    root.style.cursor = drag.hover ? 'grab' : '';
  };
  const onPointerOut = (e: PointerEvent) => {
    if (!e.relatedTarget) mouse.active = false;
  };
  const onBlur = () => {
    mouse.active = false;
    endDrag();
  };

  window.addEventListener('resize', resize);
  window.addEventListener('pointermove', onPointerMove, { passive: true });
  document.addEventListener('pointerdown', onPointerDown);
  window.addEventListener('pointerup', endDrag);
  document.addEventListener('pointerout', onPointerOut);
  window.addEventListener('blur', onBlur);

  // --- loop ---
  const state = { d: 0, z: 5.4, x: 0, y: 0, mx: 0, my: 0 };
  const clock = new THREE.Clock();
  let raf = 0;

  const frame = () => {
    const dt = Math.min(clock.getDelta(), 0.05);
    if (!reduced) uniforms.uTime.value += dt * 0.7;

    const sy = window.scrollY;
    const reform = document.getElementById(reformAt);
    const reformTop = reform ? reform.getBoundingClientRect().top + sy : Infinity;
    const out = smooth(H * 0.08, H * 0.95, sy);
    const back = smooth(reformTop - H * 1.1, reformTop - H * 0.15, sy);
    state.d += (out * (1 - back) - state.d) * 0.08;
    uniforms.uDisperse.value = state.d;
    uniforms.uAlpha.value = Math.max(0, 1 - state.d * 2.2);
    core.visible = uniforms.uAlpha.value > 0.01;

    const wide = W > 820;
    const tx = wide ? 1.05 : 0;
    const ty = wide ? 0.15 : 0.65;
    state.x += (tx * (1 - state.d) - state.x) * 0.06;
    state.y += (ty * (1 - state.d) - state.y) * 0.06;
    group.position.set(state.x, state.y, 0);
    state.z += ((wide ? 5.4 : 6.6) - state.d * 2.4 - state.z) * 0.06;
    camera.position.z = state.z;

    state.mx += (mouse.x - state.mx) * 0.05;
    state.my += (mouse.y - state.my) * 0.05;
    group.rotation.y = (reduced ? 0 : uniforms.uTime.value * 0.05) + sy * 0.0004 + state.mx * 0.05;
    group.rotation.x = -state.my * 0.04 + state.d * 0.3;

    // drag rotation with weight + inertia
    if (drag.on) {
      const tvx = drag.ax * 0.0035;
      const tvy = drag.ay * 0.0035;
      drag.ax = drag.ay = 0;
      drag.vx += (tvx - drag.vx) * 0.25;
      drag.vy += (tvy - drag.vy) * 0.25;
    } else {
      drag.vx *= 0.955;
      drag.vy *= 0.955;
    }
    if (Math.abs(drag.vx) + Math.abs(drag.vy) > 1e-5) {
      qy.setFromAxisAngle(AY, drag.vx);
      qx.setFromAxisAngle(AX, drag.vy);
      spin.quaternion.premultiply(qy).premultiply(qx);
    }
    group.updateMatrixWorld();
    camera.updateMatrixWorld();

    // stretch: project the cursor onto the core's plane, in the core's local space
    hit.set(0, 0, 0);
    if (mouse.active && !drag.on) {
      ray.set(mouse.x, mouse.y, 0.5).unproject(camera).sub(camera.position).normalize();
      const t = (group.position.z - camera.position.z) / ray.z;
      hit.copy(camera.position).addScaledVector(ray, t);
      spin.worldToLocal(hit);
    }
    uniforms.uPull.value.lerp(hit, 0.035);

    renderer.render(scene, camera);
    raf = requestAnimationFrame(frame);
  };
  raf = requestAnimationFrame(frame);

  return () => {
    cancelAnimationFrame(raf);
    window.removeEventListener('resize', resize);
    window.removeEventListener('pointermove', onPointerMove);
    document.removeEventListener('pointerdown', onPointerDown);
    window.removeEventListener('pointerup', endDrag);
    document.removeEventListener('pointerout', onPointerOut);
    window.removeEventListener('blur', onBlur);
    root.style.cursor = '';
    document.body.style.userSelect = '';
    coreGeo.dispose();
    coreMat.dispose();
    pointsGeo.dispose();
    pointsMat.dispose();
    renderer.dispose();
  };
}
