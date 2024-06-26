import UI from './ui.js';
import Card from './card.js';
import Player from './player.js';

export default class Game{
	constructor(){
		this.preventInspectTools();
		this.gameBoardElement = document.getElementById('gameboard');
		this.randomAndUniqueCards();

		this.cards = [];
		this.gameBoardElement.addEventListener("click", this.onFlip.bind(this));
		window.localStorage.getItem('highscore') ? window.localStorage.getItem('highscore') : window.localStorage.setItem('highscore', 0);
		this.firstCard;
		this.secondCard;
		this.hasFlippedCard = false;
		this.lockBoard = false;
		this.gameOver = false;

	}

	showGameMenu(){
		//Game menu buttons
		this.gameBoardElement.innerHTML = UI.startMenuTemplate();
		document.getElementById("easyMode").addEventListener('click', this.onGameStart.bind(this));
		document.getElementById("hardcoreMode").addEventListener('click',this.onGameStart.bind(this));
		document.getElementById("resetHighscore").addEventListener('click',this.resetHighscore.bind(this));
		
		//Rules
		document.getElementById('rules').style.display = 'block';
		this.onRulesHover();
	}

	onGameStart(e){
		// get gamemode
		this.gameMode = e.srcElement.dataset.gamemode;

		this.player = new Player(this.gameMode);
		this.startNewGame();
		document.getElementById('rules').style.display = 'none';		
	}

	startNewGame(){
		document.getElementById('scoreboard').innerHTML = UI.scoreBoardTemplate(this.player.getScore(), this.player.getLivesLeft(), window.localStorage.getItem('highscore'));

		//swipe the cards first from the right
		UI.animate(this.gameBoardElement, 'swipeOutLeft');
		UI.animate(this.gameBoardElement, 'swipeInRight', this.getGameCards() );
		
		// then swipe the scoreboard and "moves Left" from the top
		UI.animate(document.getElementById('scoreboard'), 'swipeInTop');
		Game.shuffle();
		if (this.gameMode === "easy") {
			this.showCardTip();
		}
	}

	showCardTip(){
		setTimeout(() => {
			document.querySelectorAll('.memory-card').forEach(card => {
				card.classList.add('flip');
				this.lockBoard = true;
			});
		}, 1000);

		setTimeout(() => {
			document.querySelectorAll('.memory-card').forEach(card => {
				card.classList.remove('flip');
				this.lockBoard = false;
			});
		}, 5000);
	}

	resetHighscore(){
		let resethighscore = confirm("You're about to delete your highscore, are you sure you wanna do that ?");
		if (resethighscore) {
			window.localStorage.setItem('highscore', 0);
		}
	}

	onFlip(e){
		// check what was clicked
		// if (e.target.nodeName === "IMG") {
		if (e.target.alt === "minecraft-card") {
			// don't allow multiple clicks (lock the board until it's finished animation)
			if (this.lockBoard) return;

			let cardIndex = e.target.dataset.cardindex;
			let current = document.getElementById('frontface' + cardIndex);
			let currentparent = document.getElementById('frontface' + cardIndex).parentElement;

			//make sure the first card can't be clicked 2 times to prevent a double click bug
			if (currentparent === this.firstCard) return;
			current.parentElement.classList.toggle('flip');

			// if is false, this is the first time the player has clicked the card
			if (!this.hasFlippedCard) {
				// first click
				this.hasFlippedCard = true;
				this.firstCard = currentparent;

				return;
			}

			// else it's second card
			this.secondCard = currentparent;

			this.checkForMatch()

		}
		

	}

	checkForMatch(){
	// if the cards match on second card attempt
	let isMatch = this.firstCard.dataset.framework === this.secondCard.dataset.framework; 
	// if it's not a match rotate the cards back to their backface
		if (isMatch) {
			this.removePairFromBoard();
			this.player.win();
			this.updateScoreAndLivesLeft();
			this.takeANewGuess();

			if (this.hasGameEnded()) {
				UI.animate(this.gameBoardElement, 'noAnimation', UI.resetGameButton());
				this.randomAndUniqueCards();
				if (this.gameMode === 'easy') {
					this.player.resetLives();
				}
				this.onGameResetBoard();
			}
			


		}else{
			this.unflipCards();
			this.player.lose();
			this.updateScoreAndLivesLeft();

			// check if game is over
			this.checkGameOver();
			
			if (this.gameOver) {
				this.gameIsOver();
			}
		}
	
	}


	randomSound(){
		setTimeout(() => {
			let sounds = [
				"Chicken_plop.ogg",
				"Minecraft-pling.mp3",
				"Minecraft-levelup.mp3",
				"Minecraft-explode1.mp3",
				"Minecraft-break.mp3",
				"anvil_break.ogg",
				"anvil_land.ogg",
				"anvil_use.ogg",
				"bowhit1.ogg",
				"anvil_break.ogg",
				"bowhit1.ogg",
				"bowhit2.ogg",
				"bowhit3.ogg",
				"bowhit4.ogg",
				"break.ogg",
				"chestclosed.ogg",
				"chestopen.ogg",
				"classic_hurt.ogg",
				"door_close.ogg",
				"door_open.ogg",
				"explode2.ogg",
				"explode3.ogg",
				"explode4.ogg",
				"glass1.ogg",
				"glass2.ogg",
				"glass3.ogg",
				"orb.ogg",
				"splash.ogg"
			];

			let random = Math.floor(Math.random() * 27); 
			
			let audio = new Audio("sound/" +sounds[random]);
			audio.volume = 0.02;
			audio.play();
		}, 1500);
	}

	updateScoreAndLivesLeft(){
		// Update score
		document.getElementById('playerScore').innerHTML = this.player.getScore();

		// Update Highscore
		this.isNewRecord();


		// Update moves left
		let livesLeft = document.getElementById('livesLeft');
		livesLeft.innerHTML = this.player.getLivesLeft();

	}

	isNewRecord(){
		// Check if current score is greater than highscore
		if (this.player.getScore() > window.localStorage.getItem('highscore')) {
			window.localStorage.setItem('highscore', this.player.getScore()); 
			document.getElementById('playerHighScore').innerHTML = window.localStorage.getItem('highscore');
		}
	}

	checkGameOver(){
		if (this.player.getLivesLeft() <= 0) {
			this.gameOver = true;
		}
	}

	gameIsOver(){
		UI.animate(this.gameBoardElement, 'bounceOutDown');
		UI.animate(this.gameBoardElement, 'bounceIn', UI.gameOverTemplate(this.player.getScore()));
		UI.animate(document.getElementById('playerScoreBox'), 'rotateOut');
		UI.animate(document.getElementById('livesLeftBox'), 'rotateOut');

		setTimeout(() => {
			document.getElementById('backToStartMenu').addEventListener('click', () => {
				// get new cards for, for next game
				this.randomAndUniqueCards();
				this.gameOver = false;
				// document.getElementById('gameboard').style.width = '800px';
				// document.getElementById('gameboard').style.height = '524px';
				document.getElementById('gameboard').style.width = '900px';
				document.getElementById('gameboard').style.height = '644px';
				this.showGameMenu();
			});
		}, 1000)
	}

	removePairFromBoard(){
		UI.animate(this.firstCard, 'noAnimation');
		UI.animate(this.secondCard, 'noAnimation');
		this.randomSound();
	}

	unflipCards(){
		this.lockBoard = true;
		setTimeout(() => {
			this.firstCard.classList.remove('flip');
			this.secondCard.classList.remove('flip');

			this.takeANewGuess();
		}, 1000);
	}

	takeANewGuess(){
		// ES6 destructering to reset variables for a new guess
		[this.hasFlippedCard, this.lockBoard] = [false, false];
		[this.firstCard, this.secondCard] = [null, null];
	}

	onGameResetBoard(){
		setTimeout(() => {
			document.getElementById('resetGameButton').addEventListener('click', this.startNewGame.bind(this));
		}, 2000);
	}

	setGameCards(){
		this.cards = [];
		this.frontFaceIcons.forEach((icon, index) => {
			this.cards.push(new Card(icon, index));
		});
	}

	getGameCards(){
		let cardInterface = '';
		this.cards.forEach(card => {
			cardInterface += UI.cardTemplate(card);
		});
		return cardInterface;
		
	}

	getIconsFromFolder(){
		return new Promise((resolve, recject) => {
			// let xhr = new XMLHttpRequest();
			// xhr.open("GET", "img/cards", true);
			// xhr.responseType = 'document';
			// xhr.onload = () => {
			//   if (xhr.status === 200) {
			//     let elements = xhr.response.getElementsByTagName("a");
			//     let images = [];
			//     for (let x of elements) {
			//       if ( x.href.match(/\.(jpe?g|png|gif)$/) ) { 
			//       	let fileName = x.href.split('#').shift().split('?').shift().split('/').pop();
			//     	console.log(fileName);
			//           // let img = document.createElement("img");
			//           // img.src = x.href;
			//           // document.body.appendChild(img);
			//           images.push(fileName);
			//       } 
			//     };

			// 	resolve(images);
			//   } 
			//   else {
			//     // alert('Request failed. Returned status of ' + xhr.status);
			//     recject();
			//   }
			// }
			// xhr.send()
			let images = [
				"Bottle_of_Enchanting.gif",
				"Diamond_Sword.png",
				"Iron_Sword.png",
				"Music_Disc_13.png",
				"Nether_Wart_Age_0.png",
				"Painting.png",
				"Ruby_Block.png",
				"apple.png",
				"beetroot.png",
				"berries.png",
				"boat.png",
				"bone.png",
				"book.png",
				"bookshelf.png",
				"bow.png",
				"bread.png",
				"brick.png",
				"cake_JE2.png",
				"cat.png",
				"chicken.png",
				"chicken_baby.png",
				"clay.png",
				"coalOre.png",
				"cookedchicken.png",
				"cookedsalmon.png",
				"cookie.png",
				"craftingTable.png",
				"diamond.png",
				"diamondOre.png",
				"diamond_horse_armor.png",
				"earthruby.png",
				"egg.png",
				"emerald.png",
				"emeraldOre.png",
				"furnace.gif",
				"glass.png",
				"glass_bottle.png",
				"goldOre.png",
				"golden_Sword.png",
				"gondingot.png",
				"ironOre.png",
				"ironingot.png",
				"lapis.png",
				"lapisOre.png",
				"lava.png",
				"melon.png",
				"melonslice.png",
				"milk.png",
				"minecart.png",
				"pumpkin.png",
				"randomblocksadntools.png",
				"redstone.png",
				"redstoneOre.png",
				"redstoneandpickaxe.png",
				"saddle.png",
				"shears.png",
				"slimeball.png",
				"steak.png",
				"sugar.png",
				"tnt.png",
				"totem_of_undying.png",
				"turtle.png",
				"wheat.png",
				"bat.gif",
				"bee.gif",
				"spider.png",
				"wolf.png",
				"ghast.png",
				"chest.png",
				"slime.png",
				"magmacube.png",
				"dragon.gif",
				"wither.png",
				"piglin.png",
				"brewing_Stand.png",
				"glowstonedust.png",
				"bell.png",
				"campfire.png",
				"Pufferfish_large.gif",
				"bed.png",
				"Enchanting_Table.gif",
				"dirt.png",
				"anvil.png",
				"compass.gif",
				"map.png",
				"enderpearl.png",
				"eye_of_ender.png",
				"blaze_powder.png",
				"coal.png",
				"oaklog.png",
				"birchlogaxis.png",
				"silverfish.gif",
				"skeletonskull.png",
				"zombiehead.png",
				"playerhead.png",
				"creeperhead.png",
				"witherskeletonskull.png",
				"dragonhead.png",
				"spiderspawner.png",
				"ladder.png",
				"torch.png",
				"endportalframe.png",
				"soulsand.png",
				"hanginglantern.gif",
				"stonebricks.png",
				"chiseledstonebricks.png",
				"oakplank.png",
				"mossycobblestone.png",
				"door.png",
				"irondoor.png",
				"redflower.png",
				"allium.png",
				"brownmushroom.png",
				"redmushroom.png",
				"lilypad.png",
				"sugarcane.png",
				"ravager.png",
				"goldenapple.gif",
				"enchantedbook.gif",
				"packedice.png",
				"clock.gif",
				"phantom.gif",
				"cookedmutton.png",
				"cookedrabbit.png",
				"honey.png",
				"pumpkinpie.png"

			];
			resolve(images);
		});
	}

	randomAndUniqueCards(){
		this.getIconsFromFolder()
		.then((images => {
			this.frontFaceIcons = [];
			while(this.frontFaceIcons.length < 20){
			    let random = Math.floor(Math.random() * images.length);
			    if(this.frontFaceIcons.indexOf(images[random]) === -1){
			    	let image = images[random];
			    	this.frontFaceIcons.push(image); 
			    	this.frontFaceIcons.push(image);
			    } 
			}
			this.setGameCards();
		}));
	}

	static shuffle(){
		setTimeout(() => {
			let gameCards = document.querySelectorAll(".memory-card");
			gameCards.forEach(card => {
				let randomPos = Math.floor(Math.random() * 20);
				card.style.order = randomPos;
			});
		}, 700)
	}

	hasGameEnded(){
		return document.querySelectorAll(".flip").length === 20;
	}

	preventInspectTools(){
		//prevent shortcuts keys
		document.addEventListener('keydown', (event) => {
			event.preventDefault();
			if (event.keyCode == 123) { // Prevent F12
				return;
			}else if (event.ctrlKey && event.shiftKey && event.keyCode == 73) { // Prevent Ctrl+Shift+I       
		        return;
		    } else if (event.ctrlKey && event.shiftKey && event.keyCode == 'I'.charCodeAt(0)){
		    	return;
		    }else if (event.ctrlKey && event.shiftKey && event.keyCode == 'J'.charCodeAt(0)){
		    	return;
		    }else if (event.ctrlKey && event.keyCode == 'U'.charCodeAt(0)){
		    	return;
		    }
		});
		// prevent right click
		document.addEventListener('contextmenu', function(event) {
		  event.preventDefault();
		});
	}

	onRulesHover(){
		document.getElementById("easyMode").addEventListener('mouseover', () => {
			document.getElementById('rules').innerHTML = UI.rules("easy");
		});

		document.getElementById("hardcoreMode").addEventListener('mouseover', () => {
			document.getElementById('rules').innerHTML = UI.rules("hardcore");
		});

		document.getElementById("resetHighscore").addEventListener('mouseover', () => {
			document.getElementById('rules').innerHTML = UI.rules("resetHighscore");
		});

		document.getElementById("easyMode").addEventListener('mouseout', () => {
			document.getElementById('rules').innerHTML = UI.rules("info");
		});

		document.getElementById("hardcoreMode").addEventListener('mouseout', () => {
			document.getElementById('rules').innerHTML = UI.rules("info");
		});

		document.getElementById("resetHighscore").addEventListener('mouseout', () => {
			document.getElementById('rules').innerHTML = UI.rules("info");
		});
	}

	debugStatus(){
		console.log("----------------------------------");
		console.log("CURRENT VARIABLE STATUS");
		console.log("gameBoardElement", this.gameBoardElement);
		console.log("firstCard", this.firstCard);
		console.log("secondCard", this.secondCard);
		console.log("hasFlippedCard", this.hasFlippedCard);
		console.log("lockBoard", this.lockBoard);
		console.log("gameOver", this.gameOver);
		console.log("gameMode", this.gameMode);
		console.log("player", this.player);
		console.log("cards", this.cards)
		console.log("frontFaceIcons", this.frontFaceIcons);
		console.log("----------------------------------");
	}

}