import CONSTANTS from './Constants.js';

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

    this.load.svg('less_volume_button', 'assets/svg/arrow_left.svg');
    this.load.svg('more_volume_button', 'assets/svg/arrow_right.svg');
    this.load.svg('volume_off_button', 'assets/svg/volume_off.svg');
    this.load.svg('volume_on_button', 'assets/svg/volume_on.svg');
  }

  create() {
    this.cursors = this.input.keyboard.createCursorKeys();

    // load the map
    var map = this.make.tilemap({key: 'game_background'});

    // tiles for the ground layer
    var groundTiles = map.addTilesetImage('tiles');
    // create the ground layer
    var groundLayer = map.createDynamicLayer('World', groundTiles, 0, 0);

    this.soundText = this.add.text(700, 250, `Sound: ${this.game.soundtrack.volume.toFixed(1) * 100}`, CONSTANTS.settingsTextStyle);
    this.soundText.setScrollFactor(0);

    this.lessVolumeButton = this.add.sprite(850, 260, 'less_volume_button').setInteractive({ useHandCursor: true, });
    this.lessVolumeButton.on('pointerdown', (event) => {
      this.game.soundtrack.volume = Math.max(this.game.soundtrack.volume - 0.1, 0);
      this.soundText.setText(`Sound: ${Math.max(this.game.soundtrack.volume - 0.1, 0).toFixed(1) * 100}`);
    }, this);

    this.moreVolumeButton = this.add.sprite(900, 260, 'more_volume_button').setInteractive({ useHandCursor: true, });
    this.moreVolumeButton.on('pointerdown', (event) => {
      this.game.soundtrack.volume = Math.min(this.game.soundtrack.volume + 0.1, 1);
      this.soundText.setText(`Sound: ${Math.min(this.game.soundtrack.volume + 0.1, 1).toFixed(1) * 100}`);
    }, this);

    var muteButtonSvgKey = this.game.soundtrack.mute ? 'volume_on_button' : 'volume_off_button';
    this.muteButton = this.add.sprite(950, 260, muteButtonSvgKey).setInteractive({ useHandCursor: true, });
    this.muteButton.on('pointerdown', (event) => {
        this.game.soundtrack.mute = !this.game.soundtrack.mute;
        muteButtonSvgKey = !this.game.soundtrack.mute ? 'volume_on_button' : 'volume_off_button';
        this.muteButton.setTexture(muteButtonSvgKey);
    });

    this.backButton = this.add.sprite(50, 50, 'less_volume_button').setInteractive({ useHandCursor: true, });
    this.backButton.on('pointerdown', (event) => {
      this.scene.start('mainMenuScene');
    }, this);

    this.cameras.main.setBackgroundColor('#ccccff');
  }

  update(time, delta) {
  }
}

export default SettingsScene;
