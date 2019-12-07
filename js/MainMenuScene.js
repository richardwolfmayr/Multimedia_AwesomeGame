import CommonMethodHelper from './CommonMethodHelper.js';
import CONSTANTS from './Constants.js';

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
    // this.game.soundtrack.play();
  }

  setMainMenu() {
    // Play button
    // These coordinates are based on considering the container as (0, 0)
    this.playButton = CommonMethodHelper.addButton(this, 100, -15 + CONSTANTS.svgOffset, 'play_button');
    this.playText = this.add.text(-80, -15, 'Play', CONSTANTS.textStyle);

    this.playContainer = CommonMethodHelper.addContainer(this, window.innerWidth / 2, window.innerHeight / 6 * 2 , [this.playButton, this.playText], 170, 40);
    this.playContainer.on('pointerdown', (event) => this.scene.start('playScene'), this); // Start game on click.

    // Settings option
    // These coordinates are based on considering the container as (0, 0)
    this.settingsButton = CommonMethodHelper.addButton(this, 100, -15 + CONSTANTS.svgOffset, 'settings_button');
    this.settingsText = this.add.text(-80, -15, 'Settings', CONSTANTS.textStyle);

    this.settingsContainer = CommonMethodHelper.addContainer(this, window.innerWidth / 2, window.innerHeight / 6 * 3 , [this.settingsButton, this.settingsText], 170, 40);
    this.settingsContainer.on('pointerdown', (event) => this.scene.start('settingsScene'), this); // Start game on click.
  }

  update(time, delta) {
  }
}

export default MainMenuScene;
