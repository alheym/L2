export default class View {
  static colors = {
    1: "cyan",
    2: "blue",
    3: "green",
    4: "yellow",
    5: "blue",
    6: "purple",
    7: "red",
  };

  constructor(element, width, height, rows, columns) {
    this.element = element;
    this.width = width;
    this.height = height;

    this.canvas = document.createElement("canvas");
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.context = this.canvas.getContext("2d");

    this.playfiedBorderWidth = 2;
    this.playfiedX = this.playfiedBorderWidth;
    this.playfiedY = this.playfiedBorderWidth;
    this.playfiedWidth = (this.width * 2) / 3;
    this.playfiedHeight = this.height;
    this.playfiedInnerWidth = this.playfiedWidth - this.playfiedBorderWidth * 2;
    this.playfiedInnerHeight =
      this.playfiedHeight - this.playfiedBorderWidth * 2;

    this.blockWidth = this.playfiedInnerWidth / columns;
    this.blockHeight = this.playfiedInnerHeight / rows;

    this.panelX = this.playfiedWidth + 20;
    this.panelY = 0;
    this.panelWidth = this.width / 3;
    this.panelHeight = this.height;

    this.element.appendChild(this.canvas);
  }

  renderMainScreen(state) {
    this.clearScreen();

    this.renderPlayfield(state);

    this.renderPanel(state);
  }

  renderStartScreen() {
    this.context.fillStyle = "white";
    this.context.font = '18px "Press Start 2P"';
    this.context.textAlign = "center";
    this.context.textBaseline = "middle";
    this.context.fillText(
      "Press ENTER to Start",
      this.width / 2,
      this.height / 2
    );
  }

  renderPauseScreen() {
    this.context.fillStyle = "rgba(0, 0, 0, 0.75)";
    this.context.fillRect(0, 0, this.width, this.height);

    this.context.fillStyle = "white";
    this.context.font = '18px "Press Start 2P"';
    this.context.textAlign = "center";
    this.context.textBaseline = "middle";
    this.context.fillText(
      "Press ENTER to Resume",
      this.width / 2,
      this.height / 2
    );
  }

  renderEndScreen({ score }) {
    this.clearScreen();
    this.context.fillStyle = "rgba(0, 0, 0, 0.75)";
    this.context.fillRect(0, 0, this.width, this.height);

    this.context.fillStyle = "white";
    this.context.font = '18px "Press Start 2P"';
    this.context.textAlign = "center";
    this.context.textBaseline = "middle";
    this.context.fillText("GAME OVER", this.width / 2, this.height / 2 - 48);
    this.context.fillText(`Score: ${score}`, this.width / 2, this.height / 2);
    this.context.fillText(
      "Press ENTER to Restart",
      this.width / 2,
      this.height / 2 + 48
    );
  }

  clearScreen() {
    this.context.clearRect(0, 0, this.width, this.height);
  }

  renderPlayfield({ playfied }) {
    for (let y = 0; y < playfied.length; y++) {
      const line = playfied[y];

      for (let x = 0; x < line.length; x++) {
        const block = line[x];

        if (block) {
          this.renderBlock(
            this.playfiedX + x * this.blockWidth,
            this.playfiedY + y * this.blockHeight,
            this.blockWidth,
            this.blockHeight,
            View.colors[block]
          );
        }
      }
    }

    this.context.strokeStyle = "white";
    this.context.lineWidth = this.playfiedBorderWidth;
    this.context.strokeRect(0, 0, this.playfiedWidth, this.playfiedHeight);
  }

  renderPanel({ lvl, score, nextPiece, lines }) {
    this.context.textAlign = "start";
    this.context.textBaseline = "top";
    this.context.fillStyle = "white";
    this.context.font = '14px "Press Start 2P"';

    this.context.fillText(`Score: ${score}`, this.panelX, this.panelY + 0);
    this.context.fillText(`Lines: ${lines}`, this.panelX, this.panelY + 24);
    this.context.fillText(`Level: ${lvl}`, this.panelX, this.panelY + 48);
    this.context.fillText("Next:", this.panelX, this.panelY + 96);

    for (let y = 0; y < nextPiece.block.length; y++) {
      for (let x = 0; x < nextPiece.block[y].length; x++) {
        const block = nextPiece.block[y][x];

        if (block) {
          this.renderBlock(
            this.panelX + x * this.blockWidth,
            this.panelY + 100 + y * this.blockHeight,
            this.blockWidth,
            this.blockHeight,
            View.colors[block]
          );
        }
      }
    }
  }

  renderBlock(x, y, width, height, color) {
    this.context.fillStyle = color;
    this.context.strokeStyle = "#ebebeb";
    this.context.lineWidth = 2;

    this.context.fillRect(x, y, width, height);
    this.context.strokeRect(x, y, width, height);
  }
}
