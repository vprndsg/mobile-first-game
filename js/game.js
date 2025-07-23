const scenes = [
  {
    background: 'assets/bar_interiror_with_bartender.png',
    frames: ['assets/bartender_talking1.png', 'assets/bartender_talking2.png'],
    name: 'Lexi',
    text: "Welcome to Neon Haven. I'm Lexi, your bartender. What can I get you?",
    action: 'talk',
    choices: [
      { text: 'A holographic martini', next: 1 },
      { text: 'A solar punch', next: 2 }
    ]
  },
  {
    background: 'assets/bar_interiror_with_bartender.png',
    frames: ['assets/bartender_mixing.png'],
    name: 'Lexi',
    text: 'Coming right up! Let me mix that holographic martini for you.',
    action: 'mix',
    next: 3
  },
  {
    background: 'assets/bar_interiror_with_bartender.png',
    frames: ['assets/bartender_mixing.png'],
    name: 'Lexi',
    text: 'Ah, a solar punch! It\'s one of our best. Let me whip that up.',
    action: 'mix',
    next: 3
  },
  {
    background: 'assets/bar_interiror_with_bartender.png',
    frames: ['assets/bartender_talking1.png', 'assets/bartender_talking2.png'],
    name: 'Lexi',
    text: 'Here you go! Enjoy your drink. Feel free to chat with our patrons.',
    action: 'talk',
    next: 4
  },
  {
    background: 'assets/bar_interiror_with_bartender.png',
    frames: ['assets/patron.png'],
    name: 'Mystery Patron',
    text: 'Hey there, first time here? The neon nights are crazy!',
    action: 'talk',
    next: null
  }
];

let index = 0;
let frameInterval = null;

const backgroundEl = document.getElementById('background');
const characterEl = document.getElementById('character');
const nameEl = document.getElementById('name');
const textEl = document.getElementById('text');
const choicesEl = document.getElementById('choices');

function startFrameAnimation(frames) {
  // clear any existing interval
  if (frameInterval) {
    clearInterval(frameInterval);
    frameInterval = null;
  }
  let frameIndex = 0;
  // assign first frame
  characterEl.src = frames[0];
  // if multiple frames, cycle through them
  if (frames.length > 1) {
    frameInterval = setInterval(() => {
      frameIndex = (frameIndex + 1) % frames.length;
      characterEl.src = frames[frameIndex];
    }, 500);
  }
}

function showScene(i) {
  const scene = scenes[i];
  if (!scene) return;
  index = i;
  backgroundEl.src = scene.background;
  // start animation for frames
  if (scene.frames) {
    startFrameAnimation(scene.frames);
  } else {
    characterEl.src = '';
  }
  nameEl.textContent = scene.name;
  textEl.textContent = scene.text;
  // Reset animation classes
  characterEl.classList.remove('talking', 'mixing');
  if (scene.action === 'talk') {
    characterEl.classList.add('talking');
  } else if (scene.action === 'mix') {
    characterEl.classList.add('mixing');
  }
  // Clear choices
  choicesEl.innerHTML = '';
  if (scene.choices && scene.choices.length > 0) {
    scene.choices.forEach(choice => {
      const btn = document.createElement('button');
      btn.textContent = choice.text;
      btn.className = 'choice-btn';
      btn.addEventListener('click', () => {
        showScene(choice.next);
      });
      choicesEl.appendChild(btn);
    });
  } else {
    // If there is a next index, show a Next button
    if (scene.next !== undefined && scene.next !== null) {
      const btn = document.createElement('button');
      btn.textContent = 'Next';
      btn.className = 'choice-btn';
      btn.addEventListener('click', () => {
        showScene(scene.next);
      });
      choicesEl.appendChild(btn);
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  showScene(0);
});
