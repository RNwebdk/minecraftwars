export default class UI{
	static cardTemplate(card){
		return `
		<div class="memory-card" data-framework="${card.icon}">
			<img class="front-face" id="frontface${card.cardIndex}" data-cardIndex="${card.cardIndex}" src="img/${card.icon}" draggable="false" >
			<img class="back-face" data-cardIndex="${card.cardIndex}" alt="minecraft-card" src="img/minecraft.png" draggable="false" >
		</div>`;
	}

	static startMenuTemplate(){
		return `
		<img src="img/minecraftwars.png" class="minecraftwars" alt="">
		<button class="mc-button" id="singleplayer">Start Game</button>`;
	}

	static scoreBoardTemplate(moves, score, highscore = 0){
		return `
		 <div id="playerScoreBox">Highscore: <span id="playerHighScore">${highscore}</span><br />Game Score: <span id="playerScore">${moves}</span></div>
		 <div id="movesLeftBox">Lives left: <span id="movesLeft">${score}</span></div>`;
	}

	static resetGameButton(){
		return `<button class="mc-button" id="resetGameButton">Next Round</button>`;
	}

	static gameOverTemplate(score){
		return `
		<div id="gameoverWrapper">
		<p>Game Over</p>
			<h1>Total Score: <span id="gameoverScore">${score}</span></h1>
		</div>
		<button class="mc-button" id="backToStartMenu">Back to Main Menu</button>`;
	}

	static animate(element, animation, content = ''){
		switch(animation){

			//Show Start Menu
			case 'flipInX':
				element.classList.add('animate__animated', 'animate__jackInTheBox');
				setTimeout(() => {
					element.classList.remove('animate__animated', 'animate__jackInTheBox');
					element.innerHTML = content;
				}, 1500);
			break;


			//When game starts
			case 'swipeOutLeft':
				element.classList.add('animate__animated', 'animate__bounceOutLeft');
				setTimeout(() => {
					element.classList.remove('animate__animated', 'animate__bounceOutLeft');
					element.innerHTML = content;
				}, 400);
			break

			case 'swipeInRight':
				setTimeout(() => {
					element.innerHTML = content;
					element.classList.add('animate__animated', 'animate__bounceInRight');
				}, 400);

				setTimeout(() => {
					element.classList.remove('animate__animated', 'animate__bounceInRight');
				}, 2000);
			break

			// scoreboard and "moves left"
			case 'swipeInTop':
					
				element.classList.add('animate__animated', 'animate__backInDown');
				

				setTimeout(() => {
					element.classList.remove('animate__animated', 'animate__backInDown');
				}, 1500);
			break;

			case 'noAnimation':
				// element.children[1].remove();
				// setTimeout(() => {
				// 	element.classList.add('animate__animated', 'animate__flash', 'flip');
				// }, 400);

				// setTimeout(() => {
				// 	element.classList.remove('animate__animated', 'animate__flash');
				// }, 2000);

				setTimeout(() => {
					element.innerHTML = content;
				}, 1500);

				
			break;

			// Update "Moves Left"
			case 'rubberBand':
			console.log("rubber");
				element.classList.add('animate__animated', 'animate__rubberBand');
				element.innerHTML = content;

				setTimeout(() => {
					element.classList.remove('animate__animated', 'animate__rubberBand');
				}, 1500);
			break;

			//on game over
			case 'bounceOutDown':

				element.classList.add('animate__animated', 'animate__bounceOutDown');

				setTimeout(() => {
					element.classList.remove('animate__animated', 'animate__bounceOutDown');
					element.innerHTML = content;
				}, 800);
			break;

			case 'bounceIn':
				setTimeout(() => {
					element.innerHTML = content;
					element.classList.add('animate__animated', 'animate__bounceIn');
				}, 1000);

				setTimeout(() => {
					element.classList.remove('animate__animated', 'animate__bounceIn');
				}, 2000);
			break;

			case 'rotateOut':
				element.classList.add('animate__animated', 'animate__rotateOut');
				setTimeout(() => {
					element.classList.remove('animate__animated', 'animate__rotateOut');
					element.innerHTML = content;
				}, 1000);

				setTimeout(() => {
					element.remove();
				}, 1000);
			break;
		}
	}

}