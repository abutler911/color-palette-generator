const form = document.querySelector("#form");
form.addEventListener("submit", submitForm);

function submitForm(e) {
  e.preventDefault();
  const query = form.elements.query.value;
  sendPostRequest(query).then(displayColors);
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
}
