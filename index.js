/**
 * Created by distu on 2016/12/19.
 */
const users = (window.users || []).map((name, index) => ({name, isReward: false, id: index}));
const TOTAL_USER = users.length;
const USERS_COUNT_PER_ROW = 25;

let camera, scene, renderer;
let controls;
let objects = [];
let targets = {table: [], sphere: [], helix: [], grid: []};

let activeIndex = null;
let isRunning = false;

function init() {
  camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 10000);
  camera.position.z = 2800;
  scene = new THREE.Scene();
  // table
  let pointer = 0;
  for (let i = 0; i < TOTAL_USER; i++) {
    const element = document.createElement('div');
    element.className = 'element';
    element.setAttribute('data-id', users[i].id);
    element.style.backgroundColor = 'rgba(0,127,127,' + ( Math.random() * 0.5 + 0.25 ) + ')';
    const number = document.createElement('div');
    number.className = 'number';
    number.textContent = users[i].id + 1;
    element.appendChild(number);
    const symbol = document.createElement('div');
    symbol.className = 'symbol';
    symbol.textContent = users[i].name;
    element.appendChild(symbol);
    const object = new THREE.CSS3DObject(element);
    object.position.x = Math.random() * 4000 - 2000;
    object.position.y = Math.random() * 4000 - 2000;
    object.position.z = Math.random() * 4000 - 2000;
    scene.add(object);
    objects.push(object);
    //
    const objectForTable = new THREE.Object3D();
    pointer += Math.random() * 10 > 2 ? 0 : 1;
    objectForTable.position.x = ( (pointer % USERS_COUNT_PER_ROW + 1) * 140 ) - 1840;
    objectForTable.position.y = -((Math.floor(pointer / USERS_COUNT_PER_ROW) + 1) * 180 ) + 990;
    targets.table.push(objectForTable);
    pointer++;
  }
  // sphere
  var vector = new THREE.Vector3();
  var spherical = new THREE.Spherical();
  for (var i = 0, l = objects.length; i < l; i++) {
    var phi = Math.acos(-1 + ( 2 * i ) / l);
    var theta = Math.sqrt(l * Math.PI) * phi;
    var object = new THREE.Object3D();
    spherical.set(800, phi, theta);
    object.position.setFromSpherical(spherical);
    vector.copy(object.position).multiplyScalar(2);
    object.lookAt(vector);
    targets.sphere.push(object);
  }
  // helix
  var vector = new THREE.Vector3();
  var cylindrical = new THREE.Cylindrical();
  for (var i = 0, l = objects.length; i < l; i++) {
    var theta = i * 0.175 + Math.PI;
    var y = -( i * 8 ) + 650;
    var object = new THREE.Object3D();
    cylindrical.set(900, theta, y);
    object.position.setFromCylindrical(cylindrical);
    vector.x = object.position.x * 2;
    vector.y = object.position.y;
    vector.z = object.position.z * 2;
    object.lookAt(vector);
    targets.helix.push(object);
  }
  // grid
  for (var i = 0; i < objects.length; i++) {
    var object = new THREE.Object3D();
    object.position.x = ( ( i % 5 ) * 400 ) - 800;
    object.position.y = ( -( Math.floor(i / 5) % 5 ) * 400 ) + 800;
    object.position.z = ( Math.floor(i / 25) ) * 1000 - 2000;
    targets.grid.push(object);
  }
  //
  renderer = new THREE.CSS3DRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.domElement.style.position = 'absolute';
  document.getElementById('container').appendChild(renderer.domElement);
  //
  controls = new THREE.TrackballControls(camera, renderer.domElement);
  controls.rotateSpeed = 0.5;
  controls.minDistance = 500;
  controls.maxDistance = 6000;
  controls.addEventListener('change', render);
  var button = document.getElementById('table');
  button.addEventListener('click', function (event) {
    transform(targets.table, 2000);
  }, false);
  var button = document.getElementById('sphere');
  button.addEventListener('click', function (event) {
    transform(targets.sphere, 2000);
  }, false);
  var button = document.getElementById('helix');
  button.addEventListener('click', function (event) {
    transform(targets.helix, 2000);
  }, false);
  var button = document.getElementById('grid');
  button.addEventListener('click', function (event) {
    transform(targets.grid, 2000);
  }, false);
  transform(targets.table, 2000);
  //
  window.addEventListener('resize', onWindowResize, false);
}

function transform(targets, duration) {
  TWEEN.removeAll();
  for (var i = 0; i < objects.length; i++) {
    var object = objects[i];
    var target = targets[i];
    new TWEEN.Tween(object.position)
      .to({x: target.position.x, y: target.position.y, z: target.position.z}, Math.random() * duration + duration)
      .easing(TWEEN.Easing.Exponential.InOut)
      .start();
    new TWEEN.Tween(object.rotation)
      .to({x: target.rotation.x, y: target.rotation.y, z: target.rotation.z}, Math.random() * duration + duration)
      .easing(TWEEN.Easing.Exponential.InOut)
      .start();
  }
  new TWEEN.Tween(this)
    .to({}, duration * 2)
    .onUpdate(render)
    .start();
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  render();
}

function animate() {
  requestAnimationFrame(animate);
  TWEEN.update();
  controls.update();
  if (isRunning) {
    if (activeIndex != null) {
      objects[activeIndex].element.classList.remove('active');
    }
    activeIndex = Math.floor(Math.random() * TOTAL_USER);
    objects[activeIndex].element.classList.add('active');
  }
}

function render() {
  renderer.render(scene, camera);
}

function particles() {
  return particlesJS("particles-js", {
    "particles": {
      "number": {
        "value": 160,
        "density": {
          "enable": true,
          "value_area": 800
        }
      },
      "color": {
        "value": "#ffffff"
      },
      "shape": {
        "type": "circle",
        "stroke": {
          "width": 0,
          "color": "#000000"
        },
        "polygon": {
          "nb_sides": 5
        },
        "image": {
          "src": "img/github.svg",
          "width": 100,
          "height": 100
        }
      },
      "opacity": {
        "value": 1,
        "random": true,
        "anim": {
          "enable": true,
          "speed": 1,
          "opacity_min": 0,
          "sync": false
        }
      },
      "size": {
        "value": 3,
        "random": true,
        "anim": {
          "enable": false,
          "speed": 4,
          "size_min": 0.3,
          "sync": false
        }
      },
      "line_linked": {
        "enable": false,
        "distance": 150,
        "color": "#ffffff",
        "opacity": 0.4,
        "width": 1
      },
      "move": {
        "enable": true,
        "speed": 1,
        "direction": "none",
        "random": true,
        "straight": false,
        "out_mode": "out",
        "bounce": false,
        "attract": {
          "enable": false,
          "rotateX": 600,
          "rotateY": 600
        }
      }
    },
    "interactivity": {
      "detect_on": "canvas",
      "events": {
        "onhover": {
          "enable": true,
          "mode": "bubble"
        },
        "onclick": {
          "enable": true,
          "mode": "repulse"
        },
        "resize": true
      },
      "modes": {
        "grab": {
          "distance": 400,
          "line_linked": {
            "opacity": 1
          }
        },
        "bubble": {
          "distance": 250,
          "size": 0,
          "duration": 2,
          "opacity": 0,
          "speed": 3
        },
        "repulse": {
          "distance": 400,
          "duration": 0.4
        },
        "push": {
          "particles_nb": 4
        },
        "remove": {
          "particles_nb": 2
        }
      }
    },
    "retina_detect": true
  });
}

document.addEventListener('DOMContentLoaded', () => {
  init();
  animate();
  particles();
  const container = document.getElementById('container');
  document.getElementById('reward_btn').addEventListener('click', (e) => {
    isRunning = !isRunning;
    e.target.innerText = isRunning ? '停止' : '开始';
    if (!isRunning) {
      container.querySelector(`[data-id="${activeIndex}"]`).classList.add('reward');
    }
  });
});
