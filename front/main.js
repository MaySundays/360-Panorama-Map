import './style.css';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// ======================================================
// SCENE
// ======================================================

const scene = new THREE.Scene();

const frustumSize = 10;

let aspect = window.innerWidth / window.innerHeight;

const camera = new THREE.OrthographicCamera(
  (-frustumSize * aspect) / 2,
  (frustumSize * aspect) / 2,
  frustumSize / 2,
  -frustumSize / 2,
  0.1,
  1000
);

// IMPORTANT:
// Keep the camera slightly to the LEFT.
// This leaves the phone on the RIGHT side.
camera.position.set(-3, 0, 35);
camera.lookAt(0, 0, 0);

// ======================================================
// RENDERER
// ======================================================

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
  antialias: true,
  alpha:true
});

renderer.setPixelRatio(
  Math.min(window.devicePixelRatio, 2)
);

renderer.setSize(
  window.innerWidth,
  window.innerHeight
);

// ======================================================
// LIGHTS
// ======================================================

const pointLight = new THREE.PointLight(
  0xffffff,
  2
);

pointLight.position.set(5, 5, 5);

const ambientLight = new THREE.AmbientLight(
  0x770101,
  -1
);

scene.add(pointLight);
scene.add(ambientLight);

// ======================================================
// STARS
// ======================================================





// ======================================================
// PHONE
// ======================================================

const loader = new GLTFLoader();

loader.load(
  './assets/cellphone.glb',

  (gltf) => {
    const phone = gltf.scene;

    // ==================================================
    // PHONE SIZE
    // ==================================================

    phone.scale.set(
      5,
      5,
      5
    );

    // ==================================================
    // PHONE POSITION
    // ==================================================

    // RIGHT SIDE — NOT CENTER
    phone.position.set(
      3,
      -0.8,
      -5
    );

    // ==================================================
    // PHONE ROTATION
    // ==================================================

    phone.rotation.set(
      0,
      Math.PI,
      0
    );

    // ==================================================
    // PHONE MATERIALS
    // ==================================================

    phone.traverse((child) => {
      if (!child.isMesh) return;

      const materialName =
        child.material.name;

      console.log(
        'PHONE PART:',
        child.name,
        'MATERIAL:',
        materialName
      );

      if (materialName === 'mat16') {
        child.material.color.set(0x6e1313);
      }

      if (materialName === 'mat17') {
        child.material.color.set(0xfafcfa);
      }

      if (materialName === 'mat23') {
        child.material.color.set(0x770101);
      }

      if (materialName === 'mat24') {
        child.material.color.set(0x000000);
      }

      if (materialName === 'mat25') {
        child.material.color.set(0xffe8b3);
      }

      if (materialName === 'mat5') {
        child.material.color.set(0x00ffff);
      }

      if (materialName === 'mat8') {
        child.material.color.set(0x000000);
      }

      if (materialName === 'mat15') {
        child.material.color.set(0xff8800);
      }
    });

    scene.add(phone);

    console.log('PHONE LOADED');
  },

  undefined,

  (error) => {
    console.error(
      'PHONE LOAD ERROR:',
      error
    );
  }
);

// ======================================================
// SCROLL
// ======================================================

function moveCamera() {
  const t = document.body.getBoundingClientRect().top;

  camera.position.z = 35;
  camera.position.x = -3 + t * -0.0002;
  camera.rotation.y = t * -0.0002;
}
document.body.onscroll = moveCamera;

moveCamera();

// ======================================================
// ANIMATION
// ======================================================

function animate() {
  requestAnimationFrame(animate);

  renderer.render(
    scene,
    camera
  );
}

animate();

// ======================================================
// RESIZE
// ======================================================

window.addEventListener(
  'resize',
  () => {

    aspect =
      window.innerWidth /
      window.innerHeight;

    camera.left =
      (-frustumSize * aspect) / 2;

    camera.right =
      (frustumSize * aspect) / 2;

    camera.top =
      frustumSize / 2;

    camera.bottom =
      -frustumSize / 2;

    camera.updateProjectionMatrix();

    renderer.setSize(
      window.innerWidth,
      window.innerHeight
    );
  }
);