const colorDivs = document.querySelectorAll('.color');
const generateBtn = document.querySelector('.generate');
const sliders = document.querySelectorAll('input[type="range"]');
const currentHexs = document.querySelectorAll('.color h2');
const adjustButtons = document.querySelectorAll('.adjust');
const closeAdjustments = document.querySelectorAll('.close-adjustment');
const sliderContainers = document.querySelectorAll('.sliders');

let initialColors;

// Add event listener
sliders.forEach((slider) => {
  slider.addEventListener('input', hslControls);
});
colorDivs.forEach((div, index) => {
  div.addEventListener('change', () => {
    updateTextUI(index);
  });
});
currentHexs.forEach((hex) => {
  hex.addEventListener('click', () => {
    copyToClipboard(hex);
  });
});
adjustButtons.forEach((button, index) => {
  button.addEventListener('click', () => {
    openAdjustmentPanel(index);
  });
});
closeAdjustments.forEach((button, index) => {
  button.addEventListener('click', () => {
    closeAdjustmentPanel(index);
  });
});

function generateHex() {
  const hexColor = chroma.random().toString().toUpperCase();
  return hexColor;
}

function randomColors() {
  initialColors = [];

  colorDivs.forEach((colorDiv, index) => {
    const randomColor = generateHex();

    initialColors.push(chroma(randomColor).hex().toUpperCase());

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

  // Reset Inputs
  resetInputs();
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

function hslControls(e) {
  const index =
    e.target.getAttribute('data-bright') ||
    e.target.getAttribute('data-sat') ||
    e.target.getAttribute('data-hue');

  let sliders = e.target.parentElement.querySelectorAll('input[type="range"]');
  const hue = sliders[0];
  const brightness = sliders[1];
  const saturation = sliders[2];

  const bgColor = initialColors[index];

  let color = chroma(bgColor)
    .set('hsl.s', saturation.value)
    .set('hsl.l', brightness.value)
    .set('hsl.h', hue.value);

  colorDivs[index].style.backgroundColor = color;

  colorizeSliders(color, hue, brightness, saturation);
}

function updateTextUI(index) {
  const activeDiv = colorDivs[index];
  const color = chroma(activeDiv.style.backgroundColor);
  const textHex = activeDiv.querySelector('h2');
  textHex.innerText = color.hex().toUpperCase();
  checkTextColor(color, textHex);

  const icons = activeDiv.querySelectorAll('.controls button');
  icons.forEach((icon) => checkTextColor(color, icon));
}

function resetInputs() {
  sliders.forEach((slider) => {
    if (slider.name === 'hue') {
      const color = initialColors[slider.dataset.hue];
      const hueValue = chroma(color).hsl()[0];
      slider.value = Math.floor(hueValue);
    } else if (slider.name === 'saturation') {
      const color = initialColors[slider.dataset.sat];
      const satValue = chroma(color).hsl()[1];
      slider.value = Math.floor(satValue * 100) / 100;
    } else if (slider.name === 'brightness') {
      const color = initialColors[slider.dataset.bright];
      const brightValue = chroma(color).hsl()[2];
      slider.value = Math.floor(brightValue * 100) / 100;
    } else {
    }
  });
}

function copyToClipboard(hex) {
  const el = document.createElement('textarea');
  el.value = hex.innerText;
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);

  // Popup Animation
  const popup = document.querySelector('.copy-container');
  const popupBox = popup.children[0];

  popup.addEventListener('transitionend', () => {
    popup.classList.remove('active');
    popupBox.classList.remove('active');
  });

  popup.classList.add('active');
  popupBox.classList.add('active');
}

function openAdjustmentPanel(index) {
  sliderContainers[index].classList.toggle('active');
}
function closeAdjustmentPanel(index) {
  sliderContainers[index].classList.remove('active');
}

randomColors();
