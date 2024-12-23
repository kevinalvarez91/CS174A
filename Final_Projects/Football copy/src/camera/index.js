import * as THREE from 'three';
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 100, 48);  // Set the initial position of the camera
export default camera;