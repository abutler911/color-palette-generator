window.onload = () => {
  form.elements.query.value = "";
};

const form = document.querySelector("#form");
form.addEventListener("submit", submitForm);

function submitForm(e) {
  e.preventDefault();
  const query = form.elements.query.value;

  const instructions = document.querySelector("#instructions");
  const clickInstructions = document.querySelector("#click-instructions");
  instructions.style.display = "none";
  clickInstructions.style.display = "block";

  sendPostRequest(query).then(displayColors);
  form.elements.query.value = "";
}

function sendPostRequest(query) {
  return fetch("/palette", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ query }),
  }).then((response) => response.json());
}

function displayColors(data) {
  const colors = data.colors;
  const container = document.querySelector(".container");
  container.innerHTML = "";
  colors.forEach((color) => createColorBlock(color, container, colors.length));
}

function createColorBlock(color, container, colorCount) {
  const div = document.createElement("div");
  div.classList.add("color");
  div.style.backgroundColor = color;
  div.style.width = `calc(100%/ ${colorCount})`;
  div.addEventListener("click", () => navigator.clipboard.writeText(color));
  const span = document.createElement("span");
  span.innerText = color;
  div.appendChild(span);
  container.appendChild(div);

  updateTextColor(div);
}

function updateTextColor(element) {
  const color = window.getComputedStyle(element).backgroundColor;
  const rgb = color.match(/(\d+)/g);

  // calculate luminance
  const luminance = (0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2]) / 255;

  if (luminance <= 0.5) {
    element.childNodes[0].style.color = "white";
  } else {
    element.childNodes[0].style.color = "black";
  }
}
