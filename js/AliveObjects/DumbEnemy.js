import AliveObject from './AliveObject.js';

class DumbEnemy extends AliveObject {
  constructor(scene, xCoord, yCoord, assetKey, deathSound) {
    super(scene, xCoord, yCoord, assetKey, deathSound);
    this.sprite.body.setSize(this.sprite.width, this.sprite.height - 8);
  }

  move() {
    this.sprite.anims.play('walk', true);
    this.randomStep();
    return this;
  };

  randomStep() {
    if (Math.random() < 0.5) {
      this.sprite.setVelocityX(-200);
      this.sprite.flipX = true;
    } else {
      this.sprite.setVelocityX(200);
      this.sprite.flipX = false;
    }
  }
}

export default DumbEnemy;
