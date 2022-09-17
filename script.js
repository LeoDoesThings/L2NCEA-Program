const COFFEE = [
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

let orders = {};
let orderRows = "";
let coffeeOptions = "";
COFFEE.forEach((name) => generateCoffeeOption(name));

// Number formatter for converting to dollars in the US format
var currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

orderForm.addEventListener("submit", function (e) {
  e.preventDefault();
  resetOutput();
});

function newOrder() {
  let orderBody = document.getElementById("orderBody");
  orderRows = "";
  for (let i = 0; i < 10; i++) {
    createCoffeeRow(COFFEE[i], i);
  }
  orderBody.innerHTML = orderRows;
  showPage(orderMenu);
}

function createCoffeeRow(name, index) {
  orderRows += `<tr>
      <th scope="row" class="fw-normal">${index + 1}.</th>
      <td>
        <select
          class="form-select"
          name="coffeeDropdown"
          id="coffeeDropdown${index}"
        >
          <option selected>None</option>
          ${coffeeOptions}
        </select>
      </td>
      <td>
        <select
          onchange="updateCost(${index})"
          class="form-select"
          name="sizeDropdown"
          id="sizeDropdown${index}"
        >
          <option value="${costRegular}">Regular</option>
          <option value="${costMedium}">Medium</option>
          <option value="${costLarge}">Large</option>
        </select>
      </td>
      <td class="text-end" id="cost${index}">
        ${currency.format(0)}
      </td>
    </tr>`;
}

function generateCoffeeOption(name) {
  // .replace(/\s+/g, "") will remove all whitespaces in the string
  coffeeOptions += `<option value="${name.replace(/\s+/g, "")}">${name}
                    </option>`;
}

function updateCost(index) {
  let costElement = document.getElementById(`cost${index}`);
  // Use parseFloat to convert string to number and round to 2dp
  let cost = document.getElementById(`sizeDropdown${index}`).value;
  costElement.innerHTML = `${currency.format(cost)}`;
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
