$(document).ready(function () {
	console.log("Document ready...");


	var boardState = {
		areIndicatorsVisible: false,
		selectedPieceCell: "zz",
	}

	var pieces = {
		whiteKing: "&#9812;",
		whiteQueen: "&#9813;",
		whiteRook: "&#9814;",
		whiteBishop: "&#9815;",
		whiteKnight: "&#9816;",
		whitePawn: "&#9817;",
		blackKing: "&#9818;",
		blackQueen: "&#9819;",
		blackRook: "&#9820;",
		blackBishop: "&#9821;",
		blackKnight: "&#9822;",
		blackPawn: "&#9823;",
	}

	var selectedColor = "black";

	function modifyState(stateValue, value) {
		boardState.stateValue = value;
		// console.log(`modifying state: ${stateValue} = ${value}`);
		if (boardState.areIndicatorsVisible == false) {
			$('.cell').removeClass("indicating");
		}
	}

	function init() {
		setBoard(selectedColor);
		addDroppability();
		determineIndicatorVisibility();

	}

	function setBoard(startingColor) {
		let orderPlayer = [pieces.whiteRook, pieces.whiteKnight, pieces.whiteBishop, pieces.whiteQueen, pieces.whiteKing, pieces.whiteBishop, pieces.whiteKnight, pieces.whiteRook, pieces.whitePawn, pieces.whitePawn, pieces.whitePawn, pieces.whitePawn, pieces.whitePawn, pieces.whitePawn, pieces.whitePawn, pieces.whitePawn];
		let orderOpponent = [pieces.blackRook, pieces.blackKnight, pieces.blackBishop, pieces.blackQueen, pieces.blackKing, pieces.blackBishop, pieces.blackKnight, pieces.blackRook, pieces.blackPawn, pieces.blackPawn, pieces.blackPawn, pieces.blackPawn, pieces.blackPawn, pieces.blackPawn, pieces.blackPawn, pieces.blackPawn];
		function pieceHtml(piece, who) {
			var key = Object.keys(pieces).find(key => pieces[key] === piece);
			let html;
			if(who == "opponent") {
				html = `<div class="piece opponent noselect" data-piece="${key}">${piece}</div>`;
			}
			if(who == "player") {
				html = `<div class="piece playable noselect" data-piece="${key}">${piece}</div>`;
			}
			return html;
		}
		if (startingColor == "black") {
			setCellIdsForBlack();
			changeAxes();
		}
		let rowNumber = 8;
		let columnLetter = "a";
		orderOpponent.forEach(function (piece) {
			let cell = columnLetter + rowNumber;
			$(`#${cell}`).append(pieceHtml(piece, "opponent"));
			if (columnLetter == "h") {
				columnLetter = "a";
				rowNumber = 7;
			}
			else {
				columnLetter = String.fromCharCode(columnLetter.charCodeAt(0) + 1);
			}
		})
		rowNumber = 1;
		columnLetter = "a";
		orderPlayer.forEach(function (piece) {
			let cell = columnLetter + rowNumber;
			$(`#${cell}`).append(pieceHtml(piece, "player"));
			if (columnLetter == "h") {
				columnLetter = "a";
				rowNumber = 2;
			}
			else {
				columnLetter = String.fromCharCode(columnLetter.charCodeAt(0) + 1);
			}
		})
	}

	function setCellIdsForBlack() {
		var allCells = [];
		$('tbody').children().each(function (rowPlacement) {
			$(this).children().each(function (cell) {
				allCells.push($(this));
			});
		});
		console.log("allCells:");
		console.log(allCells);
		var currentLetter = "h";
		var currentNumber = 1;
		for (let i = 0; i < allCells.length; i++) {
			$(allCells[i]).attr("id", currentLetter + currentNumber);
			if (currentLetter == 'a') {
				currentLetter = "i";
				currentNumber++;
			}
			currentLetter = String.fromCharCode(currentLetter.charCodeAt(0) - 1);
		}
		console.log("CurrentNumber iterated to: " + currentNumber);
	}

	function changeAxes() {
		var letterAxisLabels = $('.letterAxis').children();
		var numberAxisLabels = $('.numberAxis').children();
		let xAxis = ['H', 'G', 'F', 'E', 'D', 'C', 'B', 'A'];
		let yAxis = [1, 2, 3, 4, 5, 6, 7, 8];
		for(let j = 0; j < letterAxisLabels.length; j++) {
			$(letterAxisLabels[j]).text(xAxis[j]);
			$(numberAxisLabels[j]).text(yAxis[j]);
		}
	}

	function addDroppability() {
		$('.playable').draggable({ containment: "table", revert: 'invalid' });
		$('td').droppable({
			drop: function (ev, ui) {
				var originalCell = $(ui.draggable).parent();
				var dropped = ui.draggable;
				var droppedOn = $(this);
				$(droppedOn).droppable("disable");
				$(dropped).parent().droppable("enable");
				$(dropped).detach().css({ top: 0, left: 0 }).appendTo(droppedOn);
				removeIndicator();
			}
		});
		$('td').not('td:empty').droppable("disable");
	}

	function determineIndicatorVisibility() {
		$(window).mousedown(function () {
			modifyState("areIndicatorsVisible", false);
		});
		$(".playable").mousedown(function (e) {
			e.stopPropagation();
			let pieceColor = $(this).attr('data-piece').slice(0, 5);
			console.log(pieceColor);
			if (selectedColor != pieceColor) {
				console.log("breaking");
				return;
			}
			let currentCell = $(this).parent().attr("id");
			modifyState("selectedPieceCell", currentCell);
			addMovementIndicators(this);
		});
	}

	function removeIndicator() {
		modifyState("areIndicatorsVisible", false);
	}


	function addMovementIndicators(element) {
		modifyState("areIndicatorsVisible", true);
		let cells = determineIndicatorCells($(element).attr('data-piece'), $(element).parent().attr('id'));
		console.log("cells:");
		console.log(cells);
		cells.moves.forEach(function (cell) {
			$(`#${cell}`).addClass('indicating');
		});
		cells.attackOptions.forEach(function (cell) {
			$(`#${cell}`).addClass('attackable');
		});
		$('td').droppable("enable");
		$('td').not('.indicating').droppable("disable");
	}


	function determineIndicatorCells(pieceName, cell) {
		let cellArray = {
			moves: [],
			attackOptions: [],
		};
		console.log(pieceName + " in " + cell);
		let splitCell = cell.split('');
		splitCell[1] = parseInt(splitCell[1]);
		if (pieceName == "whitePawn") {
			cellArray.moves.push(splitCell[0] + (splitCell[1] + 1));
			if (splitCell[1] == 2) {
				cellArray.moves.push(splitCell[0] + (splitCell[1] + 2));
			}
		}
		console.log('cellArray:');
		console.log(cellArray);
		return cellArray;
	}


	init();
})