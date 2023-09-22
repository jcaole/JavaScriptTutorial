const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
const CANVAS_WIDTH = canvas.width = 800;
const CANVAS_HEIGHT = canvas.height = 700;

// scrollspeed
let gameSpeed = 5;
// let gameFrame = 0;

const backgroundLayer1 = new Image();
backgroundLayer1.src = './background/layer-1.png';
const backgroundLayer2 = new Image();
backgroundLayer2.src = './background/layer-2.png';
const backgroundLayer3 = new Image();
backgroundLayer3.src = './background/layer-3.png';
const backgroundLayer4 = new Image();
backgroundLayer4.src = './background/layer-4.png';
const backgroundLayer5 = new Image();
backgroundLayer5.src = './background/layer-5.png';

window.addEventListener('load', function() {
    // slider
const slider = document.getElementById('slider');
slider.value = gameSpeed;
const showGameSpeed = document.getElementById('showGameSpeed');
showGameSpeed.innerHTML = gameSpeed;

slider.addEventListener('change', function(e){
    // console.log(e.target.value);
    gameSpeed = e.target.value;
    showGameSpeed.innerHTML = e.target.value;
});

// scroll layer
class Layer {
    constructor(image, speedModifier) {
        this.x = 0;
        this.y = 0;
        this.width = 2400;
        this.height = 700;
        this.image = image;
        this.speedModifier = speedModifier;
        this.speed = gameSpeed * this.speedModifier;
    }
    update() {
        this.speed = gameSpeed * this.speedModifier;
        if(this.x <= -this.width) {
            this.x = 0;
        }
        this.x = this.x - this.speed;
        // this.x = gameFrame * this.speed % this.width;
    }
    draw() {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        ctx.drawImage(this.image, this.x + this.width, this.y, this.width, this.height);

    }
}

// Create an array to hold all the layers
const gameObjects = [];

// Create instances for each layer
gameObjects.push(new Layer(backgroundLayer1, 0.2));
gameObjects.push(new Layer(backgroundLayer2, 0.4));
gameObjects.push(new Layer(backgroundLayer3, 0.6));
gameObjects.push(new Layer(backgroundLayer4, 0.8));
gameObjects.push(new Layer(backgroundLayer5, 1.0));

function animate() {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Update and draw each Layer
    gameObjects.forEach(layer => {
        layer.update();
        layer.draw();
    });
    // gameFrame--;
    requestAnimationFrame(animate);
}

// Start the animation loop
animate();
});