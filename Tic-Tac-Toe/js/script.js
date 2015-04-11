curr = "X";
victory = [];
token = 'X';
gameOver = 0;
lastMove = 0;
winningPatterns = [
	[1,2,3],
	[4,5,6],
	[7,8,9],
	[1,4,7],
	[2,5,8],
	[3,6,9],
	[1,5,9],
	[3,5,7],
];

function getWinner(victory){
	if(victory[1]==victory[2] && victory[2]==victory[3] && victory[1] != undefined){
		return 1;
	}
	if(victory[4]==victory[5] && victory[5]==victory[6] && victory[4] != undefined){
		return 1;
	}
	if(victory[7]==victory[8] && victory[8]==victory[9] && victory[7] != undefined){
		return 1;
	}
	if(victory[1]==victory[4] && victory[4]==victory[7] && victory[1] != undefined){
		return 1;
	}
	if(victory[2]==victory[5] && victory[5]==victory[8] && victory[2] != undefined){
		return 1;
	}
	if(victory[3]==victory[6] && victory[6]==victory[9] && victory[3] != undefined){
		return 1;
	}
	if(victory[1]==victory[5] && victory[5]==victory[9] && victory[1] != undefined){
		return 1;
	}
	if(victory[3]==victory[5] && victory[5]==victory[7] && victory[3] != undefined){
		return 1;
	}
	for(i=1;i<=9;i++){
		if(victory[i] == undefined)
			return 0;
	}
	return 2;
}
function getLetter(curr){
	if(curr == 'X')
		return "O";
	else
		return "X";
}
function makeMove(idx){
	if(!gameOver){
		$('.block.d'+idx).find("p").html(curr);
		victory[idx] = curr;
		var result = getWinner(victory);
		if(result != 0){
			gameOver = 1;
			if(result == 2){
				$('.step3 h1').html("Its a tie!");
			}
			else if(token == curr)
				$('.step3 h1').html("You Win!");
			else
				$('.step3 h1').html("You Lose!");

			$('.overlay').removeClass("hide");
			$('.step3').removeClass("hide");
		}
		lastMove = idx;
		curr = getLetter(curr);
	}
}
function WinoBlockus(curr){
	goodMoves = [];
	for(i=0;i<winningPatterns.length;i++){
		var j = 3, x = 0, y = 1, z = 2, temp;
		while(j > 0){
			if(victory[winningPatterns[i][x]] == victory[winningPatterns[i][y]] && victory[winningPatterns[i][x]] == curr && victory[winningPatterns[i][z]] == undefined ){
				goodMoves.push(winningPatterns[i][z]);
			}
			temp = x; x = y; y = z; z = temp; 
			j--;
		}
	}
	return goodMoves;
}
function ForkBlockium(curr){
	for(i=1;i<=9;i++){
		forkLines = [];
		if(victory[i] == undefined){
			for(j=0;j<winningPatterns.length;j++){
				if(winningPatterns[j].indexOf(i) > 0){
					forkLines.push(j);
				}
			}
			goodMoves = [];
			for(k=0;k<forkLines.length;k++){
				var j = 3, x = 0, y = 1, z = 2, temp;
				while(j > 0){
					if(victory[winningPatterns[k][x]] == curr && victory[winningPatterns[k][y]] == undefined && victory[winningPatterns[k][z]] == undefined){
						goodMoves.push(i);
					}
					temp = x; x = y; y = z; z = temp; 
					j--;
				}
			}
			if(goodMoves.length > 1){
				return i;
			}
		}
	}
}
function Centeridini(){
	if(victory[5] == undefined){
		return 5;
	}
}
function Opposeto(lastMove){
	lastMove = parseInt(lastMove);
	myMove = lastMove + (9 - lastMove) - (lastMove - 1);
	if(victory[myMove] == undefined)
		return myMove;

}
function Corneresto(){
	corners = [1,3,7,9];
	for(i=0;i<corners.length;i++){
		if(victory[corners[i]] == undefined)
			return corners[i];
	}
}
function Sidesta(){
	sides = [2,4,6,8];
	for(i=0;i<sides.length;i++){
		if(victory[i] == undefined)
			return i;
	}
}
function robotDecision(){
	rand = WinoBlockus(curr)[0];
	if(rand == undefined){
		rand = WinoBlockus(getLetter(curr))[0];
		if(rand == undefined){
			rand = ForkBlockium(curr);
			if(rand == undefined){
				rand = ForkBlockium(getLetter(curr));
				if(rand == undefined){
					rand = Centeridini();
					if(rand == undefined || rand > 9){
						rand = Opposeto(lastMove);
							if(rand == undefined){
							rand = Corneresto();
							if(rand == undefined){
								rand = Sidesta();
							}
						}
					}
				}
			}
		}
	}
	makeMove(rand);
}

$('div.block').click(function(){
	idx = $(this).attr("id");
	if(victory[idx] != undefined ){
		return false;
	}
	makeMove(idx);
	robotDecision();

});
$('.token').click(function(){
	token = $(this).attr("id");
	if(token == 'O'){
		robotDecision();
	}
	$('.step1').addClass("hide");
	$('.step2').removeClass('hide');
});