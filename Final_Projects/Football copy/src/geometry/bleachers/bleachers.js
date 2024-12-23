import { GLTFLoader } from "three/examples/jsm/Addons.js";
const loadBleachers = async () => {
    const loader = new GLTFLoader();

    return new Promise((resolve, reject) => {
        loader.load(
            'textures/elevated_bleacher/scene.gltf',
            function(gltf) {
                const model1 = gltf.scene;
                model1.position.set(4.25, 11.5, -70);
                model1.scale.set(3, 3, 3);

                const model2 = model1.clone();
                model2.rotation.y = Math.PI;
                model2.position.set(-4.25, 11.5, 70);
                model2.scale.set(3, 3, 3);
                
                const bleacherLeftClone = model1.clone();
                bleacherLeftClone.position.set(-40.75, 11.5, -70);
                
                const bleacherRightClone = model1.clone();
                bleacherRightClone.rotation.y = Math.PI;
                bleacherRightClone.position.set(40.75,11.5,70);


                resolve({ left: model1, right: model2, left1: bleacherLeftClone, right1: bleacherRightClone});
            },
            undefined,
            function(error) {
                console.error('An error occurred while loading model', error);
                reject(error);
            }
        );
    });
};

export default loadBleachers;