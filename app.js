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

// Categories Elements
const filterCategoryCollection = document.getElementById(
  "filter-category-collection"
);
const newOpCategoryCollection = document.getElementById(
  "new-op-category-collection"
);
const categoriesSectionCollection = document.getElementById(
  "categories-section-collection"
);
const addCategoryButton = document.getElementById("add-category-button");
const categoryName = document.getElementById("category-name");

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

// PRINT CATEGORIES (REUSABLE- to use each time the section changes)

const printCategories = (collection) => {
  const categoriesStorage = getStorage("categoriesList");
  if (collection === categoriesSectionCollection) {
    collection.innerHTML = "";
    categoriesStorage.forEach((category) => {
      const newHTML = `
      <div class="chip category-style" id="${category.id}" onclick="clickOnChip(this)">
        <i class="material-icons">${category.icon}</i>
        ${category.name}
        <i class="edit material-icons">edit</i>
        <i class="close material-icons">close</i>
        </div>`;
      collection.insertAdjacentHTML("beforeend", newHTML);
    });
  } else {
    collection.innerHTML = "<h6>Categorías</h6>";
    categoriesStorage.forEach((category) => {
      const newHTML = `
      <div class="chip" id="${category.id}" onclick="clickOnChip(this)">
        <i class="material-icons">${category.icon}</i>
        <span class="category-style">${category.name}</span>
        </div>`;
      collection.insertAdjacentHTML("beforeend", newHTML);
    });
  }
};

//MENU BUTTONS FUNCIONALITY

const arraySections = [
  balanceSection,
  categoriesSection,
  reportsSection,
  newOperationSection,
];

const toggleNavButtons = (click) => {
  arraySections.forEach((section) => {
    if (section !== click) {
      section.classList.add("hide");
    } else {
      click.classList.remove("hide");
      if (click === categoriesSection) {
        printCategories(categoriesSectionCollection);
      }
    }
  });
};
balanceButton.addEventListener("click", () => {
  toggleNavButtons(balanceSection);
});

categoriesButton.addEventListener("click", () => {
  toggleNavButtons(categoriesSection);
});

reportsButton.addEventListener('click', ()=>{
  toggleNavButtons(reportsSection)
})

// LOCAL STORAGE COMMON FUNCTIONS

const setStorage = (key, arr) => localStorage.setItem(key, JSON.stringify(arr));

const getStorage = (key) => JSON.parse(localStorage.getItem(key));

// CATEGORIES FUNCTIONS

// ADD CATEGORY (to use in the submit event)

const getSelected = (element, name) => {
  const previous = document.querySelector(`.selected-${name}`);
  if (previous) {
    previous.classList.remove("red");
    previous.classList.remove("lighten-4");
    previous.classList.remove(`selected-${name}`);
  }
  element.classList.add("red");
  element.classList.add("lighten-4");
  element.classList.add(`selected-${name}`);
  return element;
};

let selectedIcon = "";

document.querySelectorAll(".category-icon").forEach((icon) => {
  icon.addEventListener("click", () => {
    const emoji = getSelected(icon, "icon");
    selectedIcon = emoji.innerText;
  });
});

const addCategory = (name, emoji) => {
  const newCategory = {
    id: uuidv4(),
    name: name,
    icon: emoji,
  };
  categories.push(newCategory);
  console.log(categories);
  setStorage("categoriesList", categories);
};

addCategoryButton.addEventListener("click", () => {
  console.log("click");
  addCategory(categoryName.value, selectedIcon);
  printCategories(categoriesSectionCollection);
});
// OBJECTS

const operations = [];

const categories = [];
addCategory("Comida", "local_pizza");
addCategory("Servicios", "lightbulb_outline");
addCategory("Salidas", "beach_access");
addCategory("Educación", "local_library");
addCategory("Transporte", "directions_bus");
addCategory("Cine", "star");
addCategory("Trabajo", "work");

// CATEGORY CHIPS



const clickOnChip = (e) =>{
  getSelected(e, "chip");
}


const getSelectedCategory = () => {
  let categoryName = '';
  const selected = document.querySelector(".selected-chip");
  const categoriesStorage = getStorage('categoriesList');
  categoriesStorage.forEach(category => {
    if(category['id'] === selected['id']){
      categoryName = category.name
    }
  });
  return categoryName
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
  printCategories(newOpCategoryCollection);
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

const capitalizeCategory = (category) =>
  category.charAt(0).toUpperCase() + category.slice(1);

const colorAmount = (type) => (type === "spent" ? "red" : "green");

const symbolAmount = (amount, type) =>
  type === "spent" ? `-${amount}` : amount;

const printOperations = () => {
  operationsList.innerHTML = "";
  operations.forEach((operation) => {
    const newRow = `<div class="row">
      <div class="col s3">${operation.description}</div>
      <div class="col s3">
        <div class="chip">
          ${capitalizeCategory(operation.category)}
        </div>
      </div>
      <div class="col s2">${operation.date}</div>
      <div class="col s2" style="color:${colorAmount(
        operation.type
      )};">${symbolAmount(operation.amount, operation.type)}</div>
      <div class="col s2" id=${operation.id}>
        <a href="#" class="edit-op margin-right-plus">Editar</a>
        <a href="#" class="remove-op">Eliminar</a>
      </div>
    </div>`;
    operationsList.insertAdjacentHTML("beforeend", newRow);
  });
  editOpButtons = document.querySelectorAll(".edit-op");
  removeOpButtons = document.querySelectorAll(".remove-op");
  return editOpButtons, removeOpButtons;
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
  operations.forEach((operation) => {
    if (operation.id === selectedId) {
      let opIndex = operations.indexOf(operation);
      console.log(opIndex);
      return opIndex;
    }
  });
};

// EDITING OPERATIONS

editOpButtons.forEach((editButton) => {
  editButton.addEventListener("click", (e) => {
    e.preventDefault();
    operations.splice(getOperationById(editButton), 1);
    checkOperations();
  });
});

// REMOVE OPERATIONS

removeOpButtons.forEach((removeButton) => {
  removeButton.addEventListener("click", (e) => {
    e.preventDefault();
    console.log("click");
    operations.splice(getOperationById(removeButton), 1);
    checkOperations();
  });
});

// ONLOAD EVENTS

window.addEventListener("load", () => {
  printCategories(filterCategoryCollection);
});
