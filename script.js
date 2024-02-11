import {
  WaterColorBrush,
  WaterDrop,
  BugBrush,
  MilkyWayBrush,
} from "./brush.js";
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
const brushSelector = document.getElementById("brushSelector");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let isDragging = false;
let selectedBrushType = brushSelector.value;

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
const milkyWays = [];
const waterDrops = [];

const brushFunctions = {};

const buildBrushFunctions = () => {
  switch (selectedBrushType) {
    case brushType.WaterColorBrush:
      brushFunctions.animate = () => {
        drawCircles(ctx, circlesArray);
        new WaterColorBrush({
          ctx,
          mouse,
          moistureLevel: Number(moistureLevelElement.value),
          brushSize: Number(brushSizeElement.value),
          selectedColor,
        }).cursor({ size: Number(brushSizeElement.value) * 1.5 });
      };
      brushFunctions.click = () => {
        handleCircles();
      };
      brushFunctions.drag = () => {
        const brushVoulumn = 5; // 브러쉬를 풍성하게. 높을수록 많은 양
        for (let i = 0; i < brushVoulumn; i++) {
          handleCircles();
        }
      };
      break;

    case brushType.BugBrush:
      brushFunctions.animate = () => {
        bugBrushes.forEach((i) => i.update());
        bugBrushes.forEach((i) => i.draw(ctx));
      };
      brushFunctions.drag = () => {
        bugBrushes.push(
          new BugBrush({ x: mouse.x, y: mouse.y, selectedColor })
        );
      };
      break;

    case brushType.WaterDrop:
      brushFunctions.animate = () => {
        drawWaterDrops(ctx, waterDrops);
        new WaterDrop({
          ctx,
          mouse,
          canvas,
        }).cursor({ size: 40 });
      };
      brushFunctions.click = () => {
        waterDrops.push(
          new WaterDrop({
            ctx,
            mouse,
            canvas,
            waterDrops,
          })
        );
      };
      brushFunctions.drag = () => {
        timer++;
        if (timer >= interval) {
          timer = 0;
          waterDrops.push(
            new WaterDrop({
              ctx,
              mouse,
              canvas,
              waterDrops,
            })
          );
        }
      };
      break;

    case brushType.MilkyWayBrush:
      brushFunctions.animate = () => {
        milkyWays.forEach((i) => i.update());
        milkyWays.forEach((i) => i.draw(ctx));
      };
      brushFunctions.drag = () => {
        milkyWays.push(new MilkyWayBrush({ x: mouse.x, y: mouse.y }));
      };
      break;
  }
};

const animate = () => {
  clearCanvas({ ctx, canvas });
  brushFunctions.animate?.();
  requestAnimationFrame(animate);
};

animate();
buildBrushFunctions();

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

  brushFunctions.click?.();
};

let timer = 0;
const interval = 20;
const handleMoveAction = (e) => {
  mouse.x = e.x;
  mouse.y = e.y;

  if (!isDragging) return;

  brushFunctions.drag?.();
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

brushSelector.addEventListener("change", (e) => {
  selectedBrushType = e.target.value;
  buildBrushFunctions();
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
