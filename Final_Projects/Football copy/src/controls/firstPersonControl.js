import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';
import { velocity,direction } from '../physics/state';
import { moveSpeed } from '../physics/constants';
const controlsBuilder = (camera, document) => {
    let controller = {};
    const controls = new PointerLockControls(camera, document.body);

    document.addEventListener('click', () => {
        controls.lock();
    });
    
    controller.controls = controls;

    const keyState = {};
    document.addEventListener('keydown', (event) => {
        keyState[event.code] = true;
    });
    document.addEventListener('keyup', (event) => {
        keyState[event.code] = false;
    });

    controller.keyState = keyState;

    function handleMovement(delta) {
        direction.set(0, 0, 0);

        if (keyState['KeyW']) direction.z += 1; // Forward
        if (keyState['KeyS']) direction.z -= 1; // Backward
        if (keyState['KeyA']) direction.x -= 1; // Left
        if (keyState['KeyD']) direction.x += 1; // Right

        direction.normalize(); // Prevent diagonal movement from being faster
        velocity.x = direction.x * moveSpeed * delta;
        velocity.z = direction.z * moveSpeed * delta;

        controls.moveRight(velocity.x); // Move left/right
        controls.moveForward(velocity.z); // Move forward/backward
    }
    controller.handleMovement = handleMovement;

    return controller;
}

export default controlsBuilder;