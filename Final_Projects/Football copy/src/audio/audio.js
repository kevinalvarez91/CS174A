import * as THREE from 'three';
const listener = new THREE.AudioListener();

//Different sounds
const background = new THREE.Audio(listener);
const bounce = new THREE.PositionalAudio(listener);
const crowd1 = new THREE.PositionalAudio(listener);
const crowd2 = new THREE.PositionalAudio(listener);
const goal1 = new THREE.PositionalAudio(listener);
const goal2 = new THREE.PositionalAudio(listener);
const wind = new THREE.Audio(listener);

const soundLoader = new THREE.AudioLoader();

soundLoader.load('/audio/crowd.mp3', function(buffer){
    background.setBuffer(buffer);
    background.setVolume(0.3);
    background.setLoop(true);
    background.play();
});
soundLoader.load('/audio/footballBounce.mp3', function(buffer) {
    bounce.setBuffer(buffer);
    bounce.setRefDistance(10.0);
    bounce.setMaxDistance(50);
    bounce.setRolloffFactor(0.5);
    bounce.setVolume(0.9);
});

soundLoader.load('/audio/goalClap.mp3', function(buffer) {
    goal1.setBuffer(buffer);
    goal1.setVolume(2.0);
    goal1.setRefDistance(15.0);
});

soundLoader.load('/audio/goalHey.mp3', function(buffer) {
    goal2.setBuffer(buffer);
    goal2.setVolume(2.0);
    goal2.setRefDistance(15.0);
});

soundLoader.load('/audio/lookWestHam.mp3', function(buffer) {
    crowd1.setBuffer(buffer);
    crowd1.setVolume(1.5);
    crowd1.setRefDistance(10.0);
});

soundLoader.load('/audio/lookAtMe.mp3', function(buffer) {
    crowd2.setBuffer(buffer);
    crowd2.setVolume(1.5);
    crowd2.setRefDistance(10.0);
});



export {listener, background, bounce, crowd1, crowd2, goal1, goal2, wind, soundLoader};
