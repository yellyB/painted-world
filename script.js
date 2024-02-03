const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

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

    this.angle = Math.random() * 6.2;
  }
  update() {
    this.x += this.speedX + Math.sin(this.angle);
    this.y += this.speedY + Math.sin(this.angle);
    this.size += 0.1;
    this.angle += 0.1;
    if (this.size < this.maxSize) {
      ctx.beginPath(); // 새로운 경로 시작
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); // 원 그리기. (x, y)는 중심 좌표, size는 반지름
      ctx.fillStyle = "hsl(140,100%,50%)"; // 색상, 채도, 명도
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