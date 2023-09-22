let playerState = 'fall';
const dropdown = document.getElementById('animations');
dropdown.addEventListener('change', function(e){
    playerState = e.target.value;
})

const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');

const CANVAS_WIDTH = canvas.width = 600;
const CANVAS_HEIGHT = canvas.height = 600;

const playerImage = new Image();
playerImage.src = 'shadow_dog.png';

// get sprite fit to screen | shadow_dog is 6876px width, 12 col, 10 rows
// spriteWidth : 6876/12 = 573
const spriteWidth = 575;
// spriteHeight : 5230/10 = 523
const spriteHeight = 523;

//frames per second
let gameFrame = 0;
const staggerFrames = 5;

// container to hold animation
const spriteAnimations = [];
// map coord for each frame
const animationStates = [
    {
        name: 'idle',
        frames: 7,
    },
    {
        name: 'jump',
        frames: 7,
    },
    {
        name: 'fall',
        frames: 7,
    },
    {
        name: 'run',
        frames: 9,
    },
    {
        name: 'dizzy',
        frames: 11,
    },
    {
        name: 'sit',
        frames: 5,
    },
    {
        name: 'roll',
        frames:7,
    },
    {
        name: 'bite',
        frames: 7,
    },
    {
        name: 'ko',
        frames: 12,
    },
    {
        name: 'getHit',
        frames:4,
    }
];
// callback function used to refer to each animation state in image.
animationStates.forEach((state, index) => {
    let frames = {
        loc: [],
    }
    for(let j = 0; j < state.frames; j++) {
        let positionX = j * spriteWidth;
        let positionY = index * spriteHeight;
        frames.loc.push({x: positionX, y: positionY});
    }
    spriteAnimations[state.name] = frames;
});
console.log(spriteAnimations);

playerImage.onload = function () {

    function animate() {
        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        
        // refactored to use all frames in image.
        //NOTE: increase gameframe 5x, floor is 0 till 5 where 5=1.
        let position = Math.floor(gameFrame/staggerFrames) % spriteAnimations[playerState].loc.length;
        let frameX = spriteWidth * position;
        let frameY = spriteAnimations[playerState].loc[position].y;
        // s = rectangular area to crop out from the image, d = where to display the cropped image to be displayed in canvas
        // NOTE: sx = (n * spriteWidth) = each sprite in image ROW
        // NOTE: sy = (n * spriteHeight) = each sprite in image COL
        ctx.drawImage(playerImage, frameX, frameY,
            spriteWidth, spriteHeight, 0, 0, spriteWidth, spriteHeight);



        gameFrame++;
        requestAnimationFrame(animate);
    }
    animate();
};
// handles erros in case the image fails to load.
playerImage.onerror = function () {
    console.error("Failed to load the image.");
};