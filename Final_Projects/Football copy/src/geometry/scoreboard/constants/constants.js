import * as THREE from 'three';
/// Precomputed Dimensions
const outerWidth = 30;
const outerHeight = 10;
const outerDepth = 1;
const textHeight = 2;

const cutoutSeparator = 1;
const cutoutBackThickness = 0.5;
const cutoutWidth = (outerWidth - cutoutSeparator * 3) / 2;
const cutoutHeight = outerHeight - cutoutSeparator * 2;
const cutoutDepth = outerDepth - cutoutBackThickness;

const digitPlateSeparator = 0.5;
const digitPlateWidth = cutoutWidth;
const digitPlateHeight = cutoutHeight;
const digitPlateDepth = 0.1;

const lightRadius = (cutoutDepth - digitPlateDepth * 2 )/2;
const lightThickness = 0.25;

/// Dimensions Object
const dimensions = {
    outer: {
        width: outerWidth,
        height: outerHeight,
        depth: outerDepth,
    },
    cutout: {
        separator: cutoutSeparator,
        backThickness: cutoutBackThickness,
        width: cutoutWidth,
        height: cutoutHeight,
        depth: cutoutDepth,
    },
    digitPlate: {
        separator: digitPlateSeparator,
        width: digitPlateWidth,
        height: digitPlateHeight,
        depth: digitPlateDepth,
    },
    digit:{
        widthNum: 4,
        heightNum: 7,
        separator: 0.5,
        spacing: 0.1
    },
    lights: {
        radius: lightRadius,
        thickness: lightThickness,
    },
    text: {
        height: 1.5,
        depth: 0.1,
        separator: 0.25,
    }
};

/// Colors
const colors = {
    backplate: 0x2e2e2e, // Dark gray, close to black
    light: 0xfff2cc, // Warm soft white with a slight yellow tint
    digitPlate: 0x535353, // Light gray for the digit plates
    text: 0xFFFFF, // Light gray for the digit plates
};


/// Constants
const constants = {
    numLights: 5,
};

/// material
const materials = {
    backplate:{
        color: colors.backplate,
        metalness: 0.0, // Non-metallic
    roughness: 0.8, // Matte finish
    clearcoat: 0.3, // Subtle glossy top layer
    clearcoatRoughness: 0.6, // Diffuse reflection
    side: THREE.DoubleSide,
    },
    text:{
        color: colors.text,
        metalness: 0.0, // Non-metallic
    roughness: 0.2, // Slight gloss
    emissive: 0xffffff, // Subtle glow to highlight text
    emissiveIntensity: 0.05,
    side: THREE.DoubleSide,
    },
    digitPlate:{
        color: colors.digitPlate,
        metalness: 0.2,
        roughness: 0.4,
        clearcoat: 0.8,
        clearcoatRoughness: 0.2,
        side: THREE.DoubleSide,
    }
}

export { dimensions, colors, constants,materials };
