import { Dust, Fire } from "./particles.js";

export const states = {
  SITTING: 0,
  RUNNING: 1,
  JUMPING: 2,
  FALLING: 3,
  ROLLING: 4,
  DIVING: 5,
  HIT: 6,
};

class State {
  constructor(game) {
    this.game = game;
  }
}

export class Sitting extends State {
  constructor(game) {
    super(game);
  }

  enter() {
    this.game.player.maxFrame = 4;
    this.game.player.frameY = 5;
    this.game.speed = 0;
  }

  handleInput(input) {
    if (input.keys.includes("ArrowLeft") || input.keys.includes("ArrowRight")) {
      this.game.player.setState(states.RUNNING);
    } else if (input.keys.includes("Enter")) {
      this.game.player.setState(states.ROLLING);
    }
  }
}

export class Running extends State {
  constructor(game) {
    super(game);
  }

  enter() {
    this.game.player.frameY = 3;
    this.game.player.maxFrame = 8;
    this.game.player.game.speed = 3;
  }

  handleInput(input) {
    this.game.particles.unshift(
      new Dust(
        this.game,
        this.game.player.x + this.game.player.width / 2,
        this.game.player.y + this.game.player.height
      )
    );
    if (input.keys.includes("ArrowDown") && input.keys.length === 1) {
      this.game.player.setState(states.SITTING);
    } else if (input.keys.includes("ArrowUp")) {
      this.game.player.setState(states.JUMPING);
    }
    if (input.keys.includes("Enter")) {
      this.game.player.setState(states.ROLLING);
    }
  }
}

export class Jumping extends State {
  constructor(game) {
    super(game);
  }

  enter() {
    this.game.player.frameY = 1;
    this.game.player.maxFrame = 6;
    if (this.game.player.onGround()) {
      this.game.player.vy = -15;
    }
  }

  handleInput(input) {
    if (this.game.player.vy > 0) {
      this.game.player.setState(states.FALLING);
    } else if (input.keys.includes("Enter")) {
      this.game.player.setState(states.ROLLING);
    }
  }
}

export class Falling extends State {
  constructor(game) {
    super(game);
  }

  enter() {
    this.game.player.frameY = 2;
    this.game.player.maxFrame = 6;
  }

  handleInput(input) {
    if (this.game.player.onGround()) {
      this.game.player.setState(states.RUNNING);
    }
  }
}

export class Rolling extends State {
  constructor(game) {
    super(game);
  }

  enter() {
    this.game.player.frameY = 6;
    this.game.player.maxFrame = 6;
    this.game.player.game.speed *= 3;
  }

  handleInput(input) {
    this.game.particles.unshift(
      new Fire(this.game, this.game.player.x, this.game.player.y)
    );    
    if (!input.keys.includes("Enter") && this.game.player.onGround()) {
      this.game.player.setState(states.RUNNING);
    } else if (!input.keys.includes("Enter") && !this.game.player.onGround()) {
      this.game.player.setState(states.JUMPING);
    } else if (
      input.keys.includes("Enter") &&
      input.keys.includes("ArrowUp") &&
      this.game.player.onGround()
    ) {
      this.game.player.vy = -10;
    }
  }
}

export class Diving extends State {
  constructor(game) {
    super(game);
  }

  enter() {
    this.game.player.frameY = 2;
    this.game.player.maxFrame = 6;
  }

  handleInput(input) {}
}

export class Hit extends State {
  constructor(game) {
    super(game);
  }

  enter() {
    this.game.player.frameY = 2;
    this.game.player.maxFrame = 6;
  }

  handleInput(input) {}
}
