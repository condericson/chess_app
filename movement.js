function determineMovementOptions(pieceName, cell) {
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