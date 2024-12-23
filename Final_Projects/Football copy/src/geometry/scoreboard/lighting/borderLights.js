import * as THREE from 'three';
import { dimensions, colors, constants } from '../constants/constants';

const { cutout, lights } = dimensions;
const { radius, thickness } = lights;
const { numLights } = constants;
const { light: lightColor } = colors;

// Extend THREE.Group to create a custom BorderLights class
class BorderLights extends THREE.Group {
    constructor() {
        super();

        // Create and add left and right light groups
        const leftLightsGroup = this.createLightsGroup();
        const rightLightsGroup = leftLightsGroup.clone();
        rightLightsGroup.position.x += (cutout.width + cutout.separator) / 2 * 2; // Reflect across x = 0

        this.add(leftLightsGroup);
        this.add(rightLightsGroup);

        this.leftLightsGroup = leftLightsGroup; // Store reference to the left group
        this.rightLightsGroup = rightLightsGroup; // Store reference to the right group
    }

    /**
     * Creates a lights group with top, bottom, left, and right strips.
     * @returns {THREE.Group} The group of lights.
     */
    createLightsGroup() {
        const group = new THREE.Group();

        // Create the top strip
        const topStrip = this.createLightDisks({
            xStart: -(cutout.width + cutout.separator / 2),
            xEnd: -cutout.separator / 2,
            yStart: cutout.height / 2,
            yEnd: cutout.height / 2,
            zStart: cutout.backThickness / 2,
            numLights,
            radius,
            thickness,
            alignX: true,
        });

        // Create the bottom strip by mirroring the top strip
        const bottomStrip = topStrip.clone();
        bottomStrip.scale.y = -1; // Mirror in the Y plane

        // Create the left strip
        const leftStrip = this.createLightDisks({
            xStart: -(cutout.width + cutout.separator / 2),
            xEnd: -(cutout.width + cutout.separator / 2),
            yStart: -cutout.height / 2,
            yEnd: cutout.height / 2,
            zStart: cutout.backThickness / 2,
            numLights,
            radius,
            thickness,
            alignX: false,
        });

        // Create the right strip by mirroring the left strip
        const rightStrip = leftStrip.clone();
        rightStrip.position.x = -(cutout.width + cutout.separator) / 2 -
            (leftStrip.position.x - -(cutout.width + cutout.separator) / 2);
        rightStrip.scale.x *= -1; // Mirror across the X-axis

        // Add all strips to the group
        group.add(topStrip, bottomStrip, leftStrip, rightStrip);
        return group;
    }

    /**
     * Creates a group of light disks and point lights.
     * @param {Object} params - Configuration parameters for the lights.
     * @returns {THREE.Group} The group of light disks and point lights.
     */
    createLightDisks({ xStart, xEnd, yStart, yEnd, zStart, numLights, radius, thickness, alignX = true }) {
        const group = new THREE.Group();
        const xRange = xEnd - xStart;
        const yRange = yEnd - yStart;
        const spacing = alignX
            ? xRange / (numLights + 1)
            : yRange / (numLights + 1);
        const mid = Math.floor(numLights / 2);

        for (let i = 0; i < numLights; i++) {
            const position = alignX
                ? xStart + spacing * (i + 1)
                : yStart + spacing * (i + 1);

            const x = alignX ? position : xStart;
            const y = alignX ? yStart : position;
            const z = zStart;

            // Create the light
            const pointLight = new THREE.PointLight(lightColor, 0.5, 10);
            pointLight.position.set(x, y, z);
            pointLight.castShadow = i === mid; // Enable shadow for the middle light

            // Create the disk
            const diskGeometry = new THREE.CylinderGeometry(radius, radius, thickness, 16);
            const diskMaterial = new THREE.MeshStandardMaterial({ color: lightColor, emissive: lightColor });
            const diskMesh = new THREE.Mesh(diskGeometry, diskMaterial);
            diskMesh.rotation.z = !alignX ? Math.PI / 2 : 0;
            diskMesh.position.set(x, y, z);

            group.add(pointLight, diskMesh);
        }

        return group;
    }

    /**
 * Flashes a specific group of lights by briefly increasing their brightness and changing their color.
 * @param {THREE.Group} group - The lights group to flash (e.g., leftLightsGroup or rightLightsGroup).
 * @param {THREE.Color | string | number} flashColor - The color to temporarily change the lights to during the flash.
 * @param {number} [flashIntensity=3.0] - The intensity of the lights during the flash.
 * @param {number} [duration=500] - The duration of the flash in milliseconds.
 */
    async flash(group, flashColor, flashIntensity = 3.0, duration = 500) {
        const lights = [];
        const meshes = [];
        const originalLightStates = [];
        const originalMeshStates = [];
    
        // Traverse the group and store the original state
        group.traverse((child) => {
            if (child.isPointLight) {
                lights.push(child);
                originalLightStates.push({
                    intensity: child.intensity,
                    color: child.color.clone(),
                });
    
                // Apply flash properties to PointLights
                child.intensity = flashIntensity;
                child.color.set(flashColor);
            } else if (child.isMesh && child.material && child.material.emissive) {
                meshes.push(child);
                originalMeshStates.push({
                    emissive: child.material.emissive.clone(),
                });
    
                // Apply flash properties to Mesh emissive materials
                child.material.emissive.set(flashColor);
                child.material.needsUpdate = true;
            }
        });
    
        // Wait for the flash duration
        await new Promise((resolve) => setTimeout(resolve, duration));
    
        // Restore original states for lights
        lights.forEach((light, index) => {
            light.intensity = originalLightStates[index].intensity;
            light.color.copy(originalLightStates[index].color);
        });
    
        // Restore original states for meshes
        meshes.forEach((mesh, index) => {
            mesh.material.emissive.copy(originalMeshStates[index].emissive);
            mesh.material.needsUpdate = true;
        });
    }
    
}

export default BorderLights;
