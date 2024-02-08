import { WaterColorBrush, WaterDrop, BugBrush } from "./brush.js";
import { rgbToHsl, hexToRgb, clearCanvas } from "./utils.js";
import { drawCircles, drawWaterDrops } from "./brushUtils.js";
import { brushType } from "./type.js";

/**
 * TODO:
 * - 마우스 커서에 내가 그릴 브러쉬 모양이 미리 보이게
 * - 지우개(그린걸 남길 수 있게 된 경우)
 */

const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");

const moistureLevelElement = document.querySelector(".moistureLevel");
const brushSizeElement = document.querySelector(".brushSize");

const colorPicker = document.getElementById("colorPicker");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let isDragging = false;

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
  s: undefined, // 아직 사용 안함
  l: undefined, // 아직 사용 안함
};

const circlesArray = [];
const bugBrushes = [];
const waterDrops = [];

// todo: 모든 브러시에 cursor 표현할 수 있도록 구조 변경
const cursor = () => {
  const waterDrop = new WaterDrop({
    ctx,
    mouse,
    canvas,
    size: 50,
  });
  waterDrop.draw();
};

const animate = () => {
  clearCanvas({ ctx, canvas });

  if (brushSelector.value === brushType.WaterColorBrush) {
    drawCircles(ctx, circlesArray);
  }
  if (brushSelector.value === brushType.BugBrush) {
    bugBrushes.forEach(i => i.update());
    bugBrushes.forEach(i => i.draw(ctx));
    requestAnimationFrame(animate);
    return;
  }
  if (brushSelector.value === brushType.WaterDrop) {
    drawWaterDrops(ctx, waterDrops);
    cursor();
  }

  requestAnimationFrame(animate);
};

animate();

const handleCircles = () => {
  circlesArray.push(
    new WaterColorBrush({
      ctx,
      mouse,
      moistureLevel: Number(moistureLevelElement.value),
      brushSize: Number(brushSizeElement.value),
      selectedColor,
    })
  );
};

const handleClickAction = (e) => {
  isDragging = true;

  mouse.x = e.x;
  mouse.y = e.y;

  if (brushSelector.value === brushType.WaterColorBrush) {
    handleCircles();
  } else if (brushSelector.value === brushType.WaterDrop) {
    waterDrops.push(
      new WaterDrop({
        ctx,
        mouse,
        canvas,
      })
    );

    // brush.draw();
  }
};

const handleMoveAction = (e) => {
  mouse.x = e.x;
  mouse.y = e.y;

  if (!isDragging) return;

  if (brushSelector.value === brushType.WaterColorBrush) {
    const brushVoulumn = 5; // 브러쉬를 풍성하게. 높을수록 많은 양

    for (let i = 0; i < brushVoulumn; i++) {
      handleCircles();
    }
  } else if (brushSelector.value === brushType.BugBrush) {
    bugBrushes.push(new BugBrush({ x: e.x, y: e.y, selectedColor }));
  }
};

const handleReleaseAction = () => {
  isDragging = false;
};

canvas.addEventListener("mousedown", (e) => handleClickAction(e));
canvas.addEventListener("mousemove", (e) => handleMoveAction(e));
canvas.addEventListener("mouseup", () => handleReleaseAction());

canvas.addEventListener("touchstart", (e) => {
  e.preventDefault();
  e.x = e.changedTouches[0].pageX;
  e.y = e.changedTouches[0].pageY;
  handleClickAction(e);
});
canvas.addEventListener("touchmove", (e) => {
  e.preventDefault();
  e.x = e.changedTouches[0].pageX;
  e.y = e.changedTouches[0].pageY;
  handleMoveAction(e);
});
canvas.addEventListener("touchend", () => handleReleaseAction());

brushSelector.addEventListener("change", () => {
  clearCanvas({ ctx, canvas });
});

function updateColor() {
  const color = colorPicker.value;
  const hslColor = rgbToHsl(hexToRgb(color));

  selectedColor.h = hslColor[0];
  selectedColor.s = hslColor[1];
  selectedColor.l = hslColor[2];
}

colorPicker.addEventListener("change", () => updateColor());
