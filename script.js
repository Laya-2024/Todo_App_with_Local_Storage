// Navigation
function showPage(pageId) {
  document.querySelectorAll('.page').forEach(sec => sec.classList.remove('active'));
  document.getElementById(pageId).classList.add('active');
}

// Todo functionality
const todoInput = document.getElementById("todo-input");
const addBtn = document.getElementById("add-btn");
const clearBtn = document.getElementById("clear-btn");
const todoList = document.getElementById("todo-list");

document.addEventListener("DOMContentLoaded", loadTodos);
addBtn.addEventListener("click", addTodo);
clearBtn.addEventListener("click", clearTodos);

function addTodo() {
  const task = todoInput.value.trim();
  if (task === "") return;

  const todo = { text: task, completed: false };
  saveToLocalStorage(todo);
  renderTodo(todo);

  todoInput.value = "";
}

function renderTodo(todo) {
  const li = document.createElement("li");
  if (todo.completed) li.classList.add("completed");

  const span = document.createElement("span");
  span.textContent = todo.text;
  span.addEventListener("click", () => toggleComplete(todo, li));

  const editBtn = document.createElement("button");
  editBtn.textContent = "Edit";
  editBtn.addEventListener("click", () => editTodo(todo, span));

  const delBtn = document.createElement("button");
  delBtn.textContent = "Delete";
  delBtn.addEventListener("click", () => deleteTodo(todo, li));

  li.appendChild(span);
  li.appendChild(editBtn);
  li.appendChild(delBtn);
  todoList.appendChild(li);
}

function saveToLocalStorage(todo) {
  const todos = JSON.parse(localStorage.getItem("todos")) || [];
  todos.push(todo);
  localStorage.setItem("todos", JSON.stringify(todos));
}

function loadTodos() {
  const todos = JSON.parse(localStorage.getItem("todos")) || [];
  todos.forEach(todo => renderTodo(todo));
}

function toggleComplete(todo, li) {
  li.classList.toggle("completed");
  todo.completed = !todo.completed;
  updateLocalStorage();
}

function editTodo(todo, span) {
  const newText = prompt("Edit task:", todo.text);
  if (newText) {
    todo.text = newText;
    span.textContent = newText;
    updateLocalStorage();
  }
}

function deleteTodo(todo, li) {
  li.remove();
  const todos = JSON.parse(localStorage.getItem("todos")) || [];
  const updated = todos.filter(t => t.text !== todo.text);
  localStorage.setItem("todos", JSON.stringify(updated));
}

function clearTodos() {
  todoList.innerHTML = "";
  localStorage.removeItem("todos");
}

function updateLocalStorage() {
  const todos = [];
  document.querySelectorAll("#todo-list li").forEach(li => {
    todos.push({
      text: li.querySelector("span").textContent,
      completed: li.classList.contains("completed")
    });
  });
  localStorage.setItem("todos", JSON.stringify(todos));
}

// Contact form handler
document.getElementById("contactForm").addEventListener("submit", function(e) {
  e.preventDefault();
  alert("Message sent successfully!");
  this.reset();
});

// About form handler
document.getElementById("aboutForm").addEventListener("submit", function(e) {
  e.preventDefault();
  const feature = document.getElementById("feature").value;
  const reason = document.getElementById("reason").value;

  alert(`Thank you! You requested: "${feature}"\nReason: ${reason}`);
  this.reset();
});
