const COFFEES = [
  "Cappuccino",
  "Flat White",
  "Hot Mocha",
  "Cafe Latte",
  "Macchiato",
  "White Chocolate Mocha",
  "Chai Latte",
  "Vanilla Latte",
  "Long Black",
  "Caramel Latte",
  "Short Black",
  "Piccolo Latte",
];
const costRegular = 5.5;
const costMedium = costRegular + 1;
const costLarge = costRegular + 2;
const costShipping = 5;

let coffeeRows = "";

orderForm.addEventListener("submit", function (e) {
  e.preventDefault();
  resetOutput();
});

function newOrder() {
  let orderBody = document.getElementById("orderBody");
  coffeeRows = "";
  COFFEES.forEach(createCoffeeRow);
  orderBody.innerHTML = coffeeRows;
  showPage(orderMenu);
}

function createCoffeeRow(name, index) {
  coffeeRows += `<tr>
      <th scope="row" class="fw-normal">${index + 1}.</th>
      <td><b>${name}</b></td>
      <td>Regular</td>
      <td><input type="number" name="c${index}" id="input-${index}" /></td>
    </tr>`;
}

function checkEmpty(userInput) {
  // Check if input is empty
  if (userInput == "") {
    alert("red", "Please answer all questions before submitting.");
    return false;
  } else {
    return userInput;
  }
}

function showPage(page) {
  let mainMenu = document.getElementById("mainMenu");
  let orderMenu = document.getElementById("orderMenu");
  resetOutput();
  mainMenu.classList.add("d-none");
  orderMenu.classList.add("d-none");
  page.classList.remove("d-none");
  page.classList.add("d-block");
}

function resetOutput() {
  output.classList.add("d-none");
  output.innerHTML = "";
}

function alert(colour, message) {
  if (colour == "red") {
    output.classList.add("alert-danger");
  } else if (colour == "green") {
    output.classList.add("alert-success");
  }
  output.innerHTML = message;
  output.classList.remove("d-none");
}
