// Hand of the Demiurge – Biker Bar edition
//
// This script implements a simplified version of the card‑based gameplay
// described for the "Hand of the Demiurge" prototype.  The setting is
// restricted to a neon biker bar; all events occur within this single
// location.  The Demiurge draws sabotage cards each turn, while the
// player chooses from a set of decision cards.  Some of these cards
// disguise fundamental illusion effects which can cost or regain turns.

// ---------------------------------------------------------------------
// 1. DATA DEFINITIONS
// ---------------------------------------------------------------------

// Cards that can appear as disguised illusion options.  Illusion cards
// merely tax the player's time if they fall for them; detecting an
// illusion grants bonus turns.  These phrases are flavourful but carry
// no mechanical effect beyond turn adjustments.
const FUNDAMENTAL_ILLUSIONS = [
  'Hall of Mirrors',
  'Flickering Vision',
  'Phantom Motorcycle',
  'Empty Glass',
  'False Door',
  'Vanishing Jukebox',
  'Echoing Laughs',
  'Ghostly Bartender'
];

// Real decision cards are the meaningful actions the player can take
// within the biker bar.  The list avoids leaving the location and
// focuses on interactions and exploration inside the bar.
const REAL_DECISION_CARDS = [
  'Order a Drink',
  'Chat with a Biker',
  'Inspect the Jukebox',
  'Play a Game of Pool',
  'Check the Bulletin Board',
  'Search Behind the Bar',
  'Take a Short Rest',
  'Check Inventory',
  'Start a Bar Brawl'
];

// The Demiurge's sabotage deck.  Each turn the Demiurge draws one
// card and its effect may harm the player directly or modify the mix
// of illusion cards dealt for that turn.  Cards like Barrier or Heal
// are narratively described but carry no mechanical effect here.
const DEMIURGE_DECK = [
  'Summon Illusion',
  'Distort Reality',
  'Attack Player',
  'Barrier',
  'Heal',
  'Temporal Loop'
];

// Sample dialogues that bikers in the bar might utter.  When the
// player chooses to chat with a biker, one of these lines is
// displayed at random to convey atmosphere and hints.  Because we
// avoid LLM calls, these are prewritten.
const BIKER_DIALOGUES = [
  'You hear the roar of engines even when the bikes are silent.',
  'This bar’s seen more fights than you’ve had hot dinners.',
  'Watch your drink; sometimes the glasses bite back.',
  'Never trust a smiling biker.',
  'The jukebox only plays if you kick it just right.',
  'Ain’t no law around here but the one you make.'
];

// ---------------------------------------------------------------------
// 2. ENTITY CLASSES
// ---------------------------------------------------------------------

// Simple player class tracking hit points, turns and inventory.  The
// player’s attack and defence stats are fixed for this prototype.
class Player {
  constructor() {
    this.hp = 100;
    this.turns = 60;
    this.inventory = ['Short Sword', 'Torch'];
    this.baseAttack = 5;
    this.baseDefense = 2;
  }

  isAlive() {
    return this.hp > 0 && this.turns > 0;
  }

  heal(amount) {
    this.hp = Math.min(100, this.hp + amount);
  }
}

// The Demiurge draws cards from its deck each turn.  When the deck is
// exhausted, it is reshuffled.  Some cards have immediate effects.
class Demiurge {
  constructor() {
    this.deck = [...DEMIURGE_DECK];
    this.shuffle();
  }

  shuffle() {
    for (let i = this.deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
    }
  }

  drawCard() {
    if (this.deck.length === 0) {
      this.deck = [...DEMIURGE_DECK];
      this.shuffle();
    }
    return this.deck.pop();
  }
}

// ---------------------------------------------------------------------
// 3. GAME STATE AND DOM REFERENCES
// ---------------------------------------------------------------------

const player = new Player();
const demiurge = new Demiurge();

// Keep track of the last demiurge card to influence illusion count.
let lastDemiurgeCard = null;
// The current decision cards presented to the player this turn.
let currentCards = [];

// DOM elements
const hpEl = document.getElementById('hp');
const turnsEl = document.getElementById('turns');
const inventoryEl = document.getElementById('inventory');
const decisionCardsEl = document.getElementById('decision-cards');
const logEl = document.getElementById('log');
const inspectBtn = document.getElementById('inspect-btn');
const quitBtn = document.getElementById('quit-btn');

// ---------------------------------------------------------------------
// 4. UTILITY FUNCTIONS
// ---------------------------------------------------------------------

// Update the on‑screen stats for HP, turns and inventory.
function updateStats() {
  hpEl.textContent = `HP: ${player.hp}`;
  turnsEl.textContent = `Turns: ${player.turns}`;
  inventoryEl.textContent = `Inventory: ${player.inventory.join(', ')}`;
}

// Append a message to the narrative log.  Older messages scroll
// upwards as new ones appear at the bottom.
function logMessage(message) {
  const para = document.createElement('p');
  para.textContent = message;
  logEl.appendChild(para);
  logEl.scrollTop = logEl.scrollHeight;
}

// Simple damage computation used for the Demiurge’s attack.
function computeDamage(att, def) {
  const base = att - def;
  const roll = Math.floor(Math.random() * 3); // 0–2
  return Math.max(1, base + roll);
}

// Check whether the current game state meets a losing condition.  If
// the player has no turns left or HP drops to zero, a message is
// displayed and the game is halted by disabling the card buttons.
function checkGameOver() {
  if (player.turns <= 0) {
    logMessage('Your time has run out! The Demiurge wins.');
    disableCards();
    return true;
  }
  if (player.hp <= 0) {
    logMessage('You collapse from your wounds. Game Over.');
    disableCards();
    return true;
  }
  return false;
}

// Remove all decision card buttons from the interface.
function clearCards() {
  decisionCardsEl.innerHTML = '';
}

// Disable all decision card buttons so the player cannot take
// additional actions after game over.
function disableCards() {
  const buttons = decisionCardsEl.querySelectorAll('button');
  buttons.forEach((btn) => {
    btn.disabled = true;
  });
  inspectBtn.disabled = true;
  quitBtn.disabled = true;
}

// ---------------------------------------------------------------------
// 5. DEMIURGE TURN & DECISION CARD GENERATION
// ---------------------------------------------------------------------

// Execute the Demiurge’s turn: draw a sabotage card and apply its
// immediate effect.  Effects include damaging the player or simply
// flavourful descriptions.
function demiurgeTurn() {
  const card = demiurge.drawCard();
  lastDemiurgeCard = card;
  logMessage(`[Demiurge draws: ${card}]`);

  switch (card) {
    case 'Attack Player': {
      const damage = computeDamage(7, player.baseDefense);
      player.hp -= damage;
      logMessage(`Shadows lash at you for ${damage} damage!`);
      break;
    }
    case 'Barrier':
      logMessage('A shimmering barrier appears around the bar, humming ominously.');
      break;
    case 'Heal':
      logMessage('The Demiurge siphons energy from the crowd, growing stronger.');
      break;
    case 'Temporal Loop':
      logMessage('Time stutters – reality flickers like a faulty neon sign.');
      break;
    case 'Summon Illusion':
      logMessage('The air shimmers; trickery lurks among your choices.');
      break;
    case 'Distort Reality':
      logMessage('Your vision swims, colours bleed. Something is off.');
      break;
  }
}

// Create a new set of seven decision cards based on the Demiurge’s
// last drawn card.  Five cards are real actions and two (or three if
// an illusion card was played) are disguised illusion cards.  The
// order is randomised.
function generateDecisionCards() {
  const realCount = 5;
  let illusionCount = 2;
  if (lastDemiurgeCard === 'Summon Illusion') {
    illusionCount = 3;
  }
  const reals = shuffleArray([...REAL_DECISION_CARDS]).slice(0, realCount);
  const illus = shuffleArray([...FUNDAMENTAL_ILLUSIONS]).slice(0, illusionCount)
    .map((text) => `[ILLUSION?] ${text}`);
  const cards = [...reals, ...illus];
  return shuffleArray(cards);
}

// Fisher–Yates shuffle helper
function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Render the decision cards as clickable buttons.  Each button
// represents one card and triggers a handler when clicked.  If the
// game is over, cards are disabled.
function renderDecisionCards(cards) {
  clearCards();
  currentCards = cards;
  cards.forEach((card, index) => {
    const btn = document.createElement('button');
    btn.textContent = card;
    btn.className = 'decision-card';
    btn.addEventListener('click', () => handleCardSelection(index));
    decisionCardsEl.appendChild(btn);
  });
}

// ---------------------------------------------------------------------
// 6. PLAYER ACTION HANDLING
// ---------------------------------------------------------------------

// Attempt to detect disguised illusion cards.  Success chance is 70%.
function inspectIllusions() {
  if (player.turns <= 0) return;
  if (!currentCards.some((c) => c.startsWith('[ILLUSION?]'))) {
    logMessage('You sense nothing amiss this round.');
    return;
  }
  const success = Math.random() < 0.7;
  if (success) {
    player.turns += 5;
    logMessage('You uncover the Demiurge’s trickery! (+5 turns)');
    // Reveal illusion cards by removing the marker
    currentCards = currentCards.map((c) => {
      if (c.startsWith('[ILLUSION?]')) {
        return c.replace('[ILLUSION?] ', '(Revealed Illusion) ');
      }
      return c;
    });
    // Re-render to update labels
    renderDecisionCards(currentCards);
  } else {
    logMessage('Your instincts fail you; the mirages persist.');
    player.turns -= 1;
  }
  updateStats();
  checkGameOver();
}

// Handle the player selecting a specific card.  Applies the card’s
// effect, updates stats and advances the game.  Illusions subtract
// turns if not detected; real cards perform actions defined below.
function handleCardSelection(index) {
  if (!player.isAlive()) return;
  const card = currentCards[index];
  logMessage(`You choose: ${card}`);
  // If the card is an illusion
  if (card.startsWith('[ILLUSION?]')) {
    const success = Math.random() < 0.3; // 30% chance to recognise
    if (success) {
      player.turns += 5;
      logMessage('You see through the illusion just in time! (+5 turns)');
    } else {
      player.turns -= 5;
      logMessage('You stumble into a trap set by the Demiurge. (-5 turns)');
    }
    player.turns -= 1; // selecting consumes a turn regardless
    updateStats();
    if (checkGameOver()) return;
    startTurn();
    return;
  }

  // Handle real actions
  switch (card) {
    case 'Order a Drink':
      player.heal(10);
      logMessage('Lexi pours you a strong drink. You feel reinvigorated. (+10 HP)');
      break;
    case 'Chat with a Biker': {
      const line = BIKER_DIALOGUES[Math.floor(Math.random() * BIKER_DIALOGUES.length)];
      logMessage(`Biker: “${line}”`);
      break;
    }
    case 'Inspect the Jukebox':
      logMessage('You tap the jukebox; it crackles and plays a throbbing synth‑rock tune.');
      break;
    case 'Play a Game of Pool':
      logMessage('You challenge a biker to pool. You win a couple rounds and some respect.');
      player.turns += 1;
      break;
    case 'Check the Bulletin Board':
      logMessage('The bulletin board is cluttered with hand‑scrawled notes: “Lost helmet,” “Band needs drummer.”');
      break;
    case 'Search Behind the Bar': {
      const found = Math.random() < 0.5;
      if (found) {
        const item = Math.random() < 0.5 ? 'Health Potion' : 'Lockpick';
        player.inventory.push(item);
        logMessage(`You rummage behind the bar and find a ${item}!`);
      } else {
        logMessage('You search behind the bar but find nothing of interest.');
      }
      break;
    }
    case 'Take a Short Rest':
      player.heal(5);
      player.turns += 2;
      logMessage('You lean back and catch your breath. (+5 HP, +2 turns)');
      break;
    case 'Check Inventory':
      logMessage(`You check your belongings: ${player.inventory.join(', ')}`);
      break;
    case 'Start a Bar Brawl':
      player.hp -= 10;
      logMessage('Fists fly and chairs break. You emerge victorious but bruised. (-10 HP)');
      break;
    default:
      logMessage('You hesitate, doing nothing of note.');
  }
  // Action consumes one turn
  player.turns -= 1;
  updateStats();
  if (checkGameOver()) return;
  startTurn();
}

// ---------------------------------------------------------------------
// 7. GAME FLOW FUNCTIONS
// ---------------------------------------------------------------------

// Start the next turn: Demiurge draws a card, then decision cards are
// generated and rendered.  Stats are updated at the beginning of
// each turn.
function startTurn() {
  updateStats();
  if (checkGameOver()) return;
  demiurgeTurn();
  updateStats();
  const cards = generateDecisionCards();
  renderDecisionCards(cards);
}

// Begin the game by presenting a world intro and initial hand.  This
// function also attaches event listeners for the inspect and quit
// buttons.
function startGame() {
  // Clear any existing log
  logEl.innerHTML = '';
  // Intro narrative
  logMessage('Welcome to the Neon Biker Bar, where synthwave hums and engines purr.');
  logMessage('Your goal: survive 60 turns and unravel the Demiurge’s tricks.');
  updateStats();
  // Attach controls
  inspectBtn.addEventListener('click', inspectIllusions);
  quitBtn.addEventListener('click', () => {
    logMessage('You decide you’ve had enough and leave the bar. Game Over.');
    disableCards();
  });
  // Start first turn
  startTurn();
}

// Automatically start the game when the DOM is ready
document.addEventListener('DOMContentLoaded', startGame);