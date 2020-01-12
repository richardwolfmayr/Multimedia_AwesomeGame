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
    this.selectedMap = data;
  }

  preload() {
      // map made with Tiled in JSON format
      this.load.tilemapTiledJSON('map', `assets/tiles/map${this.selectedMap}.json?`+new Date().getTime());

      // tiles in spritesheet
      this.load.spritesheet('diabloTiles', 'assets/tiles/diabloTiles.png', {frameWidth: 70, frameHeight: 70});
      // simple coin image
      this.load.image('coinGold', 'assets/tiles/coinGold.png');
      // player animations
      this.load.atlas('player', 'assets/player.png', 'assets/player.json');
	  
	  
	  this.load.image('walk0', 'assets/PNG/wizard_fire/3_RUN_000.png');
	  this.load.image('walk1', 'assets/PNG/wizard_fire/3_RUN_001.png');
	  this.load.image('walk2', 'assets/PNG/wizard_fire/3_RUN_002.png');
	  this.load.image('walk3', 'assets/PNG/wizard_fire/3_RUN_003.png');
	  
	  this.load.image('ewalk0', 'assets/Golem_2/PNG/PNG Sequences/Running/0_Golem_Running_000.png');
	  this.load.image('ewalk1', 'assets/Golem_2/PNG/PNG Sequences/Running/0_Golem_Running_001.png');
	  this.load.image('ewalk2', 'assets/Golem_2/PNG/PNG Sequences/Running/0_Golem_Running_002.png');
	  this.load.image('ewalk3', 'assets/Golem_2/PNG/PNG Sequences/Running/0_Golem_Running_003.png');
	  this.load.image('ewalk4', 'assets/Golem_2/PNG/PNG Sequences/Running/0_Golem_Running_004.png');
	  this.load.image('ewalk5', 'assets/Golem_2/PNG/PNG Sequences/Running/0_Golem_Running_005.png');
	  this.load.image('ewalk6', 'assets/Golem_2/PNG/PNG Sequences/Running/0_Golem_Running_006.png');
	  this.load.image('ewalk7', 'assets/Golem_2/PNG/PNG Sequences/Running/0_Golem_Running_007.png');
	  this.load.image('ewalk8', 'assets/Golem_2/PNG/PNG Sequences/Running/0_Golem_Running_008.png');
	  this.load.image('ewalk9', 'assets/Golem_2/PNG/PNG Sequences/Running/0_Golem_Running_009.png');
	  this.load.image('ewalk10', 'assets/Golem_2/PNG/PNG Sequences/Running/0_Golem_Running_010.png');
	  this.load.image('ewalk11', 'assets/Golem_2/PNG/PNG Sequences/Running/0_Golem_Running_011.png');
	  
	  this.load.image('eidle0', 'assets/Golem_2/PNG/PNG Sequences/Idle/0_Golem_Idle_000.png');
	  this.load.image('eidle1', 'assets/Golem_2/PNG/PNG Sequences/Idle/0_Golem_Idle_001.png');
	  this.load.image('eidle2', 'assets/Golem_2/PNG/PNG Sequences/Idle/0_Golem_Idle_002.png');
	  this.load.image('eidle3', 'assets/Golem_2/PNG/PNG Sequences/Idle/0_Golem_Idle_003.png');
	  this.load.image('eidle4', 'assets/Golem_2/PNG/PNG Sequences/Idle/0_Golem_Idle_004.png');
	  this.load.image('eidle5', 'assets/Golem_2/PNG/PNG Sequences/Idle/0_Golem_Idle_005.png');
	  this.load.image('eidle6', 'assets/Golem_2/PNG/PNG Sequences/Idle/0_Golem_Idle_006.png');
	  this.load.image('eidle7', 'assets/Golem_2/PNG/PNG Sequences/Idle/0_Golem_Idle_007.png');
	  this.load.image('eidle8', 'assets/Golem_2/PNG/PNG Sequences/Idle/0_Golem_Idle_008.png');
	  this.load.image('eidle9', 'assets/Golem_2/PNG/PNG Sequences/Idle/0_Golem_Idle_009.png');
	  this.load.image('eidle10', 'assets/Golem_2/PNG/PNG Sequences/Idle/0_Golem_Idle_010.png');
	  this.load.image('eidle11', 'assets/Golem_2/PNG/PNG Sequences/Idle/0_Golem_Idle_011.png');
	  this.load.image('eidle12', 'assets/Golem_2/PNG/PNG Sequences/Idle/0_Golem_Idle_012.png');
	  this.load.image('eidle13', 'assets/Golem_2/PNG/PNG Sequences/Idle/0_Golem_Idle_013.png');
	  this.load.image('eidle14', 'assets/Golem_2/PNG/PNG Sequences/Idle/0_Golem_Idle_014.png');
	  this.load.image('eidle15', 'assets/Golem_2/PNG/PNG Sequences/Idle/0_Golem_Idle_015.png');
	  this.load.image('eidle16', 'assets/Golem_2/PNG/PNG Sequences/Idle/0_Golem_Idle_016.png');
	  this.load.image('eidle17', 'assets/Golem_2/PNG/PNG Sequences/Idle/0_Golem_Idle_017.png');
	  
	  this.load.image('idle0', 'assets/PNG/wizard_fire/1_IDLE_000.png');
	  this.load.image('idle1', 'assets/PNG/wizard_fire/1_IDLE_001.png');
	  this.load.image('idle2', 'assets/PNG/wizard_fire/1_IDLE_002.png');
	  this.load.image('idle3', 'assets/PNG/wizard_fire/1_IDLE_003.png');
	  this.load.image('idle4', 'assets/PNG/wizard_fire/1_IDLE_004.png');
	  
	  this.load.image('attack0', 'assets/PNG/wizard_fire/5_ATTACK_000.png');
	  this.load.image('attack1', 'assets/PNG/wizard_fire/5_ATTACK_002.png');
	  this.load.image('attack3', 'assets/PNG/wizard_fire/5_ATTACK_004.png');
	  this.load.image('attack4', 'assets/PNG/wizard_fire/5_ATTACK_005.png');
	  this.load.image('attack5', 'assets/PNG/wizard_fire/5_ATTACK_006.png');
	  
	  
	  
	  
	  

      //background image
      this.load.image('dungeonBackground', 'assets/tiles/dungeonBackground.png');

      // Enemy animations
      this.load.atlas('enemy', 'assets/tiles/player.png', 'assets/player.json');


      // this.load.spritesheet('redTiles', 'assets/redTile.png', {frameWidth: 70, frameHeight: 70});

      this.load.audio('jump_sound', ['assets/audio/jumpnew.mp3']);
      this.load.audio('enemy_dying', ['assets/audio/enemy_dyingnew.mp3']);
	  this.load.audio('player_dying', ['assets/audio/player_dying.mp3']);
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
    this.player = new Player(this, 200, 200, 'player', this.playerDyingSound);

    // player will collide with the level tiles
    this.physics.add.collider(this.player.sprite, this.groundLayer);
    this.physics.add.overlap(this.player.sprite, this.coinLayer);

    // player walk animation
	    this.anims.create({
        key: 'walk',
        frames: [
            { key: 'walk0' },
            { key: 'walk1' },
            { key: 'walk2' },
            { key: 'walk3' }
        ],
        frameRate: 10,
        repeat: 1
    });
	//
	this.anims.anims.size = 0.5;
	

	this.anims.create({
        key: 'idle',
        frames: [
            { key: 'idle0' },
            { key: 'idle1' },
            { key: 'idle2' },
            { key: 'idle3' },
			{ key: 'idle4' }
        ],
        frameRate: 5,
        repeat: -1
    });
	
		this.anims.create({
        key: 'attack',
        frames: [
            { key: 'attack0' },
            { key: 'attack1' },
            { key: 'attack3' },
			{ key: 'attack4' },
			{ key: 'attack5' }
        ],
        frameRate: 10,
        repeat: -1
    });
	  
  }


  createEnemies() {
    this.enemies = [];

    // player walk animation
	    this.anims.create({
        key: 'walk1',
        frames: [
            { key: 'ewalk0' },
            { key: 'ewalk1' },
            { key: 'ewalk2' },
			{ key: 'ewalk3' },
			{ key: 'ewalk4' },
			{ key: 'ewalk5' },
			{ key: 'ewalk6' },
			{ key: 'ewalk7' },
			{ key: 'ewalk8' },
			{ key: 'ewalk9' },
			{ key: 'ewalk10' },
            { key: 'ewalk11' }
        ],
        frameRate: 10,
        repeat: -1
    });

	this.anims.create({
        key: 'idle1',
        frames: [
            { key: 'eidle0' },
            { key: 'eidle1' },
            { key: 'eidle2' },
            { key: 'eidle3' },
			{ key: 'eidle4' },
			{ key: 'eidle5' },
			{ key: 'eidle6' },
			{ key: 'eidle7' },
			{ key: 'eidle8' },
			{ key: 'eidle9' },
			{ key: 'eidle10' },
			{ key: 'eidle11' },
			{ key: 'eidle12' },
			{ key: 'eidle13' },
			{ key: 'eidle14' },
			{ key: 'eidle15' },
			{ key: 'eidle16' },
			{ key: 'eidle17' }
        ],
        frameRate: 10,
        repeat: -1
    });

    for (var i = 0; i < 6; i++) {
      if (Math.random() < 0.5) {
        this.enemies.push(new DumbEnemy(this, 1500 + Math.random() * (window.innerWidth - 200), 200, 'enemy', this.enemyDyingSound));
      } else {
        this.enemies.push(new DumbEnemyWithJump(this, 1500 + Math.random() * window.innerWidth, 200, 'enemy', this.enemyDyingSound));
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
    this.add.image(0, 0, 'dungeonBackground').setOrigin(0, 0);

    this.setWeapons();
    this.setBackButton();

    debugger

    this.jumpSound = this.game.sound.add('jump_sound');
    this.enemyDyingSound = this.game.sound.add('enemy_dying');
	this.playerDyingSound = this.game.sound.add('player_dying');
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
    //this should really not be hardcoded, but i don't know any better solution so far... on these maps the gold has firstgid: 17, at the last map it had 61... who knows

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
    debugger
      this.coinLayer.removeTileAt(tile.x, tile.y); // remove the tile/coin
      this.coinsCollected++; // add 1 points to the score
      this.scoreText.setText(`Coins: ${this.coinsCollected}`); // set the text to show the current score
      return false;
  }

}

export default PlayScene;
