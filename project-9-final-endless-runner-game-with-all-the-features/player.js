import { states, Sitting, Running, Jumping, Falling } from "./playerState.js";

export class Player {
  constructor(game) {
    this.game = game;
    this.width = 100;
    this.height = 91.3;
    this.ground = this.game.height - this.height - this.game.groundMargin;
    this.x = 0;
    this.y = this.ground;
    this.vy = 0;
    this.weight = 0.3;
    this.playerImage = document.getElementById("playerImage");
    this.frameX = 0;
    this.maxFrame = 0;
    this.fps = 20;
    this.frameInterval = 1000 / this.fps;
    this.frameTimer = 0;
    this.frameY = 0;
    this.speed = 0;
    this.maxSpeed = 4;
    this.states = {
      [states.SITTING]: new Sitting(this),
      [states.RUNNING]: new Running(this),
      [states.JUMPING]: new Jumping(this),
      [states.FALLING]: new Falling(this),
    };
    this.currentState = this.states[states.SITTING];
    this.currentState.enter();
  }

  update(input, deltaTime) {
    this.checkCollision();
    this.currentState.handleInput(input);

    // Horizontal movement
    this.x += this.speed;
    if (input.keys.includes("ArrowRight")) this.speed = this.maxSpeed;
    else if (input.keys.includes("ArrowLeft")) this.speed = -this.maxSpeed;
    else this.speed = 0;
    // Horizontal boundaries
    if (this.x < 0) this.x = 0;
    else if (this.x > this.game.width - this.width)
      this.x = this.game.width - this.width;

    // Vertical movement
    this.y += this.vy;
    if (!this.onGround()) {
      this.vy += this.weight;
    } else {
      this.vy = 0;
      this.y = this.ground;
    }

    // Sprite animation
    if (this.frameTimer > this.frameInterval) {
      this.frameTimer = 0;
      if (this.frameX < this.maxFrame) this.frameX++;
      else this.frameX = 0;
    } else this.frameTimer += deltaTime;
  }

  draw(context) {
    if (this.game.debug)
      context.strokeRect(this.x, this.y, this.width, this.height);
    context.drawImage(
      this.playerImage,
      this.frameX * this.width,
      this.frameY * this.height,
      this.width,
      this.height,
      this.x,
      this.y,
      this.width,
      this.height
    );
  }

  onGround() {
    return this.y >= this.ground;
  }

  setState(state) {
    this.currentState = this.states[state];
    this.currentState.enter();
  }

  checkCollision() {
    this.game.enemies.forEach((enemy) => {
      if (
        enemy.x < this.x + this.width &&
        enemy.x + enemy.width > this.x &&
        enemy.y < this.y + this.height &&
        enemy.y + enemy.height > this.y
      ) {
        enemy.markForDeletion = true;
        this.game.score++;
      } else {
      }
    });
  }
}
