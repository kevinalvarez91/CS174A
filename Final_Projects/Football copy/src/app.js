import * as THREE from 'three';
import * as COLLISIONS  from './physics/collision.js';
import controlsBuilder from './controls/firstPersonControl.js';
import camera from './camera/index.js';
import { floor, animateGrass, dirtFloor } from './geometry/pitch/floor.js';
import customFootball, { ballRadius, ballVelocity, mass } from './geometry/ball/football.js';
import sky from './geometry/sky/sky.js';
import lighting from './lighting/index.js';
import { gravity, friction } from './physics/constants.js';
import loadNets from './geometry/nets/nets.js';
import { goalie as createGoalie } from './geometry/goalie/index.js';
import { createGoalies } from './geometry/people.js';
import walls from './physics/walls.js';
import nets from './physics/nets.js';
import { detectCollision, checkWallCollision, checkNetCollision, bounceFactor, score } from './physics/collision.js';
import sun from './geometry/sun/sun.js';
import { moveGoalies } from './physics/keepers.js';
import loadBleachers from './geometry/bleachers/bleachers.js';
import { listener, background, bounce, crowd1, crowd2, goal1, goal2, wind, soundLoader } from './audio/audio.js'
import scoreBoard from './geometry/scoreboard/index.js';
import game from './controls/game.js';
import { min } from 'three/webgpu';
import cornerFlag from './geometry/cornerFlag/index.js';
import { addCrowd } from './geometry/crowd.js';


const scoreElement = document.getElementById('score');

// Basic setup
const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('threejs-canvas') });
renderer.setSize(window.innerWidth, window.innerHeight);

// First person controls
const controller = controlsBuilder(camera, document);

// Add floor
scene.add(floor);

// Add Dirt
scene.add(dirtFloor);

// Add soccer ball
const football = customFootball;
scene.add(football);

// Add sky
scene.add(sky);

// Add lighting
lighting.forEach(light => scene.add(light));

// Add sun
scene.add(sun);

// Clock
const clock = new THREE.Clock();

// Add Sound
let volumeDistance = 999.9;
camera.add(listener);
football.add(bounce);

// Load soccer nets (modeled in Blender)
const { left: netLeft, right: netRight } = await loadNets();
scene.add(netLeft);
scene.add(netRight);

// load bleachers
const { left: bleacherLeft1, right: bleacherRight1, left1: bleacherLeft2, right1: bleacherRight2 } = await loadBleachers();
scene.add(bleacherLeft1);
scene.add(bleacherRight1);
scene.add(bleacherLeft2);
scene.add(bleacherRight2);

// Add goalies
const goalie1 = createGoalie({ position: { x: -37, y: 1.3 }, rotation: { y: Math.PI / 2 },team:'guest' });
scene.add(goalie1);

const goalie2 = createGoalie({ position: { x: 37, y: 1.3 }, rotation: { y: -Math.PI / 2 },team:'home' });
scene.add(goalie2);

//Flag
scene.add(cornerFlag);

//Scoreboard
scene.add(scoreBoard)
// Add bounding boxes for the goalies
const goalies = [goalie1, goalie2];
for (let keeper of goalies) {
    COLLISIONS.addBoundingBox(keeper);
}
for (let keeper of COLLISIONS.visibleBoxes) {
    for (let balls of keeper) {
        scene.add(balls);
    }
}


function updateBoundings() {
    COLLISIONS.footballBounding.center = football.position;
    for (let i = 0; i < COLLISIONS.boundingBoxes.length; i++) {
        for (let j = 0; j < COLLISIONS.boundingBoxes[i].length; j++) {
            COLLISIONS.boundingBoxes[i][j].center.x = goalies[i].position.x;
            COLLISIONS.boundingBoxes[i][j].center.z = goalies[i].position.z;
            COLLISIONS.visibleBoxes[i][j].position.x = COLLISIONS.boundingBoxes[i][j].center.x;
            COLLISIONS.visibleBoxes[i][j].position.y = COLLISIONS.boundingBoxes[i][j].center.y;
            COLLISIONS.visibleBoxes[i][j].position.z = COLLISIONS.boundingBoxes[i][j].center.z;
        }
    }
}



// Crowd
addCrowd(scene, createGoalies);

// Reset positions function
function resetPositions() {
    // Reset ball position
    football.rotation.set(0, 0, 0);
    football.position.set(0, 2.3, 0);
    ballVelocity.set(0, 0, 0);

    // Reset camera position
    camera.position.set(-4, 2.7, 0);
}
let elapse = 0;

let elapsedTime = 0; // Accumulator
let updateInterval = 1;
let homeScore = 0;
let guestScore = 0;
function animate() {
    requestAnimationFrame(animate);
    animateGrass();
    const delta = clock.getDelta();
    elapse += delta;
    const frequency = 1 / 3; // Complete one oscillation every 3 seconds
    const angle = 2 * Math.PI * frequency * elapse; // Circular oscillation

    // Magnitude oscillates between small (0.5) and large (3.0)
    const magnitude = 1.75 + 1.25 * Math.sin(frequency * elapse * Math.PI);

    // Wind speed in circular motion
    const windSpeed = {
      x: magnitude * Math.cos(angle), // Circular x
      y: 0, // Wind in y-axis remains constant
      z: magnitude * Math.sin(angle), // Circular z
    };

    // Update wind speed for all flags
    cornerFlag.wave(windSpeed);
    camera.position.y = 2.7;
    controller.handleMovement(delta);

    moveGoalies(goalie1, goalie2, delta);

    //gravitiy
    ballVelocity.y += gravity * delta;

    //update ball position
    football.position.add(ballVelocity.clone().multiplyScalar(delta));

    checkSounds();
    updateBoundings();

    const floorLevel = 1;
    if (football.position.y < floorLevel) {
        football.position.y = floorLevel;
        ballVelocity.x *= friction;
        ballVelocity.z *= friction;
        if (ballVelocity.y > -0.1) {
            ballVelocity.y = 0;
        }
        else {
            ballVelocity.y *= -COLLISIONS.bounceFactor;
            let volumeY = Math.min(1.2, 0.1 * Math.abs(ballVelocity.y));
            bounce.setVolume(volumeY);
            bounce.stop();
            bounce.play();
        }
        
    }
    COLLISIONS.checkKeeperCollision();
    COLLISIONS.detectCollision(camera, football);
    COLLISIONS.checkWallCollision(walls, football, scoreElement, camera, resetPositions,game);
    COLLISIONS.checkNetCollision(nets, football, ballVelocity);

    // to simulate a ball rolling on the ground(for the texture)
    if (ballVelocity.length() != 0) {
        const rotationAxis = new THREE.Vector3(ballVelocity.z, 0, -ballVelocity.x);
        const angularVelocity = rotationAxis.length() / ballRadius;
        rotationAxis.normalize();
        football.rotateOnWorldAxis(rotationAxis, angularVelocity * delta);
    }

    sun.rotateY(0.5 * delta);

    renderer.render(scene, camera);
}

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

//audio doesn't start playing until you kick the ball - so I added click to resume sound
window.addEventListener('click', function () {
    listener.context.resume();
});

window.addEventListener('keydown', function (event) {
    if (event.key == 'b' || event.key == 'B') {
        COLLISIONS.toggleBoundingVis();
        console.log("YOU CAN'T SEE ME");
    }
});

//Audio Function
function checkSounds() {
    //choose which bleacher the sounds are coming from
    if (camera.position.x > 0) {
        bleacherLeft1.add(crowd1);
        bleacherLeft1.add(goal1);
        bleacherRight2.add(crowd2);
        bleacherRight2.add(goal2);
    }
    else {
        bleacherLeft2.add(crowd1);
        bleacherLeft2.add(goal1);
        bleacherRight1.add(crowd2);
        bleacherRight1.add(goal2);
    }

    let bleachersLeft = [bleacherLeft1, bleacherLeft2];
    let bleachersRight = [bleacherRight1, bleacherRight2];
    //using dot product of the directions to trigger the chants
    for (let bleacher of bleachersLeft) {
        let bleacherPosition = new THREE.Vector3().subVectors(bleacher.position, camera.position);
        bleacherPosition.x += 20.0;
        let viewDirection = camera.getWorldDirection(new THREE.Vector3());
        bleacherPosition.normalize();
        viewDirection.normalize();
        let chantTrigger = bleacherPosition.dot(viewDirection);
        if (chantTrigger > 0.999) {
            crowd1.play();
        }
    }
    for (let bleacher of bleachersRight) {
        let bleacherPosition = new THREE.Vector3().subVectors(bleacher.position, camera.position);
        bleacherPosition.x -= 20.0;
        let viewDirection = camera.getWorldDirection(new THREE.Vector3());
        bleacherPosition.normalize();
        viewDirection.normalize();
        let chantTrigger = bleacherPosition.dot(viewDirection);
        if (chantTrigger > 0.999) {
            crowd2.play();
        }
    }
}

animate();