import AliveObject from './AliveObject.js';

class DumbEnemy extends AliveObject {
  constructor(scene, xCoord, yCoord, assetKey, deathSound) {
    super(scene, xCoord, yCoord, assetKey, deathSound);
    this.sprite.setSize(350, 500);
	this.sprite.setOffset(280, 250);
	debugger;
  }

  move() {
    this.sprite.anims.play('walk1', true);
    this.randomStep();
    return this;
  };

  randomStep() {
      this.sprite.setVelocityX(-200);
      this.sprite.flipX = true;

  }
}

export default DumbEnemy;
