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
let isDelivery = false;
let remainingCapacity = maxCapacity;

let customerInfo = [];
let order = [];
let invoiceRows = "";
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
  let run;
  let customerInputs = document.querySelectorAll(`input[id^="customer"]`);
  customerInputs.forEach(function (input) {
    input = input.value;
    if (isEmpty(input)) {
      alert("red", "Please enter all customer information");
      run = false;
    } else {
      customerInfo.push(input.value);
    }
  });

  if (run == false) {
    return;
  }

  order = [];
  for (let i = 0; i < COFFEE.length; i++) {
    order.push([0, 0, 0]);
  }

  let coffeeTypes = document.querySelectorAll(`select[id^="coffeeDropdown"]`);
  let coffeeSizes = document.querySelectorAll(`select[id^="sizeDropdown"]`);

  for (let i = 0; i < coffeeTypes.length; i++) {
    let cType = coffeeTypes[i].value;
    let cSize = coffeeSizes[i].value;
    let sizeID = 0;

    if (cSize == "medium") sizeID = 1;
    else if (cSize == "large") sizeID = 2;

    if (!isNaN(cType)) {
      order[cType][sizeID] += 1;
    }
  }

  orderSum = order.flat().reduce((a, b) => a + b, 0);

  if (orderSum == 0) {
    alert("red", "Please add at least 1 coffee to the order");
  } else {
    readOrder(order, true);
    showPage(orderInvoice);
  }

  console.log(order);
});

function newOrder() {
  let orderBody = document.getElementById("orderBody");
  let pricesElement = document.getElementById("prices");
  let bulkCoffeeSelect = document.getElementById("bulkCoffeeSelect");
  // Reset variables
  isDelivery = false;
  orderRows = "";
  bulkCoffeeSelect.innerHTML = "";
  // Inject information onto page
  pricesElement.innerHTML = `
    Regular - ${currency.format(costRegular)}<br>
    Medium - ${currency.format(costMedium)}<br>
    Large - ${currency.format(costLarge)}`;
  // Set HTML rows for costs
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
  // Create the maximum amount of input rows
  for (let i = 0; i < maxCapacity; i++) {
    createCoffeeRow(i);
  }
  // Inject HTML into the page
  orderTable = orderRows + orderShipping + orderTotal;
  orderBody.innerHTML = orderTable;
  // Clear all automatic selections from browser
  for (let i = 0; i < maxCapacity; i++) {
    updateCoffee(i);
  }
  // Inject HTML and show the page
  bulkCoffeeSelect.innerHTML = coffeeOptions;
  showPage(orderMenu);
}

function createCoffeeRow(index) {
  // Create a row of inputs with IDs depending on index number
  orderRows += `
    <tr id="coffeeRow${index}">
      <th scope="row" class="fw-normal">${index + 1}.</th>
      <td>
        <select
          onchange="updateCoffee(${index})"
          class="form-select"
          name="coffeeDropdown${index}"
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
          name="sizeDropdown${index}"
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
  coffeeOptions += `<option value="${index}">${name}
                    </option>`;
}

function updateCoffee(index) {
  let coffeeElement = document.getElementById(`coffeeDropdown${index}`);
  let sizeElement = document.getElementById(`sizeDropdown${index}`);
  // If a coffee is selected, indicate empty input for size by setting a red background
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
  // If a size is inputted then remove indicator of empty input
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
  if (isDelivery == true) costTotal += costShipping;
  costTotalElement.innerHTML = currency.format(costTotal);
}

function updateTransport(transportSelect) {
  let deliveryElement = document.getElementById("deliveryInfo");
  let deliveryRow = document.getElementById("rowDelivery");
  if (transportSelect.value == "delivery") {
    // If order is delivery then show inputs for delivery information
    isDelivery = true;
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
    // If order is not delivery then do not show inputs for delivery information
    isDelivery = false;
    deliveryElement.innerHTML = "";
    deliveryRow.classList.add("d-none");
  }
  // Add or remove the delivery fee depending on the value of `isDelivery`
  updateTotal();
}

// This function is run when the user changes item
function updateBulkName(bulkSelect) {
  // Update the item name when user changes item
  let bulkCoffeeName = document.getElementById("bulkCoffeeName");
  bulkCoffeeName.innerHTML = COFFEE[bulkSelect.value];
}

function verifyAmount(input) {
  if (input.value < 1) {
    // If user inputs an amount smaller than 1 then reset amount to 1
    input.value = 1;
    alert("red", "You must add at least 1 item");
  } else if (input.value > remainingCapacity) {
    // If user inputs an amount larger than remaining capacity then reset amount to remaining capacity
    input.value = remainingCapacity;
    alert("red", `The remaining capacity is ${remainingCapacity} items`);
  }
}

function bulkAdd() {
  // Do not run if there is no capacity remaining
  if (remainingCapacity <= 0) {
    alert("red", "No capacity remaining. No items added.");
    return;
  }
  let amount = document.getElementById("bulkAddAmount").value;
  // Do not run if an amount was not specified
  if (amount == "") {
    alert("red", "No amount entered. Added 0 items.");
    return;
  }
  // Do not run if no item was specified
  let coffeeSelect = document.getElementById("bulkCoffeeSelect").value;
  if (coffeeSelect == "") {
    alert("red", "Select a coffee to add");
    return;
  }
  // Get HTML elements
  let size = document.getElementById("bulkAddSize").value;
  let formCoffees = document.querySelectorAll("select[id^='coffeeDropdown']");
  let formSizes = document.querySelectorAll("select[id^='sizeDropdown']");
  let formCoffeesEmpty = [];
  let formSizesEmpty = [];
  // Store all empty coffee and size inputs from main form in respective arrays
  formCoffees.forEach(function (coffeeElement) {
    if (coffeeElement.value == "none") {
      formCoffeesEmpty.push(coffeeElement);
    }
  });
  formSizes.forEach(function (sizeElement) {
    if (sizeElement.value == "") {
      formSizesEmpty.push(sizeElement);
    }
  });
  // Add the bulk items to empty inputs
  for (let i = 0; i < amount; i++) {
    formCoffeesEmpty[i].value = coffeeSelect;
    formSizesEmpty[i].value = size;
    formSizesEmpty[i].disabled = false;
    updateCost(i);
  }
  // Clear bulk amount input field
  document.getElementById("bulkAddAmount").value = "";
  let sizeCapitalised = size.charAt(0).toUpperCase() + size.slice(1);
  // Inform user of successful action with details
  alert("green", `Added ${amount}x ${sizeCapitalised} ${COFFEE[coffeeSelect]}`);
}

function calculateCapacity() {
  let coffeeSizes = document.querySelectorAll("select[id^='sizeDropdown']");
  // Reset remaining capacity and for every coffee selected, remove 1 from remaining capacity
  remainingCapacity = maxCapacity;
  coffeeSizes.forEach(function (size) {
    if (!isEmpty(size.value)) {
      remainingCapacity -= 1;
    }
  });
}

function readOrder(order, canEdit) {
  // Get HTML elements
  let invoiceBody = document.getElementById("invoiceBody");
  let title = document.getElementById("invoiceTitle");
  // Show order title
  if (isDelivery == true) title.innerHTML = "Delivery Order";
  else title.innerHTML = "Pick-up Order";
  // Reset variables
  let costTotal = 0;
  let size;
  invoiceRows = "";

  // Change function of back button if the order can not be edited
  if (canEdit == false) {
    let editOrderBtn = document.getElementById("editOrder");
    editOrderBtn.innerHTML = "&larr; Return to Saved Orders Page";
    editOrderBtn.onclick = showPage(savedOrders);
  }

  // Read order array and show as HTML table
  for (let i = 0; i < COFFEE.length; i++) {
    for (let p = 0; p < order[p].length; p++) {
      let amount = order[i][p];
      if (amount > 0) {
        if (p == 2) {
          size = "Large";
          cost = costLarge;
        } else if (p == 1) {
          size = "Medium";
          cost = costMedium;
        } else {
          size = "Regular";
          cost = costRegular;
        }
        cost = cost * amount;
        costTotal += cost;
        invoiceRows += `
          <tr>
            <td>${COFFEE[i]}</td>
            <td>${size}</td>
            <td>${amount}x</td>
            <td class="text-end">
              ${currency.format(cost)}
            </td>
          </tr>`;
      }
    }
  }
  if (isDelivery == true) {
    orderShipping = `
      <tr>
      <th scope="row" class="fw-bold">Delivery</th>
        <td></td><td></td>
        <td class="text-end" id="costShipping">
          ${currency.format(costShipping)}
        </td>
      </tr>`;
    costTotal += costShipping;
  }
  orderTotal = `
    <tr>
      <th scope="row" class="fw-bold">Total</th>
      <td></td><td></td>
      <td class="text-end">
        ${currency.format(costTotal)}
      </td>
    </tr>`;
  invoiceBody.innerHTML = invoiceRows + orderShipping + orderTotal;
}

function isEmpty(userInput) {
  // Check if input is empty
  if (userInput == "") {
    return true;
  } else {
    return false;
  }
}

function showPage(page) {
  let mainMenu = document.getElementById("mainMenu");
  let orderMenu = document.getElementById("orderMenu");
  let orderInvoice = document.getElementById("orderInvoice");
  resetOutput();
  mainMenu.classList.add("d-none");
  orderMenu.classList.add("d-none");
  orderInvoice.classList.add("d-none");
  page.classList.remove("d-none");
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
