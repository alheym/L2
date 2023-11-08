const area = document.getElementById("area");
const spanWho = document.getElementById("spanWho");
const gameOver = document.getElementById("winner");
const spanWinner = document.getElementById("spanWinner");
const newGame = document.getElementById("newGame");

let step = "";
let winner = "";
let counter = 0;

const win = [
  [0, 1, 2],
  [0, 4, 8],
  [2, 4, 6],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
];

for (let i = 0; i < 9; i++) {
  area.innerHTML += "<div id='item' class='item' pos=" + (i + 1) + "></div>";
}

const who = () => {
  step = step === "o" ? "x" : "o";
  spanWho.innerText = step;
};

who();

const items = document.querySelectorAll(".item");
items.forEach((item) => {
  item.addEventListener("click", () => {
    if (!item.classList.contains("o") && !item.classList.contains("x")) {
      item.classList.add(step);
      if (step == "x") {
        item.innerText = "x";
      } else {
        item.innerText = "o";
      }
    }
    counter++;
    who();
    circleWin();
    crossWin();
    draw();
  });
});

const circleWin = () => {
  for (let i = 0; i < win.length; i++) {
    if (
      items[win[i][0]].classList.contains("o") &&
      items[win[i][1]].classList.contains("o") &&
      items[win[i][2]].classList.contains("o")
    ) {
      items[win[i][0]].classList.add("winColor");
      items[win[i][1]].classList.add("winColor");
      items[win[i][2]].classList.add("winColor");

      winner = "o";
      endGame(winner);
      return 1;
    }
  }
};

const crossWin = () => {
  for (let i = 0; i < win.length; i++) {
    if (
      items[win[i][0]].classList.contains("x") &&
      items[win[i][1]].classList.contains("x") &&
      items[win[i][2]].classList.contains("x")
    ) {
      items[win[i][0]].classList.add("winColor");
      items[win[i][1]].classList.add("winColor");
      items[win[i][2]].classList.add("winColor");

      winner = "x";
      endGame(winner);
      return 1;
    }
  }
};

const draw = () => {
  if (!crossWin() && !circleWin() && counter >= 9) {
    winner = "Draw";
    endGame(winner);
  }
};

const endGame = (winner) => {
  area.style.pointerEvents = "none";
  gameOver.style.display = "block";
  spanWinner.innerText = winner;
};

const resetGame = () => {
  items.forEach((item) => {
    item.classList.remove("o", "x", "winColor");
    item.innerText = "";
  });

  counter = 0;
  step = "";
  gameOver.style.display = "none";
  area.style.pointerEvents = "auto";
  who();
};

newGame.addEventListener("click", () => {
  resetGame();
});
