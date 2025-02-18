import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

// Scene, Camera, Renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('app').appendChild(renderer.domElement);

// Lighting
// 1. Ambient Light (Pencahayaan Dasar)
const ambientLight = new THREE.AmbientLight(0xffffff, 1); // Warna putih, intensitas 0.5
scene.add(ambientLight);

// 2. Directional Light (Cahaya Arah)
const directionalLight = new THREE.DirectionalLight(0xffffff, 2); // Warna putih, intensitas 0.8
directionalLight.position.set(5, 5, 5).normalize(); // Posisi cahaya di sudut kanan atas
scene.add(directionalLight);

// 3. Point Light (Cahaya Lokal)
const pointLight = new THREE.PointLight(0xff9000, 1, 10); // Warna oranye, intensitas 1, jarak maksimal 10
pointLight.position.set(-3, 2, 4); // Posisi cahaya di kiri atas
scene.add(pointLight);

// 4. Spot Light (Cahaya Sorotan)
const spotLight = new THREE.SpotLight(0x00ff00, 1, 10, Math.PI / 4, 0.5); // Warna hijau, intensitas 1, sudut 45 derajat
spotLight.position.set(0, 5, 0); // Posisi cahaya di atas
spotLight.target.position.set(0, 0, 0); // Target cahaya ke tengah scene
scene.add(spotLight);
scene.add(spotLight.target);

// Load GLB Model
let model;
const loader = new GLTFLoader();
loader.load(
  '/models/chara.glb', // Path ke file GLB
  (gltf) => {
    model = gltf.scene;
    scene.add(model);

    // Atur posisi awal model di tengah
    model.position.set(0, 0, 9); // Posisi tetap di (x=0, y=0, z=4)
    model.scale.set(1, 1, 1); // Skala model

    // Sesuaikan posisi kamera agar model berada di tengah
    camera.position.set(0, 0, 10);
    camera.lookAt(model.position);
  },
  undefined,
  (error) => {
    console.error('Error loading GLB model:', error);
  }
);

// Scroll Variables
let previousScrollY = 0;

// Scroll Event Listener
window.addEventListener('scroll', () => {
  const currentScrollY = window.scrollY;
  const deltaY = currentScrollY - previousScrollY;

  if (model) {
    // Pindahkan model ke kiri berdasarkan scroll
    model.position.x = Math.max(-2, -currentScrollY * 0.005); // Batas maksimal perpindahan ke kiri
  }

  // Aktifkan teks berdasarkan scroll
  const textElements = document.querySelectorAll('.scroll-text');
  textElements.forEach((text, index) => {
    if (currentScrollY > index * 200) { // Aktifkan teks berdasarkan jarak scroll
      text.classList.add('active');
    } else {
      text.classList.remove('active');
    }
  });

  previousScrollY = currentScrollY;
});

// Animation Loop
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

animate();

// Handle Window Resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});