import AliveObject from './AliveObject.js';

class Player extends AliveObject {
  constructor(scene, xCoord, yCoord, assetKey, deathSound) {
    super(scene, xCoord, yCoord, assetKey, deathSound);

    this.sprite.setBounce(0.2); // our player will bounce from items

    // small fix to our player images, we resize the physics body object slightly
    this.sprite.body.setSize(this.sprite.width, this.sprite.height - 8);
  }

  move() {
    if (this.scene.cursors.left.isDown) {
        this.sprite.body.setVelocityX(-200);
        this.sprite.anims.play('walk', true); // walk left
        this.sprite.flipX = true; // flip the sprite to the left
    } else if (this.scene.cursors.right.isDown) {
        this.sprite.body.setVelocityX(200);
        this.sprite.anims.play('walk', true);
        this.sprite.flipX = false; // use the original sprite looking to the right
    } else {
        this.sprite.body.setVelocityX(0);
        this.sprite.anims.play('idle', true);
    }

    // Jump
    if (this.scene.cursors.up.isDown && this.sprite.body.onFloor()) {
        this.scene.jumpSound.play();
        this.sprite.body.setVelocityY(-1000);
    }

    return this;
  };
}

export default Player;
