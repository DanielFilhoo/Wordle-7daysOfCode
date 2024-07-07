const correctWord = "ALLOW";
let currentGuess = "";
let currentRow = 0;

document.addEventListener("DOMContentLoaded", () => {
    const tiles = document.querySelectorAll(".cell");
    const keys = document.querySelectorAll("#keyboard button");
    const backspace = document.querySelector("#keyboard button:nth-child(9)");
    const enter = document.querySelector("#keyboard button:nth-child(10)");
    const restartButton = document.getElementById("restart-button");

    keys.forEach(key => {
        key.addEventListener("click", () => {
            if (key.textContent === "ENTER") {
                if (currentGuess.length === 5) {
                    checkGuess();
                } else {
                    showNotification("Not enough letters!", "#b59f3b");
                }
            } else if (key.textContent === "⌫") {
                currentGuess = currentGuess.slice(0, -1);
                updateTiles();
            } else if (currentGuess.length < 5) {
                currentGuess += key.textContent;
                updateTiles();
            }
        });
    });

    restartButton.addEventListener("click", () => {
        resetGame();
    });

    function updateTiles() {
        const rowTiles = document.querySelectorAll(`.row:nth-child(${currentRow + 1}) .cell`);
        rowTiles.forEach((tile, index) => {
            tile.textContent = currentGuess[index] || "";
        });
    }

    function checkGuess() {
        const rowTiles = document.querySelectorAll(`.row:nth-child(${currentRow + 1}) .cell`);
        const guess = currentGuess.split("");
        const correctLetters = correctWord.split("");

        guess.forEach((letter, index) => {
            if (letter === correctLetters[index]) {
                rowTiles[index].classList.add("correct");
                updateKeyboardColor(letter, "correct");
            } else if (correctLetters.includes(letter)) {
                rowTiles[index].classList.add("present");
                updateKeyboardColor(letter, "present");
            } else {
                rowTiles[index].classList.add("absent");
                updateKeyboardColor(letter, "absent");
            }
        });

        if (currentGuess === correctWord) {
            showNotification("You guessed right! Game over!", "green");
            restartButton.style.display = "block";
        } else if (currentRow === 5) {
            showNotification("You ran out of attempts! Game over!", "red");
            restartButton.style.display = "block";
        } else {
            currentRow++;
            currentGuess = "";
        }
    }

    function updateKeyboardColor(letter, className) {
        const key = Array.from(keys).find(k => k.textContent === letter);
        if (key) {
            key.classList.add(className);
        }
    }

    function showNotification(message, color) {
        Toastify({
            text: message,
            duration: 3000,
            gravity: "top",
            position: "center",
            style: {
                background: color,
            },
            close: true
        }).showToast();
    }

    function resetGame() {
        currentGuess = "";
        currentRow = 0;
        tiles.forEach(tile => {
            tile.textContent = "";
            tile.className = "cell";
        });
        keys.forEach(key => {
            key.className = "";
        });
        restartButton.style.display = "none";
    }
});
