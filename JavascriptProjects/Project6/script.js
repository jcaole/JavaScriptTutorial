
// use 'load' when implementing client-server connection
document.addEventListener('DOMContentLoaded', function () {
    const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    canvas.width = 500;
    canvas.height = 800;

    class Game {
        constructor(ctx, width, height) {
            this.ctx = ctx;
            this.width = width;
            this.height = height;
            this.enemies = [];
            this.enemyInterval = 500;
            this.enemyTimer = 0;
            this.enemyTypes = ['worm', 'spider', 'ghost'];
        }
        update(deltaTime) {
            this.enemies = this.enemies.filter(object => !object.markedForDeletion);
            if (this.enemyTimer > this.enemyInterval) {
                this.#addNewEnemy();
                this.enemyTimer = 0;
            } else {
                this.enemyTimer += deltaTime;
            }
            this.enemies.forEach(object => object.update(deltaTime));
        }
        draw() {
            this.enemies.forEach(object => object.draw(this.ctx));
        }
        // private class method
        #addNewEnemy() {
            const randomEnemy = this.enemyTypes[Math.floor(Math.random() * this.enemyTypes.length)];
            if(randomEnemy == 'worm') {
                this.enemies.push(new Worm(this));
            }
            else if (randomEnemy == 'spider') {
                this.enemies.push(new Spider(this));
            }
            else {
                this.enemies.push(new Ghost(this));
            }
            
            // ascending sort to clean up entity layer heiarchy
            /*this.enemies.sort(function(a,b) {
                return a.y - b.y;
            });
            */
        }
    }

    class Enemy {
        constructor(game) {
            this.game = game;
            console.log(this.game);
            this.markedForDeletion = false;

            // tranisition between animations
            this.frameX = 0;
            this.maxFrame = 5;
            this.frameInterval = 100;
            this.frameTimer = 0;
        }
        update(deltaTime) {
            this.x -= this.vx * deltaTime;
            // remove enemies
            if (this.x < 0 - this.width) {
                this.markedForDeletion = true;
            }

            if(this.frameTimer > this.frameInterval) {
                if(this.frameX < this.maxFrame) {
                    this.frameX++;
                }
                else {
                    this.frameTimer = 0;
                }

            } else {
                this.frameTimer += deltaTime;
            }
        }
        draw(ctx) {
            // ctx.fillRect(this.x, this.y, this.width, this.height);
            ctx.drawImage(this.image, this.frameX * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);
        }
    }

    class Worm extends Enemy {
        constructor(game) {
            super(game);
            // widthOfSheet / numOfFrames
            this.spriteWidth = 229;
            // heightOfSpreadSheet / numOfFrames
            this.spriteHeight = 171;

            this.width = this.spriteWidth / 2;
            this.height = this.spriteHeight / 2;

            this.x = this.game.width;
            this.y = this.game.height - this.height;        // keep entity on the "floor"
            this.image = worm;

            this.vx = Math.random() * 0.1 + 0.1;
        }
    }

    class Ghost extends Enemy {
        constructor(game) {
            super(game);
            // widthOfSheet / numOfFrames
            this.spriteWidth = 261;
            // heightOfSpreadSheet / numOfFrames
            this.spriteHeight = 209;

            this.width = this.spriteWidth / 2;
            this.height = this.spriteHeight / 2;

            this.x = this.game.width;
            this.y = Math.random() * this.game.height * 0.6;        // keep entity above "floor"
            this.image = ghost;

            this.vx = Math.random() * 0.3 + 0.1;

            // move pattern for entity
            this.angle = 0;
            this.curve = Math.random() * 3;
        }
        // overload functions
        update(deltaTime) {
            super.update(deltaTime);
            this.y += Math.sin(this.angle) * this.curve;
            this.angle += 0.1;
        }
        draw(ctx) {
            ctx.save();
            ctx.globalAlpha = 0.6;
            super.draw(ctx);
            ctx.restore();
        }
    }

    class Spider extends Enemy {
        constructor(game) {
            super(game);
            // widthOfSheet / numOfFrames
            this.spriteWidth = 310;
            // heightOfSpreadSheet / numOfFrames
            this.spriteHeight = 175;

            this.width = this.spriteWidth / 2;
            this.height = this.spriteHeight / 2;

            this.x = Math.random() * this.game.width;
            this.y = 0 - this.height;        
            this.image = spider;

            this.vx = 0;
            this.vy = Math.random() * 0.1 + 0.1;        // randomize veritcal movement
            //move pattern
            this.maxLength = Math.random() * this.game.height;
        }
        update(deltaTime) {
            super.update(deltaTime);
            if(this.y < 0 - this.height * 2) {
                this.markedForDeletion = true;
            }
            this.y += this.vy * deltaTime;              // helps with consistency in other machines
            //move pattern
            if (this.y > this.maxLength) {
                this.vy *= -1;
            }
        }
        draw(ctx) {
            ctx.save();
            /* 
                spider web
             */
            ctx.beginPath();
            ctx.moveTo(this.x + this.width/2, 0);
            ctx.lineTo(this.x + this.width/2, this.y + 10);
            ctx.stroke();
            super.draw(ctx);
            ctx.restore();
        }

    }

    const game = new Game(ctx, canvas.width, canvas.height);
    let lastTime = 0;
    function animate(timeStamp) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const deltaTime = timeStamp - lastTime;
        lastTime = timeStamp;

        game.update(deltaTime);
        game.draw();

        requestAnimationFrame(animate);
    }
    animate(0);
});
