import CommonMethodHelper from '../CommonMethodHelper.js';
import CONSTANTS from '../Constants.js';
import PlayScene from './PlayScene.js'


class PickMapScene extends Phaser.Scene {
	constructor() {
		super({
			key: 'pickMapScene'
		})
	}

	init() {

	}

	preload() {
		// Play button
		for(var i=1;i<=2;i++){
			this.load.image(`map${i}_button`, `assets/tiles/map${i}.png`);
		}


	}

	create() {
		this.setMapButtons();

		// set background color, so the sky is not black
		this.cameras.main.setBackgroundColor('#ccccff');
	}

	setMapButtons() {
		this.playContainers = [];

		for(var i=1;i<=2;i++){
			this.playButton = CommonMethodHelper.addImageButton(this, 100, 0, `map${i}_button`,0.15);
			this.playText = this.add.text(-600, 0, 'Play map '+i, CONSTANTS.textStyle);
			this.playContainers[i] = CommonMethodHelper.addContainer(this, window.innerWidth / 2, window.innerHeight / 6 * i , [this.playButton, this.playText], this.playButton.width*0.15+200, this.playButton.height*0.15);
			this.playContainers[i].mapnumber = i;
			//this.playContainers[i].on('pointerdown', (event) => this.scene.start('playScene',this), this); // Start game on click.
			this.playContainers[i].on('pointerdown', function (event) {
				debugger
				//why does this not work? once a map was chosen it will always stay this one... only when reloading the page a new map can be chosen
				event.manager.game.scene.remove('playScene');
				event.manager.game.scene.add('playScene',new PlayScene());
				event.manager.game.scene.start('playScene',this.mapnumber);
				event.manager.game.scene.stop('pickMapScene');
			})
		}




	}


	update(time, delta) {
	}
}

export default PickMapScene;
