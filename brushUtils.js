export const drawCircles = (ctx, circlesArray) => {
  for (let i = 0; i < circlesArray.length; i++) {
    const circleI = circlesArray[i];
    circleI.update();
    circleI.draw();

    // 이미 그려진 궤적과 합치기 위해서 그려진 점들을 연결한다.
    // for (let j = i; j < circlesArray.length; j++) {
    //   const cicleJ = circlesArray[j];
    //   // 피타고라스 이용해서 점 간 거리를 구하기. (기울기)
    //   const dx = cicleI.x - cicleJ.x;
    //   const dy = cicleI.y - cicleJ.y;
    //   const distance = Math.sqrt(dx * dx + dy + dy);

    //   if (distance < 100) {
    //     ctx.beginPath();
    //     ctx.strokeStyle = `hsl(${cicleI.color},${cicleI.colorSaturationLevel}%,${cicleI.colorLightnessLevel}%)`; //cicleI.color;
    //     ctx.lineWidth = cicleI.size / 10; // 점 사이를 이어주는 선 굵기. 나눠주는 수가 커지면 더 정교해짐
    //     ctx.moveTo(cicleI.x, cicleI.y);
    //     ctx.lineTo(cicleJ.x, cicleJ.y);
    //     ctx.stroke();
    //   }
    // }

    // 원이 흐려지고 있는 중이라면, 원을 아예 제거하기
    if (circlesArray[i].isFading) {
      circlesArray.splice(i, 1);
      i--;
    }
  }
};

export const drawWaterDrops = (ctx, list) => {
  for (let i = 0; i < list.length; i++) {
    list[i].update();
    list[i].draw();

    if (list[i].isOutOfCanvas()) {
      list.splice(i, 1);
      i--;
    }
  }
};
