const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const naveImg = new Image();
const enemigoImg = new Image();
const fondo = new Image();
const disparoImg = new Image();

naveImg.src = "assets/nave.png";
enemigoImg.src = "assets/enemigo.png";
fondo.src = "assets/fondo.png";
disparoImg.src = "assets/disparo.png";

let nave = { x: 208, y: 580, w: 64, h: 64 };
let disparos = [];
let enemigos = [];
let puntos = 0;
let gameOver = false;

function crearOleada() {
  enemigos = [];
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 3; j++) {
      enemigos.push({ x: 60 + i * 70, y: 40 + j * 60, w: 48, h: 48 });
    }
  }
}

function startGame() {
  document.getElementById('intro').style.display = 'none';
  canvas.style.display = 'block';
  crearOleada();
  gameLoop();
}

window.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") nave.x -= 15;
  if (e.key === "ArrowRight") nave.x += 15;
  if (e.key === " " || e.key === "ArrowUp") {
    disparos.push({ x: nave.x + 28, y: nave.y });
  }
});

canvas.addEventListener("click", () => {
  disparos.push({ x: nave.x + 28, y: nave.y });
});

function gameLoop() {
  if (gameOver) {
    ctx.fillStyle = "white";
    ctx.font = "30px monospace";
    ctx.fillText("MUZZ DESTROYED!", 120, 320);
    return;
  }

  ctx.drawImage(fondo, 0, 0, canvas.width, canvas.height);
  ctx.drawImage(naveImg, nave.x, nave.y, nave.w, nave.h);

  for (let i = disparos.length - 1; i >= 0; i--) {
    const d = disparos[i];
    d.y -= 8;
    ctx.drawImage(disparoImg, d.x, d.y, 8, 16);
    if (d.y < 0) disparos.splice(i, 1);
  }

  for (let i = enemigos.length - 1; i >= 0; i--) {
    const e = enemigos[i];
    e.y += 0.5;
    ctx.drawImage(enemigoImg, e.x, e.y, e.w, e.h);

    if (e.x < nave.x + nave.w && e.x + e.w > nave.x && e.y + e.h > nave.y) {
      gameOver = true;
    }

    for (let j = disparos.length - 1; j >= 0; j--) {
      const d = disparos[j];
      if (d.x < e.x + e.w && d.x + 8 > e.x && d.y < e.y + e.h && d.y + 16 > e.y) {
        enemigos.splice(i, 1);
        disparos.splice(j, 1);
        puntos += 10;
        break;
      }
    }
  }

  ctx.fillStyle = "white";
  ctx.font = "16px monospace";
  ctx.fillText("Puntos: " + puntos, 10, 20);

  requestAnimationFrame(gameLoop);
}
