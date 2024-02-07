import { WaterColorBrush_Old, ConvexBrush, WaterColorBrush } from "./brush.js";
import { rgbToHsl, hexToRgb, clearCanvas } from "./utils.js";
import { drawCircles } from "./brushUtils.js";
import { brushType } from "./type.js";

const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
const brushSelector = document.getElementById("brushSelector");

const moistureLevelElement = document.querySelector(".moistureLevel");
const brushSizeElement = document.querySelector(".brushSize");

const colorPicker = document.getElementById("colorPicker");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let isDrawing = false;

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

const mouse = {
  x: undefined,
  y: undefined,
};

const selectedColor = {
  h: 0,
  s: undefined,
  l: undefined,
};

const circlesArray = [];

const animate = () => {
  if (brushSelector.value !== brushType.WaterColorBrush) return;

  drawCircles(ctx, circlesArray);
  requestAnimationFrame(animate);
};

animate();

const handleCircles = () => {
  circlesArray.push(
    new WaterColorBrush({
      mouse,
      moistureLevel: Number(moistureLevelElement.value),
      brushSize: Number(brushSizeElement.value),
      selectedColor,
    })
  );
};

window.addEventListener("mousemove", (e) => {
  if (!isDrawing) return;

  let brush;
  const brushVoulumn = 5; // 브러쉬를 풍성하게. 높을수록 많은 양

  for (let i = 0; i < brushVoulumn; i++) {
    switch (brushSelector.value) {
      case brushType.WaterColorBrush:
        mouse.x = e.x;
        mouse.y = e.y;
        handleCircles();
        break;
      case brushType.WaterColorBrush_Old:
        brush = new WaterColorBrush_Old(e.x, e.y);
        break;
      case brushType.ConvexBrush:
        brush = new ConvexBrush(e.x, e.y);
        break;
    }

    brush?.update(ctx);
  }
});

window.addEventListener("mousedown", (e) => {
  isDrawing = true;

  if (brushSelector.value === brushType.WaterColorBrush) {
    mouse.x = e.x;
    mouse.y = e.y;

    handleCircles();
  }
});

window.addEventListener("mouseup", () => {
  isDrawing = false;
});

brushSelector.addEventListener("change", () => {
  clearCanvas({ ctx, canvas });

  switch (brushSelector.value) {
    case brushType.WaterColorBrush:
      animate();
      canvas.classList.add("water-color-brush");
      break;
    case brushType.WaterColorBrush_Old:
      canvas.classList.remove("water-color-brush");
      break;
    case brushType.ConvexBrush:
      canvas.classList.remove("water-color-brush");
      break;
  }
});

function updateColor() {
  const color = colorPicker.value;
  const hslColor = rgbToHsl(hexToRgb(color));

  selectedColor.h = hslColor[0];
  selectedColor.s = hslColor[1];
  selectedColor.l = hslColor[2];
}

colorPicker.addEventListener("change", () => updateColor());
