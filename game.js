// Scenes definition for Neon Haven visual novel.
//
// The scenes array drives the flow of the visual novel.  Each scene
// specifies a background image, the speaking character's name and text, a
// list of character objects (including their frame sequences and actions),
// and either a list of choices or the index of the next scene.  To
// improve visual coherence the backgrounds now reference an empty bar
// illustration (`cyberpunk_bar_empty.png`) instead of the original
// bartender backdrop.  Character frames have been updated to use
// consistent waist‑up portraits (`lexi_*` and `patron_*` files) and
// additional metadata is leveraged by the renderer to highlight the
// currently speaking character and dim listeners.

const scenes = [
  {
    background: 'assets/cyberpunk_bar_empty.png',
    name: 'Lexi',
    text: "Welcome to Neon Haven. I'm Lexi, your bartender. What can I get you?",
    characters: [
      {
        name: 'Lexi',
        // cycle between talk and subtle mixing frames for a livelier speaking animation
        frames: ['assets/lexi_talk1.png', 'assets/lexi_mix2.png'],
        action: 'talk',
      },
      {
        name: 'Patron',
        frames: ['assets/patron_talk1.png', 'assets/patron_talk2.png'],
        action: 'listen',
      },
    ],
    choices: [
      { text: 'A holographic martini', next: 1 },
      { text: 'A solar punch', next: 2 },
    ],
  },
  {
    background: 'assets/cyberpunk_bar_empty.png',
    name: 'Lexi',
    text: 'Coming right up! Let me mix that holographic martini for you.',
    characters: [
      {
        name: 'Lexi',
        // use multiple frames during mixing to avoid static pose
        frames: ['assets/lexi_mix2.png', 'assets/lexi_talk1.png'],
        action: 'mix',
      },
      {
        name: 'Patron',
        frames: ['assets/patron_talk1.png', 'assets/patron_talk2.png'],
        action: 'listen',
      },
    ],
    next: 3,
  },
  {
    background: 'assets/cyberpunk_bar_empty.png',
    name: 'Lexi',
    text: "Ah, a solar punch! It's one of our best. Let me whip that up.",
    characters: [
      {
        name: 'Lexi',
        frames: ['assets/lexi_mix2.png', 'assets/lexi_talk1.png'],
        action: 'mix',
      },
      {
        name: 'Patron',
        frames: ['assets/patron_talk1.png', 'assets/patron_talk2.png'],
        action: 'listen',
      },
    ],
    next: 3,
  },
  {
    background: 'assets/cyberpunk_bar_empty.png',
    name: 'Lexi',
    text: 'Here you go! Enjoy your drink. Feel free to chat with our patrons.',
    characters: [
      {
        name: 'Lexi',
        // again cycle talk frames for Lexi
        frames: ['assets/lexi_talk1.png', 'assets/lexi_mix2.png'],
        action: 'talk',
      },
      {
        name: 'Patron',
        frames: ['assets/patron_excited.png', 'assets/patron_talk1.png'],
        action: 'listen',
      },
    ],
    next: 4,
  },
  {
    background: 'assets/cyberpunk_bar_empty.png',
    name: 'Mystery Patron',
    text: 'Hey there, first time here? The neon nights are crazy!',
    characters: [
      {
        name: 'Lexi',
        // Lexi quietly reacts while listening; alternate between laughing and neutral
        frames: ['assets/lexi_laughing.png', 'assets/lexi_talk1.png'],
        action: 'listen',
      },
      {
        name: 'Mystery Patron',
        frames: ['assets/patron_excited.png', 'assets/patron_talk2.png'],
        action: 'talk',
      },
    ],
    next: null,
  },
];

// Maintain current scene index and per‑character frame intervals
let index = 0;
let frameIntervals = [];

// Cache DOM elements for efficiency
const backgroundEl = document.getElementById('background');
const characterContainerEl = document.getElementById('character-container');
const nameEl = document.getElementById('name');
const textEl = document.getElementById('text');
const choicesEl = document.getElementById('choices');

/**
 * Clears any running frame animation intervals. Should be called before
 * showing a new scene.
 */
function clearFrameIntervals() {
  frameIntervals.forEach((id) => clearInterval(id));
  frameIntervals = [];
}

/**
 * Sanitises a character name into a valid CSS class name.  Spaces are
 * replaced with hyphens and the string is converted to lowercase.
 * @param {string} name
 * @returns {string}
 */
function classNameFromName(name) {
  return name.toLowerCase().replace(/\s+/g, '-');
}

/**
 * Shows the specified scene index, updating background, characters,
 * dialogue and choices.
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
    scene.characters.forEach((char) => {
      const img = document.createElement('img');
      img.src = char.frames[0];
      img.alt = char.name;

      // apply animation classes based on action
      if (char.action === 'talk') {
        img.classList.add('talking');
      } else if (char.action === 'mix') {
        img.classList.add('mixing');
      }

      // apply type class (e.g. patron) to allow tone adjustments
      const lower = char.name.toLowerCase();
      if (lower.includes('patron')) {
        img.classList.add('patron');
      }

      // highlight currently speaking character
      if (char.name === scene.name) {
        img.classList.add('speaking');
      } else {
        img.classList.add('dimmed');
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
    scene.choices.forEach((choice) => {
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