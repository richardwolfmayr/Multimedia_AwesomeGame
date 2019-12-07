class AliveObject {
  constructor(scene, xCoord, yCoord, assetKey, deathSound) {
    this.scene = scene;
    this.sprite = this.scene.physics.add.sprite(xCoord, yCoord, assetKey);
    this.sprite.holder = this;
    this.sprite.setCollideWorldBounds(true); // Collide with world bounds
    this.deathSound = deathSound;
    this.isDead = false;
    this.setHealthBar();
  }

  setHealthBar() {
    this.totalHP = 100;
    this.currentHP = 100;
    this.lastHP = 100;

    this.sprite.healthbar = this.scene.add.graphics(this.sprite.x - 125, this.sprite.y - 115);

    this.sprite.healthbar.lineStyle(1, 0xFF00FF, 1.0);
    this.sprite.healthbar.fillStyle(0x00FF00, 1.0);
    this.sprite.healthbar.fillRect(50, 50, 150, 10);
    this.sprite.healthbar.strokeRect(50, 50, 150, 10);
  };

  died() {
    if (this.currentHP <= 0) {
      this.sprite.healthbar.setActive(false);
      this.sprite.healthbar.destroy();
      this.sprite.setActive(false);
      this.sprite.destroy();
      this.deathSound.play();
      this.isDead = true;
      return true;
    }

    return false;
  }

  updateHealthBar() {
    if (this.currentHP != this.lastHP) {
      this.sprite.healthbar.lineStyle(1, 0xFF00FF, 1.0);
      this.sprite.healthbar.fillStyle(0xFFFFFF, 1.0);
      this.sprite.healthbar.fillRect(50, 50, 150, 10);
      this.sprite.healthbar.fillStyle(0x00FF00, 1.0);
      this.sprite.healthbar.fillRect(50, 50, Math.ceil(150 * Math.max(this.currentHP, 0) / this.totalHP), 10);
      this.sprite.healthbar.strokeRect(50, 50, 150, 10);
    }

    this.died();

    this.updateHealthBarPosition();
  };


  updateHealthBarPosition() {
    this.sprite.healthbar.x = this.sprite.x - 125;
    this.sprite.healthbar.y = this.sprite.y - 115;
  };

  gotHurt(damage) {
    this.currentHP = this.currentHP - damage;
  };

  move() {
    this.sprite.anims.play('walk', true);
    return this;
  };
}

export default AliveObject;
