import AliveObject from './AliveObject.js';

class Player extends AliveObject {
  constructor(scene, xCoord, yCoord, assetKey, deathSound) {
    super(scene, xCoord, yCoord, assetKey, deathSound);

    this.sprite.setBounce(0.2); // our player will bounce from items

    // small fix to our player images, we resize the physics body object slightly
    this.sprite.setSize(210, 300);
	this.sprite.setOffset(this.sprite.width, this.sprite.height);
	debugger;
  }

  move() {
    if (this.scene.cursors.left.isDown) {
		this.sprite.body.setVelocityX(-200);
		if(this.scene.cursors.spacebar.isDown){
			this.sprite.anims.play('attack', true);
		} else {
			this.sprite.anims.play('walk', true); // walk left
		}
        this.sprite.flipX = true; // flip the sprite to the left
    } else if (this.scene.cursors.right.isDown) {
        this.sprite.body.setVelocityX(200);
		if(this.scene.cursors.spacebar.isDown){
			this.sprite.anims.play('attack', true);
		} else {
			this.sprite.anims.play('walk', true); // walk right
		}
        this.sprite.flipX = false; // use the original sprite looking to the right
	} else if (this.scene.cursors.spacebar.isDown) {
		this.sprite.body.setVelocityX(0);
		this.sprite.anims.play('attack', true);		
    } else {
        this.sprite.body.setVelocityX(0);
        this.sprite.anims.play('idle', true);
    }
	

    // Jump
    if (this.scene.cursors.up.isDown && this.sprite.body.onFloor()) {
      if (!this.scene.jumpSound.isPlaying) {
        this.scene.jumpSound.play();
      }
      this.sprite.body.setVelocityY(-800);
    }

    return this;
  };
  
}

export default Player;
