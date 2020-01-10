import DumbEnemy from './DumbEnemy.js';

class DumbEnemyWithJump extends DumbEnemy {
  constructor(scene, xCoord, yCoord, assetKey, deathSound) {
    super(scene, xCoord, yCoord, assetKey, deathSound);
    this.sprite.setSize(350, 500);
	this.sprite.setOffset(280, 250);
  }

  move() {
    this.sprite.anims.play('walk1', true);
    this.randomStep();
    this.randomJump();
    return this;
  };

  randomJump() {
    if (Math.random() < 0.5 && this.sprite.body.onFloor()) {
      this.sprite.body.setVelocityY(-800);
    } else {
		this.sprite.anims.play('idle1', true);
	}
  }
}

export default DumbEnemyWithJump;
