import { Vector } from "./Vector.js";

export class FlowField {
  constructor({ canvas, jiggleVolumn, zoom }) {
    this.canvas = canvas;

    this.cellSize = 20;
    this.rows;
    this.cols;
    this.flowField = [];
    this.jiggleVolumn = jiggleVolumn;
    this.zoom = zoom;
    this.generate();
  }
  generate() {
    this.rows = Math.floor(this.canvas.height / this.cellSize);
    this.cols = Math.floor(this.canvas.width / this.cellSize);

    for (let row = 0; row < this.rows; row++) {
      this.flowField.push([]);
      for (let col = 0; col < this.cols; col++) {
        const angle =
          (Math.sin(row * this.zoom) + Math.cos(col * this.zoom)) *
          this.jiggleVolumn;
        this.flowField[row].push(angle);
      }
    }
  }
  get() {
    return this.flowField;
  }
  getCellSize() {
    return this.cellSize;
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
