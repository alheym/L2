// переменная для хранения имени игрока
let name = "";
let minValue = -1;
let maxValue = 0;
let number = 0;
let wrongGuesses = 0;
let isEven = false;

// переменная для хранения числа попыток
let guesses = 0;

function generateRandomNumber(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const output = document.querySelector("#output");
const prompt = document.querySelector("#prompt");
const input = document.querySelector("#prompt input");
const playAgainButton = document.querySelector("#play-again");

playAgainButton.addEventListener("click", playAgain);
prompt.addEventListener("submit", handelSubmit);


function playAgain() {
  clearOutput();
  clearOutput();
  clearOutput();
  minValue = -1;
  maxValue = 0;
  number = 0;
  guesses = 0;
  wrongGuesses = 0;
  isEven = 0;

  prompt.style.display = "flex";
  input.value = "";
  input.focus();
  printMessage("Enter min value:");

  playAgainButton.style.display = "none";
}

printMessage("Enter your name:");

input.focus();
// обработчик отправки инпута
function handelSubmit(event) {
  event.preventDefault();

  processInput(input.value);
  input.value = "";
}
// вывод сообщений
function printMessage(message) {
  let li = document.createElement("li");

  li.textContent = message;
  output.appendChild(li);
}
// удаление сообщений
function clearOutput() {
  for (let i = 0; i < output.children.length; i++) {
    output.removeChild(output.children[i]);
  }
}
// обработка вводимых данных
function processInput(input) {
  if (!input) return;

  if (!name) {
    name = input;
    clearOutput();
    printMessage(`Enter min value:`);
    return;
  }
  if (minValue < 0) {
    const min = parseInt(input);
    if (!isNaN(min) && min >= 0) {
      minValue = input;
      clearOutput();
      printMessage(`Enter max value:`);
      return;
    } else {
      printMessage(
        "Invalid minimum value input. Please enter a valid non-negative number."
      );
      clearOutput();
      return;
    }
  }
  if (maxValue <= 0) {
    const max = parseInt(input);
    if (!isNaN(max) && max > minValue) {
      maxValue = max;

      if (minValue > maxValue) {
        printMessage(
          "Minimum value should not exceed the maximum value. Please enter a valid maximum value:"
        );
        minValue = 0;
      } else {
        number = generateRandomNumber(minValue, maxValue);
        clearOutput();
        console.log(number);
        isEven = number % 2 === 0;
        printMessage(
          `${name}, a number from ${minValue} to ${maxValue} is guessed. Try to guess it in the least number of attempts. After each attempt, I will tell you more or less than the number you specified. `
        );
        return;
      }
    } else {
      clearOutput();
      printMessage(
        "Invalid maximum value input. Please enter a valid number greater than the minimum value."
      );
      return;
    }
  }

  printMessage(input);

  let guess = Number.parseInt(input);

  if (Number.isNaN(guess)) return;

  guesses += 1;

  if (guess > number) {
    printMessage("More. Try once more.");
    wrongGuesses++;
    if (wrongGuesses === 3) {
      printMessage("Hint: The number is " + (isEven ? "even" : "odd"));
      wrongGuesses = 0;
    }
  } else if (guess < number) {
    printMessage("Less. Try once more.");
    wrongGuesses++;
    if (wrongGuesses === 3) {
      printMessage("Hint: The number is " + (isEven ? "even" : "odd"));
      wrongGuesses = 0;
    }
  } else if (guess > maxValue) {
    printMessage("Number out of range.");
    wrongGuesses++;
    if (wrongGuesses === 3) {
      printMessage("Hint: The number is " + (isEven ? "even" : "odd"));
      wrongGuesses = 0;
    }
  } else {
    printMessage(`That's right, this is the number: ${guess}.`);
    printMessage(`Number of attempts: ${guesses}`);
    printMessage("GAME OVER");

    prompt.style.display = "none";
    playAgainButton.style.display = "block";
  }
}
