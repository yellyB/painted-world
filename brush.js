// const 로 따로 선언된 변수들은 추후에 입력 값으로 받을 것.

export class ConvexBrush {
  constructor(x, y) {
    this.x = x;
    this.y = y;

    const moistureLevel = 2; // 도화지가 촉촉한 정도. 높을수록 많이, 빠르게 퍼짐
    this.speedX = Math.random() * (moistureLevel * 2) - moistureLevel;
    this.speedY = Math.random() * (moistureLevel * 2) - moistureLevel;

    const finalMinSize = 20; // 다 퍼졌을때, 마지막 생성된 원의 최소 크기
    const finalMaxSize = 12;
    this.maxSize = Math.random() * (finalMaxSize - finalMinSize) + finalMinSize; // 이 값이 클수록 완전히 퍼지는데 걸리는 시간은 오래 걸린다.
    this.size = Math.random() * 1 + 2;

    this.velocitySize = Math.random() * 0.2 + 0.5; // 최대 사이즈에 도달할 때까지 랜덤한 속도로 퍼지기 위함
    this.velocityAngleX = Math.random() * 0.6 - 0.3;
    this.angleX = Math.random() * 6.2;
    this.velocityAngleY = Math.random() * 0.6 - 0.3;
    this.angleY = Math.random() * 6.2;

    this.angle = 0;
    this.velocityAngle = Math.random() * 0.02 + 0.05;

    this.lightness = 10;
  }
  update(ctx) {
    this.x += this.speedX + Math.sin(this.angleX);
    this.y += this.speedY + Math.sin(this.angleY);
    this.size += this.velocitySize;
    this.angleX += this.velocityAngleX;
    this.angleY += this.velocityAngleY;
    this.angle += this.velocityAngle;

    if (this.lightness < 70) {
      this.lightness += 1;
    }

    if (this.size < this.maxSize) {
      const halfSize = this.size / 2;
      const doubleSize = this.size * 2;
      const tripleSize = this.size * 2;

      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 10;
      ctx.shadowBlur = 10;
      ctx.shadowColor = "rgba(0, 0, 0, 0.5)";

      // ctx.globalCompositeOperation = "lighten";
      ctx.globalCompositeOperation = "destination-over";

      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle);

      ctx.fillStyle = `hsl(140,100%,${this.lightness}%)`; // 색상, 채도, 명도
      ctx.fillRect(0 - halfSize, 0 - halfSize, this.size, this.size);

      // ctx.strokeStyle = "#3c5186";
      // ctx.lineWidth = 0.5;
      // ctx.strokeRect(
      //   0 - doubleSize / 2,
      //   0 - doubleSize / 2,
      //   doubleSize,
      //   doubleSize
      // );

      // ctx.strokeStyle = "#ffffff";
      // ctx.lineWidth = 0.1;
      // ctx.strokeRect(
      //   0 - tripleSize / 2,
      //   0 - tripleSize / 2,
      //   tripleSize,
      //   tripleSize
      // );

      ctx.restore();

      requestAnimationFrame(() => this.update());
    }
  }
}

export class WaterColorBrush {
  constructor({ ctx, mouse, moistureLevel, brushSize, selectedColor }) {
    // todo: 입력 받은 값은 따로 외부에 저장해서 브러쉬끼리 공유하기?
    this.ctx = ctx;
    this.moistureLevel = moistureLevel; // 도화지가 촉촉한 정도. 높을수록 많이, 빠르게 퍼짐
    this.brushSize = brushSize;
    this.color = selectedColor.h;

    // TODO : 입력 받기
    const maxSpeadTime = 200;

    this.x = mouse.x;
    this.y = mouse.y;

    this.size = Math.random() * (brushSize * 1.5) + brushSize;

    this.speedX = Math.random() * (moistureLevel * 2) - moistureLevel;
    this.speedY = Math.random() * (moistureLevel * 2) - moistureLevel;

    this.colorLightnessLevel = 50;
    this.colorSaturationLevel = 100;

    this.time = 0; // 물감이 퍼지고 있는 시간 저장한다.
    this.maxSpeadTime = maxSpeadTime; // 물감 퍼지는 최대 시간(=범윔. 시간이 크면 그만큼 많이 퍼지게 되니깐 동일한 의미)
    this.isFading = false; // 최대로 퍼지는 시간에 다다르면 그 궤적은 제거한다. (TODO : 성능 문제 해결)
  }
  update() {
    this.time++;
    this.size += 0.1;
    this.colorLightnessLevel += 0.4; //  todo: 퍼지는 시간 비례해서(백분율) 더해주는걸로 수정하기
    this.colorSaturationLevel -= 0.4;

    if (this.time > this.maxSpeadTime) {
      this.isFading = true;
      return;
    }

    this.x += this.speedX;
    this.y += this.speedY;
  }
  draw() {
    this.ctx.fillStyle = `hsl(${this.color},${this.colorSaturationLevel}%,${this.colorLightnessLevel}%)`; // 색상, 채도, 명도

    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    this.ctx.fill();
  }
}

export class WaterDropBrush {
  // todo: 드래그할때도 그려지게? -> scatter 값 부여
  constructor({ ctx, mouse }) {
    this.ctx = ctx;
    this.x = mouse.x;
    this.y = mouse.y;
    this.size = Math.random() * 60 + 10;
    this.image = new Image();
    this.image.src = "/images/water_drop.png";
    this.drawInterval = 100;
    this.drawTimer = 0;
  }
  update() {
    this.x += Math.random() * 100 - 50;
    this.y += Math.random() * 100 - 50;
    this.drawTimer += 1;
  }
  draw() {
    this.ctx.drawImage(
      this.image,
      this.x - this.size * 0.2,
      this.y - 30 - this.size * 0.3,
      this.size,
      this.size
    );
    this.drawTimer = 0;
  }
}

export class WaterDropBrush1 {
  constructor({ mouse }) {
    this.x = mouse.x;
    this.y = mouse.y;

    this.size = Math.random() * 1 + 2;
    // this.angle = Math.random() * 360;
  }
  update() {
    this.size += this.velocitySize;
  }
  draw() {
    // ctx.save();
    // ctx.translate(this.x, this.y);
    // ctx.rotate(this.angle);
    this.ctx.drawImage(
      this.image,
      this.x - this.size * 0.2,
      this.y - 30 - this.size * 0.3,
      this.size,
      this.size
    );
    // ctx.restore();
  }
}

class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  rotate(angle) {
    return new Vector(
      this.x * Math.cos(angle) - this.y * Math.sin(angle),
      this.x * Math.sin(angle) + this.y * Math.cos(angle)
    );
  }
  multiply(scalar) {
    return new Vector(this.x * scalar, this.y * scalar);
  }
  subtract(vector) {
    return new Vector(this.x - vector.x, this.y - vector.y);
  }
  add(vector) {
    return new Vector(this.x + vector.x, this.y + vector.y);
  }
  magnitude() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }
  unit() {
    return this.multiply(1 / this.magnitude());
  }
}

export class BugBrush {
  constructor({ x, y, selectedColor }) {
    this.dst = new Vector(x, y);  // 벌레가 가야할 목적지
    this.angle = Math.random() * Math.PI * 2;  // 랜덤한 각도로
    this.pos = this.dst.subtract(this.dst.rotate(this.angle).unit().multiply(100));  // 거리를 두고 시작
    this.velocity = this.dst.subtract(this.pos).multiply(0.01);  // 시작은 목적지로 이동
    this.visible = true;  // 보이는지 여부
    this.size = 2;
    this.color = selectedColor.h;
    this.colorLightnessLevel = 50;
    this.colorSaturationLevel = 100;
  }
  update() {
    this.pos = this.pos.add(this.velocity);
    if (this.pos.subtract(this.dst).magnitude() < 5) {
      this.visible = false;
    }
  }
  draw(ctx) {
    if (!this.visible) return;
    ctx.save();
    ctx.fillStyle = `hsl(${this.color},${this.colorSaturationLevel}%,${this.colorLightnessLevel}%)`;
    ctx.beginPath();
    ctx.arc(this.pos.x, this.pos.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}
