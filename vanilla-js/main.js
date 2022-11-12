let ctx;
let isGameOver = false;
let guessLetterInput;
let secretWord = "secret word"; 

let guessedLetterArray = new Array(secretWord.length).fill(false);

let anchor = { x: 0, y: 0 };

const x = (val) => anchor.x + val;
const y = (val) => anchor.y + val;

const getAllIndexes = (arr, val) => {
    var indexes = [], i = -1;
    while ((i = arr.indexOf(val, i+1)) != -1){
        indexes.push(i);
    }
    return indexes;
}

const main = () => {
    // Get references for HTML elements.
    const canvasEl = document.getElementById('the-canvas');
    ctx = canvasEl.getContext("2d");    

    guessLetterInput = document.getElementById("guess-letter-input");

    // Set font global style
    ctx.font = "bold 36px serif";
    ctx.textAlign = "center";

    // Set up global anchor coords.
    anchor.y = 10;
    anchor.x = 150;

    drawSecretLetterUnderlining(secretWord);
    hookUpUserGuessInput();
}

const hookUpUserGuessInput = () => {
    guessLetterInput.addEventListener("input", (e) => {
        if(isGameOver) return;

        let didUserGuessCorrectLetter = false;

        const guessedLetter = e.target.value;

        const indexesForGuessedLetter = getAllIndexes(secretWord, guessedLetter);

        indexesForGuessedLetter.forEach((index) => {
            if(!guessedLetterArray[index]) {
                didUserGuessCorrectLetter = true;
                guessedLetterArray[index] = true
            }
        });

        // Reset value in user input
        e.target.value = "";

        if(didUserGuessCorrectLetter) {
            drawCorrectGuessedLetters();
        } else {
            drawHangManStep();
        }

        if(hasUserWonGame()) {
            setTimeout(() => alert("You won!"), 200);
            isGameOver = true;
        }
        else if(hasUserLostGame()) {
            setTimeout(() => alert("You lost!"), 200);
            isGameOver = true;
        }

    });
}

const hasUserWonGame = () => guessedLetterArray.every((val) => guessedLetterArray.length === secretWord.length && val === true);

const hasUserLostGame = () => drawHangManCommandQueue.length === 0;

const drawHangManStep = () => {
    if(!drawHangManCommandQueue.length) return;

    const drawCommand = drawHangManCommandQueue.shift();
    drawCommand();
}

const drawCorrectGuessedLetters = () => {
    for(let i=0; i<secretWord.length; i++) {
        if(guessedLetterArray[i]) {
            const xOffset= i*40 + 15;
            ctx.fillText(secretWord[i].toUpperCase(), x(xOffset), 400);
        }
    }
}

const drawSecretLetterUnderlining = (secretWord) => {
    for(let i=0; i<secretWord.length; i++) {
        if(secretWord[i] !== " ") {
            const xOffset= i*40;
            ctx.moveTo(x(xOffset), y(400));
            ctx.lineTo(x(xOffset + 30), y(400));
            
            ctx.stroke();
            ctx.closePath();        
        }
    }
}

const drawGround = () => {
    ctx.moveTo(x(0), y(295));
    ctx.lineTo(x(300), y(295));
    ctx.stroke();
    ctx.closePath();
}

const drawUpperPole = () => {
    ctx.rect(x(25), y(35), 200, 10)   
    ctx.stroke();
    ctx.closePath();
}

const drawLowerPole = () => {
    ctx.rect(x(200), y(45), 10, 250)   
    ctx.stroke();
    ctx.closePath();
}

const drawPoleJoin = () => {
    ctx.moveTo(x(170), y(45));
    ctx.lineTo(x(200), y(75));
    ctx.stroke();
    ctx.closePath();

    ctx.moveTo(x(155), y(45));
    ctx.lineTo(x(200), y(90));
    ctx.stroke();
    ctx.closePath();
}

const drawRope = () => {
    ctx.moveTo(x(50), y(35));
    ctx.lineTo(x(50), y(75));
    ctx.stroke();
    ctx.closePath();
}

const drawHead = () => {
    ctx.beginPath();
    ctx.arc(x(50), y(100), 20, 0, 2*Math.PI)
    ctx.stroke();
    ctx.closePath();
}

const drawBody = () => {
    ctx.moveTo(x(50), y(120));
    ctx.lineTo(x(50), y(200));
    ctx.stroke();
    ctx.closePath();
}

const drawRightArm = () => {
    ctx.moveTo(x(75), y(155));
    ctx.lineTo(x(50), y(150));
    ctx.stroke();
    ctx.closePath();
}

const drawLeftArm = () => {
    ctx.moveTo(x(25), y(155));
    ctx.lineTo(x(50), y(150));
    ctx.stroke();
    ctx.closePath();
}

const drawRightLeg = () => {
    ctx.moveTo(x(75), y(240));
    ctx.lineTo(x(50), y(200));
    ctx.stroke();
    ctx.closePath();
}

const drawLeftLeg = () => {
    ctx.moveTo(x(25), y(240));
    ctx.lineTo(x(50), y(200));
    ctx.stroke();
    ctx.closePath();
}

const drawHangManCommandQueue = [
    drawGround,
    drawLowerPole,
    drawUpperPole,
    drawPoleJoin,
    drawRope,
    drawHead,
    drawBody,
    drawRightArm,
    drawLeftArm,
    drawRightLeg,
    drawLeftLeg,
]

// Run main application function
main();