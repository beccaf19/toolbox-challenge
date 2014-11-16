
var matches = 0;
var misses = 0;
var matchesLeft = 8;
var tileClicked; //points to last tile clicked
var imgClicked;
var timer;

//shows other side of tileImg, no matter which side is up
function flipTile(img, tile) {
	if (tile.flipped) {
		img.attr('src' , 'img/tile-back.png');
	} else {
		img.attr('src', tile.src);	
	}
	tile.flipped = !tile.flipped;
	img.fadeIn(1000);
}; 

function makeBoard() {	
	//prepare game times
	//array to load game tiles
	var tiles = [];
	var idx;
	for (idx = 1; idx <= 32; idx++) {
		tiles.push({
			tileNum: idx,
			src: 'img/tile' + idx + '.jpg',
			match: null
		}); 
	}

	//returns new set of tiles now shuffled
	var shuffledTiles = _.shuffle(tiles);

	//get 8 of the shuffled tiles
	var selectedTiles = shuffledTiles.slice(0,8);

	//match them to make pairs
	var tilePairs = [];
	_.forEach(selectedTiles, function(tile)  {
		tilePairs.push(_.clone(tile));
		tilePairs.push(_.clone(tile));
	});

	//shuffle pairs
	tilePairs = _.shuffle(tilePairs);

	//display game baord
	var gameBoard = $('#game-board');
	var row = $(document.createElement('row'));
	var img;
	_.forEach(tilePairs, function(tile, elemIndex){
		if (elemIndex > 0 && 0 == elemIndex % 4) {
			gameBoard.append(row);
			row = $(document.createElement('row'));
		}

		img = $(document.createElement('img'));
		img.attr({
			src: 'img/tile-back.png', 
			alt: 'image of tile' + tile.tileNum 
		});
		img.data('tile', tile);
		row.append(img);

	});
	gameBoard.append(row);
	$('#matches').text('Matches: ' + matches);
	$('#matchesLeft').text('Matches left: ' + matchesLeft);
	$('#misses').text('Misses: ' + misses);
}

//on click, start new game
function initGame() {
	var img = $(this);
	var tile = img.data('tile'); // current clicked tile 

	//check to make sure tile clicked is a new tile
	if (tile.matched != true && tile.flipped != true) {
		flipTile(img, tile);
			
	//check against last tile clicked
	//if there was a last tile and if they match
		if (tileClicked != null && tile.src == tileClicked.src) {
			//mark as matched
			tileClicked.match = true;
			tile.match = true;
			matches++;
			matchesLeft--;
			$('#matches').text('Matches: ' + matches);
			$('#matchesLeft').text('Matches left: ' + matchesLeft);
			if (matchesLeft == 0) {
				var c = window.confirm('You Win! Do you want to play again?');
				
				if (c == true) {
					newGame();
				} 
			} else {
			//reset turn, leave both tiles face up
				tileClicked = null;
				imgClicked = null;
			}
		}

		//if there was a last tile and they dont match = reset turn
		else if (tileClicked != null && tile != tileClicked) {
			misses++;
			$('#misses').text('Misses: ' + misses);
			//flip both tiles back over after 1 sec
			setTimeout(function() {
				flipTile(imgClicked, tileClicked);
				flipTile(img, tile);
				
				//reset turn
				tileClicked = null;
				imgClicked = null;
			}, 1000);
		}

		//no last tile, first tile clicked in turn
		else {
			imgClicked = img;
			tileClicked = tile;
		}
	} else {
		window.alert("Please pick a tile that hasn't been flipped");
	}	
}

function newGame() {
	//empty board
	$('#game-board').empty();
	$('#elapsed-seconds').empty();
	$('#game-stat').show();
	$('#instructions').hide();

	//clear game state variables
	matches = 0;
	misses = 0;
	matchesLeft = 8;
	tileClicked = null;
	imgClicked = null;
	window.clearInterval(timer); 


	//start new timer
	var startTime = _.now();
	timer = window.setInterval(function() {
		var elapsedSeconds = Math.floor((_.now() - startTime) / 1000);
		$('#elapsed-seconds').text('Timer: ' + elapsedSeconds);
		if (matchesLeft == 0) {
			window.clearInterval(timer);
		}
	}, 1000);

	//make new game board
	makeBoard();
	//play game on click of image
	$('#game-board img').click(initGame); 


}

$(document).ready(function(){
	//on click of new game button
	$('#game-stat').hide();
	$('#new-game').click(function(){
		newGame();
	});//jQuery new game click function

}); // jQuery ready function







