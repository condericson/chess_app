$(document).ready(function () {
	console.log("Document ready...");

	var boardState = {
		areIndicatorsVisible: false,
	}

	var selectedColor = "white";

	function init() {
		setBoard(selectedColor);
		addDroppability();
		determineIndicatorVisibility();
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

	function setBoard(startingColor) {
		let order = [];
		function pieceHtml(piece) { return `<div class="piece">${piece}</div>`; }
		if (startingColor == "white") {
			order = [pieces.blackRook, pieces.blackKnight, pieces.blackBishop, pieces.blackQueen, pieces.blackKing, pieces.blackBishop, pieces.blackKnight, pieces.blackRook, pieces.blackPawn, pieces.blackPawn, pieces.blackPawn, pieces.blackPawn, pieces.blackPawn, pieces.blackPawn, pieces.blackPawn, pieces.blackPawn];
			let rowNumber = 8;
			let columnLetter = "a";
			order.forEach(function (piece) {
				let cell = columnLetter + rowNumber;
				$(`#${cell}`).append(pieceHtml(piece));
				if (columnLetter == "h") {
					columnLetter = "a";
					rowNumber = 7;
				}
				else {
					columnLetter = String.fromCharCode(columnLetter.charCodeAt(0) + 1);
				}
			})
			order = [pieces.whiteRook, pieces.whiteKnight, pieces.whiteBishop, pieces.whiteQueen, pieces.whiteKing, pieces.whiteBishop, pieces.whiteKnight, pieces.whiteRook, pieces.whitePawn, pieces.whitePawn, pieces.whitePawn, pieces.whitePawn, pieces.whitePawn, pieces.whitePawn, pieces.whitePawn, pieces.whitePawn];
			rowNumber = 1;
			columnLetter = "a";
			order.forEach(function (piece) {
				let cell = columnLetter + rowNumber;
				$(`#${cell}`).append(pieceHtml(piece));
				if (columnLetter == "h") {
					columnLetter = "a";
					rowNumber = 2;
				}
				else {
					columnLetter = String.fromCharCode(columnLetter.charCodeAt(0) + 1);
				}
			})
		}
	}

	function addDroppability() {
		$('.piece').draggable({ containment: "table", revert: 'invalid' });
		$('td').droppable({
			drop: function (ev, ui) {
				var dropped = ui.draggable;
				var droppedOn = $(this);
				$(droppedOn).droppable("disable");
				$(dropped).parent().droppable("enable");
				$(dropped).detach().css({ top: 0, left: 0 }).appendTo(droppedOn);
			}
		});

		$('td').not('td:empty').droppable("disable");
	}



	function determineIndicatorVisibility() {
		if (boardState.areIndicatorsVisible == false) {
			$('.cell').removeClass("indicating");
		}
		$(window).mousedown(function() {
			$('.cell').removeClass("indicating");
			boardState.areIndicatorsVisible = false;
		});
		$(".piece").mousedown(function () {
			addMovementIndicators(this);
		})

		// let visible = false;
		// $(".piece").mousedown(function () {
		// 	visible = true;
		// })
		// 	.mousemove(function () {
		// 		visible = true;
		// 	})
		// 	.mouseup(function () {
		// 		var wasDragging = isDragging;
		// 		visible = false;
		// 		if (!wasDragging) {
		// 			$("#throbble").toggle();
		// 		}
		// 	});
	}



	// This class will take in the element's cells to gain the indicating class and add that class while mutating state.
	function addMovementIndicators(element) {
		console.log(element);
		console.log($(element).text());
		boardState.areIndicatorsVisible = true;
		console.log(boardState);
		$('.cell').addClass('indicating');
		// if(typeOfPiece == pieces.whitePawn) {

		// }
	}

	//on mouse down, add indicator for specific piece based on piece(color and type)
	//on drag AND THEN mouse up, remove indicators if position has changed, else, 





	init();
})