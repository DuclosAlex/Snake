document.addEventListener("DOMContentLoaded", function() 
{
    var canvas = document.querySelector('#canvas');
    var canvasWidth = 900;
    var canvasHeight = 600;
    var blockSize = 30;
    var ctx;
    var delay = 100;
    var snake;
    var apple;
    var widthInBlocks = canvasWidth/blockSize;
    var heightInBlocks = canvasHeight/blockSize;
    var score;
    var btn = document.querySelector("#start");

    init();


    function init()
    {
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        canvas.style.border = "25px dashed gold";
        ctx = canvas.getContext('2d');
        snake = new Snake([[6,4],[5,4],[4,4],[3,4],[2,4]], "right");
        apple = new Apple([10,10]);
        score = 0;
        refreshCanvas();
    }

    function refreshCanvas() 
    {
        snake.advance();

        if(snake.checkCollision()){

            gameOver();

        }
        else {

            if(snake.isEatingApple(apple)){

                score++;
                snake.ateApple = true;
                do {

                    apple.setNewPosition();
                }

                while(apple.isOnSnake(snake))
            }
        
            ctx.clearRect(0,0, canvasWidth, canvasHeight);
            snake.draw();
            apple.draw();
            var displayScore = document.querySelector(".score").innerText = `Votre score est de : ${score}`;
            setTimeout(refreshCanvas, delay)
        }
    }

    function gameOver(){

        ctx.save();
        ctx.font = "48px serif";
        ctx.fillStyle ="gold";
        ctx.fillText("Game Over", 350, 300);
        ctx.restore();
    }


    function drawBlock(ctx, position){
        var x = position[0] * blockSize;
        var y = position[1] * blockSize;
        ctx.fillRect(x,y, blockSize, blockSize);
    }

    function Snake(body, direction) 
    {

        this.body = body;
        this.direction = direction;
        this.ateApple = false;
        this.draw = function(){

            ctx.save();
            ctx.fillStyle = "green";
            for(var i = 0; i < this.body.length; i++){
                drawBlock(ctx, this.body[i]);
            }
            ctx.restore();            
        };
        this.advance = function(){

            var nextPosition = this.body[0].slice();
            switch(this.direction){

                case "left":
                    nextPosition[0] -= 1;
                    break;
                case "right":
                    nextPosition[0] += 1;
                    break;
                case "down":
                    nextPosition[1] += 1;
                    break;
                case "up":
                    nextPosition[1] -= 1;
                    break;
                default:
                    throw("Invalid Direction");
            }
            this.body.unshift(nextPosition);
            if(!this.ateApple){
                this.body.pop();
            }
            else {
                this.ateApple = false;
            }
        };

        this.setDirection = function(newDirection){

            var allowedDirections;
            switch(this.direction){

                case "left":  
                case "right":
                    allowedDirections = ["up", "down"];
                    break;
                case "down":
                    
                case "up":
                    allowedDirections = ["left", "right"];
                    break;
                default:
                    throw("Invalid Direction");

            }
            if(allowedDirections.indexOf(newDirection) > -1){

                this.direction = newDirection;
            }
        };

        this.checkCollision = function(){

            var wallCollision = false;
            var snakeCollision = false;
            var head = this.body[0];
            var rest = this.body.slice(1);
            var snakeX = head[0];
            var snakeY = head[1];
            var minY = 0;
            var minX = 0;
            var maxX = widthInBlocks -1;
            var maxY = heightInBlocks -1;
            var NotBetweenHorizontalWalls = snakeX < minX || snakeX > maxX;
            var NotBetweenVerticalWalls = snakeY < minY || snakeY > maxY;

            if(NotBetweenHorizontalWalls || NotBetweenVerticalWalls){

                wallCollision = true;
            }

            for(var i = 0; i < rest.length; i++){

                if(snakeX == rest[i][0] && snakeY == rest[i][1]){

                    snakeCollision = true;
                }
            }

            return wallCollision || snakeCollision;
        };

        this.isEatingApple = function(appleToEat){

            var head = this.body[0];
            if(head[0] === appleToEat.position[0] && head[1] === appleToEat.position[1]){
                return true; 
            }
            else {
                return false;
            }        
        };

    }

    function Apple(position){

        this.position = position;
        this.draw = function(){

            ctx.save();
            ctx.fillStyle = "red";
            ctx.beginPath();
            var radius = blockSize/2;
            var x = this.position[0]*blockSize + radius;
            var y = this.position[1]*blockSize + radius;
            ctx.arc(x,y, radius, 0, Math.PI*2, true);
            ctx.fill();
            ctx.restore();
        };

        this.setNewPosition = function(){

            var newX = Math.round(Math.random() * (widthInBlocks -1));
            var newY = Math.round(Math.random() * (heightInBlocks -1));
            this.position = [newX, newY];
        };

        this.isOnSnake = function(snakeCheck){

            var isOnSnake = false;

            for(var i=0; i < snakeCheck.body.length; i++){

                if(this.position[0] === snakeCheck.body[i][0] && this.position[1] === snakeCheck.body[i][1]){

                    isOnSnake = true;
                }
            }

            return isOnSnake;
        }
    }

    document.onkeydown = function handleKeyDown(e){

        var key = e.keyCode;
        var newDirection;
        switch(key){
            
            case 37:
                newDirection = "left";
                break;
            case 38:
                newDirection ="up";
                break;
            case 39:
                newDirection ="right";
                break;
            case 40: 
                newDirection ="down";
                break;
            default:           
                return;
        }
        snake.setDirection(newDirection);
    } 
    
});

