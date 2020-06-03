export default class Player{
	constructor(gameMode){
		this.gameMode = gameMode;
		this.reset();
	}


	win(){
		this.score += 10;
		if (this.gameMode === "hardcore") {
			this.livesLeft += 1;
		}
	}


	lose(){
		// this.score -= 3;
		this.livesLeft -= 1;

		if (isNaN(this.score) || this.score <= 0) {
			this.score = 0;
		}
	}

	getScore(){
		return this.score;
	}

	getLivesLeft(){
		return this.livesLeft;
	}

	reset(){
		if (this.gameMode === "easy") {
			this.score = 0;
			this.livesLeft = 10;
		} else if (this.gameMode === "hardcore"){
			this.score = 0;
			this.livesLeft = 5;
		}
	}

	resetLives(){
		this.livesLeft = 10;
	}
}