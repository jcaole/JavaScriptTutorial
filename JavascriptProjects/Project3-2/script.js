/** @type {HTMLCanvasElement} */
const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
CANVAS_WIDTH = canvas.width = 500;
CANVAS_HEIGHT = canvas.height = 1000;
const numOfEnemies = 10;
const enemiesArr = [];

let gameFrame = 0;
/*
  SPRITE 2
*/
class Enemy {
    constructor() {
        //moved image instance to enemy class
        this.image = new Image();
        this.image.src = './enemies/enemy2.png';
        // between 1 and 5 pixels per frame
        this.speed = Math.random() * 4 + 1;

        // sprite 2 content
        this.spriteWidth = 266;
        this.spriteHeight = 188;

        // cropped out frame
        this.width = this.spriteWidth / 2.5;
        this.height = this.spriteHeight / 2.5;

        this.x = Math.random() * (canvas.width - this.width);
        this.y = Math.random() * (canvas.height - this.height);

        // animated sprite variables
        this.frame = 0;
        this.flapSpeed = Math.floor(Math.random() * 3 + 1);

        // add sine wave movement to entity
        this.angle = 0;
        this.angleSpeed = Math.random() * 0.2; // between 0 - 0.2
        this.curve = Math.random() * 7;    // between 0 - 7
    }
    /*
    * handles entity movement
    */
    update() {
        this.x -= this.speed;
        
        // if entity reaches end of left canvas, move to right canvas
        if (this.x + this.width < 0) {
            this.x = canvas.width;
        }

        // handles sine wave movement
        this.y += 10 * Math.sin(this.angle);
        this.angle += this.angleSpeed;

        // animate sprites
        if(gameFrame % this.flapSpeed === 0) {
        this.frame > 4 ? this.frame = 0 : this.frame++;
        }
    }
    /*
    * draw entity
    */
    draw() {
        // testing size of hitbox
        // ctx.strokeRect(this.x, this.y, this.width, this.height);
        // draw image description:
        //enemyImage : sprite to draw, next four is for the cropped frame.
        //last four params are for the location of the sprite in the cropped frame.
        ctx.drawImage(this.image, this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight,
            this.x, this.y, this.width, this.height)
    }
};

for(let i = 0; i < numOfEnemies; i++) {
    enemiesArr.push(new Enemy());
}
//testing enemies array
// console.log(enemiesArr);

function animate() {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    enemiesArr.forEach(enemy => {
        enemy.update();
        enemy.draw();
    });
    gameFrame++;
    requestAnimationFrame(animate);
}
animate();