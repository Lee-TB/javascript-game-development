const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
const CANVAS_WIDTH = (canvas.width = 1200);
const CANVAS_HEIGHT = (canvas.height = 700);

const backgroundLayer1 = new Image();
backgroundLayer1.src = "./backgroundLayers/layer-1.png";
const backgroundLayer2 = new Image();
backgroundLayer2.src = "./backgroundLayers/layer-2.png";
const backgroundLayer3 = new Image();
backgroundLayer3.src = "./backgroundLayers/layer-3.png";
const backgroundLayer4 = new Image();
backgroundLayer4.src = "./backgroundLayers/layer-4.png";
const backgroundLayer5 = new Image();
backgroundLayer5.src = "./backgroundLayers/layer-5.png";

let gameSpeed = 5;

window.addEventListener("load", function () {
  this.document.getElementById('preloader').style.display = 'none';
  const slider = document.getElementById("slider");
  const showGameSpeed = document.getElementById("showGameSpeed");
  slider.value = gameSpeed;
  showGameSpeed.innerHTML = gameSpeed;
  slider.addEventListener("change", (e) => {
    gameSpeed = parseInt(e.target.value);
    showGameSpeed.innerHTML = gameSpeed;
  });

  class Layer {
    constructor(image, speedModifier = 1) {
      this.x = 0;
      this.y = 0;
      this.width = 2400;
      this.height = 700;
      this.image = image;
      this.speedModifier = speedModifier;
      this.speed = gameSpeed * this.speedModifier;
    }

    update() {
      this.speed = gameSpeed * this.speedModifier;
      if (this.x < -this.width) this.x = this.x + this.width;
      this.x = this.x - this.speed;
    }

    draw() {
      ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
      ctx.drawImage(
        this.image,
        this.x + this.width,
        this.y,
        this.width,
        this.height
      );
    }
  }

  const layer1 = new Layer(backgroundLayer1);
  const layer2 = new Layer(backgroundLayer2, 0.2);
  const layer3 = new Layer(backgroundLayer3, 0.4);
  const layer4 = new Layer(backgroundLayer4, 0.6);
  const layer5 = new Layer(backgroundLayer5, 0.8);

  const gameObjects = [layer1, layer2, layer3, layer4, layer5];

  function animate() {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    gameObjects.forEach((layer) => {
      layer.draw();
      layer.update();
    });
    requestAnimationFrame(animate);
  }
  animate();
});
