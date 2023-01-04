let isGameOver = false;
let ctx;
let canvasEl;
let guessedLetterArray;
const maxSecretWordLength = 29;
let secretWord;

let anchor = { x: 0, y: 0 };

const x = (val) => anchor.x + val;
const y = (val) => anchor.y + val;

const getAllIndexes = (arr, val) => {
    let indexes = [];
    let i = -1;
    while ((i = arr.indexOf(val, i+1)) != -1){
        indexes.push(i);
    }
    return indexes;
}

const resetGame = () => {
    setTimeout(() => {
        window.location.reload();
    }, 200);
}

const main = () => {
    // Get references for HTML elements.
    canvasEl = document.getElementById('the-canvas');
    ctx = canvasEl.getContext("2d");

    // Set global style
    ctx.font = "bold 36px serif";
    ctx.textAlign = "center";

    // Set colors
    ctx.fillStyle = "#FFF";
    ctx.strokeStyle = "#FFF";

    // Set up global anchor coords.
    anchor.y = 10;
    anchor.x = 10;

    // Line style
    ctx.lineWidth = 2;

    secretWord = prompt("Skriv ett hemligt ord eller avbryt för ett slumpartat ord.");
    if(!secretWord) {
        secretWord = getRandomSecretWord();
    }
    secretWord = secretWord.toLowerCase();

    guessedLetterArray = new Array(secretWord.length).fill(false);

    drawSecretLetterUnderlining(secretWord);
    hookUpUserGuessInput();
}

const hookUpUserGuessInput = () => {
    document.body.addEventListener("keypress", (e) => {
        if(isGameOver) return;

        let didUserGuessCorrectLetter = false;

        const guessedLetter = e.key.toLowerCase();

        // Reset value in user input
        e.target.value = "";

        if(guessedLetter === " ") return;

        const indexesForGuessedLetter = getAllIndexes(secretWord, guessedLetter);

        indexesForGuessedLetter.forEach((index) => {
            if(!guessedLetterArray[index]) {
                didUserGuessCorrectLetter = true;
                guessedLetterArray[index] = true
            }
        });

        if(didUserGuessCorrectLetter) {
            drawCorrectGuessedLetters();
        } else {
            drawHangManStep();
        }

        addLetterToHistory(guessedLetter);

        if(hasUserWonGame()) {
            setTimeout(() => alert("Grattis. Du vann!"), 200);
            isGameOver = true;
        }
        else if(hasUserLostGame()) {
            setTimeout(() => alert(`Gubben dog. Det hemliga ordet var "${secretWord}". Bättre lycka nästa gång.`), 200);
            isGameOver = true;
        }

        if(isGameOver) {
            resetGame();
        }
    });
}

const addLetterToHistory = (letter) => {
    document.getElementById("letters-history").append(letter.toUpperCase());
}

const getRandomSecretWord = () => {
    const wordsCount = window.swedishWords.length;
    const randomWordIndex = Math.floor(Math.random() * (wordsCount - 0 + 1) + 0);
    const randomWord = window.swedishWords[randomWordIndex];
    return randomWord;
}

const hasUserWonGame = () => {
    const correctLetterCount = guessedLetterArray.filter((value) => value === true).length;

    const numberOfSpaces = (secretWord.match(/ /g) || []).length

    return correctLetterCount === secretWord.length -numberOfSpaces;
}

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
            ctx.beginPath();
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

main();