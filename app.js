let editFlag = false;
let editElement;
let editId = "";

const form = document.querySelector(".grocery-form");
const groceryInput = document.getElementById("grocery");
const groceryList = document.querySelector(".grocery-list");
const clearBtn = document.querySelector(".clear-btn");
const submitBtn = document.querySelector(".submit-btn");
const alert = document.querySelector(".alert");
const editBtns = document.querySelectorAll(".edit-btn");
const deleteBtns = document.querySelectorAll(".delete-btn");

const groceryContainer = document.querySelector(".grocery-container");

// Load Item list when refreshed
window.addEventListener("DOMContentLoaded", setupItems);

// Display alert
const displayAlert = (type, msg) => {
  alert.innerText = msg;
  alert.classList.add(`alert-${type}`);

  setTimeout(() => {
    alert.classList.remove(`alert-${type}`);
    alert.innerText = "";
  }, 1500);
};

// Set the default settings after adding/editting an item
const setBackToDefault = () => {
  groceryInput.value = "";
  editFlag = false;
  submitBtn.textContent = "submit";
};

//Edit item
const editItem = (e) => {
  editElement = e.currentTarget.parentElement.parentElement;
  groceryInput.value = editElement.querySelector(".title").innerText;
  editId = editElement.dataset.id;

  editFlag = true;
  submitBtn.textContent = "edit";
};

// Delete Item
const deleteItem = (e) => {
  const element = e.currentTarget.parentElement.parentElement;
  const id = element.dataset.id;

  groceryList.removeChild(element);

  if (groceryList.children.length === 0) {
    groceryContainer.classList.remove("show-container");
  }
  displayAlert("danger", "item removed");

  removeLocalStorage(id);
  setBackToDefault();
};

const addGroceryItem = (id, item) => {
  groceryList.insertAdjacentHTML(
    "afterbegin",
    `<div class="grocery-item" data-id=${id}>
		<p class="title">${item}</p>
		<div class="btn-container">
			<button class="edit-btn" type="button">
			<i class="fa-solid fa-pen-to-square"></i>
			</button>
			<button class="delete-btn" type="button">
			<i class="fa-solid fa-trash"></i>
			</button>
		</div>
	  </div>`
  );

  const element = groceryList.firstChild;
  element.querySelector(".edit-btn").addEventListener("click", editItem);
  element.querySelector(".delete-btn").addEventListener("click", deleteItem);

  groceryContainer.classList.add("show-container");
  setBackToDefault();
};

// Add Item
const addItem = (e) => {
  e.preventDefault();
  const item = groceryInput.value.trim();
  const id = Date.now().toString();

  if (item && !editFlag) {
    addGroceryItem(id, item);
    addToLocalStorage(id, item);
    displayAlert("success", "Item added");
  } else if (item.trim() && editFlag) {
    const element = editElement.querySelector(".title");
    element.textContent = item;

    editLocalStorage(editId, item);
    displayAlert("success", "Item edited");
    setBackToDefault();
  } else {
    displayAlert("danger", "Please enter valid value");
  }
};

form.addEventListener("submit", addItem);

deleteBtns.forEach((item) => {
  const deleteItem = () => {};
  item.addEventListener("click", deleteItem);
});

// Clear all items
clearBtn.addEventListener("click", () => {
  const groceryItems = document.querySelectorAll(".grocery-item");

  if (groceryItems.length > 0) {
    groceryContainer.classList.remove("show-container");

    groceryItems.forEach((el) => {
      groceryList.removeChild(el);
    });

    displayAlert("danger", "All Items Removed");
    localStorage.removeItem("list");
  }
});

// Local Storage ///

function addToLocalStorage(id, value) {
  const grocery = { id, value };
  const items = getLocalStorage();
  items.push(grocery);

  localStorage.setItem("list", JSON.stringify(items));
}

function removeLocalStorage(id) {
  let items = getLocalStorage();

  items = items.filter((item) => item.id !== id);
  localStorage.setItem("list", JSON.stringify(items));
}

function editLocalStorage(id, value) {
  let items = getLocalStorage();

  items = items.map(function (item) {
    if (item.id === id) {
      item.value = value;
    }
    return item;
  });
  localStorage.setItem("list", JSON.stringify(items));
}

function getLocalStorage() {
  return localStorage.getItem("list")
    ? JSON.parse(localStorage.getItem("list"))
    : [];
}

function setupItems() {
  let items = getLocalStorage();

  if (items.length > 0) {
    items.forEach((item) => {
      addGroceryItem(item.id, item.value);
    });
  }
}
