import * as THREE from 'three';
import Flag from './geometry/flag';
import Pole from './geometry/pole';

class CornerFlag extends THREE.Group {
  constructor(flag, pole) {
    super(); // Call THREE.Group constructor

    // Add pole and flag to the group
    this.add(pole);
    this.add(flag);

    // Position the flag relative to the pole
    flag.position.set(0, pole.geometry.parameters.height - 0.5, 0.1); // Adjust flag position as needed
    this.flag = flag; // Save reference to the flag
  }

  /**
   * Updates the flag's oscillations.
   */
  wave() {
    if (this.flag) {
      this.flag.wave();
    }
  }

  /**
   * Updates the wind speed of the flag.
   * @param {Object} newWindSpeed - The new wind speed properties {x, y, z}.
   */
  setWindProps(newWindSpeed) {
    if (this.flag && typeof this.flag.setWindProps === 'function') {
      this.flag.setWindProps(newWindSpeed);
    }
  }

  /**
   * Asynchronously creates a CornerFlag instance.
   * @param {string} flagTextureUrl - The URL of the flag's texture.
   * @param {string|null} poleTextureUrl - The URL of the pole's texture (optional).
   * @param {number} poleRadius - The radius of the pole.
   * @param {number} poleHeight - The height of the pole.
   * @param {Object} windSpeed - Initial wind speed {x, y, z}.
   * @param {Object} poleTextureRepeat - Texture repeat options for the pole {x, y}.
   * @returns {Promise<CornerFlag>} - A promise that resolves to a CornerFlag instance.
   */
  static async create(
    flagTextureUrl,
    poleTextureUrl = null,
    flagGeometry=[5, 3, 50, 30],
    poleRadius = 0.05,
    poleHeight = 5,
    windSpeed = { x: 1, y: 1, z: 1 },
    poleTextureRepeat = { x: 1, y: 1 }
  ) { 
    // Create the flag
    // Create the flag
const flag = await Flag.create(flagTextureUrl, windSpeed, flagGeometry);

// Create the pole
const pole = await Pole.create(poleRadius, poleHeight, poleTextureUrl, poleTextureRepeat);

// Calculate the flag's position relative to the pole
const flagWidth = flagGeometry[0]; // Width of the flag
const flagHeight = flagGeometry[1]; // Height of the flag

// Position the flag so its left edge aligns with the pole and it's centered vertically

// Return the assembled CornerFlag
const cornerFlag = new CornerFlag(flag, pole);
flag.position.set(+flagWidth / 2, poleHeight - flagHeight/2, 0);
cornerFlag.position.set(0, 0, 0); // Adjust position as needed
return cornerFlag;

  }
}

async function createCornerFlags() {
  const cornerFlags = new THREE.Group();

  const flagGeometry = [5, 3, 50, 30];
  const poleRadius = 0.05;
  const poleHeight = 10;
  const windSpeed = { x: 2, y: 3, z: 1 };
  const poleTextureRepeat = { x: 2, y: 5 };

  // Create four corner flags
  const flags = await Promise.all([
    CornerFlag.create('textures/flag.jpg', 'textures/aluminium.jpg', flagGeometry, poleRadius, poleHeight, windSpeed, poleTextureRepeat),
    CornerFlag.create('textures/flag.jpg', 'textures/aluminium.jpg', flagGeometry, poleRadius, poleHeight, windSpeed, poleTextureRepeat),
    CornerFlag.create('textures/flag.jpg', 'textures/aluminium.jpg', flagGeometry, poleRadius, poleHeight, windSpeed, poleTextureRepeat),
    CornerFlag.create('textures/flag.jpg', 'textures/aluminium.jpg', flagGeometry, poleRadius, poleHeight, windSpeed, poleTextureRepeat),
  ]);

  // Position flags at pitch corners
  const pitchOffset = 50; // Translate by 50 units in x and z
  flags[0].position.set(-pitchOffset, 0, -pitchOffset); // Bottom-left corner
  flags[1].position.set(pitchOffset, 0, -pitchOffset);  // Bottom-right corner
  flags[2].position.set(-pitchOffset, 0, pitchOffset);  // Top-left corner
  flags[3].position.set(pitchOffset, 0, pitchOffset);   // Top-right corner

  // Add flags to the group
  flags.forEach((flag) => cornerFlags.add(flag));

  // Add wave method to the group
  cornerFlags.wave = function (newWindSpeed = windSpeed) {
    flags.forEach((flag) => {
      flag.setWindProps(newWindSpeed);
      flag.wave();
    });
  };

  return cornerFlags;
}
const cornerFlags = await createCornerFlags();
export default cornerFlags;
