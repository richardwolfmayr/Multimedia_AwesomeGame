import AliveObject from './AliveObject.js';

class DumbEnemy extends AliveObject {
  constructor(scene, xCoord, yCoord, assetKey) {
    super(scene, xCoord, yCoord, assetKey);
    this.sprite.body.setSize(this.sprite.width, this.sprite.height - 8);
  }

  move() {
    this.sprite.anims.play('walk', true);
    if (Math.random() < 0.5) {
      this.sprite.setVelocityX(-200);
      this.sprite.flipX = true;
    } else {
      this.sprite.setVelocityX(200);
      this.sprite.flipX = false;
    }

    return this;
  };

  died() {
    if (this.currentHP <= 0) {
      this.sprite.healthbar.setActive(false);
      this.sprite.healthbar.destroy();
      this.sprite.setActive(false);
      this.sprite.destroy();
      this.scene.enemyDyingSound.play();
      return true;
    }

    return false;
  }
}

export default DumbEnemy;
