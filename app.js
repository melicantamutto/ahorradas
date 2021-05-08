//  -------------------------------------------------- MATERIALIZE INITIALIZATIONS --------------------------------------------------

document.addEventListener("DOMContentLoaded", function () {
  var elems = document.querySelectorAll("select");
  var instances = M.FormSelect.init(elems);
});

document.addEventListener("DOMContentLoaded", function () {
  var options = {
    defaultDate: new Date(),
    setDefaultDate: true,
    onSelect: function (Date) {
      // guardarFechaSeleccionada (Date)
    },
    i18n: {
      months: [
        "Enero",
        "Febrero",
        "Marzo",
        "Abril",
        "Mayo",
        "Junio",
        "Julio",
        "Agosto",
        "Septiembre",
        "Octubre",
        "Noviembre",
        "Diciembre",
      ],
      monthsShort: [
        "Ene",
        "Feb",
        "Mar",
        "Abr",
        "Mayo",
        "Jun",
        "Jul",
        "Ago",
        "Sep",
        "Oct",
        "Nov",
        "Dic",
      ],
      weekdays: [
        "Lunes",
        "Martes",
        "Miércoles",
        "Jueves",
        "Viernes",
        "Sabado",
        "Domingo",
      ],
      weekdaysShort: ["Lun", "Mar", "Mié", "Jue", "Vie", "Sab", "Dom"],
    },
  };
  var elems = document.querySelectorAll(".datepicker");
  var instance = M.Datepicker.init(elems, options);
});
document.addEventListener("DOMContentLoaded", function () {
  var elems = document.querySelectorAll(".tooltipped");
  var instances = M.Tooltip.init(elems);
});

document.addEventListener("DOMContentLoaded", function () {
  var elems = document.querySelectorAll(".sidenav");
  var instances = M.Sidenav.init(elems);
});

//  -------------------------------------------------- MATERIALIZE INITIALIZATIONS --------------------------------------------------

var DateTime = luxon.DateTime;

//  -------------------------------------------------- HTML ELEMENTS --------------------------------------------------

// Funciones para traer los elementos del HTML
const getId = (obj) => document.getElementById(obj);
const getQuery = (obj) => document.querySelector(obj);
const getQueryAll = (obj) => document.querySelectorAll(obj);

//  -------------------------------------------------- LOCAL STORAGE COMMON FUNCTIONS --------------------------------------------------

// Función que guarda la información en el local storage
const setStorage = (key, arr) => localStorage.setItem(key, JSON.stringify(arr));

// Función que trae la información del local storage
const getStorage = (key) => JSON.parse(localStorage.getItem(key));

//  -------------------------------------------------- PRINT CATEGORIES (REUSABLE- to use each time the section changes) -------------------------

// Funcion a la que le pasamos una colección (div en el que pintamos las categorías) como parámetro. Busca las categorías del local storage y crea un div para cada una. Si la colección es la de la seccioón categorías se le agregan también los botones para editar y remover. Finalmente agrega el div de la categoría al final de la colección.
const printCategories = (collection) => {
  const categoriesStorage = getStorage("categoriesList");
  if (collection === getId("categories-section-collection")) {
    collection.innerHTML = "";
    categoriesStorage.forEach((category) => {
      const newHTML = `
      <div class="chip category-style chips-color" id="${category.id}" onclick="clickOnChip(this)">
        <i class="tiny material-icons">${category.icon}</i>
        ${category.name}
        <i class="tiny material-icons" onclick="clickCategoryEdition(this)">edit</i>
        <i class="close material-icons" onclick="clickCategoryRemove(this)">close</i>
        </div>`;
      collection.insertAdjacentHTML("beforeend", newHTML);
    });
  } else {
    collection.innerHTML = "";
    categoriesStorage.forEach((category) => {
      const newHTML = `
      <div class="chip chips-color chips-center" id="${category.id}" onclick="clickOnChip(this)">
        <i class="material-icons icon-margin">${category.icon}</i>
        <span class="category-style">${category.name}</span>
      </div>`;
      collection.insertAdjacentHTML("beforeend", newHTML);
    });
  }
};

//  -------------------------------------------------- NEW CATEGORY FUNCTIONS --------------------------------------------------

// Función reutilizable que toma un elemento y su nombre (que es?). Primero busca si existe algún otro elemento con la clase selected. Si es así le remueve todas las clases que le dan color y la clase selected tambien. Luego de todas fromas le da el color y la clase de selccionado al elemento que le pasamos como parámetro y retorna ese elemento.
const getSelected = (element, name) => {
  const previous = getQuery(`.selected-${name}`);
  if (previous) {
    previous.classList.remove("chip-selected-color");
    previous.classList.remove(`selected-${name}`);
  }
  if (element) {
    element.classList.add(`selected-${name}`);
    element.classList.add("chip-selected-color");
    return element;
  }
};

// Variable que guarda el icono seleccionado por el usuario en el ámbito global.
let selectedIcon = "";

//Evento que se le da a cada icono seleccionable cuando se crea o edita una categoría. Busca a que icono le hizo click con la función getSelected y guarda el texto del emoji dentro de la variable selectedIcon.
getQueryAll(".category-icon").forEach((icon) => {
  icon.addEventListener("click", () => {
    const emoji = getSelected(icon, "icon");
    selectedIcon = emoji.innerText;
  });
});

//Función que crea una categoría con el nombre que le pasemos, el emoji y un id ramdom generado por UU ID. Pushea el objeto de la nueva categoría en el array de categorías y luego guarda ese array en el local storage
const addCategory = (name, emoji) => {
  const categoriesStorage = getStorage("categoriesList");
  const newCategory = {
    id: uuidv4(),
    name: name,
    icon: emoji,
  };
  categoriesStorage.push(newCategory);
  setStorage("categoriesList", categoriesStorage);
};

// Evento aplicado al botón para agregar categorías en la que le pasa el valor del input category-name y el icono seleccionado a la función addCategory y luego las pinta en el HTML con printCategories, pasandole la colección de la sección de categorías (para actualizarlas)
getId("submit-new-category").addEventListener("click", () => {
  addCategory(getId("category-name").value, selectedIcon);
  printCategories(getId("categories-section-collection"));
});

//  -------------------------------------------------- INITIAL OBJECTS --------------------------------------------------

// Variable de operaciones donde guardamos el array que encontramos en el local storage o seteamos el local storage por primera vez si no encontramos nada.
const initialOperations = getStorage("operationsList")
  ? getStorage("operationsList")
  : setStorage("operationsList", []);

// Variable de categorías donde guardamos el array que encontramos en el local storage o seteamos el local storage por primera vez si no encontramos nada.
const initialCategories = getStorage("categoriesList")
  ? getStorage("categoriesList")
  : setStorage("categoriesList", []);

// Al iniciar la página chequeamos si el array de categorías del local storage está vacío y si es así agregamos categorías por default.
if (getStorage("categoriesList").length === 0) {
  addCategory("Comida", "local_pizza");
  addCategory("Servicios", "lightbulb_outline");
  addCategory("Salidas", "beach_access");
  addCategory("Educación", "local_library");
  addCategory("Transporte", "directions_bus");
  addCategory("Cine", "star");
  addCategory("Trabajo", "work");
}

// Variable que guarda el index de la operación o la categoría que estamos editando en el ámbito global (se sobre-escribe cada vez que le damos a una nueva)
let currentEditIndex = 0;

//  -------------------------------------------------- CATEGORY CHIPS --------------------------------------------------

// Función pasada a los eventos de las categorías en el HTML que selecciona un chip y deselecciona el anterior
const clickOnChip = (e) => {
  getSelected(e, "chip");
  if (e.parentNode === getId("filter-category-collection")) {
    filterOperations();
  }
};

// Función que busca el chip con la clase de seleccionado y busca en el local storage qué categoría tiene el mismo id que el chip seleccionado y retorna EL NOMBRE de la categoría
const getCategoryName = () => {
  let name = "";
  const selected =
    getQuery(".selected-chip") !== null ? getQuery(".selected-chip") : false;
  const categoriesStorage = getStorage("categoriesList");
  categoriesStorage.forEach((category) => {
    if (category["id"] === selected["id"]) {
      name = category.name;
    }
  });
  return name;
};

// Función que busca por id el chip seleccionado y retorna el índice de la categoría con el mismo id
const getCategoryIndex = () => {
  let index = "";
  const selected = getQuery(".selected-chip");
  const categoriesStorage = getStorage("categoriesList");
  categoriesStorage.forEach((category) => {
    if (category["id"] === selected["id"]) {
      index = categoriesStorage.indexOf(category);
    }
  });
  return index;
};

//  -------------------------------------------------- MENU BUTTONS FUNCIONALITY --------------------------------------------------

const sectionsArray = [
  getId("balance-section"),
  getId("categories-section"),
  getId("edit-category-section"),
  getId("reports-section"),
  getId("new-operation-section"),
  getId("edit-operation-section"),
];

//Función que toma como parámentro la sección clickeada a mostrar y le remueve la clase hide y se la da a todas las demás secciones que no son la clickeada (recorriendo el sectionsArray). Si la sección es la de categorías imprime las categorías y si es la de balance, chequea si hay operaciones y si es así, las muestra.
const showSection = (click) => {
  showBalanceTotals();
  sectionsArray.forEach((section) => {
    if (section !== click) {
      section.classList.add("hide");
    } else {
      click.classList.remove("hide");
      if (click === getId("categories-section")) {
        printCategories(getId("categories-section-collection"));
      } else if (click === getId("balance-section")) {
        checkIfOperations();
      }
    }
  });
};

// Evento para mostrar la sección de balance
getId("balance-button").addEventListener("click", () => {
  showSection(getId("balance-section"));
  showBalanceTotals();
  printCategories(getId("filter-category-collection"));
});

getId("balance-ham-button").addEventListener("click", () => {
  showSection(getId("balance-section"));
  showBalanceTotals();
  printCategories(getId("filter-category-collection"));
});

// Evento para mostrar la sección de categorías
getId("categories-button").addEventListener("click", () => {
  showSection(getId("categories-section"));
});

getId("categories-ham-button").addEventListener("click", () => {
  showSection(getId("categories-section"));
});

// Evento para mostrar la sección de reportes

getId("reports-button").addEventListener("click", () => {
  showSection(getId("reports-section"));
  showAllReports();
});

getId("reports-ham-button").addEventListener("click", () => {
  showSection(getId("reports-section"));
  showAllReports();
});

//  -------------------------------------------------- ADD OPERATIONS --------------------------------------------------

// Función que crea un objeto con la descripción, el monto, la fecha, el tipo y la categoría según los inputs del formulario de la sección de nueva operación. Además le agrega un id random creado por el UU ID. Agrega la nueva operación al array de operaciones y lo guarda en el local storage.
const addOperation = () => {
  const operationsStorage = getStorage("operationsList");
  const type = getId("new-type").options[getId("new-type").selectedIndex].value;
  const amount = getId("new-amount").value;
  let newOp = {
    id: uuidv4(),
    description: getId("new-description").value,
    amount: type === "spent" ? -amount : amount,
    type: type,
    date: getId("new-date").value,
    category: getCategoryName(),
  };
  operationsStorage.push(newOp);
  setStorage("operationsList", operationsStorage);
};

// Evento que hace visible la sección de nueva operación y muestra las categorías disponibles actualizadas.
getId("add-operation-button").addEventListener("click", (e) => {
  e.preventDefault();
  showSection(getId("new-operation-section"));
  printCategories(getId("new-op-category-collection"));
});

// Evento que cancela la nueva operación que estabamos creando y retorna a la sección de balance
getId("cancel-operation").addEventListener("click", (e) => {
  e.preventDefault();
  showSection(getId("balance-section"));
});

// Evento que envía la nueva operación que estabamos creando, retorna a la sección de balance y checkea si existen operaciones y en ese caso las muestra en el HTML actualizadas.
getId("submit-new-operation").addEventListener("click", (e) => {
  e.preventDefault();
  // checkIfChipSelected(e)
  addOperation();
  showSection(getId("balance-section"));
  checkIfOperations();
  showBalanceTotals();
});

//  -------------------------------------------------- PRINTING OPERATIONS --------------------------------------------------

// Función que toma una categoría y la retorna con la primera letra en mayúsculas
const capitalizeCategory = (category) =>
  category.charAt(0).toUpperCase() + category.slice(1);

// Función que según el tipo de operación la pinta en rojo o en verde
const colorAmount = (type) => (type === "spent" ? "red" : "green");

// Función que busca las operaciones que guardamos en el local storage y las pinta en el div correspondiente, una por una. A todas le agrega un contenedor con dos botones para editarlas y para eliminarlas (con eventos en linea, onlick correspondientes). Ese contenedor tiene el id único de cada operación para poder distinguir cual operación quiero editar o eliminar
const printOperations = (array) => {
  getId("operations-list").innerHTML = "";
  array.forEach((operation) => {
    const newRow = `<div class="row">
      <div class="col s4 m3 l3">${operation.description}</div>
      <div class="col s4 offset-s4 m3 l3">
        <div class="chip card-color typography-color ">
          ${capitalizeCategory(operation.category)}
        </div>
      </div>
      <div class="col m2 l2 hide-on-small-only">${operation.date}</div>
      <div class="col s5 m2 l2" style="color:${colorAmount(operation.type)};">${
      operation.amount
    }</div>
      <div class="col s6 offset-s1 m2 l2" id=${operation.id}>
        <a href="#" class="margin-right-plus" onclick="editOpClick(this)">Editar</a>
        <a href="#" onclick="removeOpClick(this)">Eliminar</a>
      </div>
    </div>`;
    getId("operations-list").insertAdjacentHTML("beforeend", newRow);
  });
};

// Función que checkea si existen operaciones en el local storage. Si es así las pinta y si no muestra una imagen y un texto provisorio.
const checkIfOperations = () => {
  if (getStorage("operationsList").length !== 0) {
    getId("no-op-image").classList.add("hide");
    getId("no-op-text").classList.add("hide");
    getId("operations-description").classList.remove("hide");
    getId("operations-list").classList.remove("hide");

    printOperations(getStorage("operationsList"));
  } else {
    getId("no-op-image").classList.remove("hide");
    getId("no-op-text").classList.remove("hide");
    getId("operations-description").classList.add("hide");
    getId("operations-list").classList.add("hide");
  }
};

//  -------------------------------------------------- GETTING OPERATION BY ID (TO EDIT OR TO REMOVE) --------------------------------------------------

// Función a la que le pasamos un botón (para editar o eliminar la operación) o una operación y un str de que tipo es (si es boton o es operacion) y busca que operación del local storage coincide con el id del DIV PADRE del botón (se lo dimos cuando imprimimos la operación en el HTML) o con el id de la operacion que le pasamos. Cuando encuentra la operación retorna un NÚMERO correspondiente al index de la operación dentro del array del local storage.
const getOperationById = (selected, type) => {
  const operationsStorage = getStorage("operationsList");
  const selectedId =
    type === "category" ? selected.id : selected.parentElement.id;
  let opIndex;
  operationsStorage.forEach((operation) => {
    if (operation.id === selectedId) {
      opIndex = operationsStorage.indexOf(operation);
    }
  });
  return opIndex;
};

//  -------------------------------------------------- EDITING OPERATIONS --------------------------------------------------

// Muestra la operación que esté en el index que le pasamos como parámetro en el formulario para editar. Retorna el index que se esta editando asi queda guardado en el ámbito  global y lo puede usar la funcion que guarda la operación ya editada.
const printEditOperation = (i) => {
  const operation = getStorage("operationsList")[i];
  const arrayChips = getId("edit-op-category-collection").childNodes;

  getId("edit-description").value = operation.description;
  getId("edit-amount").value = operation.amount;
  // getId('edit-type').value = operation.type;
  if (operation.type === "spent") {
    getId("edit-type").children[0].setAttribute("selected", "selected");
  } else {
    getId("edit-type").children[1].setAttribute("selected", "selected");
  }
  getId("edit-date").value = operation.date;
  arrayChips.forEach((chip) => {
    if (chip.textContent.includes(operation.category)) {
      getSelected(chip, "chip");
    }
  });

  currentEditIndex = i;
  return currentEditIndex;
};

// Corta el objeto de la operación anterior (según el index que le pasemos) y en su lugar inserta la operación editada según los inputs de la sección de editar. Luego guarda todas las operaciones nuevamente en el local storage
const changeEditOperation = (i) => {
  const operationsStorage = getStorage("operationsList");
  const operation = getStorage("operationsList")[i];
  const edited = {
    id: operation.id,
    description: getId("edit-description").value,
    amount: getId("edit-amount").value,
    type: getId("edit-type").options[getId("edit-type").selectedIndex].value,
    date: getId("edit-date").value,
    category: getCategoryName(),
  };
  operationsStorage.splice(i, 1, edited);
  setStorage("operationsList", operationsStorage);
};

// Evento aplicado al botón de editar, que le pasa la operación a la que le hicimos click. Cambia a la sección de editar, muestra la operación seleccionada y luego checkea si existen operaciones y en ese caso, las muestra.
const editOpClick = (e) => {
  const editIndex = getOperationById(e, "button");
  showSection(getId("edit-operation-section"));
  printCategories(getId("edit-op-category-collection"));
  printEditOperation(editIndex);
  checkIfOperations();
};

// Evento aplicado al boton de cancelar que se encuentra en el formulario de edición de la operación. Únicamente vuelve a la sección de balance sin cambiar nada.
getId("cancel-edit-operation").addEventListener("click", (e) => {
  e.preventDefault();
  showSection(getId("balance-section"));
});

// Evento aplicado al botón para enviar la operación editada. Busca cual es la operación que queremos editar, cambia la operacion en el local storage, vuelve a la sección de balance y checkea si existen operaciones y en ese caso, las muestra.
getId("submit-edit-operation").addEventListener("click", (e) => {
  e.preventDefault();
  // checkIfChipSelected(e)
  changeEditOperation(currentEditIndex);
  showSection(getId("balance-section"));
  checkIfOperations();
});

//  -------------------------------------------------- REMOVE OPERATIONS --------------------------------------------------

//Función reutilizable que busca en el local storage todas las operaciones y corta según el indice la operacion seleccionada. Luego vuelve a guardar el array modificado en el local storage.
const removeOperation = (op, type) => {
  const operationsStorage = getStorage("operationsList");
  operationsStorage.splice(getOperationById(op, type), 1);
  setStorage("operationsList", operationsStorage);
};

//Evento aplicado al boton de eliminar de cada operación. Busca en el local storage todas las operaciones y corta según el indice la operacion seleccionada. Luego vuelve a guardar el array modificado en el local storage. Finalemente chequea si existen operaciones y las imprime.
const removeOpClick = (e) => {
  removeOperation(e, "operation");
  checkIfOperations();
};

//  -------------------------------------------------- EDIT CATEGORY --------------------------------------------------

//Función que muestra en la sección de edita rcategoría el nombre y el icono de la categoría a editar. Duelve al ambito global el indice de la categoría dentro del array de categorias almacenado en el local storage
const printEditCategory = (i) => {
  const category = getStorage("categoriesList")[i];
  const icons = getQueryAll(".category-icon");
  getId("edit-category-name").value = category.name;
  icons.forEach((icon) => {
    if (icon.textContent.includes(category.icon)) {
      getSelected(icon, "icon");
    }
  });
  currentEditIndex = i;
  return currentEditIndex;
};

// Función que reemplaza la categoría que se euncuentra en el índice que le pasamos como parámetro en el array de categorías del local storage por una categoría con el mismo id que la anterior pero con los valores que tiene el input de nombre y el icono seleccionado en el momento que se apreta el botón de editar.
const changeEditCategory = (i) => {
  const categoriesStorage = getStorage("categoriesList");
  const category = getStorage("categoriesList")[i];
  const edited = {
    id: category.id,
    name: getId("edit-category-name").value,
    icon: selectedIcon,
  };
  categoriesStorage.splice(i, 1, edited);
  setStorage("categoriesList", categoriesStorage);
};

// Evento aplicado al botón de editar de cada categoría. Convierte a ese chip en seleccionado, vuelve visible la sección que permite editar esa categoría e imprime sus valores en los inputs.
const clickCategoryEdition = (e) => {
  getSelected(e.parentNode, "chip");
  showSection(getId("edit-category-section"));
  printEditCategory(getCategoryIndex(e.parentNode));
};

// Evento aplicado al boton de cancelar que se encuentra en el formulario de edición de la categoría. Únicamente vuelve a la sección de balance sin cambiar nada.
getId("cancel-edit-category").addEventListener("click", (e) => {
  e.preventDefault();
  showSection(getId("categories-section"));
});

// Evento aplicado al botón para enviar la categoría editada. Busca cual es la categoría que queremos editar, cambia la categoría en el local storage y finalmente las muestra a todas actualizadas en la sección de categorías inicial.
getId("submit-edit-category").addEventListener("click", (e) => {
  e.preventDefault();
  changeEditCategory(currentEditIndex);
  showSection(getId("categories-section"));
  printCategories(getId("categories-section-collection"));
});

//  -------------------------------------------------- REMOVE CATEGORY --------------------------------------------------

// Variable que guarda en el ámbito global qué categoría eliminamos, para luego eliminar las operaciones que pertenecían a esta categoría en aprticular.
let eliminatedCategory = "";

//Función que busca en el local storage las categorías y luego borra la seleccionada, usando la funcion que busca la categoria seleccionada y devuelve el index. Finalmente vuelve a guardar el array actualizado en el local storage y lo imprime en la seccion de categorías. Guarda en la variable eliminatedCategory el NOMBRE de la categoría eliminada para retornarla al ámbito global
const removeCategory = () => {
  eliminatedCategory = getCategoryName();
  const categoriesStorage = getStorage("categoriesList");
  categoriesStorage.splice(getCategoryIndex(), 1);
  setStorage("categoriesList", categoriesStorage);
  printCategories(getId("categories-section-collection"));
  return eliminatedCategory;
};

// Función que necesita que categoría se eliminó para recorrer el array de operaciones y pasarle la función de removeOperation a las que cuya categoría coincida con la eliminada.
const removeOperationsByCategory = (category) => {
  const operationsStorage = getStorage("operationsList");
  operationsStorage.forEach((op) => {
    if (op.category === category) {
      removeOperation(op, "category");
    }
  });
};

//Evento aplicado a la cruz dentro de cada chip de categorías que primero las selecciona(les da la clase de .selected-chip) con getSelected luego la remueve del local storage , las pinta y luego remueve las operaciones que tenian esa categoría eliminadas del local storage.
const clickCategoryRemove = (e) => {
  getSelected(e.parentNode, "chip");
  removeCategory();
  removeOperationsByCategory(eliminatedCategory);
};

//  -------------------------------------------------- FORM VALIDATION --------------------------------------------------

// // Función
// const checkIfChipSelected = (button) =>{
//   const instance = M.Tooltip.getInstance(button);
//   if(getQuery('.selected-category')){
//     console.log('no tooltip');
//     instance.close();
//   }else{
//     instance.open();
//     console.log('tooltip');
//   }
// }

// -------------------------------------------------- Balance / TOTALES --------------------------------------------------

//Funcion reutilizable que separa la list de operacines segun gasto o ganancia
const searchOperationByType = (array, str) => {
  const typeOp = array.filter((op) => op.type === str);
  return typeOp;
};

//Funcion reutilizable que suma las operaciones segun gasto o ganancia
const searchTotalAmounts = (array) => {
  let result = 0;
  array.map((move) => {
    result += Number(move.amount);
  });
  return result;
};

// Función que actualiza el balance de la sección balance
const showBalanceTotals = () => {
  const totalEarned = searchOperationByType(
    [...getStorage("operationsList")],
    "earned"
  );
  const totalSpent = searchOperationByType(
    [...getStorage("operationsList")],
    "spent"
  );

  getId("total-earned").innerText = searchTotalAmounts(totalEarned);
  getId("total-spent").innerText = searchTotalAmounts(totalSpent);
  getId("total-balance").innerText =
    searchTotalAmounts(totalEarned) + searchTotalAmounts(totalSpent);
};

// -------------------------------------------------- FILTER-FUNCIONALITY --------------------------------------------------

const filterBySort = (newArr) => {
  const filterSort = getId("filter-sort").value;

  switch (filterSort) {
    case "most-recent":
      newArr = newArr.sort((a, b) => (a.date < b.date ? 1 : -1));
      break;
    case "least-recent":
      newArr = newArr.sort((a, b) => (a.date > b.date ? 1 : -1));
      break;
    case "biggest-amount":
      newArr = newArr.sort((a, b) =>
        Number(a.amount) < Number(b.amount) ? 1 : -1
      );
      break;
    case "smallest-amount":
      newArr = newArr.sort((a, b) =>
        Number(a.amount) > Number(b.amount) ? 1 : -1
      );
      break;
    case "a-z":
      newArr = newArr.sort((a, b) => (a.description > b.description ? 1 : -1));
      break;
    case "z-a":
      newArr = newArr.sort((a, b) => (a.description < b.description ? 1 : -1));
      break;
  }
  return newArr;
};

const filterOperations = () => {
  let newArr = [...getStorage("operationsList")];
  const filterType = getId("filter-type");
  const selectedType = filterType.options[filterType.selectedIndex].value;
  const selectedCategory = getCategoryName();
  const selectedDate = getId("filter-date").value;
  // filtro por categoría
  if (selectedCategory) {
    newArr = newArr.filter((op) => op.category === selectedCategory);
  }
  // filtro por tipo
  if (selectedType !== "all") {
    newArr = newArr.filter((op) => op.type === selectedType);
  }
  // filtro por fecha
  newArr = newArr.filter((op) => op.date >= selectedDate);
  // filtro que ordena, usando la función específica
  newArr = filterBySort(newArr);

  printOperations(newArr);
};

// Función que parsea la fecha con la librería luxon, para obtener una fecha comparable
const parseDate = (date) => {
  return DateTime.fromFormat("May 25 1982", "LLLL dd yyyy");
};

// Funcion que busca la fecha mas vieja para pasarla como base de filtro
const getOldestDate = (array) => {
  let result = [];
  array.filter((op) => {
    result.push(op.date);
  });
  result = result.sort((a, b) => {
    const dateA = parseDate(a.date);
    const dateB = parseDate(b.date);
    return dateA < dateB ? -1 : 1;
  });
  return result[0];
};

// Funcion que pone a los filtros como default (materialize no deja cambiar el value de los select por lo que cambiamos la fecha y categoría unicamente)
const printDefaultFilters = () => {
  getSelected(null, "chip");
  getId("filter-date").value = getOldestDate(getStorage("operationsList"));
};

// Evento que imprime las operaciones en el orden que aparecen en el local storage y quita la categoría seleccionada
getId("clean-filters").addEventListener("click", () => {
  checkIfOperations();
  printDefaultFilters();
});

//  --------------------------------------------------  REPORTS FUNCTIONALITY --------------------------------------------------

// Función que retorna true or false dependiendo si alguno de los reportes dan undefined. Si es el caso, muestra que no hay suficientes operaciones para mostrar los reportes
const checkIfReports = (result) => {
  if (result === undefined) {
    getId("no-reports").classList.remove("hide");
    getId("reports-container").classList.add("hide");
    return false;
  } else {
    getId("no-reports").classList.add("hide");
    getId("reports-container").classList.remove("hide");
    return true;
  }
};

// Función reutilizable que busca la categoría con más ganancias o gastos, segun lo que le pasemos como parámetros
const getCategoryMost = (type) => {
  const reportCategories = getReport("categories");
  let result;
  let amount = type === "balance" ? getCategoryMost("spent").spent : 0;
  reportCategories.forEach((report) => {
    if (type === "spent") {
      if (report.spent < amount) {
        amount = report.spent;
        result = report;
      }
    } else {
      if (report[type] > amount) {
        amount = report[type];
        result = report;
      }
    }
  });
  const isTrue = checkIfReports(result);
  return isTrue === true ? result : false;
};

// Función reutilizable que muestra la categoría con más ganancias o gastos en el HTML, segun lo que le pasemos como parámetros
const showCategoryMost = (most, type) => {
  let title = "";
  if (type === "earned") {
    title = "<td>Categoria con mayor ganancia</td>";
  } else if (type === "spent") {
    title = "<td>Categoria con mayor gasto</td>";
  } else {
    title = "<td>Categoria con mayor balance</td>";
  }
  const newTd = ` 
   ${title}
    <td>
      <div class="chip">
        <i class="material-icons">${most.icon}</i>
        ${most.name}
      </div>  
    </td>  
    <td>$${most[type]}</td>`;
  getId(`category-most-${type}`).innerHTML = newTd;
};

// Función que retorna un array de reportes según mes o categorías, con objetos dentro que tienen el nombre, los gastos y ganancias y el balance de cada uno
const getReport = (type) => {
  const operationsStorage = getStorage("operationsList");
  const categoriesStorage = getStorage("categoriesList");
  const months = [
    "Ene",
    "Feb",
    "Mar",
    "Abr",
    "Mayo",
    "Jun",
    "Jul",
    "Ago",
    "Sep",
    "Oct",
    "Nov",
    "Dic",
  ];
  const toFilter = type === "months" ? months : categoriesStorage;
  let reportArray = [];

  toFilter.forEach((filter) => {
    const operationsFiltered =
      type === "months"
        ? operationsStorage.filter((op) => op["date"].includes(filter))
        : operationsStorage.filter((op) => filter["name"] === op["category"]);

    if (operationsFiltered.length !== 0) {
      const earned = searchOperationByType(operationsFiltered, "earned");
      const spent = searchOperationByType(operationsFiltered, "spent");

      const totalEarned = searchTotalAmounts(earned);
      const totalSpent = searchTotalAmounts(spent);
      const totalBalance = searchTotalAmounts(operationsFiltered);

      const amounts = {
        earned: totalEarned,
        spent: totalSpent,
        balance: totalBalance,
      };
      const obj =
        type === "months"
          ? {
              month: filter,
              ...amounts,
            }
          : {
              ...filter,
              ...amounts,
            };
      reportArray.push(obj);
    }
  });
  return reportArray;
};

// Función que muestra en el HTML los reportes de cada categoría con operaciones
const showCategoryReport = (array) => {
  getId("categories-reports").innerHTML = "";
  array.forEach((category) => {
    const newTr = `<tr>
    <td>
      <div class="chip">
        <i class="material-icons">${category.icon}</i>
        ${category.name}
      </div>  
    </td>  
    <td>${category.earned}</td>
    <td>${category.spent}</td>
    <td>${category.balance}</td>
  </tr>  
    <tr>`;
    getId("categories-reports").insertAdjacentHTML("beforeend", newTr);
  });
};

// Función que muestra en el HTML los reportes de cada mes con operaciones
const showMonthReport = (array) => {
  getId("months-reports").innerHTML = "";
  array.forEach((month) => {
    const newTr = `
    <tr>
      <td>${month.month}</td>
      <td>${month.earned}</td>
      <td>${month.spent}</td>
      <td>${month.balance}</td>
    </tr>`;
    getId("months-reports").insertAdjacentHTML("beforeend", newTr);
  });
};

//Función reutilizable que busca el mes con más ganancias o gastos, segun lo que le pasemos como parámetros
const getMonthMost = (type) => {
  const reportMonths = getReport("months");
  let result;
  let amount = 0;
  reportMonths.forEach((report) => {
    if (type === "earned") {
      if (report[type] > amount) {
        amount = report[type];
        result = report;
      }
    } else {
      if (report["spent"] < amount) {
        amount = report["spent"];
        result = report;
      }
    }
  });
  const isTrue = checkIfReports(result);
  return isTrue === true ? result : false;
};

//Función reutilizable que muestra el mes con más ganancias o gastos en el HTML, segun lo que le pasemos como parámetros
const showMonthMost = (most, type) => {
  const title =
    type === "earned"
      ? "<td>Mes con mayor ganancia</td>"
      : "<td>Mes con mayor gasto</td>";
  const newTd = `     
  ${title}
  <td>${most.month}</td>
  <td>$${most[type]}</td>`;
  getId(`month-most-${type}`).innerHTML = newTd;
};

// Función que reune todas las funciones para mostrar los reportes
const showAllReports = () => {
  showCategoryMost(getCategoryMost("earned"), "earned");
  showCategoryMost(getCategoryMost("spent"), "spent");
  showCategoryMost(getCategoryMost("balance"), "balance");
  showMonthMost(getMonthMost("earned"), "earned");
  showMonthMost(getMonthMost("spent"), "spent");
  showCategoryReport(getReport("category"));
  showMonthReport(getReport("months"));
};

//  -------------------------------------------------- ONLOAD EVENTS --------------------------------------------------

// Evento aplicado a la página cuando se carga. Se imprimen las categorías que se enceuntran en el local storage y checkea si existen operaciones en el local storage. Si las hay las muestra, sino muestra que no hay.
window.addEventListener("load", () => {
  printCategories(getId("filter-category-collection"));
  checkIfOperations();
  showBalanceTotals();
  printDefaultFilters();
});

//  --------------------------------------------------  RESPONSIVE  --------------------------------------------------

const mediaQuery850 = window.matchMedia("(max-width: 850px)");

if (mediaQuery850.matches) {
  getId("balance-section").classList.remove("container");
}
