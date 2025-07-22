/* Simple endless-runner style demo with swipe controls        */
/* Uses pointer events (works for touch AND mouse)             */

const canvas = /** @type {HTMLCanvasElement} */(document.getElementById("gameCanvas"));
const ctx     = canvas.getContext("2d");

function resize() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resize, {passive:true});
resize();

/* Load images */
const playerImg = new Image();
playerImg.src = "assets/player.png";
const obstacleImg = new Image();
obstacleImg.src = "assets/obstacle.png";

/* ---- Game state ---- */
let player = {x:50, y:canvas.height/2, size:30, vy:0};
let obstacles = [];
let lastTime=0;

/* ---- Touch / Mouse controls ---- */
let startX=0, startY=0, swiping=false;
canvas.addEventListener("pointerdown", e=>{
  startX=e.clientX; startY=e.clientY; swiping=true;
});
canvas.addEventListener("pointerup", e=>{
  if(!swiping) return;
  const dx=e.clientX-startX, dy=e.clientY-startY;
  if(Math.abs(dx) > Math.abs(dy)){       // horizontal swipe
      if(dx>30) move("right"); else if(dx<-30) move("left");
  } else {
      if(dy>30) move("down"); else if(dy<-30) move("up");
  }
  swiping=false;
});
document.querySelectorAll("#buttons button").forEach(btn=>{
  btn.onclick=()=>move(btn.dataset.dir);
});
function move(dir){
  const speed=60;
  if(dir==="up")   player.vy=-speed;
  if(dir==="down") player.vy= speed;
}

/* ---- Main loop ---- */
function loop(ts){
  const dt=(ts-lastTime)/1000;
  lastTime=ts;

  update(dt);
  draw();

  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);

function update(dt){
  /* gravity-ish decay so swipe is impulse-like */
  player.y += player.vy*dt;
  player.vy *= 0.9;

  // stay on screen
  if(player.y<player.size) {player.y=player.size; player.vy=0;}
  if(player.y>canvas.height-player.size){player.y=canvas.height-player.size; player.vy=0;}

  // spawn and move obstacles
  if(Math.random() < 1*dt){
    const size=30+Math.random()*20;
    obstacles.push({x:canvas.width+size, y:Math.random()*(canvas.height-size*2)+size,
                    size});
  }
  obstacles.forEach(o=>o.x-=200*dt);
  obstacles = obstacles.filter(o=>o.x+o.size>0);

  // collision
  obstacles.forEach(o=>{
    if(Math.hypot(player.x-o.x, player.y-o.y) < player.size+o.size){
      reset();
    }
  });
}
function draw(){
  ctx.clearRect(0,0,canvas.width,canvas.height);

  // player
  if (playerImg.complete) {
    ctx.drawImage(playerImg, player.x - player.size, player.y - player.size, player.size*2, player.size*2);
  } else {
    ctx.fillStyle="#4af";
    ctx.beginPath(); ctx.arc(player.x,player.y,player.size,0,Math.PI*2); ctx.fill();
  }

  // obstacles
  obstacles.forEach(o=>{
    if (obstacleImg.complete) {
      ctx.drawImage(obstacleImg, o.x - o.size, o.y - o.size, o.size * 2, o.size * 2);
    } else {
      ctx.fillStyle="#fa4";
      ctx.beginPath(); ctx.arc(o.x,o.y,o.size,0,Math.PI*2); ctx.fill();
    }
  });
}
function reset(){
  player.y  = canvas.height/2;
  player.vy = 0;
  obstacles = [];
}
