import * as THREE from 'three';

class Flag extends THREE.Mesh {
  constructor(geometry, material, windSpeed = { x: 1, y: 1, z: 1 }) {
    super(geometry, material);

    // Initial properties
    this.windSpeed = windSpeed; // Stores wind speed properties
    this.clock = new THREE.Clock(); // Internal clock for time tracking
    this.rotation.set(-0.1, 0, 0); // Initial rotation

    // Clone initial vertex positions for reuse
    this.originalPositions = this.geometry.attributes.position.array.slice();
  }

  /**
   * Async factory method to create a Flag instance.
   * @param {string} textureUrl - The URL of the flag's texture.
   * @param {Object} windSpeed - Initial wind speed {x, y, z}.
   * @returns {Promise<Flag>} - A promise that resolves to a Flag instance.
   */
  static async create(textureUrl, windSpeed = { x: 1, y: 1, z: 1 },flagGeometry=[5, 3, 50, 30]) {
    const geometry = new THREE.PlaneGeometry(...flagGeometry);

    const texture = await new Promise((resolve, reject) => {
      new THREE.TextureLoader().load(
        textureUrl,
        (loadedTexture) => resolve(loadedTexture),
        undefined,
        (error) => reject(error)
      );
    });

    const material = new THREE.MeshBasicMaterial({
      opacity: 1, // Set to 1 after the texture is loaded
      transparent: true,
      map: texture,
      side : THREE.DoubleSide
    });

    return new Flag(geometry, material, windSpeed);
  }

  /**
   * Update the flag oscillations based on current wind speed.
   */
  wave() {
    const time = this.clock.getElapsedTime();

    const position = this.geometry.attributes.position;
    const original = this.originalPositions;

    // Loop through each vertex
    for (let i = 0; i < position.count; i++) {
      const x = original[i * 3]; // x-coordinate
      const y = original[i * 3 + 1]; // y-coordinate
      const z = original[i * 3 + 2]; // z-coordinate (not used in the original flag)

      const multiplier = ((x + 2.5) / 5); // Normalize multiplier based on x
      const wave1 = 0.5 * Math.sin(0.5 * x + time * this.windSpeed.x);
      const wave2 = 0.2 * Math.sin(2 * x + time * this.windSpeed.y);

      // Update z-coordinate for the waving effect
      position.setXYZ(i, x, y, (wave1 + wave2) * multiplier * this.windSpeed.z);
    }

    position.needsUpdate = true; // Notify Three.js of geometry changes
  }
  
  
  

  /**
   * Update the wind speed properties dynamically.
   * @param {Object} newWindSpeed - The new wind speed properties {x, y, z}.
   */
  setWindProps(newWindSpeed) {
    this.windSpeed = { ...this.windSpeed, ...newWindSpeed }; // Merge with existing wind speed
  }
}

export default Flag;
