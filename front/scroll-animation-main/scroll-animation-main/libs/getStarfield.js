import * as THREE from "three";

export default function getStarfield({ numStars = 500 } = {}) {
  const verts = new Float32Array(numStars * 3);
  const colors = new Float32Array(numStars * 3);
  
  // Reuse a single Color instance to avoid creating thousands of objects
  const tempColor = new THREE.Color();

  for (let i = 0; i < numStars; i++) {
    // Inline sphere point calculation to avoid Vector3 allocation overhead
    const radius = Math.random() * 25 + 25;
    const u = Math.random();
    const v = Math.random();
    const theta = 2 * Math.PI * u;
    const phi = Math.acos(2 * v - 1);
    
    const x = radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.sin(phi) * Math.sin(theta);
    const z = radius * Math.cos(phi);

    // Write directly to flat array positions
    const stride = i * 3;
    verts[stride] = x;
    verts[stride + 1] = y;
    verts[stride + 2] = z;

    // Set colors efficiently using the shared object
    tempColor.setHSL(0.6, 0.2, Math.random());
    colors[stride] = tempColor.r;
    colors[stride + 1] = tempColor.g;
    colors[stride + 2] = tempColor.b;
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(verts, 3));
  geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  
  const mat = new THREE.PointsMaterial({
    size: 0.2,
    vertexColors: true,
    blending: THREE.AdditiveBlending,
    transparent: true // Keeps rendering fast when blending colors
  });

  return new THREE.Points(geo, mat);
}
