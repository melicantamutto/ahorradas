// MATERIALIZE INITIALIZATIONS

document.addEventListener("DOMContentLoaded", function () {
  var elems = document.querySelectorAll("select");
  var instances = M.FormSelect.init(elems);
});

document.addEventListener("DOMContentLoaded", function () {
  var elems = document.querySelectorAll(".datepicker");
  var instances = M.Datepicker.init(elems);
});

// HTML ELEMENTS

// Sections
const newOperationSection = document.getElementById("new-operation-section");
const balanceSection = document.getElementById("balance-section");
const categoriesSection = document.getElementById("categories-section");
const reportsSection = document.getElementById("reports-section");
const noOpImage = document.getElementById("no-op-image");
const noOpText = document.getElementById("no-op-text");
const operationsDescription = document.getElementById("operations-description");
const operationsList = document.getElementById("operations-list");

// Balance Buttons
const addOperationButton = document.getElementById("add-operation-button");
const balanceButton = document.getElementById("balance-button");
const categoriesButton = document.getElementById("categories-button");
const reportsButton = document.getElementById("reports-button");

// New Operation Elements
const cancelOperation = document.getElementById("cancel-operation");
const submitNewOperation = document.getElementById("submit-new-operation");
const newDescription = document.getElementById("new-description");
const newAmount = document.getElementById("new-amount");
const newType = document.getElementById("new-type");
const newDate = document.getElementById("new-date");
let editOpButtons = document.querySelectorAll(".edit-op");
let removeOpButtons = document.querySelectorAll(".remove-op");

// OBJECTS

const operations = [];

const categories = [];

// CATEGORY CHIPS

let chips = document.querySelectorAll(".chip");

chips.forEach((chip) => {
  chip.addEventListener("click", () => {
    const previous = document.querySelector(".selected-chip");
    if (previous) {
      previous.classList.remove("red");
      previous.classList.remove("lighten-4");
      previous.classList.remove("selected-chip");
    }
    chip.classList.add("red");
    chip.classList.add("lighten-4");
    chip.classList.add("selected-chip");
  });
});

const getSelectedCategory = () => {
  const selected = document.querySelector(".selected-chip");
  return selected.id;
};

// ADD OPERATIONS SECTION

const toggleAddOperationSection = () => {
  newOperationSection.classList.toggle("hide");
  balanceSection.classList.toggle("hide");
};

const addOperation = () => {
  let newOp = {
    id: uuidv4(),
    description: newDescription.value,
    amount: newAmount.value,
    type: newType.options[newType.selectedIndex].value,
    date: newDate.value,
    category: getSelectedCategory(),
  };
  operations.push(newOp);
  console.log(operations);
};

addOperationButton.addEventListener("click", (e) => {
  e.preventDefault();
  toggleAddOperationSection();
});

cancelOperation.addEventListener("click", (e) => {
  e.preventDefault();
  toggleAddOperationSection();
});

submitNewOperation.addEventListener("click", (e) => {
  e.preventDefault();
  addOperation();
  toggleAddOperationSection();
  checkOperations();
});

// PRINTING OPERATIONS

const capitalizeCategory = (category) => category.charAt(0).toUpperCase() + category.slice(1);

const colorAmount = (type) => type === 'spent' ? 'red' : 'green' ;

const symbolAmount = (amount, type) => type === 'spent' ? `-${amount}` : amount ;


const printOperations = () => {
  operationsList.innerHTML='';
  operations.forEach((operation) => {
    const newRow = `<div class="row">
      <div class="col s3">${operation.description}</div>
      <div class="col s3">
        <div class="chip">
          ${capitalizeCategory(operation.category)}
        </div>
      </div>
      <div class="col s2">${operation.date}</div>
      <div class="col s2" style="color:${colorAmount(operation.type)};">${symbolAmount(operation.amount, operation.type)}</div>
      <div class="col s2" id=${operation.id}>
        <a href="#" class="edit-op margin-right-plus">Editar</a>
        <a href="#" class="remove-op">Eliminar</a>
      </div>
    </div>`;
    operationsList.insertAdjacentHTML("beforeend", newRow);
  });
  editOpButtons = document.querySelectorAll(".edit-op");
  removeOpButtons = document.querySelectorAll(".remove-op");
  return editOpButtons, removeOpButtons
};

const checkOperations = () => {
  if (operations !== []) {
    noOpImage.classList.add("hide");
    noOpText.classList.add("hide");
    operationsDescription.classList.remove("hide");
    printOperations();
  } else {
    noOpImage.classList.remove("hide");
    noOpText.classList.remove("hide");
  }
};

// GETTING OPERATION BY ID (TO EDIT OR TO REMOVE)

const getOperationById = (button) => {
  const selectedId = button.parentElement.id;
  console.log(selectedId);
  operations.forEach(operation => {
    if (operation.id === selectedId) {
      let opIndex = operations.indexOf(operation);
      console.log(opIndex);
      return opIndex;
    }
  });
};

// EDITING OPERATIONS

editOpButtons.forEach(editButton => {
  editButton.addEventListener("click", (e) => {
    e.preventDefault();
    operations.splice(getOperationById(editButton), 1);
    checkOperations();
  });
});

// REMOVE OPERATIONS



removeOpButtons.forEach(removeButton => {
  removeButton.addEventListener("click", (e) => {
    e.preventDefault();
    console.log('click');
    operations.splice(getOperationById(removeButton), 1);
    checkOperations();
  });
});
