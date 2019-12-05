import MainMenuScene from './MainMenuScene.js'
import PlayScene from './PlayScene.js'

var mainMenuScene = new MainMenuScene()
var playScene = new PlayScene()

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
game.scene.add('mainMenuScene', mainMenuScene)
game.scene.add('playScene', playScene)

game.scene.start('mainMenuScene')
