import { ConvexBrush, WaterColorBrush, WaterDropBrush, BugBrush } from "./brush.js";
import { rgbToHsl, hexToRgb, clearCanvas } from "./utils.js";
import { drawCircles } from "./brushUtils.js";
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
  s: undefined, // 아직 사용 안함
  l: undefined, // 아직 사용 안함
};

const circlesArray = [];

const animate = () => {
  if (brushSelector.value === brushType.WaterColorBrush) {
    drawCircles(ctx, circlesArray);
  }
  if (brushSelector.value === brushType.BugBrush) {
    clearCanvas({ ctx, canvas });
    circlesArray.forEach(i => i.update());
    circlesArray.forEach(i => i.draw(ctx));
    requestAnimationFrame(animate);
    return
  }
  if (brushSelector.value !== brushType.WaterColorBrush) return;

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

window.addEventListener("mousemove", (e) => {
  if (!isDrawing) return;

  mouse.x = e.x;
  mouse.y = e.y;

  if (brushSelector.value === brushType.WaterColorBrush) {
    const brushVoulumn = 5; // 브러쉬를 풍성하게. 높을수록 많은 양

    for (let i = 0; i < brushVoulumn; i++) {
      handleCircles();
    }
  } else if (brushSelector.value === brushType.BugBrush) {
    circlesArray.push(new BugBrush({ x: e.x, y: e.y, selectedColor }));
  }
});

window.addEventListener("mousedown", (e) => {
  isDrawing = true;

  mouse.x = e.x;
  mouse.y = e.y;

  if (brushSelector.value === brushType.WaterColorBrush) {
    handleCircles();
  } else if (brushSelector.value === brushType.WaterDropBrush) {
    const brush = new WaterDropBrush({ ctx, mouse });
    brush.draw();
  }
});

window.addEventListener("mouseup", () => {
  isDrawing = false;
});

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
