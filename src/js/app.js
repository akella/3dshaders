import * as THREE from 'three';
var OrbitControls = require('three-orbit-controls')(THREE);
import Delaunator from 'delaunator';
import Mouse from './lib/mouse.js';
import Particle from './lib/particle.js';
import Perlin from './lib/perlin.js';

let dots = [];
let mydots = [];

dots.push([0, 0]);
dots.push([500, 0]);
dots.push([500, 500]);
dots.push([0, 500]);

for (var i = 0; i < 1550; i++) {
  dots.push([Math.floor(Math.random() * 500), Math.floor(Math.random() * 500)]);
}

dots.forEach(d => {
  mydots.push(new Particle(d[0],d[1],0));
});

console.log( mydots);
var delaunay = new Delaunator(dots);

let triangles = delaunay.triangles;

var camera, pos, controls, scene, renderer, geometry, geometry1, mesh;

function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);
  // scene.fog = new THREE.FogExp2( 0xcccccc, 0.002 );

  renderer = new THREE.WebGLRenderer();

  pos = new Mouse(renderer.domElement);

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



    




    var material = new THREE.ShaderMaterial({
      extensions: {
        derivatives: '#extension GL_OES_standard_derivatives : enable',
      },
      uniforms: {
        textureSampler: {type: 't', value: null}
      },
      vertexShader: document.getElementById('vertShader').textContent,
      fragmentShader: document.getElementById('fragShader').textContent,
      side: THREE.DoubleSide
    });

    material.uniforms.textureSampler.value = texture;


    geometry = new THREE.Geometry();

    dots.forEach(d => {
      geometry.vertices.push(
        new THREE.Vector3(d[0] - 250, d[1] - 150, 0)
      );
    });
    console.log(triangles.length);
    for (var i = 0; i < triangles.length; i = i + 3) {
      var face = new THREE.Face3(
        triangles[i],
        triangles[i + 1],
        triangles[i + 2]
      );
      geometry.faces.push(face);
    }




    geometry.computeBoundingBox();

    var max = geometry.boundingBox.max,
      min = geometry.boundingBox.min;
    var offset = new THREE.Vector2(0 - min.x, 0 - min.y);
    var range = new THREE.Vector2(max.x - min.x, max.y - min.y);
    var faces = geometry.faces;

    geometry.faceVertexUvs[0] = [];

    for (var i = 0; i < faces.length ; i++) {

      var v1 = geometry.vertices[faces[i].a], 
        v2 = geometry.vertices[faces[i].b], 
        v3 = geometry.vertices[faces[i].c];

      geometry.faceVertexUvs[0].push([
        new THREE.Vector2((v1.x + offset.x)/range.x ,(v1.y + offset.y)/range.y),
        new THREE.Vector2((v2.x + offset.x)/range.x ,(v2.y + offset.y)/range.y),
        new THREE.Vector2((v3.x + offset.x)/range.x ,(v3.y + offset.y)/range.y)
      ]);
    }
    geometry.uvsNeedUpdate = true;




    var mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
  });
}

let time = 0;
function animate() {
  time++;
  console.log(pos);
  if(geometry) {
    // geometry.vertices.forEach((v,index) => {
    //   v.z = 100*Math.sin(index/10 + time/100);
    // });
    mydots.forEach((d,index) => {
      d.think(pos);
      geometry.vertices[index].z = -d.z;
      geometry.vertices[index].z = 50*Perlin(d.x/100,d.y/100,time/100);
    });
    geometry.verticesNeedUpdate = true;
  }


  
  requestAnimationFrame(animate);
  render();
}

function render() {
  renderer.render(scene, camera);
}

init();
animate();
