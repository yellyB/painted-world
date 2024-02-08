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

export class WaterDrop {
  // todo: 땅에 튕기는 바운스 여러번.
  // todo: 큰 구슬은 깨지기
  // todo: 떨어지는 궤적 남기기
  constructor({ ctx, mouse, canvas }) {
    this.ctx = ctx;
    this.x = mouse.x;
    this.y = mouse.y;
    this.size = Math.random() * 80 + 10;
    this.canvas = canvas;

    this.image = new Image();
    this.image.src = "images/water_drop.png";

    this.bottomCoordinates = canvas.height;
    this.velocity = 0;
    this.accelLevel = 4; // // 가속도 조절 todo: 입력 받기
    this.weight = this.size * 0.0005; // 사이즈에 따라 무게 결정
    this.isDropping = true;
  }
  switchDirection() {
    this.isDropping = !this.isDropping;
  }
  checkIsOnGround() {
    return this.y >= this.bottomCoordinates;
  }
  checkIsTouchingCeiling() {
    // const res = this.y <= this.ceilingLimit;
    // return res;
  }
  update() {
    // TODO: 추후 커서에 따라 미리보기 이미지 제공되면 정교하게 수정
    // this.x += Math.random() * 100 - 50;
    // this.y += Math.random() * 100 - 50;

    if (this.isDropping) {
      this.velocity += this.weight;
      this.y += Math.pow(this.velocity, this.accelLevel);
    } else {
      this.velocity -= this.weight;
      this.y -= this.velocity;
    }

    if (this.checkIsOnGround()) {
      this.isDropping = false;
      this.switchDirection();
    }
    if (this.checkIsOnGround()) {
      this.switchDirection();
    }
  }
  draw() {
    this.ctx.drawImage(
      this.image,
      this.x - this.size * 0.2,
      this.y - 30 - this.size * 0.3,
      this.size,
      this.size
    );
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
    this.dst = new Vector(x, y); // 벌레가 가야할 목적지
    this.angle = Math.random() * Math.PI * 2; // 랜덤한 각도로
    this.pos = this.dst.subtract(
      this.dst.rotate(this.angle).unit().multiply(100)
    ); // 거리를 두고 시작
    this.velocity = this.dst.subtract(this.pos).multiply(0.01); // 시작은 목적지로 이동
    this.visible = true; // 보이는지 여부
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
