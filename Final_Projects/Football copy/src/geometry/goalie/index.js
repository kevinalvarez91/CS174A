import { createHumanParts } from "./humanParts";
import * as THREE from 'three';

const goalie = ({ position = {}, rotation = {},team='' } = {}) => {
    const keeper = new THREE.Group();
    const humanParts = createHumanParts({ team });
    humanParts.forEach(part => keeper.add(part.clone()));

    keeper.position.set(position.x || 0, position.y || 0, position.z || 0);
    keeper.rotation.set(rotation.x || 0, rotation.y || 0, rotation.z || 0);

    return keeper;
}

export { goalie };
