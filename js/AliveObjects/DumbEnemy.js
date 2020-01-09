import AliveObject from './AliveObject.js';

class DumbEnemy extends AliveObject {
  constructor(scene, xCoord, yCoord, assetKey, deathSound) {
    super(scene, xCoord, yCoord, assetKey, deathSound);
    this.sprite.body.setSize(this.sprite.width, this.sprite.height);
  }

  move() {
    this.sprite.anims.play('walk', true);
    this.randomStep();
    return this;
  };

  randomStep() {
      this.sprite.setVelocityX(-200);
	  this.sprite.anims.play('walk1', true);
      this.sprite.flipX = true;

  }
}

export default DumbEnemy;
