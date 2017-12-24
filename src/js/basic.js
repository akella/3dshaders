import * as THREE from 'three';
var OrbitControls = require('three-orbit-controls')(THREE);



var camera, pos, controls, scene, renderer, geometry, geometry1, mesh;

function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);
  // scene.fog = new THREE.FogExp2( 0xcccccc, 0.002 );

  renderer = new THREE.WebGLRenderer();



  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerWidth);

  var container = document.getElementById('container');
  container.appendChild(renderer.domElement);

  camera = new THREE.PerspectiveCamera(
    90,
    window.innerWidth / window.innerHeight,
    1,
    3000
  );
  camera.position.z = 200;

  controls = new OrbitControls(camera, renderer.domElement);

  var loader = new THREE.TextureLoader();
  loader.load('img/flower.jpg', function(texture) {

    // here goes everything

  
    scene.add(mesh);
  });
}

let time = 0;
function animate() {
  time++;
  
  requestAnimationFrame(animate);
  render();
}

function render() {
  renderer.render(scene, camera);
}

init();
animate();
