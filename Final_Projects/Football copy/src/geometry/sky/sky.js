import * as THREE from 'three';
const skyGeometry = new THREE.SphereGeometry(100, 32, 32);
const loader2 = new THREE.TextureLoader();
const skyTexture = loader2.load('textures/sky.jpeg');
const skyMaterial = new THREE.MeshBasicMaterial({ map: skyTexture, side: THREE.BackSide });
const skySphere = new THREE.Mesh(skyGeometry, skyMaterial);
export default skySphere;