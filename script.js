const cards = document.querySelectorAll('.memory-card');

let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;


function flipCard(){
	// don't allow multiple clicks (lock the board until it's finished animation)
	if (lockBoard) return;

	//make sure the first card can't be clicked 2 times to prevent a double click bug
	if (this === firstCard) return;
	
	this.classList.toggle('flip');

	// if is false, this is the first time the player has clicked the card
	if (!hasFlippedCard) {
		// first click
		hasFlippedCard = true;
		firstCard = this;

		return;
	}

	// else it's second card
	secondCard = this;
	
	checkForMatch();
		
}

function checkForMatch(){
	// if the cards match on second card attempt
	let isMatch = firstCard.dataset.framework === secondCard.dataset.framework; 
	
	// remove the event so it's not possible to rotate the cards again
	// if it's not a match rotate the cards back to their backface
	isMatch ? disableCards() : unflipCards();
	
}

function disableCards(){
	firstCard.removeEventListener('click', flipCard);
	secondCard.removeEventListener('click', flipCard);
	resetBoard();
}

function unflipCards(){
	lockBoard = true;
	setTimeout(() => {
		firstCard.classList.remove('flip');
		secondCard.classList.remove('flip');

		// lockBoard = false;
		resetBoard();
	}, 1000);
}

function resetBoard(){
	[hasFlippedCard, lockBoard] = [false, false];
	[firstCard, secondCard] = [null, null];
}

(function shuffle(){
	cards.forEach(card => {
		let randomPos = Math.floor(Math.random() * 20);
		card.style.order = randomPos;
	})
})();


cards.forEach(card => card.addEventListener('click', flipCard));