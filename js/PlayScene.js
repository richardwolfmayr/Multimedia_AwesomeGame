import CONSTANTS from './Constants.js';

class PlayScene extends Phaser.Scene {
  constructor() {
    super({
      key: 'playScene'
    })

    this.score = 0;
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

      this.load.svg('bullet', 'assets/svg/exit_button.svg');
  }

  setHealthBar(object) {

    object.healthbar = this.add.graphics(object.x - 125, object.y - 115);

    object.healthbar.lineStyle(1, 0xFF00FF, 1.0);
    object.healthbar.fillStyle(0x00FF00, 1.0);
    object.healthbar.fillRect(50, 50, 150, 10);
    object.healthbar.strokeRect(50, 50, 150, 10);

    // this.group.add(this.healthbar); // this.group being a pre-initialised group for this entity...
    object.currentHP = 100;
    object.totalHP = 100;
    object.lastHP = 100;
  }

  setHealthBars(objectsArray) {
    for (var i = 0; i < objectsArray.length; i++) {
      this.setHealthBar(objectsArray[i]);
    }
  }

  rgbToHex(r, g, b) {
    return "0x" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }

  createEnemies() {
    // create the enemy sprite
    this.enemies = []
    for (var i = 1; i < 10; i++) {
      var enemy = this.physics.add.sprite(400, 200, 'enemy');
      enemy.body.setSize(enemy.width, enemy.height - 8);
      this.physics.add.collider(this.groundLayer, enemy);
      this.anims.create({
          key: 'walk',
          frames: this.anims.generateFrameNames( 'enemy', {prefix: 'p1_walk', start: 1, end: 11, zeroPad: 2}),
          frameRate: 10,
          repeat: -1
      });
      // idle with only one frame, so repeat is not neaded
      this.anims.create({
          key: 'idle',
          frames: [{key:  'enemy', frame: 'p1_stand'}],
          frameRate: 10,
      });

      this.enemies.push(enemy);
    }
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

      // create the player sprite
      this.player = this.physics.add.sprite(200, 200, 'player');

      this.player.setBounce(0.2); // our player will bounce from items
      this.player.setCollideWorldBounds(true); // don't go out of the map

      this.setHealthBar(this.player);
      this.createEnemies();
      this.setHealthBars(this.enemies);

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



        // this.bullets = this.game.add.group();
  }

  damageEnemy(enemy, bullet) {
    // console.log(this.bullets);
    enemy.currentHP = enemy.currentHP - 50;
    this.bullets = this.bullets.filter((arrayBullet) => arrayBullet != bullet);
    bullet.setVisible(false);
  }

  update(time, delta) {
      if (this.cursors.down.isDown) {
        if (this.time.now > this.shootTime) {
          this.shootTime = this.time.now + 200;
          var bullet = this.physics.add.sprite(this.player.x, this.player.y, 'bullet');
          bullet.direction = this.player.flipX ? 'WEST' : 'EAST';
          for (var i = 0; i < this.enemies.length; i++) {
            this.physics.add.collider(this.enemies[i], bullet, this.damageEnemy, null, this);
          }
          this.bullets.push(bullet);
        }
      }

      for (var i = 0; i < this.bullets.length; i++) {
        if (this.bullets[i].direction == 'WEST') {
          this.bullets[i].setVelocityX(-400);
        } else {
          this.bullets[i].setVelocityX(400);
        }
        this.bullets[i].setVelocityY(0);
      }

      for (var i = 0; i < this.enemies.length; i++) {
        if (Math.random() < 0.5) {
          this.enemies[i].setVelocityX(-200);
          this.enemies[i].anims.play('walk', true);
          this.enemies[i].flipX = true;
        } else {
          this.enemies[i].setVelocityX(200);
          this.enemies[i].anims.play('walk', true);
          this.enemies[i].flipX = false;
        }
      }
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
          this.player.body.setVelocityY(-1000);
          this.currentHP = this.currentHP - 5;
      }


      this.updateHealthBar(this.player);
      this.updateHealthBars(this.enemies, 'enemy');
  }

  updateHealthBarPosition(object) {
    object.healthbar.x = object.x - 125;
    object.healthbar.y = object.y - 115;
  }

  updateHealthBars(objectsArray, objectType = 'player') {
    for (var i = 0; i < objectsArray.length; i++) {
      this.updateHealthBar(objectsArray[i], objectType);
    }
  }

  updateHealthBar(object, objectType = 'player') {
    if (objectType == 'enemy' && object.currentHP <= 0) {
      this.enemies = this.enemies.filter((arrayEnemy) => arrayEnemy != object);
      this.enemyDyingSound.play();
      object.setVisible(false);
      object.healthbar.setVisible(false);
    }
    if (object.currentHP != object.lastHP) {
      object.healthbar.lineStyle(1, 0xFF00FF, 1.0);
      object.healthbar.fillStyle(0xFFFFFF, 1.0);
      object.healthbar.fillRect(50, 50, 150, 10);
      object.healthbar.fillStyle(0x00FF00, 1.0);
      object.healthbar.fillRect(50, 50, 50 + Math.ceil(100 * object.currentHP / object.totalHP), 10);
      object.healthbar.strokeRect(50, 50, 150, 10);
    }

    this.updateHealthBarPosition(object);
  }

  collectCoin(sprite, tile) {
      this.coinLayer.removeTileAt(tile.x, tile.y); // remove the tile/coin
      this.score++; // add 10 points to the score
      this.scoreText.setText(this.score); // set the text to show the current score
      return false;
  }

}

export default PlayScene;
