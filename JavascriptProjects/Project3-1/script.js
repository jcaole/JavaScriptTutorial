/** @type {HTMLCanvasElement} */
const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
CANVAS_WIDTH = canvas.width = 500;
CANVAS_HEIGHT = canvas.height = 1000;
const numOfEnemies = 10;
const enemiesArr = [];

let gameFrame = 0;
/*
  SPRITE 1
*/
class Enemy {
    constructor() {
        //moved image instance to enemy class
        this.image = new Image();
        this.image.src = './enemies/enemy1.png';

        // sprite content
        this.spriteWidth = 293;
        this.spriteHeight = 155;

        // cropped out frame
        this.width = this.spriteWidth / 2.5;
        this.height = this.spriteHeight / 2.5;

        this.x = Math.random() * (canvas.width - this.width);
        this.y = Math.random() * (canvas.height - this.height);

        // animated sprite variables
        this.frame = 0;
        this.flapSpeed = Math.floor(Math.random() * 3 + 1);
    }
    //handles entity movement
    update() {
        // this.x += this.speed;
        this.x += Math.random() * 15 - 7.5;
        // this.y += this.speed;
        this.y += Math.random() * 10 - 5;

        // animate sprites
        if(gameFrame % this.flapSpeed === 0) {
        this.frame > 4 ? this.frame = 0 : this.frame++;
        }
    }
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