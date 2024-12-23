import * as THREE from 'three';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { dimensions, materials } from '../constants/constants'; // Import dimensions and materials

const { cutout, outer, text } = dimensions;

// Define the text style
const textSettings = {
    fontUrl: '/fonts/premier-2019-font/Premier 2019_Regular.typeface.json', // Path to the font file
    size: text.height, // Text size
    height: text.depth, // Thickness of the text
    width: cutout.width - 2* text.separator
};

const loadTextMeshes = async () => {
    const loader = new FontLoader();

    return new Promise((resolve, reject) => {
        loader.load(
            textSettings.fontUrl,
            (font) => {
                const textGroup = new THREE.Group();

                // Utility function to scale text to a desired width
                const adjustTextWidth = (mesh, targetWidth) => {
                    const boundingBox = new THREE.Box3().setFromObject(mesh);
                    const currentWidth = boundingBox.max.x - boundingBox.min.x;
                    const scaleFactor = targetWidth / currentWidth;
                    mesh.scale.x = scaleFactor;
                };

                // Create the "HOME" text geometry
                const homeGeometry = new TextGeometry('HOME', {
                    font: font,
                    size: textSettings.size,
                    depth: textSettings.height,
                });
                const homeMaterial = new THREE.MeshPhysicalMaterial(materials.text); // Use material from constants
                const homeText = new THREE.Mesh(homeGeometry, homeMaterial);
                homeGeometry.center(); // Center the text
                const homeTargetWidth = textSettings.width; // Set your desired width for "HOME"
                adjustTextWidth(homeText, homeTargetWidth);
                homeText.position.set(
                    -(cutout.width + cutout.separator) / 2,
                    (outer.height + text.height) / 2,
                    (outer.depth) / 2 // Slightly in front of the backplate
                );

                // Adjust the "HOME" text width
                homeText.receiveShadow = true;
                homeText.castShadow = true;
                textGroup.add(homeText);
                
                // Create the "GUEST" text geometry
                const guestGeometry = new TextGeometry('GUEST', {
                    font: font,
                    size: textSettings.size,
                    depth: textSettings.height,
                });
                const guestMaterial = new THREE.MeshPhysicalMaterial(materials.text);
                const guestText = new THREE.Mesh(guestGeometry, guestMaterial);
                guestGeometry.center(); // Center the text
                // Adjust the "GUEST" text width
                const guestTargetWidth = textSettings.width; // Set your desired width for "GUEST"
                adjustTextWidth(guestText, guestTargetWidth);
                guestText.position.set(
                    (cutout.width + cutout.separator) / 2,
                    (outer.height + text.height) / 2,
                    (outer.depth) / 2
                );
                
                
                guestText.receiveShadow = true;
                guestText.castShadow = true;
                textGroup.add(guestText);

                resolve(textGroup); // Resolve the group
            },
            undefined,
            (error) => {
                console.error('Error loading font:', error);
                reject(error);
            }
        );
    });
};

const textMeshes = await loadTextMeshes();
export default textMeshes;
