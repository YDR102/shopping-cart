//**** Selecion ****\\
const alert = document.querySelector(".alert");
const btnSubmit = document.querySelector(".submit-btn");
const btnClear = document.querySelector(".clear-btn");
const input = document.getElementById("grocery");
const container = document.querySelector(".grocery-container");
const form = document.querySelector(".grocery-form");
const list = document.querySelector(".grocery-list");

// Editar
let editItem;
let editFlag = false;
let editID = "";

//**** Event Listeners ****\\

//Envio de Formulario
form.addEventListener("submit", addItem);

// Limpiar lista
btnClear.addEventListener("click", clearItems);

// Cargar items
window.addEventListener("DOMContentLoaded", setupItems);

//**** Funciones ****\\
function generateUUID() {
  let d = new Date().getTime();
  const uuid = "xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx".replace(
    /[xy]/g,
    function (c) {
      const r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
    }
  );
  return uuid;
}
function addItem(e) {
  e.preventDefault();
  const value = input.value;
  const id = generateUUID();

  if (value && !editFlag) {
    // Creando el item
    CreateListItem(id, value);
    // Mostrar alerta
    displayalert("Añadido", "success");
    // Añadir al almacenamiento local
    addToLocalStorage(id, value);
    // Resetear valores
    setBackToDeDefault();
    // Mostrar elemetos
    container.classList.add("show-container");
  } else if (value && editFlag) {
    editElement.innerHTML = value;
    displayalert("Editado", "success");
    // edita el almacenamiento
    editLocalStorage(editID, value);
    setBackToDeDefault();
  } else {
    displayalert("Campo vacío", "danger");
  }
}
// display alert
function displayalert(text, action) {
  alert.textContent = text;
  alert.classList.add(`alert-${action}`);

  setTimeout(function () {
    alert.textContent = "";
    alert.classList.remove(`alert-${action}`);
  }, 1000);
}

// limpiar lista
function clearItems() {
  const items = document.querySelectorAll(".grocery-item");
  if (items.length > 0) {
    items.forEach((item) => {
      list.removeChild(item);
    });
  }
  container.classList.remove("show-container");
  displayalert("Lista vacia", "danger");
  setBackToDeDefault();
  localStorage.removeItem("list");
}

// eliminar/Editar items
function deleteItems(e) {
  const element = e.currentTarget.parentElement.parentElement;
  const id = element.dataset.id;
  list.removeChild(element);
  if (list.children.length === 0) {
    container.classList.remove("show-container");
  }
  displayalert("Eliminado", "danger");
  setBackToDeDefault();
  removeFromLocalStore(id);
}
function editItems(e) {
  const element = e.currentTarget.parentElement.parentElement;
  editElement = e.currentTarget.parentElement.previousElementSibling;

  input.value = editElement.innerHTML;
  editFlag = true;
  editID = element.dataset.id;
  btnSubmit.textContent = "Editar";
}

// set back to de default
function setBackToDeDefault() {
  input.value = "";
  editFlag = false;
  editID = "";
  btnSubmit.textContent = "añadir";
}

//**** Local Storage ****\\

function addToLocalStorage(id, value) {
  const valueLocal = {
    id: id,
    value: value,
  };
  let items = getLocalStorage();
  console.log(items);

  items.push(valueLocal);
  localStorage.setItem("list", JSON.stringify(items));
}
function removeFromLocalStore(id) {
  let items = getLocalStorage();
  items = items.filter((item) => {
    if (item.id !== id) {
      return item;
    }
  });
  localStorage.setItem("list", JSON.stringify(items));
}
function editLocalStorage(editID, value) {
  let items = getLocalStorage();
  items = items.map((item) => {
    if (item.id === editID) {
      item.value = value;
    }
    return item;
  });
  localStorage.setItem("list", JSON.stringify(items));
}
// Get
function getLocalStorage() {
  return localStorage.getItem("list")
    ? JSON.parse(localStorage.getItem("list"))
    : [];
}

//**** Setup Items ****\\

function setupItems() {
  let items = getLocalStorage();
  if (items.length > 0) {
    items.forEach((item) => {
      CreateListItem(item.id, item.value);
    });
    container.classList.add("show-container");
  }
}

function CreateListItem(id, value) {
  let items = getLocalStorage();
  // Creando el item
  const element = document.createElement("article");
  // Dándole clase
  element.classList.add("grocery-item");
  // Dándole ID
  const attr = document.createAttribute("data-id");
  attr.value = id;
  element.setAttributeNode(attr);
  element.innerHTML = `
         <p class="title">${value}</p>
         <div class="btn-container">
             <button type="button" class="edit-btn">
                 <i class="fas fa-edit"></i>
             </button>
             <button type="button" class="delete-btn">
                 <i class="fas fa-trash"></i>
             </button>
         </div>
     `;

  // Seleccionar los botones del elemento recién creado
  const btnDelete = element.querySelector(".delete-btn");
  const btnEdit = element.querySelector(".edit-btn");
  btnDelete.addEventListener("click", deleteItems);
  btnEdit.addEventListener("click", editItems);

  // Añadiéndolo a la lista
  list.appendChild(element);
}
