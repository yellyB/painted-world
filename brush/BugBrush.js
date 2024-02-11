import { Vector } from "./Vector.js";

export class BugBrush {
  constructor({ x, y, selectedColor }) {
    this.dst = new Vector(x, y); // 벌레가 가야할 목적지
    this.angle = Math.random() * Math.PI * 2; // 랜덤한 각도로
    this.startDistance = Math.random() * 100 + 50; // 랜덤한 거리로
    this.pos = this.dst.subtract(
      this.dst.rotate(this.angle).unit().multiply(this.startDistance)
    ); // 거리를 두고 시작
    this.velocity = new Vector(0, 0); // 속도
    this.size = 3;
    this.color = selectedColor.h;
    this.colorLightnessLevel = 50;
    this.colorSaturationLevel = 100;
    this.age = 0;
    this.speed = Math.random() * 0.005 + 0.01;
    this.opacity = 0;
    this.destinationThreshold = Math.random() * 10 + 5;
    this.phases = [
      { t: 0, velocity: new Vector(0, 0) },
      { t: 60, velocity: this.dst.subtract(this.pos).multiply(0.01) },
    ].reverse();
    this.legs = [
      {
        start: new Vector(1, 0).rotate((Math.PI * 20) / 16).scale(this.size),
        joints: [
          {
            angle: (Math.PI * 20) / 16,
            length: 6,
            bz1: Math.PI,
            bz2: Math.PI / 2,
          },
          {
            angle: (Math.PI * 11) / 16,
            length: 10,
            bz1: Math.PI,
            bz2: (Math.PI * 3) / 2,
          },
        ],
      },
      {
        start: new Vector(1, 0).rotate(Math.PI).scale(this.size),
        joints: [
          {
            angle: (Math.PI * 18) / 16,
            length: 3,
            bz1: Math.PI,
            bz2: (Math.PI * 3) / 2,
          },
          {
            angle: (Math.PI * 11) / 16,
            length: 6,
            bz1: Math.PI,
            bz2: Math.PI / 2,
          },
        ],
      },
      {
        start: new Vector(1, 0).rotate((Math.PI * 12) / 16).scale(this.size),
        joints: [
          {
            angle: (Math.PI * 10) / 16,
            length: 3,
            bz1: (Math.PI * 12) / 16,
            bz2: (Math.PI * 3) / 2,
          },
          {
            angle: (Math.PI * 6) / 16,
            length: 3,
            bz1: Math.PI / 2,
            bz2: (Math.PI * 20) / 16,
          },
        ],
      },
      // opposite side (mirrored)
      {
        start: new Vector(1, 0).rotate((Math.PI * 28) / 16).scale(this.size),
        joints: [
          { angle: (Math.PI * 28) / 16, length: 6, bz1: 0, bz2: Math.PI / 2 },
          {
            angle: (Math.PI * 5) / 16,
            length: 10,
            bz1: 0,
            bz2: (Math.PI * 3) / 2,
          },
        ],
      },
      {
        start: new Vector(1, 0).rotate(0).scale(this.size),
        joints: [
          {
            angle: (Math.PI * 30) / 16,
            length: 3,
            bz1: 0,
            bz2: (Math.PI * 3) / 2,
          },
          { angle: (Math.PI * 5) / 16, length: 6, bz1: 0, bz2: Math.PI / 2 },
        ],
      },
      {
        start: new Vector(1, 0).rotate(Math.PI / 4).scale(this.size),
        joints: [
          {
            angle: (Math.PI * 6) / 16,
            length: 3,
            bz1: Math.PI / 4,
            bz2: (Math.PI * 3) / 2,
          },
          {
            angle: (Math.PI * 10) / 16,
            length: 3,
            bz1: Math.PI / 2,
            bz2: (Math.PI * 28) / 16,
          },
        ],
      },
    ];
  }
  update() {
    this.age += 1;
    const currentPhase = this.phases.find((phase) => this.age > phase.t);
    if (!currentPhase) return;
    this.velocity = currentPhase.velocity;
    if (this.pos.subtract(this.dst).magnitude() < this.destinationThreshold) {
      this.velocity = new Vector(0, 0);
    }
    this.pos = this.pos.add(this.velocity);
    this.opacity = Math.min(1, this.age / 60);
  }
  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = this.opacity;
    this.drawLegs(ctx);
    this.drawBody(ctx);
    ctx.restore();
  }
  drawBody(ctx) {
    ctx.fillStyle = `hsl(${this.color},${this.colorSaturationLevel}%,${this.colorLightnessLevel}%)`;
    ctx.beginPath();
    ctx.arc(this.pos.x, this.pos.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
  drawLegs(ctx) {
    ctx.beginPath();
    ctx.lineWidth = 0.5;
    ctx.strokeStyle = `hsl(${this.color},${this.colorSaturationLevel * 0.2}%,${
      this.colorLightnessLevel
    }%)`;
    this.legs.forEach((leg) => {
      let start = leg.start.add(this.pos);
      ctx.moveTo(start.x, start.y);
      leg.joints.forEach((joint) => {
        const dest = start.add(
          new Vector(1, 0).rotate(joint.angle).scale(joint.length)
        );
        const startBezier = start.add(
          new Vector(1, 0).rotate(joint.bz1).scale(joint.length / 4)
        );
        const destBezier = dest.add(
          new Vector(1, 0).rotate(joint.bz2).scale(joint.length / 4)
        );
        ctx.bezierCurveTo(
          startBezier.x,
          startBezier.y,
          destBezier.x,
          destBezier.y,
          dest.x,
          dest.y
        );
        start = dest;
      });
    });
    ctx.stroke();
  }
}
