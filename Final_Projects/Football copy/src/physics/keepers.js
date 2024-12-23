import * as THREE from 'three';
let goalie1Direction = 1;
let goalie2Direction = -1;
import camera from '../camera';
function moveGoalies(leftGoalie,rightGoalie,delta) {
    const upperBound = 5;
    const lowerBound = -5;
    const speed = 2;

    const cameraDirection = camera.getWorldDirection(new THREE.Vector3()).x;

    if (cameraDirection < 0) {
        leftGoalie.position.z += speed * delta * goalie1Direction;
        if (leftGoalie.position.z > upperBound) {
            leftGoalie.position.z = upperBound;
            goalie1Direction *= -1;
        } else if (leftGoalie.position.z < lowerBound) {
            leftGoalie.position.z = lowerBound;
            goalie1Direction *= -1;
        }
    } else {
        rightGoalie.position.z += speed * delta * goalie2Direction;
        if (rightGoalie.position.z > upperBound) {
            rightGoalie.position.z = upperBound;
            goalie2Direction *= -1;
        } else if (rightGoalie.position.z < lowerBound) {
            rightGoalie.position.z = lowerBound;
            goalie2Direction *= -1;
        }
    }
}
export { moveGoalies };