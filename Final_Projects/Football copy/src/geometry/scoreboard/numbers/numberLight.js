import * as THREE from 'three';
import { colors } from '../constants/constants';
import { CSG } from 'three-csg-ts'; // Ensure this is the correct import
const { light } = colors;

class LightBox {
    constructor({ width = 0.3, height = 0.4, depth = 0.2, lightColor = light, emissiveIntensity = 1.0, plasticOpacity = 0.6 }) {
        this.group = new THREE.Group();

        const outerMesh = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth));
        const innerMesh = new THREE.Mesh(new THREE.BoxGeometry(width - 0.05, height - 0.05, depth - 0.05));

        // Use CSG to subtract inner geometry from outer geometry
        const hollowMesh = CSG.subtract(outerMesh, innerMesh);
        const hollowGeometry = hollowMesh.geometry;

        // Translucent material with emissive color
        this.material = new THREE.MeshPhysicalMaterial({
            color: lightColor,
            emissive: new THREE.Color(lightColor),
            emissiveIntensity,
            transparent: true,
            opacity: plasticOpacity,
            roughness: 0.7,
            metalness: 0.1,
        });

        this.mesh = new THREE.Mesh(hollowGeometry, this.material);

        this.group.add(this.mesh);

        // Store colors for toggling
        this.lightColor = new THREE.Color(lightColor);
        this.offColor = new THREE.Color(0x000000); // Dark gray for "off" state
    }

    // Setter to toggle emissive intensity and color
    turnOn() {
        this.material.color.set(this.lightColor);
        this.material.emissive.set(this.lightColor);
        this.material.emissiveIntensity = 1.0;
        this.material.opacity = 0.8; // Slightly higher opacity when on
        this.material.needsUpdate = true;
    }

    turnOff() {
        this.material.color.set(this.offColor);
        this.material.emissive.set(this.offColor);
        this.material.emissiveIntensity = 0.0;
        this.material.opacity = 0.4; // Lower opacity when off
        this.material.needsUpdate = true;
    }

    getObject() {
        return this.group;
    }
}

export default LightBox;
