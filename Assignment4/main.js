import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 0, -8);

const renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0, 0);


class Texture_Rotate {
	vertexShader() {
		return `
			uniform sampler2D uTexture;
		varying vec2 vUv;
		varying vec3 vPosition;
		void main() {
			vUv = uv;
			vPosition = position;
			gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
		}
		`;
	}

	fragmentShader() {
		return `
			uniform sampler2D uTexture;
		uniform float animation_time;
		varying vec2 vUv;
		varying vec3 vPosition;
		void main() {    
			// TODO: 2.c Rotate the texture map around the center of each face at a rate of 8 rpm.
			// Rotation speed: 8 rpm = 4π/15 rad/sec
			float rotationSpeed = 4.0 * 3.14159 / 15.0;
			float angle = mod(animation_time * rotationSpeed, 2.0 * 3.14159);

			vec2 centeredUv = vUv - 0.5;

			float cosAngle = cos(angle);
			float sinAngle = sin(angle);
			vec2 rotatedUv;
			rotatedUv.x = centeredUv.x * cosAngle + centeredUv.y * sinAngle; 
			rotatedUv.y = - centeredUv.x * sinAngle + centeredUv.y * cosAngle; 


			rotatedUv += 0.5;

			// TODO: 1.b Load the texture color from the texture map
			// Hint: Use texture2D function to get the color of the texture at the current UV coordinates
			vec4 tex_color = texture2D(uTexture, rotatedUv);



			// TODO: 2.d add the outline of a black square in the center of each texture that moves with the texture
			// Hint: Tell whether the current pixel is within the black square or not using the UV coordinates
			//       If the pixel is within the black square, set the tex_color to vec4(0.0, 0.0, 0.0, 1.0)
			float inside = 0.5; 
			float outside = 0.7; 

			bool withinInnerSquare = abs(rotatedUv.x - 0.5) < inside * 0.5 && abs(rotatedUv.y - 0.5) < inside * 0.5;
			bool withinOuterSquare = abs(rotatedUv.x - 0.5) < outside * 0.5 && abs(rotatedUv.y - 0.5) < outside * 0.5;

			if (withinOuterSquare && !withinInnerSquare) {
				tex_color = vec4(0.0, 0.0, 0.0, 1.0); 
			}


			gl_FragColor = tex_color;
		}
		`;
	}
}


class Texture_Scroll_X {
	vertexShader() {
		return `
		uniform sampler2D uTexture;
		varying vec2 vUv;
		varying vec3 vPosition;
		void main() {
			vUv = uv;
			vPosition = position;
			gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
		}
		`;
	}

	fragmentShader() {
		return `
		uniform sampler2D uTexture;
		uniform float animation_time;
		varying vec2 vUv;
		varying vec3 vPosition;
		void main() {

			// TODO: 2.a Shrink the texture by 50% so that the texture is repeated twice in each direction
			vec2 scaledUv = vUv * 2.0;

			// TODO: 2.b Translate the texture varying the s texture coordinate by 4 texture units per second
			float scroll_speed = 4.0; 
            //negative so that it moves left to right like the readme
			scaledUv.x += mod(-animation_time * scroll_speed, 1.0);


			vec2 tileUv = mod(scaledUv, 1.0);

			// TODO: 1.b Load the texture color from the texture map
			vec4 tex_color = texture2D(uTexture, scaledUv);

			// TODO: 2.d Add the outline of a black square in the center of each texture tile
			// Define the dimensions of the inner and outer square
			float inside = 0.5;
			float outside = 0.7;


			bool withinInnerSquare = abs(tileUv.x - 0.5) < inside * 0.5 && abs(tileUv.y - 0.5) < inside * 0.5;
			bool withinOuterSquare = abs(tileUv.x - 0.5) < outside * 0.5 && abs(tileUv.y - 0.5) < outside * 0.5;

			if (withinOuterSquare && !withinInnerSquare) {
				tex_color = vec4(0.0, 0.0, 0.0, 1.0); // Black outline
			}

			gl_FragColor = tex_color;
		}
		`;
	}

}

let animation_time = 0.0;

const cube1_geometry = new THREE.BoxGeometry(2, 2, 2);

// TODO: 1.a Load texture map 
//DONE
const cube1_texture = new THREE.TextureLoader().load('assets/stars.png');


// TODO: 1.c Apply Texture Filtering Techniques to Cube 1
// Nearest Neighbor Texture Filtering
// e.g. cube1_texture.minFilter = ...
//DONE
cube1_texture.magFilter = THREE.NearestFilter;
cube1_texture.minFilter = THREE.NearestFilter;


// TODO: 2.a Enable texture repeat wrapping for Cube 1
//DONE
cube1_texture.wrapS = THREE.RepeatWrapping;
cube1_texture.wrapT = THREE.RepeatWrapping;



const cube1_uniforms = {
uTexture: { value: cube1_texture },
	  animation_time: { value: animation_time }
};
const cube1_shader = new Texture_Rotate();
const cube1_material = new THREE.ShaderMaterial({
uniforms: cube1_uniforms,
vertexShader: cube1_shader.vertexShader(),
fragmentShader: cube1_shader.fragmentShader(),
});

const cube1_mesh = new THREE.Mesh(cube1_geometry, cube1_material);
cube1_mesh.position.set(2, 0, 0);
scene.add(cube1_mesh);

const cube2_geometry = new THREE.BoxGeometry(2, 2, 2);

// TODO: 1.a Load texture map
//DONE 
const cube2_texture = new THREE.TextureLoader().load('assets/earth.gif');

// TODO: 1.c Apply Texture Filtering Techniques to Cube 2
// Linear Mipmapping Texture Filtering
// e.g. cube2_texture.minFilter = ...
//DONE
cube2_texture.minFilter = THREE.LinearMipMapLinearFilter;
cube2_texture.generateMipmaps = true;

//DONE
// TODO: 2.a Enable texture repeat wrapping for Cube 2
cube2_texture.wrapS = THREE.RepeatWrapping;
cube2_texture.wrapT = THREE.RepeatWrapping;



const cube2_uniforms = {
uTexture: { value: cube2_texture },
	  animation_time: { value: animation_time }
};
const cube2_shader = new Texture_Scroll_X();
const cube2_material = new THREE.ShaderMaterial({
uniforms: cube2_uniforms,
vertexShader: cube2_shader.vertexShader(),
fragmentShader: cube2_shader.fragmentShader(),
});

const cube2_mesh = new THREE.Mesh(cube2_geometry, cube2_material);
cube2_mesh.position.set(-2, 0, 0)
	scene.add(cube2_mesh);

	const clock = new THREE.Clock();

	const cube1RotationSpeed = (15 * 2 * Math.PI) / 60; 
	const cube2RotationSpeed = (40 * 2 * Math.PI) / 60; 

	let isRotating = false;


function animate() {
	controls.update();
	const delta = clock.getDelta(); 


	// TODO: 2.b&2.c Update uniform values
	// e.g. cube1_uniforms.animation_time.value = ...
    //DONE
	animation_time = clock.getElapsedTime();
	cube2_uniforms.animation_time.value = animation_time;
	cube1_uniforms.animation_time.value = animation_time

	// TODO: 2.e Rotate the cubes if the key 'c' is pressed to start the animation
	// Cube #1 should rotate around its own X-axis at a rate of 15 rpm.
	// Cube #2 should rotate around its own Y-axis at a rate of 40 rpm
    //NOTE: This HAS to be before updating the uniform values otherwise, translations/rotations won't work
    //DONE
	if(isRotating){
		cube1_mesh.rotation.x += -cube1RotationSpeed * delta;
		cube2_mesh.rotation.y += cube2RotationSpeed * delta;
	}



		renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

// TODO: 2.e Keyboard Event Listener
// Press 'c' to start and stop the rotating both cubes
//DONE
window.addEventListener('keydown', onKeyPress);


function onKeyPress(event) {
	if (event.key === 'c') {
		isRotating = !isRotating;
	}
}
