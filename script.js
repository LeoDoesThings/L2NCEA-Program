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
let delivery = false;

let customerInfo = [];
let order = [];
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

  let customerInputs = document.querySelectorAll(`input[id^="customer"]`);
  customerInputs.forEach(function (input) {
    input = input.value;
    if (checkEmpty(input)) {
      customerInfo.push(input.value);
    } else {
      alert("red", "Please enter all customer information");
      return;
    }
  });

  for (let i = 0; i < COFFEE.length; i++) {
    order.push([0, 0, 0]);
  }

  let coffeeTypes = document.querySelectorAll(`select[id^="coffeeDropdown"]`);
  let coffeeSizes = document.querySelectorAll(`select[id^="sizeDropdown"]`);

  for (let i = 0; i < coffeeTypes.length; i++) {
    let ct = coffeeTypes[i].value;
    let cs = coffeeSizes[i].value;
    let sizeID = 0;

    if (cs == "medium") sizeID = 1;
    else if (cs == "large") sizeID = 2;

    if (!isNaN(ct)) {
      order[ct][sizeID] += 1;
    }
  }
});

function newOrder() {
  let orderBody = document.getElementById("orderBody");
  let pricesElement = document.getElementById("prices");
  // Reset variables
  order = [];
  delivery = false;
  orderRows = "";
  // Inject information onto page
  pricesElement.innerHTML = `
    Regular - ${currency.format(costRegular)}<br>
    Medium - ${currency.format(costMedium)}<br>
    Large - ${currency.format(costLarge)}`;
  orderShipping = `
    <tr id="rowDelivery" class="d-none">
    <th scope="row" class="fw-bold">Delivery</th>
      <td></td><td></td>
      <td class="text-end" id="costShipping">
        ${currency.format(costShipping)}
      </td>
    </tr>`;
  orderTotal = `
    <tr>
      <th scope="row" class="fw-bold">Total</th>
      <td></td><td></td>
      <td class="text-end" id="costTotal">
        ${currency.format(costTotal)}
      </td>
    </tr>`;
  for (let i = 0; i < maxCapacity; i++) {
    createCoffeeRow(i);
  }
  orderTable = orderRows + orderShipping + orderTotal;
  orderBody.innerHTML = orderTable;
  for (let i = 0; i < maxCapacity; i++) {
    updateCoffee(i);
  }
  showPage(orderMenu);
}

function createCoffeeRow(index) {
  orderRows += `
    <tr>
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
          <option value="regular">Regular</option>
          <option value="medium">Medium</option>
          <option value="large">Large</option>
        </select>
      </td>
      <td class="text-end" id="cost-${index}">
        ${currency.format(0)}
      </td>
    </tr>`;
}

function createCoffeeOption(name, index) {
  // .replace(/\s+/g, "") will remove all whitespaces in the string
  coffeeOptions += `<option value="${index}">${name}
                    </option>`;
}

function updateCoffee(index) {
  let coffeeElement = document.getElementById(`coffeeDropdown${index}`);
  let sizeElement = document.getElementById(`sizeDropdown${index}`);
  // If a coffee is selected, inform the user of the empty size
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
  let cost = 0;
  if (sizeElement.value != "") {
    sizeElement.classList.remove("bg-danger");
  }
  // Run if the user has selected a coffee
  if (coffeeElement.value != "none") {
    // Get the cost of the new size selected
    size = document.getElementById(`sizeDropdown${index}`).value;
    if (size == "medium") cost = costMedium;
    else if (size == "large") cost = costLarge;
    else cost = costRegular;
  }
  // Inject new cost into the element
  costElement.innerHTML = `${currency.format(cost)}`;
  updateTotal();
}

function updateTotal() {
  let costTotalElement = document.getElementById("costTotal");
  let costElements = document.querySelectorAll(`td[id^="cost-"]`);
  costTotal = 0;
  costElements.forEach(
    (element) =>
      (costTotal += Number(element.textContent.replace(/[^0-9\.]+/g, "")))
  );
  if (delivery == true) costTotal += costShipping;
  costTotalElement.innerHTML = currency.format(costTotal);
}

function updateTransport(transportSelect) {
  let deliveryElement = document.getElementById("deliveryInfo");
  let deliveryRow = document.getElementById("rowDelivery");
  if (transportSelect.value == "delivery") {
    delivery = true;
    deliveryElement.innerHTML = `
      <div class="input-group mb-2">
        <span class="input-group-text" for="customerAddress"
          >Delivery Address</span
        >
        <input type="text" class="form-control" id="customerAddress" />
      </div>
      <div class="input-group mb-2">
        <span class="input-group-text" for="customerPhone"
          >Phone Number</span
        >
        <input type="tel" class="form-control" id="customerPhone" />
      </div>`;
    deliveryRow.classList.remove("d-none");
  } else {
    delivery = false;
    deliveryElement.innerHTML = "";
    deliveryRow.classList.add("d-none");
  }
  updateTotal();
}

function checkEmpty(userInput) {
  // Check if input is empty
  if (userInput == "") {
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
  output.innerHTML = "";
}

function alert(colour, message) {
  let bg;
  if (colour == "red") {
    bg = "text-bg-danger";
  } else if (colour == "green") {
    bg = "text-bg-success";
  }
  output.innerHTML = `
    <div id="liveToast" class="toast align-items-center border-0 ${bg}" role="alert" aria-live="assertive" aria-atomic="true">
      <div class="d-flex">
        <div class="toast-body fw-bold">
          ${message}
        </div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
    </div>`;
  const toast = new bootstrap.Toast(document.getElementById("liveToast"));
  toast.show();
}
