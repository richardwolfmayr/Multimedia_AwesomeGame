import CommonMethodHelper from '../CommonMethodHelper.js';
import CONSTANTS from '../Constants.js';

class HelpScene extends Phaser.Scene {
  constructor() {
    super({
      key: 'helpScene'
    })
  }

  init() {

  }

  preload() {
    this.load.tilemapTiledJSON('game_background', 'assets/game_background.json');
    this.load.spritesheet('tiles', 'assets/tiles.png', {frameWidth: 70, frameHeight: 70});

    this.load.svg('back_button', 'assets/svg/arrow_back.svg');
  }

  setBackButton() {
    this.backText = this.add.text(30, 0, 'Back', CONSTANTS.textStyle);
    this.backText.setScrollFactor(0);

    this.backButton = this.add.sprite(0, 10, 'back_button');

    this.backContainer = CommonMethodHelper.addContainer(this, 50, 50 , [this.backButton, this.backText], 170, 40);
    this.backContainer.on('pointerdown', (event) => this.scene.start('mainMenuScene'), this); // Start game on click.
  }

  create() {
    this.cursors = this.input.keyboard.createCursorKeys();

    // load the map
    var map = this.make.tilemap({key: 'game_background'});

    // tiles for the ground layer
    var groundTiles = map.addTilesetImage('tiles');
    // create the ground layer
    var groundLayer = map.createDynamicLayer('World', groundTiles, 0, 0);

    this.setBackButton();

    this.movementText = this.add.text(550, 200, '1. Move with WAD.', { color: "#FF0000", fontSize: 26 });
    this.shootingText = this.add.text(550, 250, '2. Shoot with SPACEBAR.', { color: "#FF0000", fontSize: 26 });
    this.pauseText = this.add.text(550, 300, '3. Pause/Unpause with p/P.', { color: "#FF0000", fontSize: 26 });
    this.changeWeaponsText = this.add.text(550, 350, '4. Change weapons with 0, 1, ..., 9.', { color: "#FF0000", fontSize: 26 });
    this.changeSettingsText = this.add.text(550, 400, '5. Changing settings persists automatically.', { color: "#FF0000", fontSize: 26 });
    this.cameras.main.setBackgroundColor('#ccccff');
  }

  update(time, delta) {
  }

}

export default HelpScene;
