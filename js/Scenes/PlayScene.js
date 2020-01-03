import CONSTANTS from '../Constants.js';
import CommonMethodHelper from '../CommonMethodHelper.js';
import DumbEnemy from '../AliveObjects/DumbEnemy.js';
import DumbEnemyWithJump from '../AliveObjects/DumbEnemyWithJump.js';
import Player from '../AliveObjects/Player.js';
import Weapon from '../Weapon.js';

class PlayScene extends Phaser.Scene {
  constructor() {
    super({
      key: 'playScene'
    })

    this.coinsCollected = 0;
    this.shootTime = 0;
    this.bullets = [];
    this.isPaused = false;

  }

  init(data) {
    debugger
    this.selectedMap = data;
  }

  preload() {
      debugger
      // map made with Tiled in JSON format
      this.load.tilemapTiledJSON('map', `assets/tiles/map${this.selectedMap}.json?`+new Date().getTime());

      // tiles in spritesheet
      this.load.spritesheet('diabloTiles', 'assets/tiles/diabloTiles.png', {frameWidth: 70, frameHeight: 70});
      // simple coin image
      this.load.image('coinGold', 'assets/tiles/coinGold.png');
      // player animations
      this.load.atlas('player', 'assets/player.png', 'assets/player.json');

      //background image
      this.load.image('dungeonBackground', 'assets/tiles/dungeonBackground.png');

      // Enemy animations
      this.load.atlas('enemy', 'assets/tiles/player.png', 'assets/player.json');


      // this.load.spritesheet('redTiles', 'assets/redTile.png', {frameWidth: 70, frameHeight: 70});

      this.load.audio('jump_sound', ['assets/audio/jump.mp3']);
      this.load.audio('enemy_dying', ['assets/audio/enemy_dying.mp3'])
      this.load.audio('shooting', ['assets/audio/shooting.mp3']);

      this.load.svg('bullet', 'assets/svg/arrow_bullet_0.svg');
      this.load.svg('back_button', 'assets/svg/arrow_back.svg');

      for (var i = 0; i < 10; i++) {
        this.load.svg(`pistol_gun_${i}`, `assets/svg/pistol_gun_${i}.svg`);
        this.load.svg(`pistol_bullet_${i}`, `assets/svg/arrow_bullet_${i}.svg`);
      }
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

    for (var i = 0; i < 6; i++) {
      if (Math.random() < 0.5) {
        this.enemies.push(new DumbEnemy(this, 300 + Math.random() * (window.innerWidth - 200), 200, 'enemy', this.enemyDyingSound));
      } else {
        this.enemies.push(new DumbEnemyWithJump(this, 300 + Math.random() * window.innerWidth, 200, 'enemy', this.enemyDyingSound));
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
    //this.cameras.main.setBackgroundColor('#ccccff');
  }

  setWeapons() {
    this.weapons = [];
    this.weapons.push(new Weapon(this, `pistol_gun_0`, 'INF', 0, 5));
    this.weapons[0].container.x = 300 + 0 * 100;
    this.weapons[0].container.y = 30;
    for (var i = 1; i < 10; i++) {
      this.weapons.push(new Weapon(this, `pistol_gun_${i}`, 10, i, (i + 1) * 5));
      this.weapons[i].container.x = 300 + i * 100;
      this.weapons[i].container.y = 30;
    }

    this.selectedWeapon = 0;
    this.weapons[this.selectedWeapon].select();

    this.input.keyboard.on('keydown', function(e) {
      var key = e.key;
      if (key >= "0" && key <= "9") {
        var digit = parseInt(key);
        this.weapons[this.selectedWeapon].unselect();
        this.selectedWeapon = digit;
        this.weapons[this.selectedWeapon].select();
      }
    }, this);
  }

  setBackButton() {
    this.backText = this.add.text(30, 0, 'Back', CONSTANTS.textStyle);
    this.backButton = this.add.sprite(0, 10, 'back_button');

    this.backContainer = CommonMethodHelper.addContainer(this, 50, 50 , [this.backButton, this.backText], 170, 40);

    this.backContainer.on('pointerdown', (event) => this.scene.start('mainMenuScene'), this); // Start game on click.

    // this.backContainer.on('pointerdown', function (event) {
    //   event.manager.game.scene.start('mainMenuScene');
    //   event.manager.game.scene.stop('playScene');
    // })
  }

  //the order is important! first thing places is in the very back
  create() {
    // add background:
    this.add.image(0, 0, 'dungeonBackground').setOrigin(0, 0)

    this.setWeapons();
    this.setBackButton();


    this.jumpSound = this.game.sound.add('jump_sound');
    this.enemyDyingSound = this.game.sound.add('enemy_dying');
    this.shootingSound = this.game.sound.add('shooting');
    // load the map
    this.map = this.make.tilemap({key: 'map'});

    // tiles for the ground layer
    this.groundTiles = this.map.addTilesetImage('diabloTiles');
    // create the ground layer
    this.groundLayer = this.map.createDynamicLayer('World', this.groundTiles, 0, 0);
    // the player will collide with this layer
    this.groundLayer.setCollisionByExclusion([-1]);

    // coin image used as tileset
    var coinTiles = this.map.addTilesetImage('coinGold');

    // add coins as tiles
    this.coinLayer = this.map.createDynamicLayer('Coins', coinTiles, 0, 0);


    //redTiles
    // var redTiles = this.map.addTilesetImage('redTiles');
    // create the ground layer
    // var redLayer = this.map.createDynamicLayer('redTiles', redTiles, 0, 0);

    // set the boundaries of our game world
    this.physics.world.bounds.width = this.groundLayer.width;
    this.physics.world.bounds.height = this.groundLayer.height;



    // when the player overlaps with a tile with index 17, collectCoin will be called
    this.coinLayer.setTileIndexCallback(17, this.collectCoin, this);

    this.cursors = this.input.keyboard.createCursorKeys();
    this.cursors.spacebar = this.input.keyboard.addKey('SPACE');
    this.cursors.shift = this.input.keyboard.addKey('SHIFT');
    this.cursors.P = this.input.keyboard.addKey('P');

    this.createPlayer();
    this.createEnemies();
    this.setCameras();


    // this text will show the score
    this.scoreText = this.add.text(20, 570, `Coins: ${this.coinsCollected}`, CONSTANTS.textStyle);
    // fix the text to the camera
    this.scoreText.setScrollFactor(0);


    window.onkeydown = (event) => {
      if (event.key == "p" || event.key == "P") {
        this.isPaused = !this.isPaused;
        this.isPaused ? this.scene.pause() : this.scene.resume();
      }
    };
  }

  damagePlayer(enemySprite, playerSprite) {
    playerSprite.holder.gotHurt(10);
  }

  bulletHitsEnemy(bulletSprite, enemySprite) {
    enemySprite.holder.gotHurt(bulletSprite.damage);
    this.bullets = this.bullets.filter((arrayBullet) => arrayBullet != bulletSprite);
    bulletSprite.destroy();
  }

  update(time, delta) {
      // Shoot new bullets
      if (this.cursors.spacebar.isDown) {
        if (this.time.now > this.shootTime) {
          if (this.weapons[this.selectedWeapon].canShoot(1)) {
            var bullet = this.weapons[this.selectedWeapon].shootBullet(this.player.sprite.x, this.player.sprite.y);

          } else {
            var nonEmptyWeapon = this.selectedWeapon;
            while (!this.weapons[nonEmptyWeapon].canShoot(1)) {
              nonEmptyWeapon -= 1;
            }

            this.weapons[this.selectedWeapon].unselect();
            this.selectedWeapon = nonEmptyWeapon;
            this.weapons[this.selectedWeapon].select();
            var bullet = this.weapons[this.selectedWeapon].shootBullet(this.player.sprite.x, this.player.sprite.y);
          }

          this.shootTime = this.time.now + CONSTANTS.SHOOTING_TIMEOUT;
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
        this.isPaused = true;
        this.scene.pause();
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
