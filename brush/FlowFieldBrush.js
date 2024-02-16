import { Vector } from "./Vector.js";

export class FlowFieldBrush {
  constructor({ ctx, mouse, canvas }) {
    this.ctx = ctx;
    this.mouse = mouse;
    this.canvas = canvas;

    const gap = 20;
    this.pos = new Vector(
      mouse.x + Math.floor(Math.random() * (gap * 2) - gap),
      mouse.y + Math.floor(Math.random() * (gap * 2) - gap)
    );
    this.angle = 0;
    this.speed = new Vector(1, 1);
    this.velocity = Math.floor(Math.random() * 3 + 1);
    this.trajectories = [this.pos]; // 궤적
    this.maxLenOfTrajectory = Math.floor(Math.random() * 100 + 20); // 20~100
    this.lives = Math.floor(Math.random() * 100 + 40);
    this.isDie = false;
    this.vectorMethod = ["add", "subtract"][Math.floor(Math.random() * 2)];

    // flow field
    this.cellSize = 20;
    this.rows;
    this.cols;
    this.flowField = [];
    this.generateFlowField();
  }
  generateFlowField() {
    const jiggleVolumn = 2;
    const zoom = 0.3;
    this.rows = Math.floor(this.canvas.height / this.cellSize);
    this.cols = Math.floor(this.canvas.width / this.cellSize);

    for (let row = 0; row < this.rows; row++) {
      this.flowField.push([]);
      for (let col = 0; col < this.cols; col++) {
        const angle =
          (Math.sin(row * zoom) + Math.cos(col * zoom)) * jiggleVolumn;
        this.flowField[row].push(angle);
      }
    }
  }
  update() {
    this.lives--;

    if (this.lives < 1) {
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

    const newSpeed = new Vector(
      Math.sin(this.angle) + this.velocity,
      Math.cos(this.angle) + this.velocity
    );
    this.pos = this.pos[this.vectorMethod](newSpeed);
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
  turnOnDebug(ctx) {
    ctx.save();
    ctx.strokeStyle = "cyan";
    ctx.lineWidth = 0.3;
    for (let row = 0; row < this.rows; row++) {
      ctx.beginPath();
      ctx.moveTo(0, this.cellSize * row);
      ctx.lineTo(this.canvas.width, this.cellSize * row);
      ctx.stroke();
    }
    for (let col = 0; col < this.cols; col++) {
      ctx.beginPath();
      ctx.moveTo(this.cellSize * col, 0);
      ctx.lineTo(this.cellSize * col, this.canvas.height);
      ctx.stroke();
    }
    ctx.restore();
  }
}
