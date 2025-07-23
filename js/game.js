const scenes = [
  {
    background: 'assets/bar_interiror_with_bartender.png',
    character: 'assets/bartender.png',
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
    character: 'assets/bartender.png',
    name: 'Lexi',
    text: 'Coming right up! Let me mix that holographic martini for you.',
    action: 'mix',
    next: 3
  },
  {
    background: 'assets/bar_interiror_with_bartender.png',
    character: 'assets/bartender.png',
    name: 'Lexi',
    text: 'Ah, a solar punch! It\'s one of our best. Let me whip that up.',
    action: 'mix',
    next: 3
  },
  {
    background: 'assets/bar_interiror_with_bartender.png',
    character: 'assets/bartender.png',
    name: 'Lexi',
    text: 'Here you go! Enjoy your drink. Feel free to chat with our patrons.',
    action: 'talk',
    next: 4
  },
  {
    background: 'assets/bar_interiror_with_bartender.png',
    character: 'assets/patron.png',
    name: 'Mystery Patron',
    text: 'Hey there, first time here? The neon nights are crazy!',
    action: 'talk',
    next: null
  }
];

let index = 0;

const backgroundEl = document.getElementById('background');
const characterEl = document.getElementById('character');
const nameEl = document.getElementById('name');
const textEl = document.getElementById('text');
const choicesEl = document.getElementById('choices');

function showScene(i) {
  const scene = scenes[i];
  if (!scene) return;
  index = i;
  backgroundEl.src = scene.background;
  characterEl.src = scene.character;
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
