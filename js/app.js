// src/js/app.js
import UI from './ui.js';
import Game from './game.js';
import Card from './card.js';
import Player from './player.js';

class App{
	constructor(){
		this.game = new Game();
		this.game.showGameMenu();
	}

	
}

let app = new App();