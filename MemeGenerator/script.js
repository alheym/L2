const imageInput = document.getElementById("imageInput");
const canvas = document.getElementById("canvas");
const topText = document.getElementById("topText");
const bottomText = document.getElementById("bottomText");
const textX = document.getElementById("textX");
const textY = document.getElementById("textY");
const generateButton = document.getElementById("generateButton");
const downloadLink = document.getElementById("downloadLink");
const ctx = canvas.getContext("2d");
let image;

imageInput.addEventListener("change", function () {
  image = new Image();
  image.src = URL.createObjectURL(imageInput.files[0]);
  image.onload = function () {
    let width = image.width;
    let height = image.height;

    if (width > 500 || height > 500) {
      if (width > height) {
        height = (500 / width) * height;
        width = 500;
      } else {
        width = (500 / height) * width;
        height = 500;
      }
    }

    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(image, 0, 0, width, height);
  };
});

function drawText() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

  ctx.font = "36px Impact";
  ctx.fillStyle = "white";
  ctx.strokeStyle = "black";
  ctx.lineWidth = 2;
  ctx.textAlign = "left";

  const textXValue = parseInt(textX.value);
  const textYValue = parseInt(textY.value);

  ctx.fillText(topText.value, textXValue, textYValue);
  ctx.fillText(bottomText.value, textXValue, textYValue + 40);
}

generateButton.addEventListener("click", function () {
  drawText();

  const downloadDataUrl = canvas.toDataURL("image/png");
  downloadLink.href = downloadDataUrl;
  downloadLink.style.display = "block";
});

topText.addEventListener("input", drawText);
bottomText.addEventListener("input", drawText);
textX.addEventListener("input", drawText);
textY.addEventListener("input", drawText);
