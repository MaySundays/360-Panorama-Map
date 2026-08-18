import * as THREE from "three";
import getLayer from "./libs/getLayer.js";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import getStarfield from "./libs/getStarfield.js";

// ======================================================
// BASIC THREE.JS SETUP
// ======================================================

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

camera.position.z = 5;

const canvas = document.getElementById("three-canvas");

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  canvas,
  alpha: true
});

renderer.setSize(
  window.innerWidth,
  window.innerHeight
);

// IMPORTANT FOR PERFORMANCE
renderer.setPixelRatio(1);

renderer.setClearColor(0x000000, 0);


// ======================================================
// BACKGROUND
// ======================================================

const background =
  document.getElementById("background");


// ======================================================
// SCROLL STATE
// ======================================================

let targetScroll = 0;
let currentScroll = 0;

let maxScroll =
  document.documentElement.scrollHeight -
  window.innerHeight;


// ======================================================
// UPDATE SCROLL TARGET
// ======================================================

function updateScrollTarget() {

  maxScroll =
    document.documentElement.scrollHeight -
    window.innerHeight;

  if (maxScroll <= 0) {
    targetScroll = 0;
    return;
  }

  targetScroll =
    window.scrollY / maxScroll;

  targetScroll =
    Math.max(
      0,
      Math.min(1, targetScroll)
    );
}


// ======================================================
// SCROLL EVENT
// ======================================================

window.addEventListener(
  "scroll",
  updateScrollTarget,
  {
    passive: true
  }
);


// ======================================================
// INITIAL SCROLL POSITION
// ======================================================

updateScrollTarget();


// ======================================================
// GLOW
// ======================================================

const gradientBackground = getLayer({
  numSprites: 8,
  opacity: 0.5,
  radius: 10,
  size: 24,
  z: -10.5
});

scene.add(gradientBackground);


// ======================================================
// STARS
// ======================================================

const stars = getStarfield({
  numStars: 1500
});

scene.add(stars);


// ======================================================
// LIGHT
// ======================================================

const hemiLight =
  new THREE.HemisphereLight(
    0xffffff,
    0x444444,
    1
  );

scene.add(hemiLight);


// ======================================================
// ASTRONAUT
// ======================================================

const loader = new OBJLoader();

loader.load(
  "./about/astronaut.obj",

  (obj) => {

    console.log("ASTRONAUT LOADED");

    let geometry = null;

    obj.traverse((child) => {

      if (child.isMesh) {
        geometry = child.geometry;
      }

    });


    if (!geometry) {

      console.error(
        "No mesh found inside astronaut.obj"
      );

      return;
    }


    // ==================================================
    // CENTER MODEL
    // ==================================================

    geometry.center();


    // ==================================================
    // BLUE MATCAP
    // ==================================================

    const textureLoader =
      new THREE.TextureLoader();

    textureLoader.load(

      "./about/blue.jpg",

      // ----------------------------------------------
      // BLUE TEXTURE LOADED
      // ----------------------------------------------

      (blueTexture) => {

        console.log("BLUE TEXTURE LOADED");

        blueTexture.colorSpace =
          THREE.SRGBColorSpace;


        const material =
          new THREE.MeshMatcapMaterial({
            matcap: blueTexture
          });


        // ==================================================
        // ASTRONAUT MESH
        // ==================================================

        const astronaut =
          new THREE.Mesh(
            geometry,
            material
          );

        astronaut.position.set(
          1.5,
          -0.5,
          0
        );

        scene.add(astronaut);


        // ==================================================
        // ANIMATION
        // ==================================================

        let animationRunning = false;


        function animate() {

          animationRunning = true;

          requestAnimationFrame(() => {

            // ----------------------------------------------
            // SMOOTH SCROLL
            // ----------------------------------------------

            const difference =
              targetScroll - currentScroll;

            currentScroll +=
              difference * 0.08;


            // ----------------------------------------------
            // UPDATE BACKGROUND
            //
            // This is CSS only.
            // It does NOT affect the Three.js render.
            // ----------------------------------------------

            if (background) {

              background.style.backgroundPosition =
                `0% ${currentScroll * 100}%`;

            }


            // ----------------------------------------------
            // ASTRONAUT
            // ----------------------------------------------

            const goalRotation =
              Math.PI * currentScroll;

            astronaut.rotation.y +=
              (
                goalRotation -
                astronaut.rotation.y
              ) * 0.08;


            // ----------------------------------------------
            // STARS
            // ----------------------------------------------

            const goalStarsZ =
              goalRotation * 8;

            stars.position.z +=
              (
                goalStarsZ -
                stars.position.z
              ) * 0.08;


            // ----------------------------------------------
            // RENDER
            // ----------------------------------------------

            renderer.render(
              scene,
              camera
            );


            // ----------------------------------------------
            // CHECK IF WE STILL NEED ANIMATION
            // ----------------------------------------------

            const scrollStillMoving =
              Math.abs(
                targetScroll -
                currentScroll
              ) > 0.0005;


            const astronautStillMoving =
              Math.abs(
                goalRotation -
                astronaut.rotation.y
              ) > 0.0005;


            const starsStillMoving =
              Math.abs(
                goalStarsZ -
                stars.position.z
              ) > 0.0005;


            if (
              scrollStillMoving ||
              astronautStillMoving ||
              starsStillMoving
            ) {

              animate();

            } else {

              animationRunning = false;

            }

          });
        }


        // ==================================================
        // START FIRST FRAME
        // ==================================================

        renderer.render(
          scene,
          camera
        );


        // ==================================================
        // START ANIMATION WHEN SCROLLING
        // ==================================================

        window.addEventListener(
          "scroll",
          () => {

            if (!animationRunning) {
              animate();
            }

          },
          {
            passive: true
          }
        );


        // ==================================================
        // INITIAL ANIMATION
        // ==================================================

        animate();

      },


      // ----------------------------------------------
      // TEXTURE PROGRESS
      // ----------------------------------------------

      undefined,


      // ----------------------------------------------
      // TEXTURE ERROR
      // ----------------------------------------------

      (error) => {

        console.error(
          "BLUE TEXTURE FAILED TO LOAD:",
          error
        );

      }

    );

  },


  // ====================================================
  // OBJ PROGRESS
  // ====================================================

  undefined,


  // ====================================================
  // OBJ ERROR
  // ====================================================

  (error) => {

    console.error(
      "ASTRONAUT FAILED TO LOAD:",
      error
    );

  }
);


// ======================================================
// RESIZE
// ======================================================

window.addEventListener(
  "resize",
  () => {

    const width =
      window.innerWidth;

    const height =
      window.innerHeight;


    camera.aspect =
      width / height;

    camera.updateProjectionMatrix();


    renderer.setSize(
      width,
      height
    );


    maxScroll =
      document.documentElement.scrollHeight -
      height;


    updateScrollTarget();


    // Render one frame after resizing
    renderer.render(
      scene,
      camera
    );

  }
);