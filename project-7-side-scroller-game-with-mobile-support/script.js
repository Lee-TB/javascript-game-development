/**@type {HTMLCanvasElement} */
window.addEventListener("load", function () {
  const canvas = this.document.getElementById("canvas1");
  const ctx = canvas.getContext("2d");
  canvas.width = 1200;
  canvas.height = 720;
  let enemies = [];
  let score = 0;
  let gameOver = false;

  class InputHandler {
    constructor() {
      this.keys = [];
      this.touchY = 0;
      this.touchThreshold = 30;
      window.addEventListener("keydown", (e) => {
        if (
          (e.key === "ArrowUp" ||
            e.key === " " ||
            e.key === "ArrowDown" ||
            e.key === "ArrowLeft" ||
            e.key === "ArrowRight") &&
          this.keys.indexOf(e.key) === -1
        ) {
          this.keys.push(e.key);
        } else if (e.key === "Enter" && gameOver) restartGame();
      });
      window.addEventListener("keyup", (e) => {
        if (
          (e.key === "ArrowUp" ||
            e.key === " " ||
            e.key === "ArrowDown" ||
            e.key === "ArrowLeft" ||
            e.key === "ArrowRight") &&
          this.keys.indexOf(e.key) !== -1
        ) {
          this.keys.splice(this.keys.indexOf(e.key), 1);
        }
      });

      window.addEventListener("touchstart", (e) => {
        this.touchY = e.changedTouches[0].pageY;
      });
      window.addEventListener("touchmove", (e) => {
        const swipeDistance = e.changedTouches[0].pageY - this.touchY;
        if (
          swipeDistance < -this.touchThreshold &&
          this.keys.indexOf("swipe up") === -1
        ) {
          this.keys.push("swipe up");
        } else if (
          swipeDistance > this.touchThreshold &&
          this.keys.indexOf("swipe down") === -1
        ) {
          this.keys.push("swipe down");
          if (gameOver) restartGame();
        }
      });
      window.addEventListener("touchend", (e) => {
        this.keys.splice(this.keys.indexOf("swipe up"), 1);
        this.keys.splice(this.keys.indexOf("swipe down"), 1);
      });
    }
  }

  class Player {
    constructor(gameWidth, gameHeight) {
      this.gameWidth = gameWidth;
      this.gameHeight = gameHeight;
      this.spriteWidth = 573;
      this.spriteHeight = 523;
      this.width = 200;
      this.height = 200;
      this.x = 100;
      this.y = this.gameHeight - this.height;
      this.image = playerImage;
      this.frameX = 0;
      this.maxFrameX = 8;
      this.frameY = 3;
      this.fps = 20;
      this.frameTimer = 0;
      this.frameInterval = 1000 / this.fps;
      this.speed = 0;
      this.vy = 0;
      this.weight = 0.4;
    }

    restart() {
      this.x = 100;
      this.y = this.gameHeight - this.height;
    }

    draw(context) {
      context.drawImage(
        this.image,
        this.frameX * this.spriteWidth,
        this.frameY * this.spriteHeight,
        this.spriteWidth,
        this.spriteHeight,
        this.x,
        this.y,
        this.width,
        this.height
      );
    }

    update(input, deltaTime, enemies) {
      // collision detection
      enemies.forEach((enemy) => {
        const dx = enemy.x + enemy.width / 3 - (this.x + this.width / 2);
        const dy = enemy.y + enemy.height / 2 - (this.y + this.height / 2 + 20);
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < enemy.width / 3 + this.width / 3) {
          gameOver = true;
        }
      });

      // sprite animation
      if (this.frameTimer > this.frameInterval) {
        if (this.frameX >= this.maxFrameX) this.frameX = 0;
        else this.frameX++;
        this.frameTimer = 0;
      } else {
        this.frameTimer += deltaTime;
      }

      // control
      if (input.keys.indexOf("ArrowRight") > -1) {
        this.speed = 2;
        if (
          (input.keys.indexOf("ArrowUp") > -1 ||
            input.keys.indexOf(" ") > -1 ||
            input.keys.indexOf("swipe up") > -1) &&
          this.onGround()
        ) {
          this.vy = -20;
        }
      } else if (input.keys.indexOf("ArrowLeft") > -1) {
        this.speed = -5;
        if (
          (input.keys.indexOf("ArrowUp") > -1 ||
            input.keys.indexOf(" ") > -1 ||
            input.keys.indexOf("swipe up") > -1) &&
          this.onGround()
        ) {
          this.vy = -20;
        }
      } else if (
        (input.keys.indexOf("ArrowUp") > -1 ||
          input.keys.indexOf(" ") > -1 ||
          input.keys.indexOf("swipe up") > -1) &&
        this.onGround()
      ) {
        this.vy = -20;
      } else {
        this.speed = 0;
      }
      // horizontal movement
      this.x += this.speed;

      if (this.x < 0) this.x = 0;
      else if (this.x > this.gameWidth - this.width)
        this.x = this.gameWidth - this.width;

      // vertical movement
      this.y += this.vy;

      if (!this.onGround()) {
        this.vy += this.weight;
        if (this.isJumpingUp()) {
          this.frameY = 1;
        } else if (this.isFallingDown()) {
          this.frameY = 2;
        }
        this.maxFrameX = 6;
      } else {
        this.vy = 0;
        this.frameY = 3;
        this.maxFrameX = 8;
      }

      if (this.y > this.gameHeight - this.height) {
        this.y = this.gameHeight - this.height;
      }
    }

    onGround() {
      return this.y >= this.gameHeight - this.height;
    }

    isJumpingUp() {
      return this.vy < 0;
    }

    isFallingDown() {
      return this.vy > 0;
    }
  }

  class Background {
    constructor(gameWidth, gameHeight) {
      this.gameWidth = gameWidth;
      this.gameHeight = gameHeight;
      this.image = backgroundImage;
      this.x = 0;
      this.y = 0;
      this.width = 2400;
      this.height = 720;
      this.speed = 0.2;
    }

    draw(context) {
      context.drawImage(this.image, this.x, this.y);
      context.drawImage(this.image, this.x + this.width - this.speed, this.y);
    }

    update(deltaTime) {
      this.x -= this.speed * deltaTime;
      if (this.x < 0 - this.width) this.x = this.x + this.width;
    }

    restart() {
      this.x = 0;
    }
  }

  class Enemy {
    constructor(gameWidth, gameHeight) {
      this.gameWidth = gameWidth;
      this.gameHeight = gameHeight;
      this.width = 160;
      this.height = 119;
      this.image = enemyImage;
      this.x = this.gameWidth;
      this.y = this.gameHeight - this.height;
      this.frameX = 0;
      this.maxFrame = 5;
      this.fps = 20;
      this.frameTimer = 0;
      this.frameInterval = 1000 / this.fps;
      this.speed = 4;
      this.markForDeletion = false;
    }
    draw(context) {
      context.drawImage(
        this.image,
        this.frameX * this.width,
        0,
        this.width,
        this.height,
        this.x,
        this.y,
        this.width,
        this.height
      );
    }

    update(deltaTime) {
      if (this.frameTimer > this.frameInterval) {
        if (this.frameX >= this.maxFrame) this.frameX = 0;
        else this.frameX++;
        this.frameTimer = 0;
      } else {
        this.frameTimer += deltaTime;
      }
      this.x -= this.speed;

      // remove enemies who out of the horizontal boundary
      if (this.x < 0 - this.width) {
        this.markForDeletion = true;
        score++;
      }
    }
  }

  function handleEnemies(deltaTime) {
    const randomEnemyInterval = Math.random() * 2000 + 1000;
    if (enemyTimer > enemyInterval + randomEnemyInterval) {
      enemies.push(new Enemy(canvas.width, canvas.height));
      enemyTimer = 0;
    } else {
      enemyTimer += deltaTime;
    }
    enemies = enemies.filter((enemy) => !enemy.markForDeletion);
    enemies.forEach((enemy) => {
      enemy.draw(ctx);
      enemy.update(deltaTime);
    });
  }

  function displayStatusText(context) {
    context.save();
    context.font = "40px Helvatica";
    context.fillStyle = "black";
    context.fillText("Score: " + score, 20, 50);
    context.fillStyle = "white";
    context.fillText("Score: " + score, 22, 52);
    context.restore();

    if (gameOver) {
      context.save();
      context.font = "40px Helvatica";
      context.textAlign = "center";
      context.fillStyle = "black";
      context.fillText(
        "GAME OVER, press enter or swipe down to Restart",
        canvas.width / 2,
        200
      );
      context.fillStyle = "white";
      context.fillText(
        "GAME OVER, press enter or swipe down to Restart",
        canvas.width / 2 + 2,
        202
      );
      context.restore();
    }
  }

  function restartGame() {
    player.restart();
    background.restart();
    enemies = [];
    score = 0;
    gameOver = false;
    animate();
  }

  function toggleFullScreen() {
    if (!document.fullscreenElement) {
      canvas
        .requestFullscreen()
        .catch((e) =>
          alert(`Error, can't enable full-screen mode: ${e.message}`)
        );
    } else {
      document.exitFullscreen();
    }
  }
  fullScreenButton.addEventListener("click", (e) => {
    toggleFullScreen();
  });

  const input = new InputHandler();
  const player = new Player(canvas.width, canvas.height);
  const background = new Background(canvas.width, canvas.height);

  let lastTime = 0;
  let deltaTime = 0;
  let enemyTimer = 0;
  let enemyInterval = 500;

  function animate(timeStamp = 0) {
    deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    background.draw(ctx);
    background.update(deltaTime);
    handleEnemies(deltaTime);
    player.update(input, deltaTime, enemies);
    player.draw(ctx);
    displayStatusText(ctx);
    if (!gameOver) requestAnimationFrame(animate);
  }
  animate();
});
