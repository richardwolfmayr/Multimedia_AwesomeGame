import DumbEnemy from './DumbEnemy.js';

class DumbEnemyWithJump extends DumbEnemy {
  constructor(scene, xCoord, yCoord, assetKey, deathSound) {
    super(scene, xCoord, yCoord, assetKey, deathSound);
    this.sprite.body.setSize(this.sprite.width, this.sprite.height - 8);
  }

  move() {
    this.sprite.anims.play('walk', true);
    this.randomStep();
    this.randomJump();
    return this;
  };

  randomJump() {
    if (Math.random() < 0.5 && this.sprite.body.onFloor()) {
      this.sprite.body.setVelocityY(-800);
    }
  }
}

export default DumbEnemyWithJump;
