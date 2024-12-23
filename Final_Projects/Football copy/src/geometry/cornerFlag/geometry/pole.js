import * as THREE from 'three';

class Pole extends THREE.Mesh {
  constructor(geometry, material) {
    // Call parent class constructor
    super(geometry, material);
  }

  /**
   * Async factory method to create a Pole instance.
   * @param {number} radius - The radius of the pole.
   * @param {number} height - The height of the pole.
   * @param {string|null} textureUrl - The URL of the texture.
   * @param {Object} textureRepeat - Texture repeat options {x, y}.
   * @returns {Promise<Pole>} - A promise that resolves to a Pole instance.
   */
  static async create(radius = 0.05, height = 5, textureUrl = null, textureRepeat = { x: 1, y: 1 }) {
    const geometry = new THREE.CylinderGeometry(radius, radius, height, 32);
    let material;

    if (textureUrl) {
      const texture = await new Promise((resolve, reject) => {
        new THREE.TextureLoader().load(
          textureUrl,
          (loadedTexture) => {
            loadedTexture.wrapS = THREE.RepeatWrapping;
            loadedTexture.wrapT = THREE.RepeatWrapping;
            loadedTexture.repeat.set(textureRepeat.x, textureRepeat.y);
            resolve(loadedTexture);
          },
          undefined, // onProgress callback (not needed here)
          (error) => reject(error) // onError callback
        );
      });

      material = new THREE.MeshStandardMaterial({ map: texture,side : THREE.DoubleSide });
    } else {
      material = new THREE.MeshStandardMaterial({ color: 0x808080 }); // Default gray color
    }

    const pole = new Pole(geometry, material);
    pole.geometry.translate(0, height / 2, 0); // Position the pole so its base is at y=0
    return pole;
  }
}

export default Pole;
