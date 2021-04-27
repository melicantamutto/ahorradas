// -------------------------MATERIALIZE INITIALIZATIONS-------------------------

document.addEventListener("DOMContentLoaded", function () {
  var elems = document.querySelectorAll("select");
  var instances = M.FormSelect.init(elems);
});

document.addEventListener("DOMContentLoaded", function () {
  var elems = document.querySelectorAll(".datepicker");
  var instances = M.Datepicker.init(elems);
});


// -------------------------HTML ELEMENTS-------------------------


// Funciones para traer los elementos del HTML
const getId = (obj) => document.getElementById(obj)
const getQuery = (obj) => document.querySelector(obj)
const getQueryAll = (obj) => document.querySelectorAll(obj)


// -------------------------LOCAL STORAGE COMMON FUNCTIONS-------------------------


// Función que guarda la información en el local storage
const setStorage = (key, arr) => localStorage.setItem(key, JSON.stringify(arr));

// Función que trae la información del local storage
const getStorage = (key) => JSON.parse(localStorage.getItem(key));


// -------------------------PRINT CATEGORIES (REUSABLE- to use each time the section changes)


//Funcion a la que le pasamos una colección (div en el que pintamos las categorías) como parámetro. Busca las categorías del local storage y crea un div para cada una. Si la colección es la de la seccioón categorías se le agregan también los botones para editar y remover. Finalmente agrega el div de la categoría al final de la colección.
const printCategories = (collection) => {
  const categoriesStorage = getStorage("categoriesList");
  if (collection === getId('categories-section-collection')) {
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


// -------------------------NEW CATEGORY FUNCTIONS-------------------------


// Función reutilizable que toma un elemento y su nombre (que es?). Primero busca si existe algún otro elemento con la clase selected. Si es así le remueve todas las clases que le dan color y la clase selected tambien. Luego de todas fromas le da el color y la clase de selccionado al elemento que le pasamos como parámetro y retorna ese elemento.
const getSelected = (element, name) => {
  const previous = getQuery(`.selected-${name}`);
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
  const newCategory = {
    id: uuidv4(),
    name: name,
    icon: emoji,
  };
  categories.push(newCategory);
  setStorage("categoriesList", categories);
};

// Evento aplicado al botón para agregar categorías en la que le pasa el valor del input category-name y el icono seleccionado a la función addCategory y luego las pinta en el HTML con printCategories, pasandole la colección de la sección de categorías (para actualizarlas)
getId("add-category-button").addEventListener("click", () => {
  addCategory(getId('category-name').value, selectedIcon);
  printCategories(getId('categories-section-collection'));
});


// -------------------------INITIAL OBJECTS-------------------------


// Variable de operaciones donde guardamos el array que encontramos en el local storage o un array vacío si no encontramos nada.
const operations = getStorage("operationsList")
  ? getStorage("operationsList")
  : [];

// Variable de categorías donde guardamos el array que encontramos en el local storage o un array vacío si no encontramos nada.
const categories = getStorage("categoriesList")
  ? getStorage("categoriesList")
  : [];

// Al iniciar la página chequeamos si el array de categorías del local storage está vacío y si es así agregamos categorías por default.
if (!getStorage("categoriesList")) {
  addCategory("Comida", "local_pizza");
  addCategory("Servicios", "lightbulb_outline");
  addCategory("Salidas", "beach_access");
  addCategory("Educación", "local_library");
  addCategory("Transporte", "directions_bus");
  addCategory("Cine", "star");
  addCategory("Trabajo", "work");
}
  

// -------------------------CATEGORY CHIPS-------------------------


// Función pasada a los eventos de las categorías en el HTML que selecciona un chip y deselecciona el anterior
const clickOnChip = (e) => {
  getSelected(e, "chip");
};

// Función que busca el chip con la clase de seleccionado y busca en el local storage qué categoría tiene el mismo id que el chip seleccionado y retorna EL NOMBRE de la categoría
const getCategoryName = () => {
  let name = "";
  const selected = getQuery(".selected-chip");
  const categoriesStorage = getStorage("categoriesList");
  categoriesStorage.forEach((category) => {
    if (category["id"] === selected["id"]) {
      name = category.name;
    }
  });
  return name;
};


// -------------------------MENU BUTTONS FUNCIONALITY-------------------------


const sectionsArray = [
  getId('balance-section'),
  getId("categories-section"),
  getId('reports-section'),
  getId('new-operation-section'),
  getId("edit-operation-section"),
];

//Función que toma como parámentro la sección clickeada a mostrar y le remueve la clase hide y se la da a todas las demás secciones que no son la clickeada (recorriendo el sectionsArray)
const showSection = (click) => {
  sectionsArray.forEach((section) => {
    if (section !== click) {
      section.classList.add("hide");
    } else {
      click.classList.remove("hide");
      if (click === getId("categories-section")) {
        printCategories(getId('categories-section-collection'));
      }
    }
  });
};

// Evento para mostrar la sección de balance
getId("balance-button").addEventListener("click", () => {
  showSection(getId('balance-section'));
});

// Evento para mostrar la sección de categorías
getId("categories-button").addEventListener("click", () => {
  showSection(getId("categories-section"));
});

// Evento para mostrar la sección de reportes
getId("reports-button").addEventListener("click", () => {
  showSection(getId('reports-section'));
});


// -------------------------ADD OPERATIONS-------------------------


// Función que crea un objeto con la descripción, el monto, la fecha, el tipo y la categoría según los inputs del formulario de la sección de nueva operación. Además le agrega un id random creado por el UU ID. Agrega la nueva operación al array de operaciones y lo guarda en el local storage.
const addOperation = () => {
  let newOp = {
    id: uuidv4(),
    description: getId('new-description').value,
    amount: getId('new-amount').value,
    type: getId('new-type').options[getId('new-type').selectedIndex].value,
    date: getId('new-date').value,
    category: getCategoryName(),
  };
  operations.push(newOp);
  setStorage("operationsList", operations);
};

// Evento que hace visible la sección de nueva operación y muestra las categorías disponibles actualizadas.
getId('add-operation-button').addEventListener("click", (e) => {
  e.preventDefault();
  showSection(getId('new-operation-section'));
  printCategories(getId('new-op-category-collection'));
});

// Evento que cancela la nueva operación que estabamos creando y retorna a la sección de balance
getId('cancel-operation').addEventListener("click", (e) => {
  e.preventDefault();
  showSection(getId('balance-section'));
});

// Evento que envía la nueva operación que estabamos creando, retorna a la sección de balance y checkea si existen operaciones y en ese caso las muestra en el HTML actualizadas.
getId('submit-new-operation').addEventListener("click", (e) => {
  e.preventDefault();
  addOperation();
  showSection(getId('balance-section'));
  checkIfOperations();
});


// -------------------------PRINTING OPERATIONS-------------------------


// Función que toma una categoría y la retorna con la primera letra en mayúsculas
const capitalizeCategory = (category) =>
  category.charAt(0).toUpperCase() + category.slice(1);

// Función que según el tipo de operación la pinta en rojo o en verde
const colorAmount = (type) => (type === "spent" ? "red" : "green");

// Función que según el tipo de operación le agrega un menos adelante o no
const symbolAmount = (amount, type) =>
  type === "spent" ? `-${amount}` : amount;

// Función que busca las operaciones que guardamos en el local storage y las pinta en el div correspondiente, una por una. A todas le agrega un contenedor con dos botones para editarlas y para eliminarlas (con eventos en linea, onlick correspondientes). Ese contenedor tiene el id único de cada operación para poder distinguir cual operación quiero editar o eliminar
const printOperations = () => {
  const operationsStorage = getStorage("operationsList");
  getId('operations-list') .innerHTML = "";
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
    getId('operations-list') .insertAdjacentHTML("beforeend", newRow);
  });
};

// Función que checkea si existen operaciones en el local storage. Si es así las pinta y si no muestra una imagen y un texto provisorio.
const checkIfOperations = () => {
  if (getStorage("operationsList")) {
    getId('no-op-image').classList.add("hide");
    getId('no-op-text').classList.add("hide");
    getId('operations-description').classList.remove("hide");
    printOperations();
  } else {
    getId('no-op-image').classList.remove("hide");
    getId('no-op-text').classList.remove("hide");
  }
};


// -------------------------GETTING OPERATION BY ID (TO EDIT OR TO REMOVE)-------------------------


// Función a la que le pasamos un botón (para editar o eliminar la operación) y busca que operación del local storage coincide con el id del DIV PADRE del botón (se lo dimos cuando imprimimos la operación en el HTML). Cuando encuentra la operación retorna un NÚMERO correspondiente al index de la operación dentro del array del local storage.
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


// -------------------------EDITING OPERATIONS-------------------------


// Variable que guarda el index de la operación que estamos editando en el ámbito global (se sobre-escribe cada vez que le damos a una nueva)
let currentEditIndex = 0;

//Muestra la operación que esté en el index que le pasamos como parámetro en el formulario para editar. Retorna el index que se esta editando asi queda guardado en el ámbito  global y lo puede usar la funcion que guarda la operación ya editada.
const printEditOperation = (i) => {
  const operation = getStorage("operationsList")[i];
  const arrayChips = getId('edit-op-category-collection').childNodes;

  getId('edit-description').value = operation.description;
  getId('edit-amount').value = operation.amount;
  // getId('edit-type').value = operation.type;
  if (operation.type === "spent") {
    getId('edit-type').children[0].setAttribute("selected", "selected");
  } else {
    getId('edit-type').children[1].setAttribute("selected", "selected");
  }
  getId('edit-date').value = operation.date;
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
    description: getId('edit-description').value,
    amount: getId('edit-amount').value,
    type: getId('edit-type').options[getId('edit-type').selectedIndex].value,
    date: getId('edit-date').value,
    category: getCategoryName(),
  }
  operationsStorage.splice(i, 1, edited);
  setStorage("operationsList", operationsStorage);
};

// Evento aplicado al botón de editar, que le pasa la operación a la que le hicimos click. Cambia a la sección de editar, muestra la operación seleccionada y luego checkea si existen operaciones y en ese caso, las muestra.
const editOpClick = (e) => {
  const editIndex = getOperationById(e);
  showSection(getId("edit-operation-section"));
  printCategories(getId('edit-op-category-collection'))
  printEditOperation(editIndex);
  checkIfOperations();
};

// Evento aplicado al boton de cancelar que se encuentra en el formulario de edición de la operación. Únicamente vuelve a la sección de balance sin cambiar nada.
getId('cancel-edit-operation').addEventListener("click", (e) => {
  e.preventDefault();
  showSection(getId('balance-section'));
});

// Evento aplicado al botón para enviar la operación editada. Busca cual es la operación que queremos editar, cambia la operacion en el local storage, vuelve a la sección de balance y checkea si existen operaciones y en ese caso, las muestra.
getId('submit-edit-operation').addEventListener("click", (e) => {
  e.preventDefault();
  changeEditOperation(currentEditIndex)
  showSection(getId('balance-section'));
  checkIfOperations();
});


// -------------------------REMOVE OPERATIONS-------------------------


//Evento aplicado al boton de eliminar de cada operación. Busca en el local storage todas las operaciones y corta según el indice la operacion seleccionada. Luego vuelve a guardar el array modificado en el local storage.
const removeOpClick = (e) => {
  const operationsStorage = getStorage("operationsList");
  operationsStorage.splice(getOperationById(e), 1);
  setStorage("operationsList", operationsStorage);
  checkIfOperations();
};


// -------------------------ONLOAD EVENTS-------------------------


// Evento aplicado a la página cuando se carga. Se imprimen las categorías que se enceuntran en el local storage y checkea si existen operaciones en el local storage. Si las hay las muestra, sino muestra que no hay.
window.addEventListener("load", () => {
  printCategories(getId('filter-category-collection'));
  checkIfOperations();
});
