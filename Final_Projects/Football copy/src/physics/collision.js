import * as THREE from 'three';
import { ballRadius, ballVelocity } from '../geometry/ball/football.js';
import { bounce, goal1, goal2 } from '../audio/audio.js';

export function detectCollision(camera, football) {
    const cameraPosition = new THREE.Vector3().copy(camera.position);
    const ballPosition = new THREE.Vector3().copy(football.position);

    const distance = cameraPosition.distanceTo(ballPosition);

    if (distance <= ballRadius + 1.6) {
        const cameraDirection = new THREE.Vector3();
        let force_factor = 5;
        camera.getWorldDirection(cameraDirection);
        if (cameraDirection.y < 0) {
            cameraDirection.y = 0;
        }
        ballVelocity.add(cameraDirection.multiplyScalar(force_factor));
        bounce.setVolume(1.0);
        bounce.stop();
        bounce.play();
    }
}

export let score = 0;
let hasScored = false;
export let bounceFactor = 0.6;

export function checkWallCollision(walls, football, scoreElement, camera, resetPositions,game) {
    if (camera.position.x <= walls.left) {
        camera.position.x = walls.left;
    }
    if (camera.position.z <= walls.front) {
        camera.position.z = walls.front;
    }
    if (camera.position.x >= walls.right) {
         camera.position.x = walls.right;
    }
    if (camera.position.z >= walls.back) {
        camera.position.z = walls.back ;
    }

    let volumeX = Math.min(1.2, 0.1 * Math.abs(ballVelocity.x));
    let volumeZ = Math.min(1.2, 0.1 * Math.abs(ballVelocity.z));
    // Left wall collision (with left net handling)
    if (football.position.x <= walls.left) {
        const isWithinLeftNetOpening = (
            football.position.z >= -10 && football.position.z <= 10 && // Z range of the left net
            football.position.y >= 0 && football.position.y <= 8      // Y range of the left net
        );

        if (isWithinLeftNetOpening) {
            if (!hasScored) {
                game.score('home');
                console.log("You scored a point on the left net");
                hasScored = true;
                if (scoreElement) {
                    const currentScore = parseInt(scoreElement.textContent) || 0;
                    scoreElement.textContent = currentScore + 1;
                }
                resetPositions();
                goal1.play()
                hasScored = false; // Reset scoring ability immediately after resetting positions
            }
            // Prevent bouncing by not reversing velocity when in goal area
            return;
        }

        else if (football.position.y > 9) {
            resetPositions();
            return;
        }
        
        // Normal wall bounce if not in goal area
        football.position.x = walls.left;
        bounce.position.set(football.position.x, football.position.y, football.positionz);
        bounce.setVolume(volumeX);
        ballVelocity.x *= -bounceFactor;
        bounce.stop();
        bounce.play();
    }

    // Right wall collision (with right net handling)
    else if (football.position.x >= walls.right) {
        const isWithinRightNetOpening = (
            football.position.z >= -10 && football.position.z <= 10 &&
            football.position.y >= 0 && football.position.y <= 8
        );

        if (isWithinRightNetOpening) {
            if (!hasScored) {
                game.score('guest');
                console.log("You scored a point on the right net");
                hasScored = true;
                if (scoreElement) {
                    const currentScore = parseInt(scoreElement.textContent) || 0;
                    scoreElement.textContent = currentScore + 1;
                }
                resetPositions();
                goal2.play();
                hasScored = false; // Reset scoring ability immediately after resetting positions
            }
            // Prevent bouncing by not reversing velocity when in goal area
            return;
        }
        
        else if (football.position.y > 9) {
            resetPositions();
            return;
        }

        // Normal wall bounce if not in goal area
        football.position.x = walls.right;
        bounce.position.set(football.position.x, football.position.y, football.positionz);
        bounce.setVolume(volumeX);
        ballVelocity.x *= -bounceFactor;
        bounce.stop();
        bounce.play();
    }

    // Front wall collision
    if (football.position.z <= walls.front) {
        if (football.position.y > 9) {
            resetPositions();
            return;
        }
        football.position.z = walls.front;
        bounce.position.set(football.position.x, football.position.y, football.positionz);
        bounce.setVolume(volumeZ);
        ballVelocity.z *= -bounceFactor;
        bounce.stop();
        bounce.play();
        // Reset hasScored when moving away from goal area
        if (football.position.z > -10 && football.position.z < 10) {
            hasScored = false;
        }
    }

    // Back wall collision
    else if (football.position.z >= walls.back) {
        if (football.position.y > 9) {
            resetPositions();
            return;
        }
        football.position.z = walls.back;
        bounce.position.set(football.position.x, football.position.y, football.positionz);
        bounce.setVolume(volumeZ);
        ballVelocity.z *= -bounceFactor;
        bounce.stop();
        bounce.play();
        
        // Reset hasScored when moving away from goal area
        if (football.position.z > -10 && football.position.z < 10) {
            hasScored = false;
        }
    }
}

export function checkNetCollision(nets, football) {
    // Loop through each net to check collisions
    nets.forEach((net) => {
        const { left, right, front, back, bottom, top } = net;

        // Check if the football is inside the net boundaries
        const isInsideNet = (
            football.position.x >= left && football.position.x <= right &&  // X boundaries
            football.position.z >= front && football.position.z <= back && // Z boundaries
            football.position.y >= bottom && football.position.y <= top    // Y boundaries
        );

        if (isInsideNet) {
            // Optionally handle net side collisions if needed
            if (football.position.x <= left) {
                football.position.x = left;
            } else if (football.position.x >= right) {
                football.position.x = right;
            }
        }
    });
}





// nested array since multiple spheres for each person
export const boundingBoxes = [];
export const visibleBoxes = [];
export const footballBounding = new THREE.Sphere(new THREE.Vector3(0, 2, 0), ballRadius);
// for visuals
const sphereGeom = new THREE.SphereGeometry(0.6, 8, 8);
const boundMaterial = new THREE.MeshBasicMaterial({color: new THREE.Color('red')});


// both arrays are essentially identical
export function addBoundingBox(person = THREE.Group) {
    let boundingBox = [];
    let visibleBox = [];
    // stack 5 spheres into inner array
    for (let i = 0; i < 5; i++) {
        let boundingSphere = new THREE.Sphere(person.position.clone(), 0.6);
        let visibleSphere = new THREE.Mesh(sphereGeom, boundMaterial);
        visibleSphere.visible = false;
        boundingSphere.center.y += (i * 0.8 - 0.5);
        visibleSphere.position.x = boundingSphere.center.x;
        visibleSphere.position.y = boundingSphere.center.y;
        visibleSphere.position.z = boundingSphere.center.z;
        visibleBox.push(visibleSphere);
        boundingBox.push(boundingSphere);
    }
    // push spheres(person) into outer array
    visibleBoxes.push(visibleBox);
    boundingBoxes.push(boundingBox);
}

export function checkKeeperCollision() {
    for (let thisPerson of boundingBoxes) {
        for (let boundings of thisPerson) {
            if (boundings.intersectsSphere(footballBounding)) {
                // using ReflectionVec = Vec - 2(Vec dot Normal) * Normal
                let normalVector = new THREE.Vector3();
                normalVector.subVectors(footballBounding.center, boundings.center);
                normalVector.normalize();
                let deflection = ballVelocity.dot(normalVector);
                deflection *= 2.0;
                normalVector.multiplyScalar(deflection);
                // Ball's velocity is reflected away -- means no collision when ball is still!!!!
                ballVelocity.sub(normalVector);
                bounce.stop();
                bounce.play();
                break;
            }
        }
    }
}

export function toggleBoundingVis() {
    for (let i = 0; i < visibleBoxes.length; i++) {
        for (let j = 0; j < visibleBoxes[i].length; j++) {
            visibleBoxes[i][j].visible =!visibleBoxes[i][j].visible;
        }
    }
}


export * from './collision.js';
