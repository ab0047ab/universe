import * as THREE from "three";

const scene = new THREE.Scene();

scene.background = new THREE.Color(0x000000);

const renderer = new THREE.WebGLRenderer({
    antialias: true
});

renderer.setSize(window.innerWidth, window.innerHeight);

renderer.setPixelRatio(
    Math.min(window.devicePixelRatio, 2)
);

// renderer.domElement.addEventListener(
//     "pointermove",
//     startMusic,
//     {
//         once:true
//     }
// );

// ===== Color =====
renderer.outputColorSpace = THREE.SRGBColorSpace;

// ===== Tone Mapping =====
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;

// ===== Shadow =====
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const ambientLight = new THREE.AmbientLight(0xffffff, 3);
scene.add(ambientLight);

document.body.appendChild(renderer.domElement);

export { scene, renderer };