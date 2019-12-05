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
    this.load.tilemapTiledJSON('main_menu_background', 'assets/main_menu_background.json');

    // tiles in spritesheet
    this.load.spritesheet('tiles', 'assets/tiles.png', {frameWidth: 70, frameHeight: 70});

    // Play button
    this.load.svg('play_button', 'assets/svg/play_button.svg')

    // Settings button
    this.load.svg('settings_button', 'assets/svg/settings_button.svg')

    // Exit button
    this.load.svg('exit_button', 'assets/svg/exit_button.svg')

  }

  create() {
      // load the map
      var map = this.make.tilemap({key: 'main_menu_background'});

      // tiles for the ground layer
      var groundTiles = map.addTilesetImage('tiles');

      // create the ground layer
      var groundLayer = map.createDynamicLayer('World', groundTiles, 0, 0);

      this.playButton = this.add.sprite(window.innerWidth / 2, window.innerHeight / 5 * 2, 'play_button').setInteractive();
      this.settingsButton = this.add.sprite(window.innerWidth / 2, window.innerHeight / 5 * 3, 'settings_button').setInteractive();
      this.exitButton = this.add.sprite(window.innerWidth / 2, window.innerHeight / 5 * 4, 'exit_button').setInteractive();

      this.playButton.on('pointerdown', function (event) {
        this.scene.start('playScene');
      }, this); // Start game on click.
      this.settingsButton.on('pointerdown', function (event) { console.log('Clicked settings!'); }); // Start game on click.
      this.exitButton.on('pointerdown', function (event) { console.log('Clicked exit!'); }); // Start game on click.


      // set background color, so the sky is not black
      this.cameras.main.setBackgroundColor('#ccccff');
  }

  update(time, delta) {

  }
}

export default MainMenuScene;
