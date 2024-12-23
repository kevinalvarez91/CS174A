import * as THREE from 'three';
import { Teams, Time } from '../common/constants';

// Original floor

const width = 100;
const height = 100;
const lineThickness = 2.0;
const innerBorder = 1.0;
const outerRadius = 10;
const boxDepth = 15.0;
const boxWidth = 35.0;

const floorGeometry = new THREE.PlaneGeometry(width, height);
const loader = new THREE.TextureLoader();
const soccerFieldTexture = loader.load('textures/soccerField.jpeg');
const floorMaterial = new THREE.MeshStandardMaterial({ map: soccerFieldTexture });
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2;
floor.receiveShadow = true;

//dirt
const dirtGeometry = new THREE.PlaneGeometry(width * 10, height * 10);
const dirtLoader = new THREE.TextureLoader();
const dirtTexture = loader.load('textures/dirt.jpg');
const dirtMaterial = new THREE.MeshStandardMaterial({ map: dirtTexture });
const dirtFloor = new THREE.Mesh(dirtGeometry, dirtMaterial);
dirtFloor.rotation.x = -Math.PI / 2;
dirtFloor.position.y = -0.01;
dirtFloor.receiveShadow = true;

// Animated grass
const clock = new THREE.Clock();

const vertexShader = `
    varying vec2 vUv;
    varying vec3 vWorldPosition;
    uniform float time;
    
    void main() {
        vUv = uv;
        
        vec4 mvPosition = vec4(position, 1.0);
        #ifdef USE_INSTANCING
            mvPosition = instanceMatrix * mvPosition;
        #endif
        
        float dispPower = 1.0 - cos(uv.y * 3.1416 / 2.0);
        float displacement = sin(mvPosition.z + time * 10.0) * (0.1 * dispPower);
        mvPosition.z += displacement;
        
        vec4 modelViewPosition = modelViewMatrix * mvPosition;
        gl_Position = projectionMatrix * modelViewPosition;
        
        vWorldPosition = (modelMatrix * mvPosition).xyz;
    }
`;

const fragmentShader = `
    varying vec2 vUv;
    varying vec3 vWorldPosition;
    uniform vec3 lineColor;
    
    void main() {
        vec3 baseColor = vec3(0.31, 0.8, 0.4); // Darker color for grass
        float clarity = (vUv.y * 0.5) + 0.5;

        // Define white line thickness (3 units)
        float lineThickness = ${lineThickness.toFixed(2)};

        // Conditions to check if the current fragment lies within the white line boundaries
        bool inOuterVerticalLine = (abs(vWorldPosition.x) >= ${(height / 2.0 - lineThickness-innerBorder).toFixed(2)} && abs(vWorldPosition.x) <= ${(height/2.0-innerBorder).toFixed(2)});
        bool inOuterHorizontalBounds = (abs(vWorldPosition.z) <= ${(width / 2.0 - innerBorder).toFixed(2)});
        
        bool inOuterHorizontalLine = (abs(vWorldPosition.z) >= ${(width / 2.0 - lineThickness-innerBorder).toFixed(2)} && abs(vWorldPosition.z) <= ${(width/2.0-innerBorder).toFixed(2)});
        bool inOuterVerticalBounds = (abs(vWorldPosition.x) <= ${(height / 2.0 - innerBorder).toFixed(2)});

        bool inMiddleHorizontalLine = ((abs(vWorldPosition.x) <= ${(lineThickness/2.0).toFixed(2)}) && (abs(vWorldPosition.z) >= ${(outerRadius).toFixed(2)}));

        bool inMiddleCircle = (pow(vWorldPosition.x, 2.0) + pow(vWorldPosition.z, 2.0) <= pow(${outerRadius.toFixed(2)}, 2.0) && pow(vWorldPosition.x, 2.0) + pow(vWorldPosition.z, 2.0) >= pow(${(outerRadius-lineThickness).toFixed(2)}, 2.0));

        bool inKickOff = (pow(vWorldPosition.x, 2.0) + pow(vWorldPosition.z, 2.0) <= pow(${lineThickness.toFixed(2)}, 2.0));

        bool inBoxVerticalLine = (abs(vWorldPosition.x) >= ${(height / 2.0 - 2*lineThickness-innerBorder - boxDepth).toFixed(2)} && abs(vWorldPosition.x) <= ${(height / 2.0 - lineThickness-innerBorder - boxDepth).toFixed(2)});
        bool inBoxHorizontalBounds = (abs(vWorldPosition.z) <= ${(boxWidth/2.0+lineThickness).toFixed(2)});
        
        bool inBoxHorizontalLine = (abs(vWorldPosition.z) >= ${(boxWidth / 2.0).toFixed(2)} && abs(vWorldPosition.z) <= ${(boxWidth / 2.0 + lineThickness).toFixed(2)});
        bool inBoxVerticalBounds = (abs(vWorldPosition.x) >= ${(height / 2.0 - 2*lineThickness-innerBorder - boxDepth).toFixed(2)} && abs(vWorldPosition.x) <= ${(height / 2.0 - lineThickness-innerBorder ).toFixed(2)});

        if (
            (inOuterVerticalLine && inOuterHorizontalBounds ) || // left and right vertical line up pitch
            (inOuterHorizontalLine && inOuterVerticalBounds) ||   // top and bottom horizontal line along pitch
            (inMiddleHorizontalLine && inOuterHorizontalBounds) || // middle horziontal line
            (inMiddleCircle ) || // middle circle
            (inKickOff) || // kick off circle
            (inBoxVerticalLine && inBoxHorizontalBounds ) || // left and right lines for box
            (inBoxHorizontalLine && inBoxVerticalBounds)    // top and bottom lines for box
        ) {
            baseColor = lineColor; // Use the line color uniform
        }
        gl_FragColor = vec4(baseColor * clarity, 1.0);
    }
`;

const uniforms = {
    time: { value: 0 },
    lineColor: { value: new THREE.Color(1.0, 1.0, 1.0) } // Default to white
};

const leavesMaterial = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms,
    side: THREE.DoubleSide
});

const instanceNumber = 5e5;
const dummy = new THREE.Object3D();

const grassGeometry = new THREE.PlaneGeometry(0.1, 0.5, 1, 4);
grassGeometry.translate(0, 0.5, 0);

const instancedMesh = new THREE.InstancedMesh(grassGeometry, leavesMaterial, instanceNumber);

for (let i = 0; i < instanceNumber; i++) {
    dummy.position.set(
        (Math.random() - 0.5) * width,
        0,
        (Math.random() - 0.5) * height
    );
    
    dummy.scale.setScalar(0.5 + Math.random() * 0.5);
    dummy.rotation.y = Math.random() * Math.PI;
    
    dummy.updateMatrix();
    instancedMesh.setMatrixAt(i, dummy.matrix);
}

// Custom Field class
class Field extends THREE.Group {
    constructor() {
        super();
        this.add(floor);
        this.add(instancedMesh);

        this.defaultLineColor = new THREE.Color(1.0, 1.0, 1.0); // Default white color
        uniforms.lineColor.value = this.defaultLineColor; // Set initial line color
    }

    async updateScore(team) {
        let flashColor;

        // Determine the color based on the team
        if (team === 'home') {
            flashColor = new THREE.Color(Teams.Home.teamColor);
        } else if (team === 'guest') {
            flashColor = new THREE.Color(Teams.Guest.teamColor);
        } else {
            return; // Do nothing if the team is not recognized
        }

        // Change line color to the flash color
        uniforms.lineColor.value = flashColor;
        leavesMaterial.uniformsNeedUpdate = true; // Mark the material's uniforms for update

        // Wait for the flash duration (500ms here)
        await new Promise((resolve) => setTimeout(resolve, Time.flashDuration));

        // Revert back to the default color
        uniforms.lineColor.value = this.defaultLineColor;
        leavesMaterial.uniformsNeedUpdate = true; // Update again to revert
    }
}


const field = new Field();

const animateGrass = function () {
    leavesMaterial.uniforms.time.value = clock.getElapsedTime();
    leavesMaterial.uniformsNeedUpdate = true;
};

export { field as floor, animateGrass, dirtFloor };
