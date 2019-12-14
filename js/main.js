import MainMenuScene from './Scenes/MainMenuScene.js'
import PlayScene from './Scenes/PlayScene.js'
import SettingsScene from './Scenes/SettingsScene.js'
import HelpScene from './Scenes/HelpScene.js';

var mainMenuScene = new MainMenuScene()
var playScene = new PlayScene()
var settingsScene = new SettingsScene()
var helpScene = new HelpScene()
var config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {y: 1500},
            debug: false
        }
    }
};

var game = new Phaser.Game(config);

game.global = {
}

game.scene.add('mainMenuScene', mainMenuScene);
game.scene.add('settingsScene', settingsScene);
game.scene.add('playScene', playScene);
game.scene.add('helpScene', helpScene);

game.scene.start('mainMenuScene');
