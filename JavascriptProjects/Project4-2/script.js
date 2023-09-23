const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = 500;
canvas.height = 700;
const explosions = [];

// offset coords
let canvasPosition = canvas.getBoundingClientRect();
console.log(canvasPosition);

class Explosion {
    constructor(x, y) {
        // (width of sprite sheet) / (number of frames) ex template: 1000 / 5
        this.spriteWidth = 200;
        this.spriteHeight = 179;
        this.width = this.spriteWidth * 0.7;
        this.height = this.spriteHeight * 0.7;

        this.x = x;
        this.y = y;

        this.image = new Image();
        this.image.src = './images/boom.png';
        this.frame = 0;
        this.timer = 0;

        this.angle = Math.random() * 6.2    // 360 degrees = radians

        // sound effect
        this.sound = new Audio();
        this.sound.src = 'boom.wav';

    }
    update() {
        if(this.frame === 0) {
            this.sound.play();
        }
        this.timer++;
        if(this.timer % 10 ===0) {
            this.frame++
        };
    }
    draw() {
        ctx.save();                     // portion to rotate object on canvas | save current state on canvas so that effect only 1 draw call
        ctx.translate(this.x, this.y);  // portion to rotate object on canvas | translate rotation center point on top of object I want to rotate
        ctx.rotate(this.angle);         // poriton to rotate object on canvas | I rotate the entire canvas object by rand value

        // ctx.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh);
        ctx.drawImage(this.image, this.spriteWidth * this.frame, 0,
        this.spriteWidth, this.spriteHeight, 0 - this.width/2.0, 0 - this.height/2.0, this.width, this.height);    // replaced x and y to 0
        
        ctx.restore();                  // portion to rotate object on canvas | restore canvas context to original state
    }
}

window.addEventListener('click', function(e) {
    createAnimation(e);
});

// window.addEventListener('mousemove', function(e) {
//     createAnimation(e);
// });

function createAnimation(e) {
    let positionX = e.x - canvasPosition.left;
    let positionY = e.y - canvasPosition.top;
    explosions.push(new Explosion(positionX, positionY));
    // checking to see number of objects staying on screen
    // console.log(explosions);
}

function animate() {
    ctx.clearRect(0,0,canvas.width, canvas.height)
    for(let i = 0; i < explosions.length; i++) {
        explosions[i].update();
        explosions[i].draw();

        if(explosions[i].frame > 5) {
            explosions.splice(i, 1);        // remove objects from array
            i--;                            // go back to previous indexed array slot
        }
    }
    requestAnimationFrame(animate);
};
animate();
