import * as THREE from 'three';
const sunGeometry = new THREE.SphereGeometry(8, 32, 32);
const loader3 = new THREE.TextureLoader();
const sunTexture = loader3.load('textures/sun.jpg');
const sunMaterial = new THREE.MeshBasicMaterial({map: sunTexture, side: THREE.FrontSide});
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
sun.position.set(-10,60,0);
export default sun;