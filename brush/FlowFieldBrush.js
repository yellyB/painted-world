import { Vector } from "./Vector.js";

class Brush {
  constructor({ mouse, canvas, color, thickness, flowField }) {
    this.mouse = mouse;
    this.canvas = canvas;
    this.color = color;

    const gap = 20;
    this.pos = new Vector(
      mouse.x + Math.floor(Math.random() * (gap * 2) - gap),
      mouse.y + Math.floor(Math.random() * (gap * 2) - gap)
    );
    this.angle = 0;
    const direction = Math.random() > 0.5 ? 1 : -1;
    this.speed = Math.floor(Math.random() * 4 + 1) * direction;
    this.velocity = new Vector(0, 0);
    this.trajectories = [this.pos]; // 궤적
    this.maxLenOfTrajectory = Math.floor(Math.random() * 100 + 20); // 20~100
    this.initVital = Math.floor(Math.random() * 100 + 40);
    this.vital = this.initVital;
    this.isDie = false;

    this.thickness = Math.abs(thickness);
    this.colorLevel = Math.floor(Math.random() * 100 + 60);

    this.flowField = flowField.get();
    this.cellSize = flowField.getCellSize();
  }
  update() {
    this.vital--;

    if (this.vital < 1) {
      this.isDie = true;
      return;
    }

    let currRowIndex = Math.floor(this.pos.y / this.cellSize);
    let currColIndex = Math.floor(this.pos.x / this.cellSize);

    try {
      this.angle = this.flowField[currRowIndex][currColIndex];
    } catch (e) {
      this.isDie = true;
      return;
    }

    this.velocity = new Vector(
      Math.cos(this.angle),
      Math.sin(this.angle)
    ).multiply(this.speed);
    this.pos = this.pos.add(this.velocity);
    this.trajectories.push(this.pos);
    if (this.trajectories.length > this.maxLenOfTrajectory) {
      this.trajectories = this.trajectories.slice(1);
    }
  }
  draw(ctx) {
    ctx.save();
    ctx.fillStyle = `hsl(${this.color},100%,${this.colorLevel}%)`;
    ctx.strokeStyle = `hsl(${this.color},100%,${this.colorLevel}%)`;
    ctx.lineWidth = this.thickness;
    ctx.globalAlpha = this.vital / this.initVital + 0.3;

    ctx.beginPath();
    ctx.arc(this.pos.x, this.pos.y, this.thickness / 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(this.trajectories[0].x, this.trajectories[0].y);
    this.trajectories.forEach((trajectory) =>
      ctx.lineTo(trajectory.x, trajectory.y)
    );
    ctx.stroke();
    ctx.restore();
  }
}

export class FlowFieldBrush {
  constructor({ ctx, mouse, canvas, thickness, flowField }) {
    this.ctx = ctx;
    this.mouse = mouse;
    this.canvas = canvas;
    this.thickness = Math.abs(thickness);
    this.flowField = flowField;
    this.brushes = [];
  }
  add({ color }) {
    this.brushes.push(
      new Brush({
        mouse: this.mouse,
        canvas: this.canvas,
        color,
        thickness: this.thickness,
        flowField: this.flowField,
      })
    );
  }
  filter() {
    this.brushes = this.brushes.filter((flowField) => !flowField.isDie);
  }
  update() {
    this.brushes.forEach((brush) => brush.update());
  }
  draw(ctx) {
    this.brushes.forEach((brush) => brush.draw(ctx));
  }
}
