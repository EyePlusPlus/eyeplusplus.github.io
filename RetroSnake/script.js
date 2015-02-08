var canvasH = Math.floor($('#canvas').height()); //Canvas Height
var canvasW = Math.floor($('#canvas').width()); //Canvas Width
var snake = new Array(5); //Snake Position Array
var snakeWidth = 10; //Snake body width
var snakeHeight = 10; //Snake body height
var initx = 0; //Initial Position
var inity = 10*(snake.length-1); //Intitial Position
var dx = 0; //Change X
var dy = 10; //Chane Y
var ctx; //Canvas Object
var speed = 200; // Refresh rate in milliseconds
var colors = ['#0CCD58','#0B6A26','#DFEFE2']; //Colors to use for snake body and food
var tempDir = [0,-1]; //Default direction: down
var food = newFood(); //Generate initial food
var startGame; //holds setInterval
var score = 0; 
function init(){
	ctx = $('#canvas')[0].getContext("2d");
	for(var i=0;i<snake.length;i++){
		snake[i] = [initx, inity];
		rect(initx, inity,snakeHeight,snakeWidth,(i%2));
		inity-=dy;
	}
	return setInterval(draw, speed);
}
function newFood(){
	var badFood = 1;
	while(badFood){
		foodPos = [Math.floor((Math.random() * canvasW)/10)*10, Math.floor((Math.random() * canvasH)/10)*10];
		if(snake.indexOf(foodPos) == -1){
			badFood = 0;
		}
	}
	return foodPos;
}
function rect(x, y, height, width, colorCode){
	ctx.fillStyle = colors[colorCode];
	ctx.beginPath();
	ctx.rect(x, y, height, width);
	ctx.closePath();
	ctx.fill();
}
function draw(){
	ctx.clearRect(0,0,canvasW,canvasH);
	for(var i=0;i<snake.length;i++){
		x = snake[i][0];
		y = snake[i][1];
		rect(x, y, snakeHeight, snakeWidth, (i%2));
	}
	checkCollision();
	snake.unshift([snake[0][0]+dx, snake[0][1]+dy]);
	if(snake[0][0] == food[0] && snake[0][1] == food[1]){
		clearInterval(startGame);
		speed -= 5;
		startGame = setInterval(draw, speed);
		score++;
		$('#score').text(score);
		food = newFood();
	}
	else{
		snake.pop();
	}
	rect(food[0],food[1],snakeHeight,snakeWidth,2);
}
function checkCollision(){
	headx = snake[0][0];
	heady = snake[0][1];
	var gameover = 0;
	for(i=1;i<snake.length;i++){
		if(headx == snake[i][0] && heady == snake[i][1]){
			gameover = 1;
			msg = "You ate yourself! ";
		}
	}
	if(headx<0 || headx>=canvasW || heady<0 || heady >=canvasH){
			gameover = 1;
			msg = "Banged head against wall! ";
	}
	if(gameover){
		clearInterval(startGame);
		alert(msg+"Game Over!");
	}
}
function changeDir(dir){
	tempDir = dir;
	if(dir=='pause'){
		if(startGame < 1){
			startGame = setInterval(draw, speed);
		}
		else{
			clearInterval(startGame);
			startGame = 0;
		}
	}
	else{
		dx = snakeWidth * dir[0];
		dy = snakeHeight * dir[1];
	}
}
startGame = init();
$(document).keydown(function(evt){
	// alert(evt.charCode);
	if(evt.keyCode == 37) dir=[-1,0]; //left
	if(evt.keyCode == 38) dir=[0,-1]; //down
	if(evt.keyCode == 39) dir=[1,0]; //right
	if(evt.keyCode == 40) dir=[0,1]; //up
	if(evt.keyCode == 32) dir='pause';
	if(((dir[0]!=tempDir[0]) && (dir[1]!=tempDir[1])) || dir == 'pause'){
		changeDir(dir); 
	}
});