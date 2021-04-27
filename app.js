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
const editOperationSection = document.getElementById("edit-operation-section");
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
const editOpCategoryCollection = document.getElementById(
  "edit-op-category-collection"
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

// Edit Operation Elements

const cancelEditOperation = document.getElementById("cancel-edit-operation");
const submitEditOperation = document.getElementById("submit-edit-operation");
const editDescription = document.getElementById("edit-description");
const editAmount = document.getElementById("edit-amount");
const editType = document.getElementById("edit-type");
const editDate = document.getElementById("edit-date");

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
  editOperationSection,
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

reportsButton.addEventListener("click", () => {
  toggleNavButtons(reportsSection);
});

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

const operations = getStorage("operationsList")
  ? getStorage("operationsList")
  : [];

const categories = getStorage("categoriesList")
  ? getStorage("categoriesList")
  : [];

if (!getStorage("categoriesList")) {
  addCategory("Comida", "local_pizza");
  addCategory("Servicios", "lightbulb_outline");
  addCategory("Salidas", "beach_access");
  addCategory("Educación", "local_library");
  addCategory("Transporte", "directions_bus");
  addCategory("Cine", "star");
  addCategory("Trabajo", "work");
}

// CATEGORY CHIPS

const clickOnChip = (e) => {
  getSelected(e, "chip");
};

const getSelectedCategory = () => {
  let categoryName = "";
  const selected = document.querySelector(".selected-chip");
  const categoriesStorage = getStorage("categoriesList");
  categoriesStorage.forEach((category) => {
    if (category["id"] === selected["id"]) {
      categoryName = category.name;
    }
  });
  return categoryName;
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
  setStorage("operationsList", operations);
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
  const operationsStorage = getStorage("operationsList");
  operationsList.innerHTML = "";
  operationsStorage.forEach((operation) => {
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
        <a href="#" class="margin-right-plus" onclick="editOpClick(this)">Editar</a>
        <a href="#" onclick="removeOpClick(this)">Eliminar</a>
      </div>
    </div>`;
    operationsList.insertAdjacentHTML("beforeend", newRow);
  });
};

const checkOperations = () => {
  if (getStorage("operationsList")) {
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
  const operationsStorage = getStorage("operationsList");
  const selectedId = button.parentElement.id;
  let opIndex;
  operationsStorage.forEach((operation) => {
    if (operation.id === selectedId) {
      opIndex = operationsStorage.indexOf(operation);
    }
  });
  return opIndex;
};


// EDITING OPERATIONS

let currentEditIndex = 0;

//Muestra la operación que esté en el index que le pasamos como parámetro en el formulario para editar. Retorna el index que se esta editando asi queda guardado en el ámbito  global y lo puede usar la funcion que guarda la operación ya editada.
const printEditOperation = (i) => {
  const operation = getStorage("operationsList")[i];
  const arrayChips = editOpCategoryCollection.childNodes;

  editDescription.value = operation.description;
  editAmount.value = operation.amount;
  // editType.value = operation.type;
  if (operation.type === "spent") {
    editType.children[0].setAttribute("selected", "selected");
  } else {
    editType.children[1].setAttribute("selected", "selected");
  }
  editDate.value = operation.date;
  arrayChips.forEach((chip) =>{
    if(chip.textContent.includes(operation.category)){
      getSelected(chip, 'chip')
    }
  })

  currentEditIndex = i;
  return currentEditIndex
};

//Corta el objeto de la operación anterior (según el index que le pasemos) y en su lugar inserta la operación editada según los inputs de la sección de editar. Luego guarda todas las operaciones nuevamente en el local storage
const changeEditOperation = (i) => {
  const operationsStorage = getStorage("operationsList");
  const operation = getStorage("operationsList")[i];
  const edited = {
    id: operation.id,
    description: editDescription.value,
    amount: editAmount.value,
    type: editType.options[editType.selectedIndex].value,
    date: editDate.value,
    category: getSelectedCategory(),
  }
  operationsStorage.splice(i, 1, edited);
  setStorage("operationsList", operationsStorage);
};

// Evento aplicado al botón de editar, que le pasa la operación a la que le hicimos click. Cambia a la sección de editar, muestra la operación seleccionada y luego checkea si existen operaciones y en ese caso, las muestra.
const editOpClick = (e) => {
  const editIndex = getOperationById(e);
  toggleNavButtons(editOperationSection);
  printCategories(editOpCategoryCollection)
  printEditOperation(editIndex);
  checkOperations();
};

// Evento aplicado al boton de cancelar que se encuentra en el formulario de edición de la operación. Únicamente vuelve a la sección de balance sin cambiar nada.
cancelEditOperation.addEventListener("click", (e) => {
  e.preventDefault();
  toggleNavButtons(balanceSection);
});

// Evento aplicado al botón para enviar la operación editada. Busca cual es la operación que queremos editar, cambia la operacion en el local storage, vuelve a la sección de balance y checkea si existen operaciones y en ese caso, las muestra.
submitEditOperation.addEventListener("click", (e) => {
  e.preventDefault();
  changeEditOperation(currentEditIndex)
  toggleNavButtons(balanceSection);
  checkOperations();
});


// REMOVE OPERATIONS


//Evento aplicado al boton de eliminar de cada operación. Busca en el local storage todas las operaciones y corta según el indice la operacion seleccionada. Luego vuelve a guardar el array modificado en el local storage.
const removeOpClick = (e) => {
  const operationsStorage = getStorage("operationsList");
  operationsStorage.splice(getOperationById(e), 1);
  setStorage("operationsList", operationsStorage);
  checkOperations();
};


// ONLOAD EVENTS


// Evento aplicado a la página cuando se carga. Se imprimen las categorías que se enceuntran en el local storage y checkea si existen operaciones en el local storage. Si las hay las muestra, sino muestra que no hay.
window.addEventListener("load", () => {
  printCategories(filterCategoryCollection);
  checkOperations();
});
