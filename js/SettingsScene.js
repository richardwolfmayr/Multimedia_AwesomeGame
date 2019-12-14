import CONSTANTS from './Constants.js';

class SettingsScene extends Phaser.Scene {
  constructor() {
    super({
      key: 'settingsScene'
    })

    this.soundtrackSettings = {
      volume: 1.0,
      mute: false,
    };
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

  setSoundtrackVolume(volume) {
    this.soundtrackSettings.volume = volume;
    this.game.soundtrack.volume = volume;
    this.soundtrackText.setText(`Soundtrack: ${volume.toFixed(1) * 100}`);
    window.localStorage.setItem("soundtrackSettings", JSON.stringify(this.soundtrackSettings));
  }

  setSoundtrackMute(mute) {
    this.soundtrackSettings.mute = mute;
    this.game.soundtrack.mute = mute;
    var soundtrackMuteSVGKey = mute ? 'volume_on_button' : 'volume_off_button';
    this.soundtrackMute.setTexture(soundtrackMuteSVGKey);
    window.localStorage.setItem("soundtrackSettings", JSON.stringify(this.soundtrackSettings));
  }

  setSoundtrackSettings() {
    var soundtrackSettings = JSON.parse(window.localStorage.getItem('soundtrackSettings'));
    if (soundtrackSettings != null) {
      this.soundtrackSettings.volume = parseFloat(soundtrackSettings["volume"]).toFixed(1);
      this.soundtrackSettings.mute = soundtrackSettings["mute"];
      this.game.soundtrack.volume = this.soundtrackSettings.volume;
      this.game.soundtrack.mute = this.soundtrackSettings.mute;
    }

    this.soundtrackText = this.add.text(700, 250, `Soundtrack: ${this.soundtrackSettings.volume * 100}`, CONSTANTS.textStyle);
    this.soundtrackText.setScrollFactor(0);

    this.soundtrackLessVolume = this.add.sprite(900, 260, 'less_volume_button').setInteractive({ useHandCursor: true, });
    this.soundtrackLessVolume.on('pointerdown', (event) => {
      this.setSoundtrackVolume(Math.max(this.game.soundtrack.volume - 0.1, 0));
    }, this);

    this.soundtrackMoreVolume = this.add.sprite(950, 260, 'more_volume_button').setInteractive({ useHandCursor: true, });
    this.soundtrackMoreVolume.on('pointerdown', (event) => {
      this.setSoundtrackVolume(Math.min(this.game.soundtrack.volume + 0.1, 1));
    }, this);

    var soundtrackMuteSVGKey = this.soundtrackSettings.mute ? 'volume_on_button' : 'volume_off_button';
    this.soundtrackMute = this.add.sprite(1000, 260, soundtrackMuteSVGKey).setInteractive({ useHandCursor: true, });
    this.soundtrackMute.on('pointerdown', (event) => {
      this.setSoundtrackMute(!this.game.soundtrack.mute);
    });
  }

  create() {
    this.cursors = this.input.keyboard.createCursorKeys();

    // load the map
    var map = this.make.tilemap({key: 'game_background'});

    // tiles for the ground layer
    var groundTiles = map.addTilesetImage('tiles');
    // create the ground layer
    var groundLayer = map.createDynamicLayer('World', groundTiles, 0, 0);

    this.setSoundtrackSettings();


    // this.combatText = this.add.text(700, 300, `Combat: ${this.game.global.combat.volume.toFixed(1) * 100}`, CONSTANTS.textStyle);
    // this.combatText.setScrollFactor(0);
    //
    // this.combatLessVolume = this.add.sprite(900, 310, 'less_volume_button').setInteractive({ useHandCursor: true, });
    // this.combatLessVolume.on('pointerdown', (event) => {
    //   this.game.sound.volume = Math.max(this.game.sound.volume - 0.1, 0).toFixed(1);
    //   this.combatText.setText(`Combat: ${Math.max(this.game.sound.volume - 0.1, 0).toFixed(1) * 100}`);
    // }, this);
    //
    // this.combatMoreVolume = this.add.sprite(950, 310, 'more_volume_button').setInteractive({ useHandCursor: true, });
    // this.combatMoreVolume.on('pointerdown', (event) => {
    //   this.game.sound.volume = Math.min(this.game.sound.volume + 0.1, 1).toFixed(1);
    //   this.combatText.setText(`Combat: ${Math.min(this.game.sound.volume + 0.1, 1).toFixed(1) * 100}`);
    // }, this);
    //
    // var combatMuteSVGKey = this.game.sound.mute ? 'volume_on_button' : 'volume_off_button';
    // this.combatMute = this.add.sprite(1000, 310, combatMuteSVGKey).setInteractive({ useHandCursor: true, });
    // this.combatMute.on('pointerdown', (event) => {
    //     this.game.sound.mute = !this.game.sound.mute;
    //     combatMuteSVGKey = !this.game.sound.mute ? 'volume_on_button' : 'volume_off_button';
    //     this.combatMute.setTexture(combatMuteSVGKey);
    // });

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
