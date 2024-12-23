import { GLTFLoader } from "three/examples/jsm/Addons.js";

const loadNets = async () => {
    const loaders = new GLTFLoader();

    return new Promise((resolve, reject) => {
        loaders.load(
            'models/nets/scene.gltf',
            function(gltf) {
                const model1 = gltf.scene;
                model1.position.set(-53, 0, 0);
                model1.rotation.y = Math.PI / 2;
                model1.scale.set(3, 3, 3);

                const model2 = model1.clone();
                model2.rotation.y = -Math.PI / 2;
                model2.scale.set(3, 3, 3);
                model2.position.set(53, 0, 0);

                resolve({ left: model1, right: model2 });
            },
            undefined,
            function(error) {
                console.error('An error occurred while loading model', error);
                reject(error);
            }
        );
    });
}

export default loadNets;
