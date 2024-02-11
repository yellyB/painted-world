export class WaterDrop {
  // todo: 땅에 튕기는 바운스 여러번.
  // todo: 큰 구슬은 깨지기
  // todo: 떨어지는 궤적 남기기
  constructor({ ctx, mouse, canvas, waterDrops }) {
    this.ctx = ctx;
    this.x = mouse.x;
    this.y = mouse.y;
    this.size = Math.random() * 80 + 10;
    this.canvas = canvas;
    this.waterDrops = waterDrops;

    this.image = new Image();
    this.image.src = "images/water_drop.png";

    this.bottomCoordinates = canvas.height;
    this.velocity = 0;
    this.accelLevel = 4; // // 가속도 조절 todo: 입력 받기
    this.weight = this.size * 0.0005; // 사이즈에 따라 무게 결정
    this.isDropping = true; // 지금은 맨 처음 떨어지는 경우만 true. 튕기고 있어서 떨어지는 경우는 포함 안됨. todo: 추후 여러번 튕기는 모션 추가하게 되면 활용
    this.toSolveCollisionDirectionX = 0;
    this.toSolveCollisionCoordinatesY = 0; // 충돌났을 때 y좌표가 얼마나 줄어들어야(위로 튕겨야)하는지

    this.collisionInfo = { isCollision: false };
  }
  switchDirection() {
    this.isDropping = !this.isDropping;
  }
  isOnGround() {
    // NOTE: 이미지 배치가 안맞아서 마지막 이미지가 바닥 위치를 넘어가면 캔버스 바깥으로 넘어간 후 튕기게 되어버림. 때문에 size를 이용해 높이를 빼준다.
    return this.y >= this.bottomCoordinates - this.size * 0.5;
  }
  isOutOfCanvas() {
    const outOfLeft = this.x < 0 - this.size * 1.5;
    const outOfRight = this.x > this.canvas.width + this.size * 1.5;
    const outOfBottom = this.y > this.bottomCoordinates + this.size * 1.5;
    return outOfLeft || outOfRight || outOfBottom;
  }
  handleCollision() {
    this.waterDrops.forEach((waterDrop) => {
      if (waterDrop.size === this.size) return; // 자기 자신은 검사 피하기 위해
      if (
        waterDrop.x < this.x + this.size &&
        waterDrop.x + waterDrop.size > this.x &&
        waterDrop.y < this.y + this.size &&
        waterDrop.y + waterDrop.size > this.y
      ) {
        this.collisionInfo.isCollision = true;

        if (this.x > waterDrop.x) {
          this.collisionInfo.toSolveCollisionDirectionX = "+";
          waterDrop.collisionInfo.toSolveCollisionDirectionX = "-";
        } else {
          this.collisionInfo.toSolveCollisionDirectionX = "-";
          waterDrop.collisionInfo.toSolveCollisionDirectionX = "+";
        }
        if (this.y > waterDrop.y) {
          this.collisionInfo.toSolveCollisionDirectionY = "+";
          waterDrop.collisionInfo.toSolveCollisionDirectionY = "-";
        } else {
          this.collisionInfo.toSolveCollisionDirectionY = "-";
          waterDrop.collisionInfo.toSolveCollisionDirectionY = "+";
        }
      }
    });
  }
  update() {
    const sizeRate = 0.005;
    this.handleCollision();

    if (this.collisionInfo.isCollision) {
      if (this.velocity <= 0) {
        this.velocity += this.weight;
        this.y += this.velocity;
        this.collisionInfo.isCollision = false;
        return;
      }

      if (this.collisionInfo.toSolveCollisionDirectionX === "+")
        this.x += this.size * sizeRate;
      else if (this.collisionInfo.toSolveCollisionDirectionX === "-")
        this.x -= this.size * sizeRate;

      if (this.collisionInfo.toSolveCollisionDirectionY === "+")
        this.y += this.velocity;
      else if (this.collisionInfo.toSolveCollisionDirectionY === "-")
        this.y -= this.velocity;

      this.velocity -= this.weight;
      return;
    }

    // x축 이동하는 관성 유지 위해
    if (this.collisionInfo.toSolveCollisionDirectionX === "+")
      this.x += this.size * sizeRate;
    else if (this.collisionInfo.toSolveCollisionDirectionX === "-")
      this.x -= this.size * sizeRate;

    if (this.isDropping) {
      this.velocity += this.weight;
      this.y += Math.pow(this.velocity, this.accelLevel);
      if (this.isOnGround()) {
        this.switchDirection();
      }
    } else {
      this.velocity -= this.weight;

      this.y -= this.velocity;
      //   this.y -=
      //     this.velocity < 0
      //       ? -Math.pow(this.velocity, this.accelLevel)
      //       : Math.pow(this.velocity, this.accelLevel);
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
  cursor({ size }) {
    this.ctx.drawImage(
      this.image,
      this.x - size * 0.2,
      this.y - 30 - size * 0.3,
      40,
      40
    );
  }
}
