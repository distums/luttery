/**
 * Created by distu on 2016/12/19.
 */
const users = (window.users || []).map((name, index) => ({
  name,
  id: index,
}));
const TOTAL_USER = users.length;
const USERS_COUNT_PER_ROW = 50;

let camera, scene, renderer;
let controls;
let objects = [];
let targets = { table: [], sphere: [], helix: [], grid: [] };
let displayTarget = 'table';

function init() {
  camera = new THREE.PerspectiveCamera(
    40,
    window.innerWidth / window.innerHeight,
    1,
    10000
  );
  camera.position.z = 2800;
  scene = new THREE.Scene();
  // table
  let pointer = 0;
  for (let i = 0; i < TOTAL_USER; i++) {
    const element = document.createElement('div');
    element.className = 'element';
    element.setAttribute('data-id', users[i].id);
    element.setAttribute('data-name', users[i].name);
    element.style.backgroundColor =
      'rgba(0,127,127,' + (Math.random() * 0.5 + 0.25) + ')';
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
    // pointer += Math.random() * 10 > 2 ? 0 : 1;
    objectForTable.position.x = (pointer % USERS_COUNT_PER_ROW + 1) * 70 - 1840;
    objectForTable.position.y =
      -((Math.floor(pointer / USERS_COUNT_PER_ROW) + 1) * 90) + 990;
    targets.table.push(objectForTable);
    pointer++;
  }
  // sphere
  var vector = new THREE.Vector3();
  var spherical = new THREE.Spherical();
  for (var i = 0, l = objects.length; i < l; i++) {
    var phi = Math.acos(-1 + 2 * i / l);
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
    var y = -(i * 8) + 650;
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
    object.position.x = (i % 5) * 400 - 800;
    object.position.y = -(Math.floor(i / 5) % 5) * 400 + 800;
    object.position.z = Math.floor(i / 25) * 1000 - 2000;
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
      .to(
        { x: target.position.x, y: target.position.y, z: target.position.z },
        Math.random() * duration + duration
      )
      .easing(TWEEN.Easing.Exponential.InOut)
      .start();
    new TWEEN.Tween(object.rotation)
      .to(
        { x: target.rotation.x, y: target.rotation.y, z: target.rotation.z },
        Math.random() * duration + duration
      )
      .easing(TWEEN.Easing.Exponential.InOut)
      .start();
  }
  new TWEEN.Tween(this)
    .to({}, duration * 2)
    .onUpdate(render)
    .start();
}

function randomTargets(objects) {
  if (displayTarget !== 'table') {
    return targets[displayTarget];
  }
  const results = [];
  let pointer = 0;
  for (let i = 0, length = objects.length; i < length; i++) {
    const objectForTable = new THREE.Object3D();
    // pointer += Math.random() * 10 > 2 ? 0 : 1;
    objectForTable.position.x = (pointer % USERS_COUNT_PER_ROW + 1) * 70 - 1840;
    objectForTable.position.y =
      -((Math.floor(pointer / USERS_COUNT_PER_ROW) + 1) * 90) + 990;
    results.push(objectForTable);
    pointer++;
  }
  return results;
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
}

function render() {
  renderer.render(scene, camera);
}

function particles() {
  return particlesJS('particles-js', {
    particles: {
      number: {
        value: 160,
        density: {
          enable: true,
          value_area: 800,
        },
      },
      color: {
        value: '#ffffff',
      },
      shape: {
        type: 'circle',
        stroke: {
          width: 0,
          color: '#000000',
        },
        polygon: {
          nb_sides: 5,
        },
        image: {
          src: 'img/github.svg',
          width: 100,
          height: 100,
        },
      },
      opacity: {
        value: 1,
        random: true,
        anim: {
          enable: true,
          speed: 1,
          opacity_min: 0,
          sync: false,
        },
      },
      size: {
        value: 3,
        random: true,
        anim: {
          enable: false,
          speed: 4,
          size_min: 0.3,
          sync: false,
        },
      },
      line_linked: {
        enable: false,
        distance: 150,
        color: '#ffffff',
        opacity: 0.4,
        width: 1,
      },
      move: {
        enable: true,
        speed: 1,
        direction: 'none',
        random: true,
        straight: false,
        out_mode: 'out',
        bounce: false,
        attract: {
          enable: false,
          rotateX: 600,
          rotateY: 600,
        },
      },
    },
    interactivity: {
      detect_on: 'canvas',
      events: {
        onhover: {
          enable: true,
          mode: 'bubble',
        },
        onclick: {
          enable: true,
          mode: 'repulse',
        },
        resize: true,
      },
      modes: {
        grab: {
          distance: 400,
          line_linked: {
            opacity: 1,
          },
        },
        bubble: {
          distance: 250,
          size: 0,
          duration: 2,
          opacity: 0,
          speed: 3,
        },
        repulse: {
          distance: 400,
          duration: 0.4,
        },
        push: {
          particles_nb: 4,
        },
        remove: {
          particles_nb: 2,
        },
      },
    },
    retina_detect: true,
  });
}

// fisher-yates-shuffle
// http://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffle(array) {
  let currentIndex = array.length,
    temporaryValue,
    randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

let randomNext = null;

document.addEventListener('DOMContentLoaded', () => {
  init();
  animate();
  setTimeout(particles, 1000);
  const container = document.getElementById('container');
  const rewardContainer = document.getElementById('reward-container');
  const batchRewardContainer = document.getElementById(
    'batch-reward-container'
  );
  const rewardElement = rewardContainer.firstElementChild;
  const rewardNumber = rewardElement.firstElementChild;
  const rewardSymbol = rewardElement.lastElementChild;
  const rewardButtons = document.querySelectorAll(
    '.button--reward:not(#start-btn)'
  );
  document.getElementById('start-btn').addEventListener(
    'click',
    (() => {
      let isStart = false;
      return e => {
        if (isStart && confirm('确认结束抽奖？')) {
          console.groupCollapsed('获奖名单：');
          console.table(randomNext.getAll());
          console.groupEnd();
          resetButtons();
          randomNext = null;
          return;
        }
        if (!isStart) {
          e.target.disabled = true;
          (function execute(maxCount, interval = 200) {
            if (maxCount > 0) {
              shuffle(objects);
              transform(randomTargets(objects), interval);
              setTimeout(() => execute(maxCount - 1), interval * 2);
            } else {
              randomNext = window.randomNextFactory(users);
              e.target.disabled = false;
            }
          })(5);
        }
        isStart = !isStart;
        container.classList[isStart ? 'add' : 'remove']('running');
        e.target.innerText = isStart ? '结束' : '开始';
        const rewardElements = container.querySelectorAll('.reward');
        for (const item of rewardElements) {
          item.classList.remove('reward');
        }
      };
    })()
  );
  rewardButtons.forEach(button => {
    button.dataset.initRemain = button.dataset.remain;
    button.addEventListener('click', e => {
      if (!randomNext) {
        alert('请先点击开始');
        return;
      }
      const target = e.target.closest('.button--reward');
      let remain = parseInt(target.dataset.remain, 10);
      const size = parseInt(target.dataset.size, 10);
      console.groupCollapsed(target.firstElementChild.innerText);
      const currentRewards = randomNext(size);
      batchRewardContainer.querySelector('h1').innerText =
        target.firstElementChild.innerText;
      batchRewardContainer.querySelector(
        '.reward-list'
      ).innerHTML = currentRewards
        .map(item => `<li>${item.name}</li>`)
        .join('\n');
      batchRewardContainer.style.display = 'block';
      batchRewardContainer.firstElementChild.classList.add('animation');
      currentRewards.forEach(reward => {
        // 展示出来的id是+1的，而真正的id是从0开始，见37行
        container
          .querySelector(`.element[data-id="${reward.id}"]`)
          .classList.add('reward');
      });
      console.table(currentRewards);
      console.groupEnd();
      remain--;
      if (remain === 0) {
        target.innerText = '已抽完';
        target.disabled = true;
      } else {
        target.lastElementChild.innerText = `(${size} * ${remain})`;
      }
      target.dataset.remain = remain;
    });
  });
  container.addEventListener('click', e => {
    const target = e.target.closest('.element');
    if (target) {
      target.classList.add('reward');
      rewardContainer.style.display = 'block';
      rewardElement.classList.add('animation');
      rewardNumber.innerText = parseInt(target.dataset.id, 10) + 1;
      rewardSymbol.innerText = target.dataset.name;
    }
  });
  rewardContainer.addEventListener('click', () => {
    rewardContainer.style.display = 'none';
  });
  batchRewardContainer.addEventListener('click', () => {
    batchRewardContainer.style.display = 'none';
  });

  function resetButtons() {
    rewardButtons.forEach(button => {
      button.dataset.remain = button.dataset.initRemain;
    });
  }
});
