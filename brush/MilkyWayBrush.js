import { Vector } from "./Vector.js";

export class MilkyWayBrush {
  constructor({ x, y }) {
    this.age = 0;
    // 우주
    this.posDistance = Math.random() * 25 + 50;
    this.pos = new Vector(0, 1)
      .rotate(Math.random() * Math.PI * 2)
      .scale(this.posDistance)
      .add(new Vector(x, y));
    this.radius = Math.random() * 10 + 50;
    this.bgColor = 245;
    this.bgSaturation = 70;
    const bgLightnessMin = 4;
    const bgLightnessMax = 6;
    this.bgLightness =
      Math.random() * (bgLightnessMax - bgLightnessMin) + bgLightnessMin;
    this.bgOpacity = 0;
    // 별
    this.starSpeed = 0.05;
    this.starCount = Math.floor(Math.random() * 3 + 5);
    this.stars = Array.from({ length: this.starCount }, () =>
      this.createStar()
    );
    // 태양(낮은 확률로)
    if (Math.random() < 0.01) {
      this.stars.push(this.createSun());
    }
  }
  update() {
    // 배경은 처음엔 가파르게, 갈수록 완만하게 선명해진다.
    this.bgOpacity = Math.min(1, Math.log2(this.age + 1) / 5);
    // 별 이동
    this.stars.forEach((star) => {
      star.pos = star.pos.add(star.velocity);
      if (star.pos.subtract(this.pos).magnitude() > this.radius) {
        star.pos = star.sourcePos;
      }
    });
    // 나이 증가
    this.age += 1;
  }
  draw(ctx) {
    this.drawBackground(ctx);
    this.drawStars(ctx);
  }
  drawBackground(ctx) {
    ctx.save();
    ctx.fillStyle = `hsla(${this.bgColor},${this.bgSaturation}%,${this.bgLightness}%,${this.bgOpacity})`;
    ctx.beginPath();
    ctx.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
  drawStars(ctx) {
    ctx.save();
    this.stars.forEach((star) => {
      ctx.fillStyle = star.color;
      ctx.beginPath();
      ctx.arc(star.pos.x, star.pos.y, star.radius, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.restore();
  }
  createStar() {
    const angle = Math.random() * Math.PI * 2;
    const pos = new Vector(0, 1).rotate(angle).scale(this.radius).add(this.pos);
    const radius = Math.random() * 0.2 + 0.3;
    const angleVelocity = Math.random() * Math.PI * 2;
    const velocity = new Vector(0, 1)
      .rotate(angleVelocity)
      .scale(Math.random() * this.starSpeed);
    return {
      sourcePos: pos,
      pos,
      velocity,
      radius,
      color: `hsl(0, 0%, 100%)`,
    };
  }
  createSun() {
    return {
      sourcePos: this.pos,
      pos: this.pos,
      velocity: new Vector(0, 0),
      radius: Math.random() * 1 + 2,
      color: `hsl(40, 100%, 50%)`,
    };
  }
}
