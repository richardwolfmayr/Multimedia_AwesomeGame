import CONSTANTS from './Constants.js';

class PlayScene extends Phaser.Scene {
  constructor() {
    super({
      key: 'playScene'
    })

    this.score = 0
  }

  init() {

  }

  preload() {
      // map made with Tiled in JSON format
      this.load.tilemapTiledJSON('map', 'assets/map.json');
      // tiles in spritesheet
      this.load.spritesheet('tiles', 'assets/tiles.png', {frameWidth: 70, frameHeight: 70});
      // simple coin image
      this.load.image('coin', 'assets/coinGold.png');
      // player animations
      this.load.atlas('player', 'assets/player.png', 'assets/player.json');

      this.load.spritesheet('redTiles', 'assets/redTile.png', {frameWidth: 70, frameHeight: 70});

      this.load.audio('jump_sound', ['assets/audio/jump.mp3']);
  }

  setPlayerHealthBar() {

    this.player.healthbar = this.add.graphics(this.player.x - 125, this.player.y - 115);

    this.player.healthbar.lineStyle(1, 0xFF00FF, 1.0);
    this.player.healthbar.fillStyle(0x00FF00, 1.0);
    this.player.healthbar.fillRect(50, 50, 150, 10);
    this.player.healthbar.strokeRect(50, 50, 150, 10);

    // this.group.add(this.healthbar); // this.group being a pre-initialised group for this entity...
    this.player.currentHP = 100;
    this.player.totalHP = 100;
    this.player.lastHP = 100;
  }

  rgbToHex(r, g, b) {
    return "0x" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }

  create() {
      this.jumpSound = this.game.sound.add('jump_sound');

      // load the map
      this.map = this.make.tilemap({key: 'map'});

      // tiles for the ground layer
      this.groundTiles = this.map.addTilesetImage('tiles');
      // create the ground layer
      this.groundLayer = this.map.createDynamicLayer('World', this.groundTiles, 0, 0);
      // the player will collide with this layer
      this.groundLayer.setCollisionByExclusion([-1]);

      // coin image used as tileset
      var coinTiles = this.map.addTilesetImage('coin');

      // add coins as tiles
      this.coinLayer = this.map.createDynamicLayer('Coins', coinTiles, 0, 0);

      //redTiles
      var redTiles = this.map.addTilesetImage('redTiles');
      // create the ground layer
      var redLayer = this.map.createDynamicLayer('redTiles', redTiles, 0, 0);





      // set the boundaries of our game world
      this.physics.world.bounds.width = this.groundLayer.width;
      this.physics.world.bounds.height = this.groundLayer.height;

      // create the player sprite
      this.player = this.physics.add.sprite(200, 200, 'player');

      this.player.setBounce(0.2); // our player will bounce from items
      this.player.setCollideWorldBounds(true); // don't go out of the map

      this.setPlayerHealthBar();

      // small fix to our player images, we resize the physics body object slightly
      this.player.body.setSize(this.player.width, this.player.height-8);

      // player will collide with the level tiles
      this.physics.add.collider(this.groundLayer, this.player);

      this.coinLayer.setTileIndexCallback(17, this.collectCoin, this);
      // when the player overlaps with a tile with index 17, collectCoin
      // will be called
      this.physics.add.overlap(this.player, this.coinLayer);

      // player walk animation
      this.anims.create({
          key: 'walk',
          frames: this.anims.generateFrameNames('player', {prefix: 'p1_walk', start: 1, end: 11, zeroPad: 2}),
          frameRate: 10,
          repeat: -1
      });
      // idle with only one frame, so repeat is not neaded
      this.anims.create({
          key: 'idle',
          frames: [{key: 'player', frame: 'p1_stand'}],
          frameRate: 10,
      });


      this.cursors = this.input.keyboard.createCursorKeys();

      // set bounds so the camera won't go outside the game world
      this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
      // make the camera follow the player
      this.cameras.main.startFollow(this.player);

      // set background color, so the sky is not black
      this.cameras.main.setBackgroundColor('#ccccff');

      // this text will show the score
      this.scoreText = this.add.text(20, 570, '0', {
          fontSize: '20px',
          fill: '#ffffff'
      });
      // fix the text to the camera
      this.scoreText.setScrollFactor(0);
  }

  update(time, delta) {
      if (this.cursors.left.isDown)
      {
          this.player.body.setVelocityX(-200);
          this.player.anims.play('walk', true); // walk left
          this.player.flipX = true; // flip the sprite to the left
      }
      else if (this.cursors.right.isDown)
      {
          this.player.body.setVelocityX(200);
          this.player.anims.play('walk', true);
          this.player.flipX = false; // use the original sprite looking to the right
      } else {
          this.player.body.setVelocityX(0);
          this.player.anims.play('idle', true);
      }
      // jump
      if (this.cursors.up.isDown && this.player.body.onFloor())
      {
          this.jumpSound.play();
          this.player.body.setVelocityY(-500);
          this.currentHP = this.currentHP - 5;
      }

      this.updatePlayerHealthBar();
  }

  updatePlayerHealthBarPosition() {
    this.player.healthbar.x = this.player.x - 125;
    this.player.healthbar.y = this.player.y - 115;
  }

  updatePlayerHealthBar() {
    if (this.player.currentHP != this.player.lastHP) {
      this.player.healthbar.lineStyle(1, 0xFF00FF, 1.0);
      this.player.healthbar.fillStyle(0xFFFFFF, 1.0);
      this.player.healthbar.fillRect(50, 50, 150, 10);
      this.player.healthbar.fillStyle(0x00FF00, 1.0);
      this.player.healthbar.fillRect(50, 50, 50 + Math.ceil(100 * this.player.currentHP / this.player.totalHP), 10);
      this.player.healthbar.strokeRect(50, 50, 150, 10);
    }

    this.updatePlayerHealthBarPosition();
  }

  collectCoin(sprite, tile) {
      this.coinLayer.removeTileAt(tile.x, tile.y); // remove the tile/coin
      this.score++; // add 10 points to the score
      this.scoreText.setText(this.score); // set the text to show the current score
      return false;
  }

}

export default PlayScene;
