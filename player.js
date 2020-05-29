export default class Player{
	constructor(){
		this.reset();
		// this.score = 0;
		// this.movesLeft = 4;
		//Hardcore = 4
		//Hard = 6
	}


	win(){
		this.score += 10;
		this.movesLeft += 1;
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
		this.score = 0;
		this.movesLeft = 5;
	}
}