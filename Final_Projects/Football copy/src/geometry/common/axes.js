import * as THREE from 'three';

// Create a custom AxesHelper
class CustomAxesHelper extends THREE.Object3D {
    constructor(size = 1, colors = { x: 0xff0000, y: 0x00ff00, z: 0x0000ff }) {
        super();

        // X-axis (red by default)
        const xMaterial = new THREE.LineBasicMaterial({ color: colors.x });
        const xGeometry = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(size, 0, 0)
        ]);
        const xLine = new THREE.Line(xGeometry, xMaterial);
        this.add(xLine);

        // Y-axis (green by default)
        const yMaterial = new THREE.LineBasicMaterial({ color: colors.y });
        const yGeometry = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(0, size, 0)
        ]);
        const yLine = new THREE.Line(yGeometry, yMaterial);
        this.add(yLine);

        // Z-axis (blue by default)
        const zMaterial = new THREE.LineBasicMaterial({ color: colors.z });
        const zGeometry = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(0, 0, size)
        ]);
        const zLine = new THREE.Line(zGeometry, zMaterial);
        this.add(zLine);
    }
}

// Create the axes helper with custom colors and size
const size = 50;
const colors = { x: 0xff6347, y: 0x3cb371, z: 0x1e90ff }; // Custom colors
const axesHelper = new CustomAxesHelper(size, colors);

// Raise the axes helper by 2 units on the Y-axis
axesHelper.position.y += 2;

export default axesHelper;
