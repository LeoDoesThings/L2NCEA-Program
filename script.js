// Array of available coffee types
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
// Maximum order capacity
const maxCapacity = 10;
// Size costs
const costRegular = 5.5;
const costMedium = costRegular + 1;
const costLarge = costRegular + 2;
// Delivery fee
const costShipping = 5;
// Order information variables
let costTotal = 0;
let isDelivery = false;
let remainingCapacity = maxCapacity;
// Program required global variables
let customerInfo = [];
let savedOrder = {};
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

// Run when user clicks submit on order form
let orderForm = document.getElementById("orderForm");
orderForm.addEventListener("submit", function (e) {
  e.preventDefault();
  let run;
  let customerInputs = document.querySelectorAll(`input[id^="customer"]`);
  customerInfo = [];
  // Add all customer info to array, stop running if not entered.
  customerInputs.forEach(function (input) {
    input = input.value;
    if (isEmpty(input)) {
      // Stop running if any customer information was not entered
      alert("red", "Please enter all customer information");
      run = false;
      return;
    } else {
      // Add customer info to array
      customerInfo.push(input);
    }
  });

  // Stop running if variable is false
  if (run == false) {
    return;
  }

  // Save all user selected coffees to array
  let coffeeTypes = document.querySelectorAll(`select[id^="coffeeDropdown"]`);
  let coffeeSizes = document.querySelectorAll(`select[id^="sizeDropdown"]`);
  for (let i = 0; i < coffeeTypes.length; i++) {
    let cType = coffeeTypes[i].value;
    let cSize = coffeeSizes[i].value;
    // Default size is regular
    let sizeID = 0;

    // Change size depending on user input
    if (cSize == "medium") sizeID = 1;
    else if (cSize == "large") sizeID = 2;

    // If the coffee type is a number then add 1 to the corresponding order index
    if (!isNaN(cType)) {
      order[cType][sizeID] += 1;
    }
  }

  orderSum = order.flat().reduce((a, b) => a + b, 0);
  // If order is empty, require user to input at least one item.
  if (orderSum == 0) {
    alert("red", "Please add at least 1 coffee to the order");
  } else {
    // If order is not empty, save order to object and show it to user.
    savedOrder = {
      customer: customerInfo,
      order: order,
      delivery: isDelivery,
    };
    readOrder(savedOrder, true);
  }
});

// Load order form with inputs and cost information
function newOrder() {
  let orderBody = document.getElementById("orderBody");
  let pricesElement = document.getElementById("prices");
  let bulkCoffeeSelect = document.getElementById("bulkCoffeeSelect");
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
  // Reset variables
  isDelivery = false;
  orderRows = "";
  bulkCoffeeSelect.innerHTML = "";
  let customerInputs = document.querySelectorAll(`input[id^="customer"]`);
  customerInputs.forEach((input) => (input.value = ""));
  let transport = document.getElementById("transportDropdown");
  transport.value = "pickUp";
  updateTransport(transport);
  // Reset order array
  order = [];
  for (let i = 0; i < COFFEE.length; i++) {
    order.push([0, 0, 0]);
  }
  // Inject HTML and show the page
  bulkCoffeeSelect.innerHTML = coffeeOptions;
  showPage(orderMenu);
}

function createCoffeeRow(index) {
  // Create an HTML row of inputs with IDs depending on index number
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

// Create coffee option for HTML <select> dropdown depending on name and index in COFFEE array
function createCoffeeOption(name, index) {
  coffeeOptions += `<option value="${index}">${name}
                    </option>`;
}

// Runs when the user selects a coffee from <select> dropdown
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
  // Update the cost number in corresponding row
  updateCost(index);
}

// Show the cost of user selected coffee size
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
  costElement.innerHTML = currency.format(cost);
  updateTotal();
}

// Calculate total cost and show on page
function updateTotal() {
  let costTotalElement = document.getElementById("costTotal");
  let costElements = document.querySelectorAll(`td[id^="cost-"]`);
  costTotal = 0;
  // Convert all individual costs to JS numbers and add to total
  costElements.forEach(
    (element) =>
      (costTotal += Number(element.textContent.replace(/[^0-9\.]+/g, "")))
  );
  // If the order is delivery then add delivery fee to total
  if (isDelivery == true) costTotal += costShipping;
  // Inject total onto page
  costTotalElement.innerHTML = currency.format(costTotal);
}

// Add/remove delivery information depending on user selection for transport method
function updateTransport(transportSelect) {
  let deliveryElement = document.getElementById("deliveryInfo");
  let deliveryRow = document.getElementById("rowDelivery");
  if (transportSelect.value == "delivery") {
    // Save state of delivery
    isDelivery = true;
    // If order is delivery then add inputs for delivery information
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
    // Save state of delivery
    isDelivery = false;
    // If order is not delivery then remove inputs for delivery information
    deliveryElement.innerHTML = "";
    deliveryRow.classList.add("d-none");
  }
  // Add/remove delivery fee depending on the value of `isDelivery`
  updateTotal();
}

// This function is run when the user changes item
function updateBulkName(bulkSelect) {
  // Update the item name when user changes item
  let bulkCoffeeName = document.getElementById("bulkCoffeeName");
  bulkCoffeeName.innerHTML = COFFEE[bulkSelect.value];
}

// Check the user input is a valid integer within capacity
function verifyAmount(input) {
  // Failsafe if the user is somehow able to enter text
  inputNum = Number(input.value);
  // Require the user to enter a number
  if (isNaN(inputNum)) {
    input.value = "";
    alert("red", "Please enter a number");
  }
  // Convert number to integer
  if (!Number.isInteger(inputNum)) {
    input.value = parseInt(inputNum);
  }
  // If user inputs an amount smaller than 1 then reset amount to 1
  if (inputNum < 1) {
    input.value = 1;
    alert("red", "You must add at least 1 item");
  }
  // If user inputs an amount larger than remaining capacity then reset amount to remaining capacity
  if (inputNum > remainingCapacity) {
    input.value = remainingCapacity;
    alert("red", `The remaining capacity is ${remainingCapacity} items`);
  }
}

// Add the user selected amount of coffee type and size to order form
function bulkAdd() {
  // Do not run if there is no capacity remaining
  if (remainingCapacity <= 0) {
    alert("red", "No capacity remaining. No items added.");
    return;
  }
  // Do not run if an amount was not specified
  let amount = document.getElementById("bulkAddAmount").value;
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
    // Get index of empty row and update the cost value
    updateCost(formSizesEmpty[i].id.replace(/[^0-9]/g, ""));
  }
  // Clear bulk amount input field
  document.getElementById("bulkAddAmount").value = "";
  // Capitalise the first letter of string. e.g. 'regular' to 'Regular'
  let sizeCapitalised = size.charAt(0).toUpperCase() + size.slice(1);
  // Inform user of successful action with details
  alert("green", `Added ${amount}x ${sizeCapitalised} ${COFFEE[coffeeSelect]}`);
}

// Calculate remaining capacity
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

// Read order object/arrays and show on page
function readOrder(savedOrder, canEdit) {
  // Get HTML elements
  let invoiceBody = document.getElementById("invoiceBody");
  let title = document.getElementById("invoiceTitle");
  // Reset variables
  let cost = 0;
  let costTotal = 0;
  let size;
  invoiceRows = "";

  // Get order from object in multidimensional array: [customerInfo, order, isDelivery]
  orderValues = Object.values(savedOrder);

  // Set order title depending on delivery method
  if (orderValues[2] == true) title.innerHTML = "Delivery Order";
  else title.innerHTML = "Pick-up Order";

  // Change function of back button if the order can not be edited
  let editOrderLink = document.getElementById("editOrder");
  let invoiceBtn = document.getElementById("invoiceButtons");
  if (canEdit) {
    editOrderLink.innerHTML = "&larr; Return to Order Page (edit order)";
    editOrderLink.setAttribute("onclick", "showPage(orderMenu)");
    invoiceBtn.classList.remove("d-none");
  } else {
    editOrderLink.innerHTML = "&larr; Return to Saved Orders Page";
    editOrderLink.setAttribute("onclick", "showPage(savedOrders)");
    invoiceBtn.classList.add("d-none");
  }

  // Read customer info and inject onto HTML page
  let invoiceDetails = document.getElementById("invoiceDetails");
  let invoiceCustomer = `For <b>${orderValues[0][0]}</b>`;
  if (orderValues[2] == true) {
    invoiceCustomer += ` at address <b>${orderValues[0][1]}</b> with phone number <b>${orderValues[0][2]}</b>`;
  }
  invoiceDetails.innerHTML = invoiceCustomer;

  // Run for every coffee type
  for (let i = 0; i < COFFEE.length; i++) {
    // Run for every coffee size
    for (let p = 0; p < orderValues[1][p].length; p++) {
      // Get amount
      let amount = orderValues[1][i][p];
      // Do not run if there is no amount
      if (amount > 0) {
        // Get corresponding cost for size
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
        // Calculate costs
        cost = cost * amount;
        costTotal += cost;
        // Add information to HTML table row
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
  orderShipping = "";
  // If order is to be delivered then add fee to total cost and show fee in HTML table
  if (orderValues[2] == true) {
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
  // Show total cost in HTML table
  orderTotal = `
    <tr>
      <th scope="row" class="fw-bold">Total</th>
      <td></td><td></td>
      <td class="text-end">
        ${currency.format(costTotal)}
      </td>
    </tr>`;
  // Inject HTML table into page and show the page
  invoiceBody.innerHTML = invoiceRows + orderShipping + orderTotal;
  showPage(orderInvoice);
}

// If user clicks 'Save' btn then add order object to localStorage
let saveBtn = document.getElementById("saveOrder");
saveBtn.addEventListener("click", function (e) {
  e.preventDefault();
  // Save object to localStorage with key including date and customer name
  let date = new Date().toLocaleString();
  localStorage.setItem(
    `${date} Customer Order: ${customerInfo[0]}`,
    JSON.stringify(savedOrder)
  );
  // Alert user and return to main menu
  alert("green", "Order is saved");
  showPage(mainMenu);
});

// Find all keys in localStorage and show as buttons on page
function showLocalStorage() {
  // Save localStorage keys in an array
  let mainKeys = Object.keys(localStorage);
  let orders = "";
  // Inform the user if there are no saved orders
  if (mainKeys === undefined || mainKeys.length == 0) {
    orders = "No saved orders";
  } else {
    // Create a button for every localStorage key
    mainKeys.forEach(function (key) {
      orders += `
          <a
            href="javascript:void(0);"
            onclick="openSavedOrder('${key}')"
          >
            <div class="card">
              <div class="card-body">
                ${key}
              </div>
            </div>
          </a>`;
    });
  }
  // Inject information into page
  let ordersList = document.getElementById("ordersList");
  ordersList.innerHTML = orders;
}

// Show the order corresponding to localStorage key
function openSavedOrder(key) {
  item = JSON.parse(localStorage.getItem(key));
  readOrder(item, false);
}

// Check for empty string and return boolean
function isEmpty(userInput) {
  if (userInput == "") {
    return true;
  } else {
    return false;
  }
}

// Hide all pages and show the needed page
function showPage(page) {
  let mainMenu = document.getElementById("mainMenu");
  let orderMenu = document.getElementById("orderMenu");
  let orderInvoice = document.getElementById("orderInvoice");
  let savedOrders = document.getElementById("savedOrders");
  // Hide all pages
  mainMenu.classList.add("d-none");
  orderMenu.classList.add("d-none");
  orderInvoice.classList.add("d-none");
  savedOrders.classList.add("d-none");
  // Show the needed page
  page.classList.remove("d-none");
}

// Toast message box for program output
function alert(colour, message) {
  // Set box colour
  let bg;
  if (colour == "red") {
    bg = "text-bg-danger";
  } else if (colour == "green") {
    bg = "text-bg-success";
  }
  // Set box message
  output.innerHTML = `
    <div id="liveToast" class="toast align-items-center border-0 ${bg}" role="alert" aria-live="assertive" aria-atomic="true">
      <div class="d-flex">
        <div class="toast-body fw-bold">
          ${message}
        </div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
    </div>`;
  // Show toast box
  const toast = new bootstrap.Toast(document.getElementById("liveToast"));
  toast.show();
}
