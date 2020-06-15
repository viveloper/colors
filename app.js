const colorDivs = document.querySelectorAll('.color');
const generateBtn = document.querySelector('.generate');
const sliders = document.querySelectorAll('input[type="range"]');
const currentHexs = document.querySelectorAll('.color h2');

function generateHex() {
  const hexColor = chroma.random().toString().toUpperCase();
  return hexColor;
}

function randomColors() {
  colorDivs.forEach((colorDiv, index) => {
    const randomColor = generateHex();
    const hexText = colorDiv.children[0];

    // Add the color to background
    colorDiv.style.background = randomColor;
    hexText.innerText = randomColor;

    // Check for hex text color
    checkTextColor(randomColor, hexText);

    // Initial colorize sliders
    const color = chroma(randomColor);
    const sliders = colorDiv.querySelectorAll('.sliders input');
    const hue = sliders[0];
    const brightness = sliders[1];
    const saturation = sliders[2];
    colorizeSliders(color, hue, brightness, saturation);
  });
}

function checkTextColor(color, textEl) {
  const luminance = chroma(color).luminance();
  textEl.style.color = luminance > 0.5 ? 'black' : 'white';
}

function colorizeSliders(color, hue, brightness, saturation) {
  //Scale Saturation
  const noSat = color.set('hsl.s', 0);
  const fullSat = color.set('hsl.s', 1);
  const scaleSat = chroma.scale([noSat, color, fullSat]);
  //Scale Brightness
  const midBright = color.set('hsl.l', 0.5);
  const scaleBright = chroma.scale(['black', midBright, 'white']);

  //Update Input Colors
  saturation.style.backgroundImage = `linear-gradient(to right,${scaleSat(
    0
  )}, ${scaleSat(1)})`;
  brightness.style.backgroundImage = `linear-gradient(to right,${scaleBright(
    0
  )},${scaleBright(0.5)} ,${scaleBright(1)})`;
  hue.style.backgroundImage = `linear-gradient(to right, rgb(204,75,75),rgb(204,204,75),rgb(75,204,75),rgb(75,204,204),rgb(75,75,204),rgb(204,75,204),rgb(204,75,75))`;
}

randomColors();
