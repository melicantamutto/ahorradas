// MATERIALIZE INITIALIZATIONS

document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('select');
    var instances = M.FormSelect.init(elems);
  });

document.addEventListener('DOMContentLoaded', function() {
  var elems = document.querySelectorAll('.datepicker');
  var instances = M.Datepicker.init(elems);
});

// HTML ELEMENTS

// Sections
const newOperationSection = document.getElementById('new-operation-section');
const balanceSection = document.getElementById('balance-section');
const categoriesSection = document.getElementById('categories-section');
const reportsSection = document.getElementById('reports-section');
const noOpImage= document.getElementById('no-op-image');
const noOpText = document.getElementById('no-op-text');
const operationsDescription = document.getElementById('operations-description');

// Balance Buttons
const addOperationButton = document.getElementById('add-operation-button');
const balanceButton = document.getElementById('balance-button');
const categoriesButton = document.getElementById('categories-button');
const reportsButton = document.getElementById('reports-button');

// New Operation Elements
const cancelOperation = document.getElementById('cancel-operation');
const submitNewOperation = document.getElementById('submit-new-operation');
const newDescription = document.getElementById('new-description');
const newAmount = document.getElementById('new-amount');
const newType = document.getElementById('new-type');
const newDate = document.getElementById('new-date');


// OBJECTS

const operations= {
  array: []
};

const categories = {
  array: []
};

// CATEGORIE CHIPS

let chips = document.querySelectorAll('.chip');

chips.forEach(chip => {
  chip.addEventListener('click', () =>{
    chip.classList.toggle('red');
    chip.classList.toggle('lighten-4');
    chip.classList.toggle('selected-chip');
  })
});

const getSelectedcategories = () =>{
  const selectedCategories = document.querySelectorAll('.selected-chip');
  const selectedCategoriesText = [];
  selectedCategories.forEach(selected => {
    selectedCategoriesText.push(selected.id)
  });
  return selectedCategoriesText;
}



// ADD OPERATIONS SECTION 

const toggleAddOperationSection = () =>{
  newOperationSection.classList.toggle('hide');
  balanceSection.classList.toggle('hide');
}

const addOperation = () =>{
  let newOp = {
    description: newDescription.value,
    amount: newAmount.value,
    // type: newType.options[newType.selectedIndex].value,
    // date: newDate.value,
    categories: getSelectedcategories(),
  }
  operations.array.push(newOp)
  checkOperations;
}

addOperationButton.addEventListener('click', (e) =>{
  e.preventDefault();
  toggleAddOperationSection();
} )

cancelOperation.addEventListener('click', (e) =>{
  e.preventDefault();
  toggleAddOperationSection();
} )

submitNewOperation.addEventListener('click', (e) =>{
  e.preventDefault();
  addOperation();
  toggleAddOperationSection();
} )

// PRINTING OPERATIONS

const printOperations = () =>{
  operations.array.forEach(operation => {
    const newRow =`<div class="row">
    <div class="col s3>${operation.description}</div>}
    <div class="col s3>${operation.categorie}</div>
    <div class="col s2>${operation.date}</div>
    <div class="col s2>${operation.amount}</div>
    <div class="col s2><a href="#" class="edit-op">Editar</a><a href="#" class="remove-op">Eliminar</a></div>
    </div>`
    operationsDescription.insertAdjacentHTML("beforeend", newRow)
    
  });
}

const checkOperations = () =>{
  if(!operations.array === []){
    noOpImage.classList.add('hide');
    noOpText.classList.add('hide');
    operationsDescription.classList.remove('hide');
    printOperations();
  }else{
    noOpImage.classList.remove('hide');
    noOpText.classList.remove('hide');
  }
}












