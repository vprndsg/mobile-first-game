// Scenes definition for Neon Haven visual novel.
// Each scene can include multiple characters with their own frame sequences and actions.
const scenes = [
  {
    background: 'assets/bar_interiror_with_bartender.png',
    name: 'Lexi',
    text: "Welcome to Neon Haven. I'm Lexi, your bartender. What can I get you?",
    characters: [
      {
        name: 'Lexi',
        frames: ['assets/bartender_talking1.png', 'assets/bartender_talking2.png'],
        action: 'talk'
      },
      {
        name: 'Patron',
        frames: ['assets/patron.png', 'assets/patron_excited.png'],
        action: 'listen'
      }
    ],
    choices: [
      { text: 'A holographic martini', next: 1 },
      { text: 'A solar punch', next: 2 }
    ]
  },
  {
    background: 'assets/bar_interiror_with_bartender.png',
    name: 'Lexi',
    text: 'Coming right up! Let me mix that holographic martini for you.',
    characters: [
      {
        name: 'Lexi',
        frames: ['assets/bartender_mixing.png'],
        action: 'mix'
      },
      {
        name: 'Patron',
        frames: ['assets/patron.png'],
        action: 'listen'
      }
    ],
    next: 3
  },
  {
    background: 'assets/bar_interiror_with_bartender.png',
    name: 'Lexi',
    text: "Ah, a solar punch! It's one of our best. Let me whip that up.",
    characters: [
      {
        name: 'Lexi',
        frames: ['assets/bartender_mixing.png'],
        action: 'mix'
      },
      {
        name: 'Patron',
        frames: ['assets/patron.png'],
        action: 'listen'
      }
    ],
    next: 3
  },
  {
    background: 'assets/bar_interiror_with_bartender.png',
    name: 'Lexi',
    text: 'Here you go! Enjoy your drink. Feel free to chat with our patrons.',
    characters: [
      {
        name: 'Lexi',
        frames: ['assets/bartender_talking1.png', 'assets/bartender_talking2.png'],
        action: 'talk'
      },
      {
        name: 'Patron',
        frames: ['assets/patron_excited.png', 'assets/patron.png'],
        action: 'listen'
      }
    ],
    next: 4
  },
  {
    background: 'assets/bar_interiror_with_bartender.png',
    name: 'Mystery Patron',
    text: 'Hey there, first time here? The neon nights are crazy!',
    characters: [
      {
        name: 'Lexi',
        frames: ['assets/lexi_happy.png', 'assets/lexi_laughing.png'],
        action: 'listen'
      },
      {
        name: 'Mystery Patron',
        frames: ['assets/patron_excited.png', 'assets/patron.png'],
        action: 'talk'
      }
    ],
    next: null
  }
];

// Maintain current scene index and per-character frame intervals
let index = 0;
let frameIntervals = [];

// Cache DOM elements for efficiency
const backgroundEl = document.getElementById('background');
const characterContainerEl = document.getElementById('character-container');
const nameEl = document.getElementById('name');
const textEl = document.getElementById('text');
const choicesEl = document.getElementById('choices');

/**
 * Clears any running frame animation intervals. Should be called before showing a new scene.
 */
function clearFrameIntervals() {
  frameIntervals.forEach(id => clearInterval(id));
  frameIntervals = [];
}

/**
 * Shows the specified scene index, updating background, characters, dialogue and choices.
 * @param {number} i - Index of the scene to display.
 */
function showScene(i) {
  const scene = scenes[i];
  if (!scene) return;
  index = i;

  // update background
  backgroundEl.src = scene.background;

  // clear previous animations and characters
  clearFrameIntervals();
  characterContainerEl.innerHTML = '';

  // render each character in the scene
  if (scene.characters && scene.characters.length > 0) {
    scene.characters.forEach(char => {
      const img = document.createElement('img');
      img.src = char.frames[0];
      img.alt = char.name;

      // apply animation classes based on action
      if (char.action === 'talk') {
        img.classList.add('talking');
      } else if (char.action === 'mix') {
        img.classList.add('mixing');
      }
      // cycle through frames if multiple frames are provided
      if (char.frames.length > 1) {
        let frameIndex = 0;
        const interval = setInterval(() => {
          frameIndex = (frameIndex + 1) % char.frames.length;
          img.src = char.frames[frameIndex];
        }, 500);
        frameIntervals.push(interval);
      }
      characterContainerEl.appendChild(img);
    });
  }

  // update dialogue speaker and text
  nameEl.textContent = scene.name;
  textEl.textContent = scene.text;

  // clear any existing choices
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
  } else if (scene.next !== undefined && scene.next !== null) {
    // if there is a next scene index, show a Next button
    const btn = document.createElement('button');
    btn.textContent = 'Next';
    btn.className = 'choice-btn';
    btn.addEventListener('click', () => {
      showScene(scene.next);
    });
    choicesEl.appendChild(btn);
  }
}

// Initialize the first scene once DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  showScene(0);
});