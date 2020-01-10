import MainMenuScene from './Scenes/MainMenuScene.js'
import PlayScene from './Scenes/PlayScene.js'
import SettingsScene from './Scenes/SettingsScene.js'
import HelpScene from './Scenes/HelpScene.js';
import PickMapScene from './Scenes/PickMapScene.js';

var mainMenuScene = new MainMenuScene()
var playScene = new PlayScene()
var pickMapScene = new PickMapScene()
var settingsScene = new SettingsScene()
var helpScene = new HelpScene()
var config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {y: 2000},
            debug: true,
            TILE_BIAS: 64
        }
    }
};

var game = new Phaser.Game(config);

game.global = {

}

game.scene.add('mainMenuScene', mainMenuScene);
game.scene.add('settingsScene', settingsScene);
game.scene.add('playScene', playScene);
game.scene.add('pickMapScene', pickMapScene);
game.scene.add('helpScene', helpScene);


game.scene.start('mainMenuScene');
