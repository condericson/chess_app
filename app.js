$(document).ready(function () {
	console.log("Document ready...");


	var boardState = {
		areIndicatorsVisible: false,
		selectedPieceCell: "zz",
		selectedColor: "white",
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



	function modifyState(stateValue, value) {
		boardState.stateValue = value;
		if (boardState.areIndicatorsVisible == false) {
			$('.cell').removeClass("indicating");
			$('.cell').removeClass("attackable");
		}
	}

	function init() {
		setBoard(boardState.selectedColor);
		// setBoardDev(boardState.selectedColor, pieces.whiteKnight);
		addDroppability();
		determineIndicatorVisibility();

	}

	function setBoardDev(startingColor, piece) {
		var key = Object.keys(pieces).find(key => pieces[key] === piece);
		$(`#f5`).append(`<div class="piece playable noselect" data-piece="${key}">${piece}</div>`);
		$(`#f6`).append(`<div class="piece playable noselect" data-piece="whitePawn">${pieces.whitePawn}</div>`);
		for (let i = 0; i < 9; i++) {
			$(`#b${i}`).append(`<div class="piece opponent noselect" data-piece="blackPawn">${pieces.blackPawn}</div>`);
		}
	}

	function setBoard(startingColor) {
		let orderPlayer = [pieces.whiteRook, pieces.whiteKnight, pieces.whiteBishop, pieces.whiteQueen, pieces.whiteKing, pieces.whiteBishop, pieces.whiteKnight, pieces.whiteRook, pieces.whitePawn, pieces.whitePawn, pieces.whitePawn, pieces.whitePawn, pieces.whitePawn, pieces.whitePawn, pieces.whitePawn, pieces.whitePawn];
		let orderOpponent = [pieces.blackRook, pieces.blackKnight, pieces.blackBishop, pieces.blackQueen, pieces.blackKing, pieces.blackBishop, pieces.blackKnight, pieces.blackRook, pieces.blackPawn, pieces.blackPawn, pieces.blackPawn, pieces.blackPawn, pieces.blackPawn, pieces.blackPawn, pieces.blackPawn, pieces.blackPawn];
		function pieceHtml(piece, playersColor, who) {
			var key = Object.keys(pieces).find(key => pieces[key] === piece);
			let html;
			if ((playersColor == "white" && who == "highrow") || (playersColor == "black" && who == "lowrow")) {
				html = `<div class="piece opponent noselect" data-piece="${key}">${piece}</div>`;
			}
			if ((playersColor == "white" && who == "lowrow") || (playersColor == "black" && who == "highrow")) {
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
			$(`#${cell}`).append(pieceHtml(piece, boardState.selectedColor, "highrow"));
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
			$(`#${cell}`).append(pieceHtml(piece, boardState.selectedColor, "lowrow"));
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
	}

	function changeAxes() {
		var letterAxisLabels = $('.letterAxis').children();
		var numberAxisLabels = $('.numberAxis').children();
		let xAxis = ['H', 'G', 'F', 'E', 'D', 'C', 'B', 'A'];
		let yAxis = [1, 2, 3, 4, 5, 6, 7, 8];
		for (let j = 0; j < letterAxisLabels.length; j++) {
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
				console.log('droppedOn:');
				console.log(droppedOn);
				$(droppedOn).droppable("disable");
				$(dropped).parent().droppable("enable");
				$(droppedOn).empty();
				$(dropped).detach().css({ top: 0, left: 0 }).appendTo(droppedOn);
				removeIndicator();
			}
		});
		$('td').not('td:empty').droppable("disable");
	}

	function determineIndicatorVisibility() {
		$(window).hover(function () {
			modifyState("areIndicatorsVisible", false);
		});
		$(".playable").mouseup(function () {
			modifyState("areIndicatorsVisible", false);
		});
		$(".playable").on('mouseover || mousedown', function (e) {
			e.stopPropagation();
			let pieceColor = $(this).attr('data-piece').slice(0, 5);
			if (boardState.selectedColor != pieceColor) {
				console.log("broke");
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
		cells.moves.forEach(function (cell) {
			if ($(`#${cell}`).is(':empty')) {
				$(`#${cell}`).addClass('indicating');
			}
		});
		cells.attackOptions.forEach(function (cell) {
			if ($(`#${cell}`).children().hasClass('opponent')) {
				$(`#${cell}`).addClass('attackable');
			}

		});
		$('td').droppable("disable");
		$('.indicating').droppable("enable");
		$('.attackable').droppable("enable");
	}


	function determineIndicatorCells(pieceName, cell) {
		let cellArray = {
			moves: [],
			attackOptions: [],
		};
		console.log(pieceName + " in " + cell);

		//Piece movement rules
		switch (pieceName) {
			case "whitePawn": {
				cellArray.moves.push(targetHorizontalCell(cell, "up"));
				let splitCell = cell.split('');
				splitCell[1] = parseInt(splitCell[1]);
				if (splitCell[1] == 2) {
					cellArray.moves.push(targetHorizontalCell(cellArray.moves[0], "up"));
				}
				cellArray.attackOptions = [targetDiagonalCell(cell, 1), targetDiagonalCell(cell, 2)];
				break;
			}
			case "whiteRook": {
				let directions = ["up", "down", "left", "right"];
				for (let i = 0; i < directions.length; i++) {
					let continuing = "yes";
					let targetedCell = targetHorizontalCell(cell, directions[i]);
					while (continuing == "yes") {
						if (!$(`#${targetedCell}`).is(':empty')) {
							continuing = "no";
						}
						if ($(`#${targetedCell}`).children().hasClass('opponent')) {
							cellArray.attackOptions.push(targetedCell)
						}
						else {
							cellArray.moves.push(targetedCell);
							targetedCell = targetHorizontalCell(targetedCell, directions[i]);
						}
					}
				}
				break;
			}
			case "whiteBishop": {
				let quadrants = [1, 2, 3, 4];
				for (let i = 0; i < quadrants.length; i++) {
					let continuing = "yes";
					let targetedCell = targetDiagonalCell(cell, quadrants[i]);
					while (continuing == "yes") {
						if (!$(`#${targetedCell}`).is(':empty')) {
							continuing = "no";
						}
						if ($(`#${targetedCell}`).children().hasClass('opponent')) {
							cellArray.attackOptions.push(targetedCell)
						}
						else {
							cellArray.moves.push(targetedCell);
							targetedCell = targetDiagonalCell(targetedCell, quadrants[i]);
						}
					}
				}
				break;
			}
			case "whiteQueen": {
				let directions = ["up", "down", "left", "right"];
				for (let i = 0; i < directions.length; i++) {
					let continuing = "yes";
					let targetedCell = targetHorizontalCell(cell, directions[i]);
					while (continuing == "yes") {
						if (!$(`#${targetedCell}`).is(':empty')) {
							continuing = "no";
						}
						if ($(`#${targetedCell}`).children().hasClass('opponent')) {
							cellArray.attackOptions.push(targetedCell)
						}
						else {
							cellArray.moves.push(targetedCell);
							targetedCell = targetHorizontalCell(targetedCell, directions[i]);
						}
					}
				}
				let quadrants = [1, 2, 3, 4];
				for (let i = 0; i < quadrants.length; i++) {
					let continuing = "yes";
					let targetedCell = targetDiagonalCell(cell, quadrants[i]);
					while (continuing == "yes") {
						if (!$(`#${targetedCell}`).is(':empty')) {
							continuing = "no";
						}
						if ($(`#${targetedCell}`).children().hasClass('opponent')) {
							cellArray.attackOptions.push(targetedCell)
						}
						else {
							cellArray.moves.push(targetedCell);
							targetedCell = targetDiagonalCell(targetedCell, quadrants[i]);
						}
					}
				}
				break;
			}
			case "whiteKing": {
				let directions = ["up", "down", "left", "right"];
				for (let i = 0; i < directions.length; i++) {
					let targetedCell = targetHorizontalCell(cell, directions[i]);
					if (!$(`#${targetedCell}`).is(':empty')) {
						continuing = "no";
					}
					if ($(`#${targetedCell}`).children().hasClass('opponent')) {
						cellArray.attackOptions.push(targetedCell)
					}
					else {
						cellArray.moves.push(targetedCell);
						targetedCell = targetHorizontalCell(targetedCell, directions[i]);
					}
				}
				let quadrants = [1, 2, 3, 4];
				for (let i = 0; i < quadrants.length; i++) {
					let targetedCell = targetDiagonalCell(cell, quadrants[i]);
					if (!$(`#${targetedCell}`).is(':empty')) {
						continuing = "no";
					}
					if ($(`#${targetedCell}`).children().hasClass('opponent')) {
						cellArray.attackOptions.push(targetedCell)
					}
					else {
						cellArray.moves.push(targetedCell);
						targetedCell = targetDiagonalCell(targetedCell, quadrants[i]);
					}
				}
				
				break;
			}
			case "whiteKnight": {
				let targetedCells = targetKnightCells(cell);
				for (let i = 0; i < targetedCells.length; i++) {
					let workingCell = targetedCells[i];
					if ($(`#${workingCell}`).is(':empty')) {
						cellArray.moves.push(workingCell);
					}
					else if ($(`#${workingCell}`).children().hasClass('opponent')) {
						cellArray.attackOptions.push(workingCell)
					}
				}
				break;
			}
			case "blackPawn": {
				cellArray.moves.push(splitCell[0] + (splitCell[1] - 1));
				if (splitCell[1] == 7) {
					cellArray.moves.push(splitCell[0] + (splitCell[1] - 2));
				}
				break;
			}


		}
		return cellArray;
	}

	//Cell targetting
	function targetDiagonalCell(cell, quadrant) {

		let splitCell = cell.split('');
		let letter = splitCell[0];
		let number = parseInt(splitCell[1]);

		let directionalArray = [];
		switch (quadrant) {
			case 1:
				directionalArray = [1, 1];
				break;
			case 2:
				directionalArray = [-1, 1];
				break;
			case 3:
				directionalArray = [-1, -1];
				break;
			case 4:
				directionalArray = [1, -1];
				break;
		}
		letter = iterateLetter(letter, directionalArray[0]);
		let returnedCell = letter + (number + directionalArray[1]);
		return returnedCell;
	}

	function targetHorizontalCell(cell, direction) {
		let splitCell = cell.split('');
		let letter = splitCell[0];
		let number = parseInt(splitCell[1]);

		let directionalArray = [];
		switch (direction) {
			case "up":
				directionalArray = [0, 1];
				break;
			case "down":
				directionalArray = [0, -1];
				break;
			case "left":
				directionalArray = [-1, 0];
				break;
			case "right":
				directionalArray = [1, 0];
				break;
		}
		let returnedCell = iterateLetter(letter, directionalArray[0]) + (number + directionalArray[1]);
		return returnedCell;
	}

	function targetKnightCells(cell) {
		let splitCell = cell.split('');
		let letter = splitCell[0];
		let number = parseInt(splitCell[1]);
		let returnedCells = [];
		let directionalArray = [[2, 1], [2, -1], [-2, 1], [-2, -1], [1, 2], [-1, 2], [1, -2], [-1, -2]];
		directionalArray.forEach(function (coord) {
			returnedCells.push(iterateLetter(letter, coord[0]) + (number + coord[1]));
		});
		return returnedCells;
	}

	function iterateLetter(letter, iteration) {
		let response = String.fromCharCode(letter.charCodeAt() + iteration);
		if (response == "`" || response == "i") {
			return "x";
		}
		else {
			return response;
		}
	}


	init();
})