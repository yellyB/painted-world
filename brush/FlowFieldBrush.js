import { Vector } from "./Vector.js";

export class FlowFieldBrush {
  constructor({ ctx, mouse, canvas }) {
    this.ctx = ctx;
    this.mouse = mouse;
    this.canvas = canvas;

    this.pos = new Vector(mouse.x, mouse.y);
    this.speed = Math.random() * 5 - 2.5;
    this.trajectories = [this.pos]; // 궤적
    this.maxLenOfTrajectory = Math.floor(Math.random() * 100 + 20); // 20~100
  }
  update() {
    const jiggleLevel = 8;

    this.pos = this.pos.add(
      new Vector(
        this.speed + Math.random() * (jiggleLevel * 2) - jiggleLevel,
        this.speed + Math.random() * (jiggleLevel * 2) - jiggleLevel
      )
    );
    this.trajectories.push(this.pos);
    if (this.trajectories.length > this.maxLenOfTrajectory) {
      this.trajectories = this.trajectories.slice(1);
    }
  }
  draw(ctx) {
    ctx.fillRect(this.pos.x, this.pos.y, 10, 10);

    ctx.beginPath();
    ctx.moveTo(this.trajectories[0].x, this.trajectories[0].y);
    this.trajectories.forEach((trajectory) =>
      ctx.lineTo(trajectory.x, trajectory.y)
    );
    ctx.stroke();
  }
}
