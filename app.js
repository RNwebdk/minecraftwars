import Game from './game.js';

class App{
	constructor(){
		this.game = new Game();
		this.game.showGameMenu();
		// this.game.showDebugMenu()
	}

	
}

let app = new App();