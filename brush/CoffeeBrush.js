export class CoffeeBrush {
  constructor({ ctx, mouse, canvas, coffeeCircles }) {
    this.ctx = ctx;
    this.x = mouse.x;
    this.y = mouse.y;
    this.canvas = canvas;
    this.coffeeCircles = coffeeCircles;

    this.size = Math.random() * 80 + 10;

    this.radius = Math.floor(Math.random() * 15 + 10);

    const speed = 0.2;
    this.velocityX = Math.random() * (speed * 2) - speed;
    this.velocityY = Math.random() * (speed * 2) - speed;

    this.time = 0;
    this.maxTime = 800;
    this.isDelete = false;
  }
  connectCircles() {
    const ctx = this.ctx;
    const list = this.coffeeCircles;
    if (!list) return;
    const MAX_DISTANCE_TO_CONNECT = 100;

    for (let i = 0; i < list.length; i++) {
      for (let j = i; j < list.length; j++) {
        const dx = list[i].x - list[j].x;
        const dy = list[i].y - list[j].y;
        const distance = Math.hypot(dx, dy);
        if (distance < MAX_DISTANCE_TO_CONNECT) {
          const opacity = 1 - distance / MAX_DISTANCE_TO_CONNECT;
          ctx.save();
          ctx.globalAlpha = opacity;
          ctx.strokeStyle = "red";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(list[i].x, list[i].y);
          ctx.lineTo(list[j].x, list[j].y);
          ctx.stroke();
          ctx.restore();
        }
      }
    }
  }
  update() {
    this.time++;
    if (this.time > this.maxTime) {
      this.isDelete = true;
    }

    this.connectCircles();

    this.x += this.velocityX;
    this.y += this.velocityY;

    const isTouchingLeftSide = this.x < this.radius;
    const isTouchingRightSide = this.x > this.canvas.width - this.radius;
    const isTouchingTop = this.y < this.radius;
    const isTouchingBottom = this.y > this.canvas.height - this.radius;

    if (isTouchingLeftSide || isTouchingRightSide) this.velocityX *= -1;
    if (isTouchingTop || isTouchingBottom) this.velocityY *= -1;
  }
  draw() {
    // this.ctx.fillStyle = `hsl(${this.color},${this.colorSaturationLevel}%,${this.colorLightnessLevel}%)`; // 색상, 채도, 명도
    this.ctx.fillStyle = "brown";
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    this.ctx.fill();
  }
  cursor({ size }) {
    // this.ctx.fillStyle = `hsl(${this.color},${this.colorSaturationLevel}%,${this.colorLightnessLevel}%)`; // 색상, 채도, 명도
    this.ctx.fillStyle = "brown";
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, size, 0, Math.PI * 2);
    this.ctx.fill();
  }
}
