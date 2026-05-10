// Declare my variables

var canvas;
var context;
var timer;
var interval;

var player;
var platform0;
var ball;

// targets
var enemies = [];
var score = 0;

//ball stuff
var holdingBall = false;
var throwPower = 25;
// var ballCX = ball.x + ball.width / 2;
// var ballCY = ball.y + ball.height / 2;

var fX = .85;
var fY = .97;
var gravity = 1;


// Setup canvas
canvas = document.getElementById("canvas");
context = canvas.getContext("2d");

// Create player
player = new GameObject({x: canvas.width / 2, y: 700});

// Create platform
platform0 = new GameObject();
platform0.width = canvas.width;
platform0.x = platform0.width / 2;
platform0.y = canvas.height - platform0.height / 2;
platform0.color = "#a59200";

// Create ball
ball = new GameObject({ width: 64, height: 64, x: canvas.width / 2 + 100, y: 200, color: "#00ffff"});

ball.vx = 8;
ball.vy = -8;

// Create enemies
for(var i = 0; i < 3; i++)
{
	var enemy = new GameObject({ width: 64, height: 64, x: -i * 250, y: 150 + i * 120, color: "#2f00ff"});

	enemy.vx = Math.random() * 4 + 2;

	enemies.push(enemy);
}

// Start game loop
interval = 1000 / 60;
timer = setInterval(animate, interval);

function resetEnemy(enemy)
{
	enemy.x = -Math.random() * 300;
	enemy.y = Math.floor(Math.random() * (canvas.height - platform0.height - enemy.height));
	enemy.vx = Math.random() * 4 + 2;
}


function animate()
{
	context.clearRect(0, 0, canvas.width, canvas.height);

	// the score
	context.fillStyle = "#000000";
    context.font = "30px Arial";
    context.fillText("Score: "+ score, 400, 50);

	// Player controls
	if(w && player.canJump && player.vy == 0)
	{
		player.canJump = false;
		player.vy += player.jumpHeight;
	}

	if(a)
	{
		player.vx += -player.ax * player.force;
	}

	if(d)
	{
		player.vx += player.ax * player.force;
	}

	// Hold ball
	if(g)
	{
		holdingBall = true;
		ball.x = player.x , player.y - player.height;
		ball.y = player.y - player.height - 10;

		ball.vx = 0;
		ball.vy = 0;
	}

	// Throw ball
	if(!g && holdingBall)
	{
		holdingBall = false;

		ball.vx = 0;
		ball.vy = 0;

		if(left)
		{
			ball.vx = -throwPower;
		}

		if(right)
		{
			ball.vx = throwPower;
		}

		if(up)
		{
			ball.vy = -throwPower;
		}

		if(down)
		{
			ball.vy = throwPower;
		}
	}

	// Player physics
	player.vx *= fX;
	player.vy *= fY;
	player.vy += gravity;

	player.x += Math.round(player.vx);
	player.y += Math.round(player.vy);

	// Player platform collision
	while(platform0.hitTestPoint(player.bottom()) && player.vy >= 0)
	{
		player.y--;
		player.vy = 0;
		player.canJump = true;
	}

	while(platform0.hitTestPoint(player.left()) && player.vx <= 0)
	{
		player.x++;
		player.vx = 0;
	}

	while(platform0.hitTestPoint(player.right()) && player.vx >= 0)
	{
		player.x--;
		player.vx = 0;
	}

	while(platform0.hitTestPoint(player.top()) && player.vy <= 0)
	{
		player.y++;
		player.vy = 0;
	}

	// ball+player collison

	while(ball.hitTestPoint(player.top()))
	{
		ball.y--;
		ball.vy = -ball.vy * 0.8;
	}
	if(ball.hitTestObject(player))
	{
		if(ball.x < player.x)
		{
			ball.x = player.x - player.width / 2 - ball.width / 2;
			ball.vx = -Math.abs(ball.vx) * 0.9;
		}
		else
		{
			ball.x = player.x + player.width / 2 + ball.width / 2;
			ball.vx = Math.abs(ball.vx) * 0.9;
		}

		ball.vy = -8;
	}


	// Ball physics
	if(!holdingBall)
	{
		ball.vy += gravity;

		ball.x += ball.vx;
		ball.y += ball.vy;

		// Ball bounces on platform
		while(platform0.hitTestPoint(ball.bottom()) && ball.vy >= 0)
		{
			ball.y--;
			ball.vy = -ball.vy * 0.8;
		}

		// Ball bounces off right wall
		if(ball.x + ball.width / 2 >= canvas.width)
		{
			ball.x = canvas.width - ball.width / 2;
			ball.vx = -ball.vx * 0.9;
		}

		// Ball bounces off left wall
		if(ball.x - ball.width / 2 <= 0)
		{
			ball.x = ball.width / 2;
			ball.vx = -ball.vx * 0.9;
		}
	}

	// Enemies
	for(var i = 0; i < enemies.length; i++)
	{
		enemies[i].x += enemies[i].vx;

		if(enemies[i].x - enemies[i].width / 2 > canvas.width)
		{
			resetEnemy(enemies[i]);
		}

	if (ball.hitTestObject(enemies[i])) {
    console.log("Hit!");

    var ballCenterX = ball.x + ball.width / 2;
    var ballCenterY = ball.y + ball.height / 2;

    var enemyCenterX = enemy.x + enemy.width / 2;
    var enemyCenterY = enemy.y + enemy.height / 2;

		if (ballCenterX < enemyCenterX && ballCenterY < enemyCenterY) 
		{
			console.log("top left of enemy");

			ball.vx = -Math.abs(ball.vx) * 0.9;
			ball.vy = -Math.abs(ball.vy) * 0.9;

			ball.x = enemy.x - ball.width;
			ball.y = enemy.y - ball.height;
			resetEnemy(enemies[i]);


		}

		if (ballCenterX > enemyCenterX && ballCenterY < enemyCenterY)
		{
			console.log("top right of enemy");

			ball.vx = Math.abs(ball.vx) * 0.9;
			ball.vy = -Math.abs(ball.vy) * 0.9;

			ball.x = enemy.x + enemy.width;
			ball.y = enemy.y - ball.height;
			resetEnemy(enemies[i]);
		}

		if (ballCenterX < enemyCenterX && ballCenterY > enemyCenterY) 
		{
			console.log("bottom left of enemy");

			ball.vx = -Math.abs(ball.vx) * 0.9;
			ball.vy = Math.abs(ball.vy) * 0.9;

			ball.x = enemy.x - ball.width;
			ball.y = enemy.y + enemy.height;
			resetEnemy(enemies[i]);
		}

		if (ballCenterX > enemyCenterX && ballCenterY > enemyCenterY) 
		{
			console.log("bottom right of enemy");
			ball.vx = Math.abs(ball.vx) * 0.9;
			ball.vy = Math.abs(ball.vy) * 0.9;

			ball.x = enemy.x + enemy.width;
			ball.y = enemy.y + enemy.height
			resetEnemy(enemies[i]);
		}

		score++;
		console.log("score " + score);

    
}

}

	
	platform0.drawRect();

	player.drawRect();
	ball.drawCircle();

	for(var i = 0; i < enemies.length; i++)
	{
		enemies[i].drawRect();
	}
}
