import CONSTANTS from './Constants.js';
import DumbEnemy from './AliveObjects/DumbEnemy.js';
import DumbEnemyWithJump from './AliveObjects/DumbEnemyWithJump.js';
import Player from './AliveObjects/Player.js';

class PlayScene extends Phaser.Scene {
  constructor() {
    super({
      key: 'playScene'
    })

    this.coinsCollected = 0;
    this.shootTime = 0;
    this.bullets = [];
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

      // Enemy animations
      this.load.atlas('enemy', 'assets/player.png', 'assets/player.json');


      this.load.spritesheet('redTiles', 'assets/redTile.png', {frameWidth: 70, frameHeight: 70});

      this.load.audio('jump_sound', ['assets/audio/jump.mp3']);

      this.load.audio('enemy_dying', ['assets/audio/enemy_dying.mp3'])

      this.load.svg('bullet', 'assets/svg/star.svg');
  }

  rgbToHex(r, g, b) {
    return "0x" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }

  createPlayer() {
    // create the player sprite
    this.player = new Player(this, 200, 200, 'player', this.enemyDyingSound);

    // player will collide with the level tiles
    this.physics.add.collider(this.player.sprite, this.groundLayer);
    this.physics.add.overlap(this.player.sprite, this.coinLayer);

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
  }

  createEnemies() {
    this.enemies = [];

    this.anims.create({
        key: 'walk',
        frames: this.anims.generateFrameNames( 'enemy', {prefix: 'p1_walk', start: 1, end: 11, zeroPad: 2}),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'idle',
        frames: [{key:  'enemy', frame: 'p1_stand'}],
        frameRate: 10,
    });

    for (var i = 0; i < 8; i++) {
      if (Math.random() < 0.5) {
        this.enemies.push(new DumbEnemy(this, Math.random() * window.innerWidth, 200, 'enemy', this.enemyDyingSound));
      } else {
        this.enemies.push(new DumbEnemyWithJump(this, Math.random() * window.innerWidth, 200, 'enemy', this.enemyDyingSound));
      }
      this.physics.add.collider(this.enemies[i].sprite, this.groundLayer);
      this.physics.add.collider(this.enemies[i].sprite, this.player.sprite, this.damagePlayer, null, this);
    }
  }

  setCameras() {
    // set bounds so the camera won't go outside the game world
    this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
    // make the camera follow the player
    this.cameras.main.startFollow(this.player.sprite);

    // set background color, so the sky is not black
    this.cameras.main.setBackgroundColor('#ccccff');
  }

  create() {
      this.jumpSound = this.game.sound.add('jump_sound');
      this.enemyDyingSound = this.game.sound.add('enemy_dying');
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

      // when the player overlaps with a tile with index 17, collectCoin will be called
      this.coinLayer.setTileIndexCallback(17, this.collectCoin, this);

      this.cursors = this.input.keyboard.createCursorKeys();

      this.createPlayer();
      this.createEnemies();
      this.setCameras();

      // this text will show the score
      this.scoreText = this.add.text(20, 570, `Coins: ${this.coinsCollected}`, CONSTANTS.textStyle);
      // fix the text to the camera
      this.scoreText.setScrollFactor(0);
  }

  damagePlayer(enemySprite, playerSprite) {
    playerSprite.holder.gotHurt(10);
  }

  bulletHitsEnemy(bulletSprite, enemySprite) {
    enemySprite.holder.gotHurt(10);
    this.bullets = this.bullets.filter((arrayBullet) => arrayBullet != bulletSprite);
    bulletSprite.destroy();
  }

  update(time, delta) {
      // Shoot new bullets
      if (this.cursors.down.isDown) {
        if (this.time.now > this.shootTime) {
          this.shootTime = this.time.now + CONSTANTS.SHOOTING_TIMEOUT;

          var bullet = this.physics.add.sprite(this.player.sprite.x, this.player.sprite.y, 'bullet');
          bullet.direction = this.player.sprite.flipX ? 'WEST' : 'EAST';
          this.enemies.forEach((enemy) => this.physics.add.collider(bullet, enemy.sprite, this.bulletHitsEnemy, null, this));
          this.bullets.push(bullet);
        }
      }

      // Update bullets position
      this.bullets.forEach((bullet) => {
        bullet.setVelocityX(bullet.direction == 'WEST' ? -800 : 800);
        bullet.setVelocityY(0);
      });

      // Update enemies
      this.enemies.forEach((enemy) => enemy.move().updateHealthBar());
      this.enemies = this.enemies.filter((enemy) => !enemy.isDead);

      if (this.player.isDead) {
      } else {
        // Update player
        this.player.move().updateHealthBar();
      }
  }

  collectCoin(sprite, tile) {
      this.coinLayer.removeTileAt(tile.x, tile.y); // remove the tile/coin
      this.coinsCollected++; // add 1 points to the score
      this.scoreText.setText(`Coins: ${this.coinsCollected}`); // set the text to show the current score
      return false;
  }

}

export default PlayScene;
