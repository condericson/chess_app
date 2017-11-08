	// function addCellNames() {
	// 	var table = $('#gameBoard').children();
	// 	var tableRows = $(table[0]).children();
	// 	console.log("tableRows:");
	// 	console.log(tableRows);
	// 	var currentLetter = "a";
	// 	var currentNumber = 8;
	// 	for(let i = 0; i < tableRows.length; i++) {
	// 		var cells = $(tableRows[i]).children();
	// 		console.log("cells: ");
	// 		console.log(cells);
	// 		currentLetter = "a";
	// 		for(let j = 0; j < cells.length; j++) {
	// 			$(cells[j]).attr("id", currentLetter + currentNumber);	
	// 			currentLetter = String.fromCharCode(currentLetter.charCodeAt(0) + 1);
	// 		}
	// 		currentNumber--;
	// 		console.log("CurrentNumber iterated to: " + currentNumber);
	// 	}
	// }

	// addCellNames();