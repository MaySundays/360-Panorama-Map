import './style.css';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

document.querySelectorAll('.transition-link').forEach(link => {

  link.addEventListener('click', function(e) {
    const targetId = this.getAttribute('href');
    if (targetId && targetId.startsWith('#')) {
      e.preventDefault();
      const overlay = document.getElementById('overlay');
      if (overlay) {
        overlay.classList.add('active');
        setTimeout(() => {
          const targetSection =
            document.querySelector(targetId);
          if (targetSection) {
            targetSection.scrollIntoView({
              behavior: 'auto'
            });
            history.pushState(null, null, targetId
            );
          }
          overlay.classList.remove('active');
        }, 500);
      }
    }
  });
});

const learnMoreButton =
  document.querySelector('.button');

if (learnMoreButton) {

  learnMoreButton.addEventListener(
    'click',
    () => {
      const features =
        document.querySelector('scroll-animation-main/scroll-animation-main/about.html');
      if (features) {
        features.scrollIntoView({
          behavior: 'smooth'
        });
      }
    }
  );

}

const scene = new THREE.Scene();
const frustumSize = 10;
let aspect =
  window.innerWidth /
  window.innerHeight;

const camera = new THREE.OrthographicCamera(
  (-frustumSize * aspect) / 2,
  (frustumSize * aspect) / 2,
  frustumSize / 2,
  -frustumSize / 2,
  0.1,
  1000
);
camera.position.set(-3,0,35);
camera.lookAt(0,0,0);

const renderer =
  new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg'),
    antialias: true,
    alpha: true
  });

renderer.setPixelRatio(
  Math.min(window.devicePixelRatio,2)
);

renderer.setSize(
  window.innerWidth,
  window.innerHeight
);

const pointLight =
  new THREE.PointLight(0xffffff,1.6);
pointLight.position.set(6,6,6);

const ambientLight =
  new THREE.AmbientLight(0x333333,2);

scene.add(pointLight);
scene.add(ambientLight);

let phone = null;

let screenAnchor = null;

const phoneUI =
  document.getElementById('phone-ui');

function updatePhoneUI() {

  if (!phone) return;
  if (!screenAnchor) return;
  if (!phoneUI) return;

  const worldPosition =
    new THREE.Vector3();
  screenAnchor.getWorldPosition(worldPosition);

  const projected =
    worldPosition.clone();

  projected.project(camera);

  const x =
    (projected.x * 0.5 + 0.5) * window.innerWidth;

  const y =
    (-projected.y * 0.5 + 0.5) * window.innerHeight;

  phoneUI.style.left =`${x}px`;
  phoneUI.style.top =`${y}px`;
  phoneUI.style.transform ='translate(-80%, -80%)';
  phoneUI.classList.add('visible');
}
const loader =
  new GLTFLoader();
loader.load(
  './assets/HandPhone-v1/HandPhone.gltf',
  (gltf) => {
    phone = gltf.scene;
    phone.scale.set( 2.2,2.2,2.2);
    phone.position.set(4.5,-2.6,-3);
    phone.rotation.set(-0.06,Math.PI,0.02);
    phone.traverse((child) => {

      if (!child.isMesh) return;
      const materialName =
        child.material.name;
      console.log('PHONE PART:',child.name,'MATERIAL:',materialName);
      if (materialName === 'mat16') {
        child.material.color.set(0x6e1313);
      }
      if (materialName === 'mat17') {
        child.material.color.set(0xfafcfa);
      }
      if (materialName === 'mat23') {
        child.material.color.set(0x6e1313);
      }
      if (materialName === 'mat24') {
        child.material.color.set(0x000000);
      }
      if (materialName === 'mat25') {
        child.material.color.set(0xffe8b3);
      }
      if (materialName === 'mat5') {
        child.material.color.set(
          0x00ffff
        );
      }
      if (materialName === 'mat8') {
        child.material.color.set(0x000000);
      }
      if (materialName === 'mat15') {
        child.material.color.set(0xff8800);

      }

    });
    scene.add(phone);

    screenAnchor = new THREE.Object3D();
    screenAnchor.position.set(0,0,0.06);
    phone.add(screenAnchor);
    console.log('PHONE LOADED');
    console.log('SCREEN ANCHOR CREATED');
  },
  undefined,
  (error) => {
    console.error('PHONE LOAD ERROR:',error);
  }
);
function moveCamera() {

  const t = document.body
      .getBoundingClientRect()
      .top;
  camera.position.z = 35;
  camera.position.x = -3 + t * 0.005;
  camera.rotation.y = t * -0.0002;
}
document.body.onscroll =
  moveCamera;
moveCamera();

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene,camera);
  updatePhoneUI();
}
animate();
window.addEventListener(
  'resize',
  () => {
    aspect = window.innerWidth /window.innerHeight;
     camera.left = (-frustumSize * aspect) / 2;
     camera.right = (frustumSize * aspect) / 2;
     camera.top = frustumSize / 2;
     camera.bottom = -frustumSize / 2;
     camera.updateProjectionMatrix();
     
     renderer.setSize(
      window.innerWidth,
      window.innerHeight
    );
    updatePhoneUI();

  }
);