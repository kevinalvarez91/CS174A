import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';


const scene = new THREE.Scene();

//THREE.PerspectiveCamera( fov angle, aspect ratio, near depth, far depth );
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
camera.position.set(0, 5, 10);
controls.target.set(0, 5, 0);

// Rendering 3D axis
const createAxisLine = (color, start, end) => {
    const geometry = new THREE.BufferGeometry().setFromPoints([start, end]);
    const material = new THREE.LineBasicMaterial({ color: color });
    return new THREE.Line(geometry, material);
};
const xAxis = createAxisLine(0xff0000, new THREE.Vector3(0, 0, 0), new THREE.Vector3(3, 0, 0)); // Red
const yAxis = createAxisLine(0x00ff00, new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 3, 0)); // Green
const zAxis = createAxisLine(0x0000ff, new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, 3)); // Blue
scene.add(xAxis);
scene.add(yAxis);
scene.add(zAxis);


// ***** Assignment 2 *****
// Setting up the lights
const pointLight = new THREE.PointLight(0xffffff, 100, 100);
pointLight.position.set(5, 5, 5); // Position the light
scene.add(pointLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(0.5, .0, 1.0).normalize();
scene.add(directionalLight);

const ambientLight = new THREE.AmbientLight(0x505050);  // Soft white light
scene.add(ambientLight);

const phong_material = new THREE.MeshPhongMaterial({
    color: 0x00ff00, // Green color
    shininess: 100   // Shininess of the material
});


// Start here.

const l = 0.5
const positions = new Float32Array([
    // Front face done
    -l, -l, l, // 0
    l, -l, l, // 1
    l, l, l, // 2
    -l, l, l, // 3

    // Left face done
    -l, -l, -l, // 4
    -l, -l, l, // 5
    -l, l, l, // 6 
    -l, l, -l, // 7

    // Top face done
    l, l, l, // 8
    l, l, -l,  // 9
    -l, l, -l,  // 10
    -l, l, l, // 11

    // Bottom face NOT DONE
    -l, -l, l, //12
    -l, -l, -l,  // 13
    l, -l, -l, // 14
    l, -l, l, //15
    // Right face
    l, l, l,  //16
    l, -l, l, //17
    l, -l, -l, //18
    l, l, -l, //19

    // Back face done
    -l, -l, -l, //20
    -l, l, -l,  //21
    l, l, -l,  //22
    l, -l, -l //23

]);

const indices = [
    // Front face
    0, 1, 2,
    0, 2, 3,

    // Left face
    4, 5, 6,
    4, 6, 7,

    // Top face
    8, 9, 10,
    8, 10, 11,

    // Bottom face
    12, 13, 14,
    12, 14, 15,

    // Right face
    16, 17, 18,
    16, 18, 19,

    // Back face
    20, 21, 22,
    20, 22, 23
];

// Compute normals
const normals = new Float32Array([
    // Front face
    0, 0, 1,
    0, 0, 1,
    0, 0, 1,
    0, 0, 1,

    // Left face
    -1, 0, 0,
    -1, 0, 0,
    -1, 0, 0,
    -1, 0, 0,

    // Top face
    0, 1, 0,
    0, 1, 0,
    0, 1, 0,
    0, 1, 0,

    // Bottom face
    0, -1, 0,
    0, -1, 0,
    0, -1, 0,
    0, -1, 0,

    // Right face
    1, 0, 0,
    1, 0, 0,
    1, 0, 0,
    1, 0, 0,

    // Back face
    0, 0, -1,
    0, 0, -1,
    0, 0, -1,
    0, 0, -1

]);

const wireframe_vertices = new Float32Array([
    // Front face
    -l, -l, l,
    l, -l, l,
    l, -l, l,
    l, l, l,
    l, l, l,
    -l, l, l,
    -l, l, l,
    -l, -l, l,
    // left face
    -l, -l, -l, 
    -l, -l, l,
    -l, -l, l, 
    -l, l, l, 
    -l, l, l, 
    -l, l, -l, 
    -l, l, -l, 
    -l, -l, -l,
    // top face
    l, l, -l, 
    l, l, l, 
    l, l, l, 
    -l, l, l, 
    -l, l, l, 
    -l, l, -l, 
    -l, l, -l, 
    l, l, -l,
    //bottom face
    -l, -l, l, 
    l, -l, l, 
    l, -l, l, 
    l, -l, -l, 
    l, -l, -l, 
    -l, -l, -l, 
    -l, -l, -l, 
    -l, -l, l, 
    //right face
    l, l, l, 
    l, -l, l, 
    l, -l, l, 
    l, -l, -l, 
    l, -l, -l, 
    l, l, -l, 
    l, l, -l, 
    l, l, l, 
    //back face
    -l, -l, -l, 
    l, -l, -l, 
    l, -l, -l, 
    l, l, -l, 
    l, l, -l, 
    -l, l, -l, 
    -l, l, -l, 
    -l, -l, -l
]);


//this is for green material
const custom_cube_geometry = new THREE.BufferGeometry();
custom_cube_geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
custom_cube_geometry.setAttribute('normal', new THREE.BufferAttribute(normals, 3));
custom_cube_geometry.setIndex(new THREE.BufferAttribute(new Uint16Array(indices), 1));

// TODO: Implement wireframe geometry
const wireframe_geometry = new THREE.BufferGeometry(); 
wireframe_geometry.setAttribute('position', new THREE.BufferAttribute(wireframe_vertices, 3));
const wireframe_material = new THREE.LineBasicMaterial({ color: 0xff0000 });


// TODO: Implement the other transformation functions.
//translationMatrix
function translationMatrix(tx, ty, tz) {
    return new THREE.Matrix4().set(
        1, 0, 0, tx,
        0, 1, 0, ty,
        0, 0, 1, tz,
        0, 0, 0, 1
    );
}
//rotation about z-axis
function rotationMatrixZ(theta) {
    const cosTheta = Math.cos(theta);
    const sinTheta = Math.sin(theta);
    return new THREE.Matrix4().set(
        cosTheta, -sinTheta, 0, 0,
        sinTheta, cosTheta, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    );
}
//scaling matrix
function scalingMatrix(sx, sy, sz) {
    return new THREE.Matrix4().set(
        sx, 0, 0, 0,
        0, sy, 0, 0,
        0, 0, sz, 0,
        0, 0, 0, 1
    );
}




let cubes = [];
let cubes_wireframe = [];
for (let i = 0; i < 7; i++) {

    //this is regular material
    let cube = new THREE.Mesh(custom_cube_geometry, phong_material);
	cube.matrixAutoUpdate = false;
	cubes.push(cube);
	scene.add(cube);

    //this is wireframe
    const wireframe_cube = new THREE.LineSegments(wireframe_geometry, wireframe_material);
    wireframe_cube.matrixAutoUpdate = false;
    cubes_wireframe.push(wireframe_cube);
    scene.add(wireframe_cube);
}

//hiding all cubes
for(let i = 0; i < cubes.length; i++){
    cubes_wireframe[i].visible = false;
    //starting to visually output the mesh
    cubes[i].visible = true;
}

// TODO: Transform cubes
// for translation and scaling
const scaleFactorY = 1.5;
const translation = translationMatrix(0, 2 * scaleFactorY * l, 0); //translate 3l units in the y-direction
const scaler = scalingMatrix(1, scaleFactorY, 1); //scale height by 1.5
let model_transformation = new THREE.Matrix4(); // initalize transformation matrix for mesh cube
let model_transformation2 = new THREE.Matrix4(); // initalize transformation matrix for wireframe cube

const centerToTopLeft = translationMatrix(l, scaleFactorY * l, 0);
const topLeftToCenter = translationMatrix(-l, -scaleFactorY * l, 0);

//for rotation as a function of time
let animation_time = 0;
let delta_animation_time;
let rotation_angle;
const clock = new THREE.Clock();
const MAX_ANGLE = 10 * Math.PI / 180; 
const T = 3; 

 function animate() {
      //continue the animation
      requestAnimationFrame(animate);
    delta_animation_time = clock.getDelta();

    if (!still) {
        //only update the animation if still is false
        animation_time += delta_animation_time;
        rotation_angle = MAX_ANGLE * (0.5 * (1 + Math.sin((2 * Math.PI / T) * animation_time)));
    } else {
        // If still is true, set rotation_angle to MAX_ANGLE
        rotation_angle = MAX_ANGLE;
    }

    let animatedAngle = rotationMatrixZ(rotation_angle);
    
    for (let i = 0; i < cubes.length; i++) {
        if (i === 0) {
            //identity to make sure matrix is just 1 to start
            model_transformation.identity(); 
            model_transformation2.identity();
            //scaling
            model_transformation.multiplyMatrices(scaler, model_transformation); 
            model_transformation2.multiplyMatrices(scaler, model_transformation2);
            //copying
            cubes[i].matrix.copy(model_transformation); //copy the transformation to the first cube of mesh
            cubes_wireframe[i].matrix.copy(model_transformation2); //copy the transformation to the first cube of wireframe

        } else {
            //center to bottom left bottomLeftToCenter
            model_transformation.multiplyMatrices(centerToTopLeft, model_transformation);
            model_transformation2.multiplyMatrices(centerToTopLeft, model_transformation2);
            //animated rotation
            model_transformation.multiplyMatrices(animatedAngle, model_transformation);
            model_transformation2.multiplyMatrices(animatedAngle, model_transformation2);
            //bottom left to center 
            model_transformation.multiplyMatrices(topLeftToCenter, model_transformation);
            model_transformation2.multiplyMatrices(topLeftToCenter, model_transformation2);
            //verticla translation upward
            model_transformation.multiplyMatrices(translation, model_transformation); 
            model_transformation2.multiplyMatrices(translation, model_transformation2); 
            //copying model_transformation into the array's
            cubes[i].matrix.copy(model_transformation); 
            cubes_wireframe[i].matrix.copy(model_transformation2);   
        }
    }

     //render the scene and update controls
     renderer.render(scene, camera);
     controls.update();
 }

renderer.setAnimationLoop(animate);


// TODO: Add event listener
let still = false;
window.addEventListener('keydown', onKeyPress); // onKeyPress is called each time a key is pressed
//function to handle keypress
function onKeyPress(event) {
    switch (event.key) {
        case 'w': //note we only do this if w is pressed.
            for(let i = 0; i < cubes.length; i++){
                cubes[i].visible = !cubes[i].visible;
                cubes_wireframe[i].visible = !cubes[i].visible;
            }
            break;
        case 's':
            still = !still;
            break;
        default:
            console.log(`Key ${event.key} pressed`);
    }
}