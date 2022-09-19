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
const maxCapacity = 10;
const costRegular = 5.5;
const costMedium = costRegular + 1;
const costLarge = costRegular + 2;
const costShipping = 5;
let costTotal = 0;

let orderRows = "";
let coffeeOptions = "";
COFFEE.forEach(createCoffeeOption);

// Formatter for converting numbers to dollars in the US format
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
  orderTotal = `<th scope="row" class="fw-bold">Total</th>
      <td></td><td></td>
      <td class="text-end" id="costTotal">
        ${currency.format(costTotal)}
      </td>
    </tr>`;
  for (let i = 0; i < maxCapacity; i++) {
    createCoffeeRow(i);
  }
  orderTable = orderRows + orderTotal;
  orderBody.innerHTML = orderTable;
  for (let i = 0; i < maxCapacity; i++) {
    updateCoffee(i);
  }
  showPage(orderMenu);
}

function createCoffeeRow(index) {
  orderRows += `<tr>
      <th scope="row" class="fw-normal">${index + 1}.</th>
      <td>
        <select
          onchange="updateCoffee(${index})"
          class="form-select"
          name="coffeeDropdown"
          id="coffeeDropdown${index}"
        >
          <option value="none" selected>None</option>
          ${coffeeOptions}
        </select>
      </td>
      <td>
        <select
          onchange="updateCost(${index})"
          class="form-select"
          name="sizeDropdown"
          id="sizeDropdown${index}"
          disabled
        >
          <option value="${costRegular}">Regular</option>
          <option value="${costMedium}">Medium</option>
          <option value="${costLarge}">Large</option>
        </select>
      </td>
      <td class="text-end" id="cost-${index}">
        ${currency.format(0)}
      </td>
    </tr>`;
}

function createCoffeeOption(name, index) {
  // .replace(/\s+/g, "") will remove all whitespaces in the string
  coffeeOptions += `<option value="coffee${index}">${name}
                    </option>`;
}

function updateCoffee(index) {
  let coffeeElement = document.getElementById(`coffeeDropdown${index}`);
  let sizeElement = document.getElementById(`sizeDropdown${index}`);
  if (coffeeElement.value != "none") {
    sizeElement.disabled = false;
    sizeElement.classList.add("bg-danger");
  } else {
    sizeElement.value = "";
    sizeElement.classList.remove("bg-danger");
    sizeElement.disabled = true;
  }
  updateCost(index);
}

function updateCost(index) {
  let coffeeElement = document.getElementById(`coffeeDropdown${index}`);
  let sizeElement = document.getElementById(`sizeDropdown${index}`);
  let costElement = document.getElementById(`cost-${index}`);
  let costTotalElement = document.getElementById("costTotal");
  let cost = 0;
  if (sizeElement.value != "") {
    sizeElement.classList.remove("bg-danger");
  }
  // Run if the user has selected a coffee
  if (coffeeElement.value != "none") {
    // Get the cost of the new size selected
    cost = document.getElementById(`sizeDropdown${index}`).value;
  }
  // Inject new cost into the element
  costElement.innerHTML = `${currency.format(cost)}`;
  // Update total cost
  let costElements = document.querySelectorAll(`td[id^="cost-"]`);
  costTotal = 0;
  costElements.forEach(
    (element) =>
      (costTotal += Number(element.textContent.replace(/[^0-9\.]+/g, "")))
  );
  costTotalElement.innerHTML = currency.format(costTotal);
}

function updateTransport(transportSelect) {
  let deliveryElement = document.getElementById("deliveryInfo");
  if (transportSelect.value == "delivery") {
    deliveryElement.classList.remove("d-none");
  } else {
    deliveryElement.classList.add("d-none");
  }
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
  output.classList.remove("alert-danger");
  output.classList.remove("alert-success");
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
