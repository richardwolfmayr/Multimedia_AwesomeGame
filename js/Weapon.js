import CONSTANTS from './Constants.js';

class Weapon {
  constructor(scene, spriteKey, bulletNumber, idx, damage) {
    this.scene = scene;

    this.weaponSlot = this.scene.add.graphics(0,  0);
    this.weaponSlot.fillStyle(0x999966, 1.0);
    this.weaponSlot.fillRoundedRect(0, 0, 60, 60, 10);

    this.weapon = this.scene.add.sprite(88, 80, spriteKey);

    this.bulletNumber = bulletNumber;
    this.bulletNumberText = this.scene.add.text(10, 40, this.bulletNumber, CONSTANTS.textStyle);

    this.idx = idx;
    this.idxText = this.scene.add.text(2, 2, this.idx.toString(), { fontSize: '14px', fill: '#0000FF' });
    this.container = this.scene.add.container(0, 0, [this.weaponSlot, this.weapon, this.bulletNumberText, this.idxText]).setSize(50, 50);

    this.damage = damage;
  }

  select() {
    this.weaponSlot.lineStyle(4, 0xFF00FF, 1.0);
    this.weaponSlot.strokeRoundedRect(0, 0, 60, 60, 10);
  }

  unselect() {
    this.weaponSlot.lineStyle(4, 0x999966, 1.0);
    this.weaponSlot.strokeRoundedRect(0, 0, 60, 60, 10);
  }

  canShoot(bulletNumber) {
    return this.bulletNumber == 'INF' || this.bulletNumber >= bulletNumber;
  }

  shootBullet(xCoord, yCoord) {
    if (this.bulletNumber != 'INF') {
      this.bulletNumber -= 1;
      this.bulletNumberText.setText(this.bulletNumber.toString());
    }

    if (!this.scene.shootingSound.isPlaying) {
      this.scene.shootingSound.play();
    }

    var bullet = this.scene.physics.add.sprite(xCoord, yCoord, `pistol_bullet_${this.idx}`);
    bullet.damage = this.damage;
    return bullet;
  }
}

export default Weapon;
