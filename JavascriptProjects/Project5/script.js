const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

//helper variables
let timeToNextRaven = 0;
let ravenInterval = 500;    // 500ms
let lastTime = 0;           // hold value of timestamp

// hold all entity raven
let ravens = [];
class Raven {
    constructor() {
        this.spriteWidth = 271;
        this.spriteHeight = 194;
        this.sizeModifier = Math.random() * 0.1 + 1;
        this.width = this.spriteWidth * this.sizeModifier;
        this.height = this.spriteHeight * this.sizeModifier;
        this.x = canvas.width;
        this.y = Math.random() * (canvas.height - this.height);
        this.directionX = Math.random() * 5 + 3;
        this.directionY = Math.random() * 5 - 2.5;
        //
        this.markedForDeletion = false;

        // entities
        this.image = new Image();
        this.image.src = './images/raven.png';

        //frames
        this.frame = 0;
        this.maxFrame = 4;
        this.timeSinceFlap = 0;
        this.flapInterval = Math.random() * 50 + 50;
    }
    update(deltaTime) {
        this.x -= this.directionX;

        if(this.x < 0 - this.width) {
            this.markedForDeletion = true;
        }

        this.timeSinceFlap += deltaTime;
        if(this.timeSinceFlap > this.flapInterval) {
            if(this.frame > this.maxFrame) {
                this.frame = 0;
            }
            else {
                this.frame++;
            }
            this.timeSinceFlap = 0;
        }        
    }
    draw() {
        ctx.strokeRect(this.x, this.y, this.width, this.height);
        ctx.drawImage(this.image, this.frame*this.spriteWidth, 0, this.spriteWidth, this.spriteHeight,
         this.x, this.y, this.width, this.height);
    }
}
// test entity animation
// const raven = new Raven();

function animate(timeStamp) {
    ctx.clearRect(0,0, canvas.width, canvas.height);

    // one way to trigger periodic events through timestamps
    let deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;
    timeToNextRaven += deltaTime;
    if(timeToNextRaven > ravenInterval) {
        ravens.push(new Raven());
        timeToNextRaven = 0;
    };
    [...ravens].forEach(object => object.update(deltaTime));                   // array literal, spread operator
    [...ravens].forEach(object => object.draw());                     // array literal, spread operator
    ravens = ravens.filter(object => !object.markedForDeletion)     // take ravens variable and replace with same array filled only objects if true
    requestAnimationFrame(animate);                                 // callback function
}
animate(0);