const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
const brushSelector = document.getElementById("brushSelector");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let isDrawing = false;

const particlesArray = [];

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

const mouse = {
  x: undefined,
  y: undefined,
};

class Particle {
  constructor(x, y) {
    this.x = mouse.x;
    this.y = mouse.y;

    // this.x = Math.random() * canvas.width;
    // this.y = Math.random() * canvas.height;

    this.size = Math.random() * 15 + 1;

    const moistureLevel = 1.5; // 도화지가 촉촉한 정도. 높을수록 많이, 빠르게 퍼짐
    this.speedX = Math.random() * (moistureLevel * 2) - moistureLevel;
    this.speedY = Math.random() * (moistureLevel * 2) - moistureLevel;

    // const finalMinSize = 5; // 다 퍼졌을때, 마지막 생성된 원의 최소 크기
    // const finalMaxSize = 12;
    // this.maxSize = Math.random() * (finalMaxSize - finalMinSize) + finalMinSize; // 이 값이 클수록 완전히 퍼지는데 걸리는 시간은 오래 걸린다.

    // this.velocitySize = Math.random() * 0.2 + 0.05; // 최대 사이즈에 도달할 때까지 랜덤한 속도로 퍼지기 위함
    // this.velocityAngleX = Math.random() * 0.6 - 0.3;
    // this.angleX = Math.random() * 6.2;
    // this.velocityAngleY = Math.random() * 0.6 - 0.3;
    // this.angleY = Math.random() * 6.2;

    // this.lightness = 10;
  }
  update() {
    this.x += this.speedX; // + Math.sin(this.angleX);
    this.y += this.speedY; // + Math.sin(this.angleY);
    // this.size += this.velocitySize;
    // this.angleX += this.velocityAngleX;
    // this.angleY += this.velocityAngleY;

    if (this.size > 0.2) this.size -= 0.1; // 일정 이상 커지면 사라지게 // todo: 일단 적어둠. 나중 삭제
  }
  draw() {
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

const handleParticles = () => {
  for (let i = 0; i < particlesArray.length; i++) {
    console.log("i");
    particlesArray[i].update();
    particlesArray[i].draw();

    // todo: 일단 적어둠. 나중 삭제
    if (particlesArray[i].size <= 0.3) {
      particlesArray.splice(i, 1);
      i--;
    }
  }
};

const animate = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // 이건 점이 그냥 멀어짐
  // 아래는 점이 궤적 남기며 밀려나는듯한 모션
  // ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
  // ctx.fillRect(0, 0, canvas.width, canvas.height);

  handleParticles();
  requestAnimationFrame(animate);
};

animate();

const drawParticles = () => {
  for (let i = 0; i < 2; i++) {
    particlesArray.push(new Particle());
  }
};

window.addEventListener("mousemove", (e) => {
  mouse.x = e.x;
  mouse.y = e.y;

  drawParticles();
  if (!isDrawing) return;
});

window.addEventListener("click", (e) => {
  mouse.x = e.x;
  mouse.y = e.y;

  drawParticles();
});

window.addEventListener("mouseup", () => {
  isDrawing = false;
});
