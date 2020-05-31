export default class Player{
	constructor(gameMode){
		this.gameMode = gameMode;
		this.reset();
	}


	win(){
		this.score += 10;
		if (this.gameMode === "hardcore") {
			this.movesLeft += 1;
		}
	}


	lose(){
		// this.score -= 3;
		this.movesLeft -= 1;

		if (isNaN(this.score) || this.score <= 0) {
			this.score = 0;
		}
	}

	getScore(){
		return this.score;
	}

	getMovesLeft(){
		return this.movesLeft;
	}

	reset(){
		if (this.gameMode === "easy") {
			this.score = 0;
			this.movesLeft = 10;
		} else if (this.gameMode === "hardcore"){
			this.score = 0;
			this.movesLeft = 5;
		}
	}

	resetLives(){
		this.movesLeft = 10;
	}
}