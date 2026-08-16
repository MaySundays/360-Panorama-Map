import * as THREE from "three";

const loader = new THREE.TextureLoader();

function getSprite({ color, opacity, path, pos, size }) {

  const spriteMat = new THREE.SpriteMaterial({
    map: loader.load(path),

    color: color,

    transparent: true,
    opacity: opacity,

    fog: false,

    blending: THREE.NormalBlending,

    depthWrite: false,
    depthTest: true
  });

  const sprite = new THREE.Sprite(spriteMat);

  sprite.position.set(
    pos.x,
    -pos.y,
    pos.z
  );

  size += Math.random() - 0.5;

  sprite.scale.set(
    size,
    size,
    size
  );

  return sprite;
}

function getLayer({
  numSprites = 8,

  opacity = 0.5,

  path = "./about/rad-grad.png",

  radius = 10,

  size = 24,

  z = -10.5

} = {}) {

  const layerGroup = new THREE.Group();

  for (let i = 0; i < numSprites; i++) {

    const angle =
      (i / numSprites) *
      Math.PI *
      2;

    const pos = new THREE.Vector3(
      Math.cos(angle) *
        Math.random() *
        radius,

      Math.sin(angle) *
        Math.random() *
        radius,

      z + Math.random()
    );


    // ==========================================
    // CHOOSE YOUR GLOW COLOR HERE
    // ==========================================

    const color = "#ff7a2d";

    // White:
    // const color = "#ffffff";

    // Light yellow:
    // const color = "#fff4c2";

    // Warmer yellow:
    // const color = "#ffe066";


    const sprite = getSprite({
      color,
      opacity,
      path,
      pos,
      size
    });

    layerGroup.add(sprite);
  }

  return layerGroup;
}

export default getLayer;