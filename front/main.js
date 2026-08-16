import './style.css';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';


// ======================================================
// SCENE
// ======================================================

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

            history.pushState(
              null,
              null,
              targetId
            );
          }

          overlay.classList.remove('active');

        }, 500);
      }
    }
  });
});
// ======================================================
// LEARN MORE BUTTON
// ======================================================

const learnMoreButton =
  document.querySelector('.button');

if (learnMoreButton) {

  learnMoreButton.addEventListener(
    'click',
    () => {

      const features =
        document.querySelector('about.html');

      if (features) {

        features.scrollIntoView({
          behavior: 'smooth'
        });

      }

    }
  );

}

// ======================================================
// THREE.JS SCENE
// ======================================================

const scene = new THREE.Scene();

const frustumSize = 10;

let aspect =
  window.innerWidth /
  window.innerHeight;


// ======================================================
// CAMERA
// ======================================================

const camera = new THREE.OrthographicCamera(

  (-frustumSize * aspect) / 2,

  (frustumSize * aspect) / 2,

  frustumSize / 2,

  -frustumSize / 2,

  0.1,

  1000

);

camera.position.set(
  -3,
  0,
  35
);

camera.lookAt(
  0,
  0,
  0
);


// ======================================================
// RENDERER
// ======================================================

const renderer =
  new THREE.WebGLRenderer({

    canvas: document.querySelector('#bg'),

    antialias: true,

    alpha: true
  });


renderer.setPixelRatio(
  Math.min(
    window.devicePixelRatio,
    2
  )
);


renderer.setSize(
  window.innerWidth,
  window.innerHeight
);


// ======================================================
// LIGHTS
// ======================================================

const pointLight =
  new THREE.PointLight(
    0xffffff,
    2
  );

pointLight.position.set(
  5,
  5,
  5
);


const ambientLight =
  new THREE.AmbientLight(
    0x770101,
    -0.5
  );


scene.add(pointLight);
scene.add(ambientLight);


// ======================================================
// PHONE VARIABLES
// ======================================================

// IMPORTANT:
// These need to exist OUTSIDE the GLTF loader
// so the animation loop can access them.

let phone = null;

let screenAnchor = null;

const phoneUI =
  document.getElementById('phone-ui');


// ======================================================
// UPDATE PHONE HTML UI
// ======================================================

function updatePhoneUI() {

  // Wait until the phone has loaded
  if (!phone) return;

  if (!screenAnchor) return;

  if (!phoneUI) return;


  // ------------------------------------------
  // Get screen anchor world position
  // ------------------------------------------

  const worldPosition =
    new THREE.Vector3();

  screenAnchor.getWorldPosition(
    worldPosition
  );


  // ------------------------------------------
  // Convert 3D position into screen position
  // ------------------------------------------

  const projected =
    worldPosition.clone();

  projected.project(camera);


  const x =
    (projected.x * 0.5 + 0.5) *
    window.innerWidth;


  const y =
    (-projected.y * 0.5 + 0.5) *
    window.innerHeight;


  // ------------------------------------------
  // Position HTML element
  // ------------------------------------------

  phoneUI.style.left =
    `${x}px`;

  phoneUI.style.top =
    `${y}px`;


  phoneUI.style.transform =
    'translate(-50%, -50%)';


  // Make sure it is visible
  phoneUI.classList.add(
    'visible'
  );
}


// ======================================================
// PHONE
// ======================================================

const loader =
  new GLTFLoader();


loader.load(

  './assets/cellphone.glb',

  (gltf) => {

    phone = gltf.scene;


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

        child.material.color.set(
          0x6e1313
        );

      }


      if (materialName === 'mat17') {

        child.material.color.set(
          0xfafcfa
        );

      }


      if (materialName === 'mat23') {

        child.material.color.set(
          0x6e1313
        );

      }


      if (materialName === 'mat24') {

        child.material.color.set(
          0x000000
        );

      }


      if (materialName === 'mat25') {

        child.material.color.set(
          0xffe8b3
        );

      }


      if (materialName === 'mat5') {

        child.material.color.set(
          0x00ffff
        );

      }


      if (materialName === 'mat8') {

        child.material.color.set(
          0x000000
        );

      }


      if (materialName === 'mat15') {

        child.material.color.set(
          0xff8800
        );

      }

    });


    // ==================================================
    // ADD PHONE TO SCENE
    // ==================================================

    scene.add(phone);


    // ==================================================
    // PHONE SCREEN ANCHOR
    // ==================================================

    screenAnchor =
      new THREE.Object3D();


    /*
     * The anchor represents the CENTER
     * of the phone screen.
     *
     * Because your phone is rotated by PI
     * on the Y axis, the Z direction is flipped.
     */

    screenAnchor.position.set(
      0,
      0,
      0.06
    );


    phone.add(
      screenAnchor
    );


    console.log(
      'PHONE LOADED'
    );


    console.log(
      'SCREEN ANCHOR CREATED'
    );


    // Force the UI to update immediately
    updatePhoneUI();

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

  const t =
    document.body
      .getBoundingClientRect()
      .top;


  camera.position.z =
    35;


  camera.position.x =
    -3 +
    t * 0.005;


  camera.rotation.y =
    t * -0.0002;

}


document.body.onscroll =
  moveCamera;


moveCamera();


// ======================================================
// ANIMATION
// ======================================================

function animate() {

  requestAnimationFrame(
    animate
  );


  renderer.render(
    scene,
    camera
  );


  // Update HTML position every frame
  updatePhoneUI();

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


    updatePhoneUI();

  }
);