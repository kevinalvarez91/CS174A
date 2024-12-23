import *  as THREE from 'three';
const sunlight = new THREE.PointLight(0xFFD700, 200);
sunlight.position.set(0,10,0);
sunlight.castShadow = true;
sunlight.shadow.mapSize.width = 1024; 
sunlight.shadow.mapSize.height = 1024; 
sunlight.shadow.camera.near = 0.1;
sunlight.shadow.camera.far = 50;
export default sunlight;