import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import Stats from "three/examples/jsm/libs/stats.module.js";
import { Pane } from "tweakpane";
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// Stats (FPS)
const stats = Stats();
document.body.appendChild(stats.dom);

// initialize the scene
const scene = new THREE.Scene();


// Create a train group
const trainGroup = new THREE.Group();

const textureLoader = new THREE.TextureLoader();
const colorMap = textureLoader.load('textures/colormap.png', (texture) => {
  texture.encoding = THREE.sRGBEncoding;
  texture.flipY = false; // GLB models often require this
});
const loader = new GLTFLoader();
loader.load('models/train-electric-bullet-a.glb', (gltf) => {
  gltf.scene.traverse((node) => {
    if (node.isMesh) {
      node.material = new THREE.MeshPhysicalMaterial({
        map: colorMap,
        metalness: 0.8,
        roughness: 0.4,
        clearcoat: 0.8,
        clearcoatRoughness: 0.3,
      });
      node.material.needsUpdate = true;
    }
  });
  // Add train engine object to trainGroup
  trainGroup.add(gltf.scene);

});
loader.load('models/train-electric-bullet-b.glb', (gltf) => { // carriage model (b)
  gltf.scene.traverse((node) => {
    if (node.isMesh) {
      node.material = new THREE.MeshPhysicalMaterial({
        map: colorMap,
        metalness: 0.8,
        roughness: 0.4,
        clearcoat: 0.8,
        clearcoatRoughness: 0.3,
      });
      node.material.needsUpdate = true;
    }
  });
  // Add the `train-electric-bullet-b.glb` model to the train group as a carriage (b)       
  // Offset by some distance so it follows the train engine
  gltf.scene.position.set(0, 0, -2.7);
  trainGroup.add(gltf.scene);
});

scene.add(trainGroup);

// // Define material properties
// let objProps = {
//   clearcoat: 0.8,
//   clearcoatRoughness: 0.5,
//   metalness: 0.8,
//   roughness: 0.5,
// };
// const objMaterial = new THREE.MeshPhysicalMaterial({
//   color: "limegreen",
//   ...objProps,
//   // wireframe: true,
// });
//
// // Create an geometry for an object
// const objGeometry = new THREE.TorusGeometry(1, 0.4, 20, 100);
// // Create mesh from object and material and add it to the scene
// const objMesh = new THREE.Mesh(objGeometry, objMaterial);
// scene.add(objMesh);

// // Add a UI pane that binds the material properties and triggers onchange update
// const pane = new Pane();
// const objFolder = pane.addFolder({ title: objGeometry.type });
// for (const [key, _] of Object.entries(objProps)) {
//   objFolder
//     .addBinding(objProps, key, { min: 0.0, max: 1.0, step: 0.1, label: key })
//     .on("change", (prop) => {
//       objMaterial[key] = prop.value;
//     });
// }

// initialize the camera
const camera = new THREE.PerspectiveCamera(
  50,
  window.innerWidth / window.innerHeight,
  0.1,
  200,
);
camera.position.z = 5;

// Ambient lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);

// Directional lighting
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(1, 1, 1);
scene.add(directionalLight);

// initialize the renderer
const canvas = document.querySelector("canvas.threejs");
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
// Support high-res displays up to 2x pixel ratios (e.g. retina)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// instantiate the controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
// controls.autoRotate = true;

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

const clock = new THREE.Clock();

// render the scene
const renderloop = () => {
  controls.update();
  stats.update();
  renderer.render(scene, camera);
  // console.log(clock.getElapsedTime());
  window.requestAnimationFrame(renderloop);
};

renderloop();
