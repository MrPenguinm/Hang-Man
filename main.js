// *[1] Game Letters
const gameLetters = "abcdefghijklmnopqrstuvwxyz#+";
let gameLettersArray = Array.from(gameLetters);
let LettersContainer = document.querySelector(".letters");
// 1.1 Create Letters
gameLettersArray.forEach((letter) => {
  let span = document.createElement("span");
  span.className = "letter-box";
  span.textContent = letter;
  LettersContainer.appendChild(span);
});
// ------------------------------------------------------------------
// *[2] Game Words => Fetch Data and Random
let randomValueValue;
let randomHint;
fetch("wordsGame.json")
  .then((response) => response.json())
  .then((data) => {
    startGame(data);
  })
  .catch((error) => console.error("Error loading words:", error));
// ------------------------------------------------------------------
// 2.0 Start Game Function
function startGame(gameWords) {
  let categoriesKeys = Object.keys(gameWords);
  // 2.1 Random Category and Word
  let randomPropNumber = Math.floor(Math.random() * categoriesKeys.length);
  let randomPropName = categoriesKeys[randomPropNumber];
  // ------------------------------------------------------------------
  let randomPropValue = gameWords[randomPropName];
  let randomValueNumber = Math.floor(Math.random() * randomPropValue.length);
  randomValueValue = randomPropValue[randomValueNumber].word;
  randomHint = randomPropValue[randomValueNumber].hint;
  // 2.2 Set Category with Hint
  document.querySelector(
    ".game-info .category span"
  ).textContent = `${randomPropName} ${randomHint}`;
  // ------------------------------------------------------------------
  // *[3] Word Letters to Guess
  let lettersGuessContainer = document.querySelector(".letters-guess");
  lettersGuessContainer.innerHTML = "";
  let lettersAndSpace = Array.from(randomValueValue);
  // 3.1 Create Spans and Set Classes
  lettersAndSpace.forEach((letter) => {
    let emptySpan = document.createElement("span");
    if (letter === " ") {
      emptySpan.className = "with-space";
    } else {
      emptySpan.className = "letter-box-guess";
    }
    lettersGuessContainer.appendChild(emptySpan);
  });
  guessAllspans = document.querySelectorAll(".letters-guess span");
}
// ------------------------------------------------------------------
// *[4] Handle Click and Check
let guessAllspans;
let wrongAttempts = 0;
let theDraw = document.querySelector(".hangman-draw");
document.addEventListener("click", (e) => {
  let theStatus = false;
  // 4.1 Get Clicked Letter
  if (e.target.className === "letter-box") {
    e.target.classList.add("clicked-lose");
    let clickedLetter = e.target.textContent.toLowerCase();
    // 4.3 Check Clicked Letter
    let chosenWord = Array.from(randomValueValue.toLowerCase());
    chosenWord.forEach((wordLetter, wordIndex) => {
      if (clickedLetter === wordLetter) {
        // 4.4 Loop all Span in Letters Guess
        e.target.classList.add("clicked-win");
        theStatus = true;
        guessAllspans.forEach((span, spanIndex) => {
          if (wordIndex === spanIndex) {
            span.textContent = clickedLetter;
          }
        });
      }
    });
    // 4.5 Wrong Attempt and show
    if (!theStatus) {
      wrongAttempts++;
      theDraw.classList.add(`wrong-${wrongAttempts}`);
      if (wrongAttempts === 9) {
        endGame();
        LettersContainer.classList.add("finished");
        document
          .querySelectorAll(".letters .letter-box")
          .forEach((letterBox) => {
            letterBox.classList.add("clicked-lose");
          });
      }
    } else {
      successGame();
      document.getElementById("win").play();
    }
  }
});
// *[5] End Game Function and Success Game Function
function successGame() {
  let allLettersGuessed = true;
  guessAllspans.forEach((span) => {
    if (span.textContent === "") {
      allLettersGuessed = false;
    }
  });
  if (allLettersGuessed) {
    LettersContainer.classList.add("finished", "win");
    document.querySelectorAll(".letters .letter-box").forEach((letterBox) => {
      letterBox.classList.add("clicked-win");
    });
    let div = document.createElement("div");
    let divText = document.createTextNode("🎉 Congratulations You Won!");
    document.getElementById("success").play();
    setTimeout(() => {
      div.appendChild(divText);
      div.className = "popup win";
      document.body.appendChild(div);
    }, 1000);
    guessAllspans.forEach((span) => {
      span.classList.add("clicked-win");
    });
    setTimeout(() => {
      window.location.reload();
    }, 3500);
  }
}
// ------------------------------------------------------------------
function endGame() {
  let div = document.createElement("div");
  let divText = document.createTextNode("Game Over Try Again :)");
  document.getElementById("fail").play();
  setTimeout(() => {
    div.appendChild(divText);
    div.className = "popup lose";
    document.body.appendChild(div);
  }, 1000);
  guessAllspans.forEach((span) => {
    span.classList.add("clicked-lose");
  });
  setTimeout(() => {
    window.location.reload();
  }, 3500);
}
