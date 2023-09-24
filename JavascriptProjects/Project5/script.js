const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const collisionCanvas = document.getElementById('collisionCanvas');
const collisionCtx = collisionCanvas.getContext('2d');
collisionCanvas.width = window.innerWidth;
collisionCanvas.height = window.innerHeight;

// score
let score = 0;
let gameOver = false;
ctx.font = '50px Impact';

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
        this.sizeModifier = Math.random() * 0.1 + .8;
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

        // collision Canvas
        this.randomColors = [Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), Math.floor(Math.random() * 255)];
        this.color = 'rgb(' + this.randomColors[0] + ',' + this.randomColors[1]
            + ',' + this.randomColors[2] + ')';

        // particle trail per raven
        this.hasTrail = Math.random() > 0.3;
    }
    update(deltaTime) {
        // top and bottom bounce effect
        if (this.y < 0 || this.y > canvas.height - this.height) {
            this.directionY = this.directionY * -1;
        }

        this.x -= this.directionX;
        this.y += this.directionY;
        if (this.x < 0 - this.width) {
            this.markedForDeletion = true;
        }

        this.timeSinceFlap += deltaTime;
        if (this.timeSinceFlap > this.flapInterval) {
            if (this.frame > this.maxFrame) {
                this.frame = 0;
            }
            else {
                this.frame++;
            }
            this.timeSinceFlap = 0;
            // handles particle trail per raven
            if(this.hasTrail) {
                for(let i = 0; i < 5; i++) {
                    particles.push(new Particles(this.x, this.y, this.width, this.color));
                }
            }
        }
        // gameover
        if(this.x < 0 - this.width) gameOver = true;
    }
    draw() {
        collisionCtx.fillStyle = this.color;
        collisionCtx.fillRect(this.x, this.y, this.width, this.height);
        ctx.drawImage(this.image, this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight,
            this.x, this.y, this.width, this.height);
    }
}

//explosion effect
let explosions = [];
class Explosion {
    constructor(x, y, size) {
        this.image = new Image();
        this.image.src = './images/boom.png';
        this.spriteWidth = 200;
        this.spriteHeight = 179;
        this.size = size;
        this.x = x;
        this.y = y;
        this.frame = 0;
        this.sound = new Audio();
        this.sound.src = './audio/boom.wav';

        this.timeSinceLastFrame = 0;
        this.frameInterval = 200;
        this.markedForDeletion = false;
    }
    update(deltatime) {
        if (this.frame === 0) {
            this.sound.play();
        }
        this.timeSinceLastFrame += deltatime;
        if (this.timeSinceLastFrame > this.frameInterval) {
            this.frame++;
            this.timeSinceLastFrame = 0;
            if (this.frame > 5) {
                this.markedForDeletion = true;
            }
        }

    }
    draw() {
        ctx.drawImage(this.image, this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight,
             this.x, this.y - this.size / 4, this.size, this.size);
    }
}

// template to create particles
let particles = [];
class Particles {
    constructor(x, y, size, color) {
        this.size = size;
        this.x = x + this.size / 2 + Math.random() * 50 - 25;
        this.y = y + this.size / 3 + Math.random() * 50 - 25;

        this.radius = Math.random() * this.size / 10;
        this.maxRadius = Math.random() * 20 + 35;
        this.markedForDeletion = false;
        this.speedX = Math.random() * 1 + 0.5;
        this.color = color;
    }
    update() {
        this.x += this.speedX;
        this.radius += 0.5;
        if (this.radius > this.maxRadius - 5) { // Corrected typo here
            this.markedForDeletion = true;
        }
    }
    draw() {
        ctx.save(); // helps with global overflow
        ctx.globalAlpha = 1 - this.radius / this.maxRadius; // animate opacity of trail
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore(); // helps with global overflow
    }
}

function drawScore() {
    ctx.fillStyle = 'black';
    ctx.fillText('Score: ' + score, 50, 75);
    ctx.fillStyle = 'white';
    ctx.fillText('Score: ' + score, 55, 80);
}

function drawGameOver() {
    ctx.textAlign = 'center';
    ctx.fillStyle = 'black';
    ctx.fillText('GAME OVER, your score is ' + score, canvas.width/2, canvas.height/2);
    ctx.textAlign = 'center';
    ctx.fillStyle = 'red';
    ctx.fillText('GAME OVER, your score is ' + score, canvas.width/2, canvas.height/2 +5);
}

window.addEventListener('click', function (e) {
    const detectPixelColor = collisionCtx.getImageData(e.x, e.y, 1, 1);
    const pc = detectPixelColor.data;                       // 
    ravens.forEach(object => {
        if (object.randomColors[0] === pc[0] && object.randomColors[1] === pc[1]
            && object.randomColors[2] === pc[2]) {
            // collision detected
            object.markedForDeletion = true;
            score++;
            explosions.push(new Explosion(object.x, object.y, object.width));
        }
    })
});
// test entity animation
// const raven = new Raven();

function animate(timeStamp) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    collisionCtx.clearRect(0, 0, canvas.width, canvas.height);

    // one way to trigger periodic events through timestamps
    let deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;
    timeToNextRaven += deltaTime;
    if (timeToNextRaven > ravenInterval) {
        ravens.push(new Raven());
        timeToNextRaven = 0;
        ravens.sort(function (a, b) {
            return a.width - b.width;       // ascending order, small ravens built first
        });
    };
    drawScore();
    [...particles, ...ravens, ...explosions].forEach(object => object.update(deltaTime));                   // array literal, spread operator
    [...particles, ...ravens, ...explosions].forEach(object => object.draw());                     // array literal, spread operator
    ravens = ravens.filter(object => !object.markedForDeletion);     // take ravens variable and replace with same array filled only objects if true
    explosions = explosions.filter(object => !object.markedForDeletion);
    particles = particles.filter(object => !object.markedForDeletion);
    if(!gameOver) {
        requestAnimationFrame(animate);                                 // callback function
    }
    else {
        drawGameOver();
    }
}
animate(0);