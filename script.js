const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// const 로 따로 선언된 변수들은 추후에 입력 값으로 받을 것.
class Root {
  constructor(x, y) {
    this.x = x;
    this.y = y;

    const moistureLevel = 2; // 도화지가 촉촉한 정도. 높을수록 많이, 빠르게 퍼짐
    this.speedX = Math.random() * (moistureLevel * 2) - moistureLevel;
    this.speedY = Math.random() * (moistureLevel * 2) - moistureLevel;

    const finalMinSize = 5; // 다 퍼졌을때, 마지막 생성된 원의 최소 크기
    const finalMaxSize = 12;
    this.maxSize = Math.random() * (finalMaxSize - finalMinSize) + finalMinSize; // 이 값이 클수록 완전히 퍼지는데 걸리는 시간은 오래 걸린다.
    this.size = Math.random() * 1 + 2;

    this.velocitySize = Math.random() * 0.2 + 0.05; // 최대 사이즈에 도달할 때까지 랜덤한 속도로 퍼지기 위함
    this.velocityAngleX = Math.random() * 0.6 - 0.3;
    this.angleX = Math.random() * 6.2;
    this.velocityAngleY = Math.random() * 0.6 - 0.3;
    this.angleY = Math.random() * 6.2;

    this.lightness = 10;
  }
  update() {
    this.x += this.speedX + Math.sin(this.angleX);
    this.y += this.speedY + Math.sin(this.angleY);
    this.size += this.velocitySize;
    this.angleX += this.velocityAngleX;
    this.angleY += this.velocityAngleY;

    if (this.lightness < 90) {
      this.lightness += 1;
    }

    if (this.size < this.maxSize) {
      ctx.beginPath(); // 새로운 경로 시작
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); // 원 그리기. (x, y)는 중심 좌표, size는 반지름
      ctx.fillStyle = `hsl(140,100%,${this.lightness}%)`; // 색상, 채도, 명도
      ctx.fill(); // 설정된 색상으로 원의 내부를 채우기
      ctx.stroke(); // 원의 테두리
      requestAnimationFrame(() => this.update());
    }
  }
}

window.addEventListener("mousemove", function (e) {
  const root = new Root(e.x, e.y);
  root.update();
});
