const words = ["javascript", "hangman", "computer", "game", "programming", "keyboard"]; // Word list
let selectedWord = "";
let guessedWord = [];
let wrongGuesses = 0;
const maxWrong = 6;
let guessedLetters = new Set();

function initGame() {
    selectedWord = words[Math.floor(Math.random() * words.length)];
    guessedWord = Array(selectedWord.length).fill("_");
    wrongGuesses = 0;
    guessedLetters.clear();
    updateDisplay();
    createAlphabetButtons();
    document.getElementById("message").textContent = "Guess a letter!";
}

function updateDisplay() {
    document.getElementById("word-display").textContent = guessedWord.join(" ");
    document.getElementById("wrong-count").textContent = maxWrong - wrongGuesses;
}

function createAlphabetButtons() {
    const alphabetDiv = document.getElementById("alphabet");
    alphabetDiv.innerHTML = "";
    for (let i = 65; i <= 90; i++) { // A-Z
        const letter = String.fromCharCode(i).toLowerCase();
        const button = document.createElement("button");
        button.textContent = letter.toUpperCase();
        button.addEventListener("click", () => guessLetter(letter, button));
        alphabetDiv.appendChild(button);
    }
}

function guessLetter(letter, button) {
    if (guessedLetters.has(letter)) return;
    guessedLetters.add(letter);
    button.classList.add("disabled");

    let correct = false;
    for (let i = 0; i < selectedWord.length; i++) {
        if (selectedWord[i] === letter) {
            guessedWord[i] = letter;
            correct = true;
        }
    }

    if (correct) {
        button.classList.add("correct");
        document.getElementById("message").textContent = "Good guess!";
    } else {
        button.classList.add("wrong");
        wrongGuesses++;
        document.getElementById("message").textContent = "Wrong! " + (maxWrong - wrongGuesses) + " left.";
    }

    updateDisplay();
    checkGameEnd();
}

function checkGameEnd() {
    if (!guessedWord.includes("_")) {
        document.getElementById("message").textContent = "You win! The word was: " + selectedWord;
        disableAllButtons();
    } else if (wrongGuesses >= maxWrong) {
        document.getElementById("message").textContent = "Game over! The word was: " + selectedWord;
        disableAllButtons();
    }
}

function disableAllButtons() {
    const buttons = document.querySelectorAll("#alphabet button");
    buttons.forEach(btn => btn.classList.add("disabled"));
}

document.getElementById("reset-btn").addEventListener("click", initGame);

// Start the game
initGame();