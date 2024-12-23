import * as THREE from 'three';
import { Teams } from '../common/constants';
//HUMAN CHANGES
//temporary materials


const blackMaterial = new THREE.MeshStandardMaterial({color: 0x000000});
// Define the helper function
function createHumanParts(team='') {
    const material = new THREE.MeshStandardMaterial({color: 0x808080});
    let accessoryMaterial
    if (team.team == 'home') {
        accessoryMaterial = new THREE.MeshStandardMaterial({color: Teams.Home.teamColor});
    }else if (team.team == 'guest') {
        accessoryMaterial = new THREE.MeshStandardMaterial({color: Teams.Guest.teamColor});
    }
    const humanParts = [];
    const headGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    const head = new THREE.Mesh(headGeometry, material);
    head.position.set(0, 2.2, 0);
    humanParts.push(head);

    // body
    const loader = new THREE.TextureLoader();
    let soccerJersryTexture;
    if (team.team == 'home' ){
        soccerJersryTexture = loader.load(Teams.Home.shirtTexture);
    } else if (team.team == 'guest') {
        soccerJersryTexture = loader.load(Teams.Guest.shirtTexture);
    } else {
        soccerJersryTexture = loader.load('textures/soccerTexture.jpg');
    }
    soccerJersryTexture.wrapS = THREE.RepeatWrapping;
    soccerJersryTexture.wrapT = THREE.RepeatWrapping;
    soccerJersryTexture.repeat.set(3, 2); // Flip the texture horizontally

    const bodyMaterial = new THREE.MeshStandardMaterial({ map: soccerJersryTexture });
    const bodyGeometry = new THREE.CylinderGeometry(0.4, 0.4, 1.5, 32);
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.set(0, 1, 0);
    humanParts.push(body);

    //shoulders 
    const shoulderGeometry = new THREE.SphereGeometry(0.17, 16, 16);
    const leftShoulder = new THREE.Mesh(shoulderGeometry, material);
    leftShoulder.position.set(-0.5, 1.75, 0);
    humanParts.push(leftShoulder);

    const rightShoulder = new THREE.Mesh(shoulderGeometry, material);
    rightShoulder.position.set(0.5, 1.75, 0);
    humanParts.push(rightShoulder);

    //arms
    const armGeometry = new THREE.CylinderGeometry(0.1, 0.1, 1, 32);
    const leftArm = new THREE.Mesh(armGeometry, material);
    leftArm.position.set(-0.6, 1.25, 0);
    humanParts.push(leftArm);

    const rightArm = new THREE.Mesh(armGeometry, material);
    rightArm.position.set(0.6, 1.25, 0);
    humanParts.push(rightArm);

    //legs
    const legGeometry = new THREE.CylinderGeometry(0.15, 0.15, 1.5, 32);
    const leftLeg = new THREE.Mesh(legGeometry, material);
    leftLeg.position.set(-0.3, -0.5, 0);
    humanParts.push(leftLeg);

    const rightLeg = new THREE.Mesh(legGeometry, material);
    rightLeg.position.set(0.3, -0.5, 0);
    humanParts.push(rightLeg);

    //eyes
    const eyeGeometry = new THREE.SphereGeometry(0.1, 16, 16);
    const leftEye = new THREE.Mesh(eyeGeometry, blackMaterial);
    leftEye.position.set(-0.15, 2.4, 0.45);
    humanParts.push(leftEye);

    const rightEye = new THREE.Mesh(eyeGeometry, blackMaterial);
    rightEye.position.set(0.15, 2.4, 0.45);
    humanParts.push(rightEye);

    //eyebrows
    const eyebrowGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.3, 16);
    const leftEyebrow = new THREE.Mesh(eyebrowGeometry, blackMaterial);
    leftEyebrow.position.set(-0.15, 2.55, 0.45);
    leftEyebrow.rotation.z = -0.3;
    humanParts.push(leftEyebrow);

    const rightEyebrow = new THREE.Mesh(eyebrowGeometry, blackMaterial);
    rightEyebrow.position.set(0.15, 2.55, 0.45);
    rightEyebrow.rotation.z = 0.3;
    humanParts.push(rightEyebrow);

    //hat
    const hatBrimGeometry = new THREE.CylinderGeometry(0.6, 0.6, 0.1, 32);
    const hatBrim = new THREE.Mesh(hatBrimGeometry, accessoryMaterial);
    hatBrim.position.set(0, 2.7, 0);
    humanParts.push(hatBrim);

    const hatTopGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.5, 32);
    const hatTop = new THREE.Mesh(hatTopGeometry, accessoryMaterial);
    hatTop.position.set(0, 2.95, 0);
    humanParts.push(hatTop);

    return humanParts;
}

export { createHumanParts };