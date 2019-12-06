class SettingsScene extends Phaser.Scene {
  constructor() {

    super({
      key: 'settingsScene'
    })
  }

  init() {

  }

  preload() {
    this.load.tilemapTiledJSON('game_background', 'assets/game_background.json');
    this.load.spritesheet('tiles', 'assets/tiles.png', {frameWidth: 70, frameHeight: 70});

    this.load.svg('less_volume_button', 'assets/svg/arrow_left.svg')
    this.load.svg('more_volume_button', 'assets/svg/arrow_right.svg')
  }

  create() {
    this.cursors = this.input.keyboard.createCursorKeys();

    // load the map
    var map = this.make.tilemap({key: 'game_background'});

    // tiles for the ground layer
    var groundTiles = map.addTilesetImage('tiles');
    // create the ground layer
    var groundLayer = map.createDynamicLayer('World', groundTiles, 0, 0);




    this.scoreText = this.add.text(650, 250, `Sound: ${this.game.global.soundtrackVolume * 100}`, {
        fontSize: '20px',
        fill: '#000000'
    });
    this.scoreText.setScrollFactor(0);

    this.lessVolumeButton = this.add.sprite(850, 260, 'less_volume_button').setInteractive();
    this.lessVolumeButton.on('pointerdown', function (event) {
      this.scene.game.global.soundtrackVolume = Math.max(Math.round((this.scene.game.global.soundtrackVolume - 0.1) * 10) / 10, 0);
      this.scene.game.soundtrack.volume = this.scene.game.global.soundtrackVolume;
      this.scene.scoreText.setText(`Sound: ${this.scene.game.global.soundtrackVolume * 100}`);
    });

    this.moreVolumeButton = this.add.sprite(900, 260, 'more_volume_button').setInteractive();
    this.moreVolumeButton.on('pointerdown', function (event) {
      this.scene.game.global.soundtrackVolume = Math.min(Math.round((this.scene.game.global.soundtrackVolume + 0.1) * 10) / 10, 1);
      this.scene.game.soundtrack.volume = this.scene.game.global.soundtrackVolume;
      this.scene.scoreText.setText(`Sound: ${this.scene.game.global.soundtrackVolume * 100}`);
    })

    this.backButton = this.add.sprite(50, 50, 'less_volume_button').setInteractive();
    this.backButton.on('pointerdown', function (event) {
      this.scene.start('mainMenuScene');
    }, this);


      //
      // this.playButton = this.add.sprite(window.innerWidth / 2, window.innerHeight / 6 * 3, 'play_button').setInteractive();
      // this.playButton.on('pointerdown', function (event) {
      //   this.scene.start('playScene');
      // }, this); // Start game on click.
      //
      // this.settingsButton = this.add.sprite(window.innerWidth / 2, window.innerHeight / 6 * 2, 'settings_button').setInteractive();
      // this.settingsButton.on('pointerdown', function (event) {
      //   this.scene.start('settingsScene');
      // }); // Start game on click.
      //
      // // set background color, so the sky is not black
      this.cameras.main.setBackgroundColor('#ccccff');
  }

  update(time, delta) {
  }
}

export default SettingsScene;
