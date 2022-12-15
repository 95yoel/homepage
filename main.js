import * as THREE from './three.module.js';
import { OrbitControls } from './OrbitControls.js';
import { gsap } from './gsap-core.js';

//creamos la escena
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

//la forma geometrica
const geometry = new THREE.SphereGeometry(3,64,64);
//el material
const material = new THREE.MeshStandardMaterial({
    //color: 0x00ff00,
    map: new THREE.TextureLoader().load('img/earthMap.jpg'),
    roughness: 0.6,
});
//la combinacion de la forma y el material
const mesh = new THREE.Mesh(geometry, material);

scene.add(mesh);

//size 
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

//luces 
const ligth = new THREE.PointLight(0xffffff, 1,100);
scene.add(ligth);
ligth.position.set(0,10,10);
//la camara

const camera = new THREE.PerspectiveCamera(45,sizes.width/sizes.height,0.1,100);
camera.position.z = 20;
scene.add(camera);



//render
const canvas = document.querySelector('.webgl');
const renderer = new THREE.WebGLRenderer({canvas});

renderer.setSize(sizes.width,sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
renderer.render(scene,camera); 

//controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enablePan = false;
controls.enableZoom = false;
controls.autoRotate = true;
controls.autoRotateSpeed = 5;

//comprobaciones 
//si se ha creado la escena
var comprobar = function() {
    if(scene) {
        console.log('Scene created');
    }
}
//resize    
window.addEventListener('resize', () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;
    camera.aspect = sizes.width/sizes.height;
    camera.updateProjectionMatrix();
    renderer.setSize(sizes.width,sizes.height);
    renderer.render(scene,camera);
});

const loop = () => {
    controls.update();
    window.requestAnimationFrame(loop);
    renderer.render(scene,camera);
}
loop();

comprobar();

//magic

const tl = gsap.timeline({defaults: {duration: 2}});
tl.fromTo(mesh.scale,{z:0, y:0, x:0},{z:1, y:1, x:1});

let mouseDown = false;
let rgb = [];

window.addEventListener('mousedown', () => {
    mouseDown = true;
}
);
window.addEventListener('mouseup', () => {
    mouseDown = false;
}
);
window.addEventListener('mousemove', (e) => {
    if(mouseDown) {
        rgb = [
            Math.round(e.pageX/sizes.width*255),
            Math.round(e.pageY/sizes.height*255),
            150
        ]
        //animar
        gsap.to(mesh.material.color, {duration: 0.5, r: rgb[0]/255, g: rgb[1]/255, b: rgb[2]/255});
    }
}
);
