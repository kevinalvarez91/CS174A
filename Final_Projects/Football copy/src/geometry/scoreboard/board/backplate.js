import * as THREE from 'three';
import { CSG } from 'three-csg-ts'; // Ensure this is the correct import
import { dimensions,  materials} from '../constants/constants';

// Destructure properties for cleaner access
const { outer, cutout ,text} = dimensions;

// Create the back plate geometry
const textOffset = text.height +cutout.separator
const backPlateGeometry = new THREE.BoxGeometry(outer.width, outer.height+textOffset, outer.depth);
backPlateGeometry.translate(0, textOffset/2, 0);

// Create the main material for the back plate
const surfaceMaterial =new THREE.MeshPhysicalMaterial( materials.backplate)
// Create the back plate mesh with the main surface material
const backPlateMesh = new THREE.Mesh(backPlateGeometry, surfaceMaterial);
backPlateMesh.castShadow = true;
backPlateMesh.receiveShadow = true;
const backPlateCSG = CSG.fromMesh(backPlateMesh);

// Create the cutouts with proper translation
function createCutoutCSG(x, y, z) {
    const cutoutGeometry = new THREE.BoxGeometry(cutout.width, cutout.height, cutout.depth);
    cutoutGeometry.translate(x, y, z);
    const cutoutMesh = new THREE.Mesh(cutoutGeometry);
    return CSG.fromMesh(cutoutMesh);
}

// Define cutout positions
const homeCutout = createCutoutCSG(-(cutout.separator + cutout.width) / 2, 0, cutout.backThickness / 2);
const guestCutout = createCutoutCSG((cutout.separator + cutout.width) / 2, 0, cutout.backThickness / 2);

// Subtract the cutouts from the back plate
let finalCSG = backPlateCSG.subtract(homeCutout).subtract(guestCutout);

// Convert back to THREE.Mesh
const finalBackPlate = CSG.toMesh(finalCSG, backPlateMesh.matrix, surfaceMaterial);


// Export the group
export default finalBackPlate;
