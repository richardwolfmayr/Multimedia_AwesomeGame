var soundtrack;

class MainMenuScene extends Phaser.Scene {
  constructor() {

    super({
      key: 'mainMenuScene'
    })
  }

  init() {

  }

  preload() {
    // map made with Tiled in JSON format
    this.load.tilemapTiledJSON('game_background', 'assets/game_background.json');

    // tiles in spritesheet
    this.load.spritesheet('tiles', 'assets/tiles.png', {frameWidth: 70, frameHeight: 70});

    // Play button
    this.load.svg('play_button', 'assets/svg/play_button.svg');

    // Settings button
    this.load.svg('settings_button', 'assets/svg/settings_button.svg');

    // Default soundtrack
    this.load.audio('soundtrack', ['assets/audio/Rammstein - Sonne.mp3']);
  }

  create() {
      if (this.game.soundtrack == undefined) {
        this.setSoundtrack();
      }

      this.setMainMenu();

      // load the map
      var map = this.make.tilemap({key: 'game_background'});

      // tiles for the ground layer
      var groundTiles = map.addTilesetImage('tiles');

      // create the ground layer
      var groundLayer = map.createDynamicLayer('World', groundTiles, 0, 0);

      // set background color, so the sky is not black
      this.cameras.main.setBackgroundColor('#ccccff');
  }

  setSoundtrack() {
    this.game.soundtrack = this.sound.add('soundtrack');
    this.sound.context.resume();
    this.sound.pauseOnBlur = false;
    this.game.soundtrack.play();
  }

  setMainMenu() {

    this.playButton = this.add.sprite(window.innerWidth / 2, window.innerHeight / 6 * 2, 'play_button').setInteractive();
    this.playButton.on('pointerdown', function (event) {
      console.log('Play');
      this.scene.start('playScene');
    }, this); // Start game on click.

    this.playText = this.add.text(this.playButton.x - 150, this.playButton.y - 48, 'Play', {
        fontSize: '20px',
        fill: '#000000'
    });
    this.playText.on('pointerdown', function (event) {
      this.scene.start('playScene');
    });
    this.playText.setScrollFactor(0);

    this.settingsButton = this.add.sprite(window.innerWidth / 2, window.innerHeight / 6 * 3, 'settings_button').setInteractive();
    this.settingsButton.on('pointerdown', function (event) {
      console.log('Settings');
      this.scene.start('settingsScene');
    }, this); // Start settings on click

    this.settingsText = this.add.text(this.settingsButton.x - 150, this.settingsButton.y - 48, 'Settings', {
        fontSize: '20px',
        fill: '#000000'
    });
    this.settingsText.on('pointerdown', function (event) {
      this.scene.start('settingsScene');
    });
    this.settingsText.setScrollFactor(0);

  }


  update(time, delta) {
  }
}

export default MainMenuScene;
