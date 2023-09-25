window.addEventListener('load', function () {
    const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    canvas.width = 1280;
    canvas.height = 720;

    let enemies = [];
    let score = 0;

    let gameOver = false;

    const fullScreenButton = document.getElementById('fullScreenButton');

    class InputHandler {
        constructor() {
            // add and remove keyboard inputs in a game
            this.keys = [];

            // touch screen variables
            this.touchY = '';
            this.touchTreshold = 30;        //30px apart for swipe
            window.addEventListener('keydown', e => {
                if ((e.key === 'ArrowDown' ||
                    e.key === 'ArrowUp' ||
                    e.key === 'ArrowLeft' ||
                    e.key === 'ArrowRight')
                    && this.keys.indexOf(e.key) === -1) {
                    this.keys.push(e.key);
                }
                else if(e.key === 'Enter' && gameOver) {
                    restartGame();
                }
            });
            window.addEventListener('keyup', e => {
                if (e.key === 'ArrowDown' ||
                    e.key === 'ArrowUp' ||
                    e.key === 'ArrowLeft' ||
                    e.key === 'ArrowRight') {
                    this.keys.splice(this.keys.indexOf(e.key), 1);
                }
            });
            window.addEventListener('touchstart', e => {
                this.touchY = e.changedTouches[0].pageY;
            });
            window.addEventListener('touchmove', e => {
                const swipeDistance = e.changedTouches[0].pageY - this.touchY;
                if(swipeDistance < -this.touchTreshold && this.keys.indexOf('swipe up') === -1) {
                    this.keys.push('swipe up');
                } 
                else if(swipeDistance > this.touchTreshold && this.keys.indexOf('swipe down') === -1) {
                    this.keys.push('swipe down');
                    if(gameOver) {
                        restartGame();
                    }
                }
            });
            window.addEventListener('touchend', e => {
                console.log(this.keys);
                this.keys.splice(this.keys.indexOf('swipe up'), 1);
                this.keys.splice(this.keys.indexOf('swipe down'), 1);
            });
        }
    }

    class Player {
        constructor(gameWidth, gameHeight) {
            this.gameWidth = gameWidth;
            this.gameHeight = gameHeight;
            this.width = 200;
            this.height = 200;
            this.x = 100;
            this.y = this.gameHeight - this.height;
            this.image = document.getElementById('playerImage');

            //variables needed to handle animation fps
            this.frameX = 0;
            this.frameY = 0;
            this.maxFrame = 8;
            // variables to handle entity's animation frames per second
            this.fps = 20;
            this.frameTimer = 0;
            this.frameInterval = 1000 / this.fps;

            this.speed = 0;
            this.vy = 0;
            this.weight = 1;
        }
        restart() {
            this.x = 100;
            this.y = this.gameHeight - this.height;
            this.frameY = 0;
            this.maxFrame = 8;
        }
        draw(context) {        
            // draw sprite
            context.drawImage(this.image, this.frameX * this.width, this.frameY * this.height, this.width, this.height, this.x, this.y, this.width, this.height);

            //collision visualization
            context.lineWidth = 5;
            context.strokeStyle = 'white';
            context.beginPath();
            context.arc(this.x + this.width/2, this.y + this.height/2 + 20, this.width/3, 0, Math.PI * 2);
            context.stroke();
        }
        update(input, deltaTime, enemies) {
            // collision detection
            enemies.forEach(enemy => {
                const dx = (enemy.x + enemy.width / 2 - 20) - (this.x + this.width / 2);     // corrected offset for white hitboxes
                const dy = (enemy.y + enemy.height / 2) - (this.y + this.height / 2 + 20);   // corrected offset for white hitboxes | added +20 to match collision visualization
                const distance = Math.sqrt(dx * dx + dy * dy);      //pythagorean thereom
                
                // changes hit boxes for both player and enemy
                if (distance < enemy.width / 3 + this.width / 3) {      // updated to match collision visualization
                    gameOver = true;
                }
            });
            // handles animations
            if (this.frameTimer > this.frameInterval) {
                if (this.frameX >= this.maxFrame) {
                    this.frameX = 0;
                    this.frameTimer = 0;
                }
                else {
                    this.frameX++;
                }
            }
            else {
                this.frameTimer += deltaTime;
            }

            // controls
            if (input.keys.indexOf('ArrowRight') > -1) {
                this.speed = 5;
            }
            else if (input.keys.indexOf('ArrowLeft') > -1) {
                this.speed = -5;
            }
            else if ((input.keys.indexOf('ArrowUp') > -1 || input.keys.indexOf('swipe up') > -1) && this.onGround()) {
                this.vy -= 32;      // distance of initial vertical movement
            }
            else {
                this.speed = 0;
            }

            // horizontal movement
            this.x += this.speed;
            if (this.x < 0) {
                this.x = 0;
            }
            else if (this.x > this.gameWidth - this.width) {
                this.x = this.gameWidth - this.width;
            }
            // vertical movement
            this.y += this.vy;
            if (!this.onGround()) {
                this.vy += this.weight;
                this.maxFrame = 5;
                // animate ascending jump animation
                this.frameY = 1;

            }
            else {
                this.vy = 0;
                this.maxFrame = 8;
                // animate descending jump animation
                this.frameY = 0;
            }
            // veritcal boundary
            if (this.y > this.gameHeight - this.height) {
                this.y = this.gameHeight - this.height;
            }
        }
        // utility method
        onGround() {
            return this.y >= this.gameHeight - this.height;
        }
    }

    class Background {
        constructor(gameWidth, gameHeight) {
            this.gameWidth = gameWidth;
            this.gameHeight = gameHeight;
            this.image = document.getElementById('backgroundImage');
            this.x = 0;
            this.y = 0;
            this.width = 2400;
            this.height = 720;

            // scroll background variables
            this.speed = 7;
        }
        draw(context) {
            context.drawImage(this.image, this.x, this.y, this.width, this.height);
            context.drawImage(this.image, this.x + this.width - this.speed, this.y, this.width, this.height);
        }
        update() {
            // scroll to the left
            this.x -= this.speed;

            // loops background
            if (this.x < 0 - this.width) {
                this.x = 0;
            }
        }
        restart() {
            this.x = 0;
        }

    }

    class Enemy {
        constructor(gameWidth, gameHeight) {
            this.gameWidth = gameWidth;
            this.gameHeight = gameHeight;
            this.width = 160;
            this.height = 119;
            this.image = document.getElementById('enemyImage');
            this.x = this.gameWidth;
            this.y = this.gameHeight - this.height;
            this.frameX = 0;
            this.maxFrame = 5;
            // variables to handle entity's animation frames per second
            this.fps = 20;
            this.frameTimer = 0;
            this.frameInterval = 1000 / this.fps;

            this.speed = 8;

            // delete objects from array
            this.markedForDeletion = false;
        }
        draw(context) {
            // draw sprite
            context.drawImage(this.image, this.frameX * this.width, 0, this.width, this.height, this.x, this.y, this.width, this.height);
            
            //collision visualization
            context.lineWidth = 5;
            context.strokeStyle = 'white';
            context.beginPath();
            context.arc(this.x + this.width/2 - 20, this.y + this.height/2, this.width/3, 0, Math.PI * 2);
            context.stroke();
        }
        update(deltaTime) {
            if (this.frameTimer > this.frameInterval) {
                //handles entiites animation fps
                if (this.frameX >= this.maxFrame) {
                    this.frameX = 0;
                }
                else {
                    this.frameX++;
                    this.frameTimer = 0;
                }
            }
            else {
                this.frameTimer += deltaTime;
            }
            this.x -= this.speed;

            if (this.x < 0 - this.width) {
                this.markedForDeletion = true;
                score++;
            }
        }
    }
    // enemies.push(new Enemy(canvas.width, canvas.height));
    function handlesEnemies(deltaTime) {
        if (enemyTimer > enemyInterval + randomEnemyInterval) {
            enemies.push(new Enemy(canvas.width, canvas.height));
            // console.log(enemies);
            enemyTimer = 0;
        }
        else {
            enemyTimer += deltaTime;
        }
        enemies.forEach(enemy => {
            enemy.draw(ctx);
            enemy.update(deltaTime);
        });
        enemies = enemies.filter(enemy => !enemy.markedForDeletion)
    }

    function displayStatusText(context) {
        context.textAlign = 'left';
        context.font = '40px Helvetica';
        context.fillStyle = 'black';
        context.fillText('Score: ' + score, 20, 50);
        context.fillStyle = 'white';
        context.fillText('Score: ' + score, 20, 53);
        if (gameOver) {
            context.textAlign = 'center';
            context.fillStyle = 'black';
            context.fillText('GAME OVER, Press Enter or Swipe Down to Try Again!', canvas.width / 2, 300);
            context.fillStyle = 'red';
            context.fillText('GAME OVER, Press Enter or Swipe Down to Try Again!', canvas.width / 2, 304);
        }
    }

    function restartGame() {
        player.restart();
        background.restart();
        enemies = [];
        score = 0;
        gameOver = false;
        animate(0);
    }

    function toggleFullScreen() {
        console.log(document.fullscreenElement);
        if(!document.fullscreenElement) {
            
            // error popup window
            // canvas.requestFullscreen().then.catch();
            canvas.requestFullscreen().catch(err => {
                alert(`Error, can't enable full-screen mode: ${err.message}`);
            });

        }
        else {
            document.exitFullscreen();
        }
    }
    fullScreenButton.addEventListener('click', toggleFullScreen);

    // instantiate variables
    const input = new InputHandler();
    const player = new Player(canvas.width, canvas.height);
    const background = new Background(canvas.width, canvas.height);

    let lastTime = 0;
    let enemyTimer = 0;
    let enemyInterval = 1000;
    let randomEnemyInterval = Math.random() * 1000 + 500;

    function animate(timeStamp) {
        const deltaTime = timeStamp - lastTime;
        lastTime = timeStamp;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        background.draw(ctx);                               // draw background first before other objects
        background.update();
        player.draw(ctx);
        player.update(input, deltaTime, enemies);

        handlesEnemies(deltaTime);
        displayStatusText(ctx);

        if (!gameOver) {
            requestAnimationFrame(animate);
        }
    }
    animate(0);
});