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
  cursor(size) {
    this.ctx.fillStyle = `hsl(${this.color},${this.colorSaturationLevel}%,${this.colorLightnessLevel}%)`; // 색상, 채도, 명도

    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, size, 0, Math.PI * 2);
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
  isOnGround() {
    // NOTE: 이미지 배치가 안맞아서 마지막 이미지가 바닥 위치를 넘어가면 캔버스 바깥으로 넘어간 후 튕기게 되어버림. 때문에 size를 이용해 높이를 빼준다.
    return this.y >= this.bottomCoordinates - this.size * 0.5;
  }
  isOutOfCanvas() {
    return this.y > this.bottomCoordinates + this.size * 1.5;
  }
  update() {
    if (this.isDropping) {
      this.velocity += this.weight;
      this.y += Math.pow(this.velocity, this.accelLevel);
      if (this.isOnGround()) {
        this.switchDirection();
      }
    } else {
      this.velocity -= this.weight;
      this.y -= this.velocity;
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
  cursor(size) {
    this.ctx.drawImage(
      this.image,
      this.x - size * 0.2,
      this.y - 30 - size * 0.3,
      40,
      40
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
  scale(magnitude) {
    return this.unit().multiply(magnitude);
  }
}

export class BugBrush {
  constructor({ x, y, selectedColor }) {
    this.dst = new Vector(x, y); // 벌레가 가야할 목적지
    this.angle = Math.random() * Math.PI * 2; // 랜덤한 각도로
    this.startDistance = Math.random() * 100 + 50; // 랜덤한 거리로
    this.pos = this.dst.subtract(
      this.dst.rotate(this.angle).unit().multiply(this.startDistance)
    ); // 거리를 두고 시작
    this.velocity = new Vector(0, 0); // 속도
    this.size = 3;
    this.color = selectedColor.h;
    this.colorLightnessLevel = 50;
    this.colorSaturationLevel = 100;
    this.age = 0;
    this.speed = Math.random() * 0.005 + 0.01;
    this.opacity = 0;
    this.destinationThreshold = Math.random() * 10 + 5;
    this.phases = [
      { t: 0, velocity: new Vector(0, 0) },
      { t: 60, velocity: this.dst.subtract(this.pos).multiply(0.01) },
    ].reverse();
    this.legs = [
      {
        start: new Vector(1, 0).rotate((Math.PI * 20) / 16).scale(this.size),
        joints: [
          {
            angle: (Math.PI * 20) / 16,
            length: 6,
            bz1: Math.PI,
            bz2: Math.PI / 2,
          },
          {
            angle: (Math.PI * 11) / 16,
            length: 10,
            bz1: Math.PI,
            bz2: (Math.PI * 3) / 2,
          },
        ],
      },
      {
        start: new Vector(1, 0).rotate(Math.PI).scale(this.size),
        joints: [
          {
            angle: (Math.PI * 18) / 16,
            length: 3,
            bz1: Math.PI,
            bz2: (Math.PI * 3) / 2,
          },
          {
            angle: (Math.PI * 11) / 16,
            length: 6,
            bz1: Math.PI,
            bz2: Math.PI / 2,
          },
        ],
      },
      {
        start: new Vector(1, 0).rotate((Math.PI * 12) / 16).scale(this.size),
        joints: [
          {
            angle: (Math.PI * 10) / 16,
            length: 3,
            bz1: (Math.PI * 12) / 16,
            bz2: (Math.PI * 3) / 2,
          },
          {
            angle: (Math.PI * 6) / 16,
            length: 3,
            bz1: Math.PI / 2,
            bz2: (Math.PI * 20) / 16,
          },
        ],
      },
      // opposite side (mirrored)
      {
        start: new Vector(1, 0).rotate((Math.PI * 28) / 16).scale(this.size),
        joints: [
          { angle: (Math.PI * 28) / 16, length: 6, bz1: 0, bz2: Math.PI / 2 },
          {
            angle: (Math.PI * 5) / 16,
            length: 10,
            bz1: 0,
            bz2: (Math.PI * 3) / 2,
          },
        ],
      },
      {
        start: new Vector(1, 0).rotate(0).scale(this.size),
        joints: [
          {
            angle: (Math.PI * 30) / 16,
            length: 3,
            bz1: 0,
            bz2: (Math.PI * 3) / 2,
          },
          { angle: (Math.PI * 5) / 16, length: 6, bz1: 0, bz2: Math.PI / 2 },
        ],
      },
      {
        start: new Vector(1, 0).rotate(Math.PI / 4).scale(this.size),
        joints: [
          {
            angle: (Math.PI * 6) / 16,
            length: 3,
            bz1: Math.PI / 4,
            bz2: (Math.PI * 3) / 2,
          },
          {
            angle: (Math.PI * 10) / 16,
            length: 3,
            bz1: Math.PI / 2,
            bz2: (Math.PI * 28) / 16,
          },
        ],
      },
    ];
  }
  update() {
    this.age += 1;
    const currentPhase = this.phases.find((phase) => this.age > phase.t);
    if (!currentPhase) return;
    this.velocity = currentPhase.velocity;
    if (this.pos.subtract(this.dst).magnitude() < this.destinationThreshold) {
      this.velocity = new Vector(0, 0);
    }
    this.pos = this.pos.add(this.velocity);
    this.opacity = Math.min(1, this.age / 60);
  }
  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = this.opacity;
    this.drawLegs(ctx);
    this.drawBody(ctx);
    ctx.restore();
  }
  drawBody(ctx) {
    ctx.fillStyle = `hsl(${this.color},${this.colorSaturationLevel}%,${this.colorLightnessLevel}%)`;
    ctx.beginPath();
    ctx.arc(this.pos.x, this.pos.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
  drawLegs(ctx) {
    ctx.beginPath();
    ctx.lineWidth = 0.5;
    ctx.strokeStyle = `hsl(${this.color},${this.colorSaturationLevel * 0.2}%,${
      this.colorLightnessLevel
    }%)`;
    this.legs.forEach((leg) => {
      let start = leg.start.add(this.pos);
      ctx.moveTo(start.x, start.y);
      leg.joints.forEach((joint) => {
        const dest = start.add(
          new Vector(1, 0).rotate(joint.angle).scale(joint.length)
        );
        const startBezier = start.add(
          new Vector(1, 0).rotate(joint.bz1).scale(joint.length / 4)
        );
        const destBezier = dest.add(
          new Vector(1, 0).rotate(joint.bz2).scale(joint.length / 4)
        );
        ctx.bezierCurveTo(
          startBezier.x,
          startBezier.y,
          destBezier.x,
          destBezier.y,
          dest.x,
          dest.y
        );
        start = dest;
      });
    });
    ctx.stroke();
  }
}
