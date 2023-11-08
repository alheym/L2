export default class Game {
  static points = {
    1: 40,
    2: 100,
    3: 300,
    4: 1200,
  };

  constructor() {
    this.reset();
  }

  get lvl() {
    return Math.floor(this.lines * 0.1);
  }

  reset() {
    this.score = 0;
    this.lines = 0;
    this.topOut = false;
    this.playfied = this.createPlayfield();
    this.activePiece = this.createPiece();
    this.nextPiece = this.createPiece();
  }

  getState() {
    const playfied = this.createPlayfield();
    const { y: pieceY, x: pieceX, block } = this.activePiece;

    for (let y = 0; y < this.playfied.length; y++) {
      playfied[y] = [];
      for (let x = 0; x < this.playfied[y].length; x++) {
        playfied[y][x] = this.playfied[y][x];
      }
    }

    for (let y = 0; y < block.length; y++) {
      for (let x = 0; x < block[y].length; x++) {
        if (block[y][x]) {
          playfied[pieceY + y][pieceX + x] = block[y][x];
        }
      }
    }

    return {
      lvl: this.lvl,
      lines: this.lines,
      score: this.score,
      nextPiece: this.nextPiece,
      isGameOver: this.topOut,
      playfied,
    };
  }

  createPlayfield() {
    const playfied = [];
    for (let y = 0; y < 20; y++) {
      playfied[y] = [];
      for (let x = 0; x < 10; x++) {
        playfied[y][x] = 0;
      }
    }
    return playfied;
  }

  createPiece() {
    const index = Math.floor(Math.random() * 7);
    const type = "IJLOSTZ"[index];
    const piece = {};

    switch (type) {
      case "I":
        piece.block = [
          [0, 0, 0, 0],
          [1, 1, 1, 1],
          [0, 0, 0, 0],
          [0, 0, 0, 0],
        ];
        break;
      case "J":
        piece.block = [
          [0, 0, 0],
          [2, 2, 2],
          [0, 0, 2],
        ];
        break;

      case "L":
        piece.block = [
          [0, 0, 0],
          [3, 3, 3],
          [3, 0, 0],
        ];
        break;

      case "O":
        piece.block = [
          [0, 0, 0, 0],
          [0, 4, 4, 0],
          [0, 4, 4, 0],
          [0, 0, 0, 0],
        ];
        break;

      case "S":
        piece.block = [
          [0, 0, 0],
          [5, 5, 5],
          [5, 0, 0],
        ];
        break;

      case "T":
        piece.block = [
          [0, 0, 0],
          [6, 6, 6],
          [0, 6, 0],
        ];
        break;

      case "Z":
        piece.block = [
          [0, 0, 0],
          [7, 7, 0],
          [0, 7, 7],
        ];
        break;

      default:
        throw new Error("Неизвестный тип фигуры");
    }

    piece.x = Math.floor((10 - piece.block[0].length) / 2);
    piece.y = -1;

    return piece;
  }

  movePieceLeft() {
    this.activePiece.x -= 1;

    if (this.hasCollision()) {
      this.activePiece.x += 1;
    }
  }

  movePieceRight() {
    this.activePiece.x += 1;
    if (this.hasCollision()) {
      this.activePiece.x -= 1;
    }
  }

  movePieceDown() {
    if (this.topOut) return;

    this.activePiece.y += 1;

    if (this.hasCollision()) {
      this.activePiece.y -= 1;
      this.lockPiece();
      const clearedLines = this.clearLines();
      this.updateScore(clearedLines);
      this.updatePieces();
    }

    if (this.hasCollision()) {
      this.topOut = true;
    }
  }

  hasCollision() {
    const playfied = this.playfied;
    const { y: pieceY, x: pieceX, block } = this.activePiece;

    for (let y = 0; y < block.length; y++) {
      for (let x = 0; x < block[y].length; x++) {
        if (
          block[y][x] &&
          (playfied[pieceY + y] === undefined ||
            playfied[pieceY + y][pieceX + x] === undefined ||
            playfied[pieceY + y][pieceX + x])
        ) {
          return true;
        }
      }
    }

    return false;
  }

  lockPiece() {
    const { y: pieceY, x: pieceX, block } = this.activePiece;

    for (let y = 0; y < block.length; y++) {
      for (let x = 0; x < block[y].length; x++) {
        if (block[y][x]) {
          this.playfied[pieceY + y][pieceX + x] = block[y][x];
        }
      }
    }
  }

  clearLines() {
    const row = 20;
    const columns = 10;
    let lines = [];
    for (let y = row - 1; y >= 0; y--) {
      let numberOfBlocks = 0;
      for (let x = 0; x < columns; x++) {
        if (this.playfied[y][x]) {
          numberOfBlocks += 1;
        }
      }
      if (numberOfBlocks === 0) {
        break;
      } else if (numberOfBlocks < columns) {
        continue;
      } else if (numberOfBlocks === columns) {
        lines.unshift(y);
      }
    }

    for (let index of lines) {
      this.playfied.splice(index, 1);
      this.playfied.unshift(new Array(columns).fill(0));
    }

    return lines.length;
  }

  rotatePiece() {
    this.rotateBlock();

    if (this.hasCollision()) {
      this.rotateBlock(false);
    }
  }

  rotateBlock(clockwise = true) {
    const block = this.activePiece.block;
    const length = block.length;
    const x = Math.floor(length / 2);
    const y = length - 1;

    for (let i = 0; i < x; i++) {
      for (let j = i; j < y - i; j++) {
        const temp = block[i][j];

        if (clockwise) {
          block[i][j] = block[y - j][i];
          block[y - j][i] = block[y - i][y - j];
          block[y - i][y - j] = block[j][y - i];
          block[j][y - i] = temp;
        } else {
          block[i][j] = block[j][y - i];
          block[j][y - i] = block[y - i][y - j];
          block[y - i][y - j] = block[y - j][i];
          block[y - j][i] = temp;
        }
      }
    }
  }

  updateScore(clearedLines) {
    if (clearedLines > 0) {
      this.score += Game.points[clearedLines] * (this.lvl + 1);
      this.lines += clearedLines;
    }
  }

  updatePieces() {
    this.activePiece = this.nextPiece;
    this.nextPiece = this.createPiece();
  }
}
