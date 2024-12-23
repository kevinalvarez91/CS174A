import * as THREE from 'three';
import { dimensions, colors, materials } from '../constants/constants';
import LightBoxGrid from './digit';

// Destructure properties for cleaner access
const { outer, cutout, digitPlate, digit } = dimensions;

// Create the geometry for a digit plate
const digitPlateGeometry = new THREE.BoxGeometry(
    digitPlate.width,
    digitPlate.height,
    digitPlate.depth
);

// Compute the offset to position the digit plate correctly along the Z-axis
const offset = (cutout.backThickness - outer.depth / 2) + digitPlate.depth / 2;

// Function to create a digit plate (left or right, home or guest)
const createDigitPlate = ({isHome = false }) => {
    const digitPlateMesh = new THREE.Mesh(
        digitPlateGeometry,
        new THREE.MeshPhysicalMaterial(materials.digitPlate)
    );

    // Calculate the X-position for the plate
    const directionMultiplier = isHome ? -1 : 1;
    digitPlateMesh.position.set(
        directionMultiplier * (cutout.separator + cutout.width) / 2,
        0,
        offset
    );
    digitPlateMesh.castShadow = true;
    digitPlateMesh.receiveShadow = true;

    // Calculate grid configuration
    const width = (cutout.width - 3 * digit.separator) / 2;
    const height = cutout.height - 2 * digit.separator;

    const config = {
        xStart: -width / 2,
        xEnd: width / 2,
        yStart: height / 2,
        yEnd: -height / 2,
        rows: digit.heightNum,
        columns: digit.widthNum,
        boxConfig: { depth: 0.2 },
        innerSpacing: digit.spacing,
    };

    // Create two grids for the plate (left and right)
    const leftGrid = new LightBoxGrid(config);
    const rightGrid = new LightBoxGrid(config);

    const digitOffset = digit.separator / 2 + (digitPlate.width - 3 * digit.separator) / 4;

    // Position the grids
    leftGrid.getObject().position.set(
        -digitOffset,
        0,
        offset + digitPlate.depth / 2
    );
    rightGrid.getObject().position.set(
        digitOffset,
        0,
        offset + digitPlate.depth / 2
    );

    // Add grids to the plate
    digitPlateMesh.add(leftGrid.getObject());
    digitPlateMesh.add(rightGrid.getObject());

    return {
        mesh: digitPlateMesh,
        grids: {
            left: leftGrid,
            right: rightGrid,
        },
    };
};

// Create plates for home and guest
const homeLeftPlate = createDigitPlate({ isHome: true });
const homeRightPlate = createDigitPlate({  isHome: true });
const guestLeftPlate = createDigitPlate({ });
const guestRightPlate = createDigitPlate({  });

// Create the lights object for tracking
const lights = {
    home: {
        left: homeLeftPlate.grids.left,
        right: homeRightPlate.grids.right,
    },
    guest: {
        left: guestLeftPlate.grids.left,
        right: guestRightPlate.grids.right,
    },
};

// Group the plates
const digitPlatesGroup = new THREE.Group();
digitPlatesGroup.add(homeLeftPlate.mesh);
digitPlatesGroup.add(homeRightPlate.mesh);
digitPlatesGroup.add(guestLeftPlate.mesh);
digitPlatesGroup.add(guestRightPlate.mesh);

export default digitPlatesGroup;
export { lights };
