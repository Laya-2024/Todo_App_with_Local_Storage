// Initialize app
document.addEventListener("DOMContentLoaded", function() {
  loadTodos();
  initializeTodoElements();
  updateHomeStats();
  showRecentTasks();
});

function showNotification(message, type) {
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 15px 25px;
    border-radius: 10px;
    color: white;
    font-weight: 600;
    z-index: 10000;
    animation: slideInRight 0.5s ease;
    background: ${type === 'success' ? 'linear-gradient(135deg, #27ae60, #2ecc71)' : 'linear-gradient(135deg, #e74c3c, #c0392b)'};
  `;
  
  document.body.appendChild(notification);
  setTimeout(() => {
    notification.style.animation = 'slideOutRight 0.5s ease';
    setTimeout(() => notification.remove(), 500);
  }, 3000);
}

// Add notification animations to CSS
const style = document.createElement('style');
style.textContent = `
  @keyframes slideInRight {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  @keyframes slideOutRight {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(100%); opacity: 0; }
  }
`;
document.head.appendChild(style);

// Navigation
function showPage(pageId) {
  document.querySelectorAll('.page').forEach(sec => sec.classList.remove('active'));
  document.getElementById(pageId).classList.add('active');
}

// Todo functionality
function initializeTodoElements() {
  const todoInput = document.getElementById("todo-input");
  const addBtn = document.getElementById("add-btn");
  const clearBtn = document.getElementById("clear-btn");
  
  if (addBtn) addBtn.addEventListener("click", addTodo);
  if (clearBtn) clearBtn.addEventListener("click", clearTodos);
  if (todoInput) {
    todoInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') addTodo();
    });
  }
}

// Initialize todo elements when main app is shown
initializeTodoElements();

function addTodo() {
  const todoInput = document.getElementById("todo-input");
  const task = todoInput.value.trim();
  if (task === "") {
    showNotification('Please enter a task!', 'error');
    return;
  }

  const todo = { 
    text: task, 
    completed: false, 
    id: Date.now()
  };
  saveToLocalStorage(todo);
  renderTodo(todo);
  todoInput.value = "";
  updateHomeStats();
  
  // Add success animation
  todoInput.style.animation = 'none';
  setTimeout(() => todoInput.style.animation = 'successPulse 0.6s ease', 10);
}

// Add success pulse animation
const todoStyle = document.createElement('style');
todoStyle.textContent = `
  @keyframes successPulse {
    0% { border-color: #e1e5e9; }
    50% { border-color: #27ae60; box-shadow: 0 0 20px rgba(39, 174, 96, 0.3); }
    100% { border-color: #e1e5e9; }
  }
`;
document.head.appendChild(todoStyle);

function renderTodo(todo) {
  const todoList = document.getElementById("todo-list");
  const li = document.createElement("li");
  if (todo.completed) li.classList.add("completed");

  const span = document.createElement("span");
  span.textContent = todo.text;
  span.addEventListener("click", () => toggleComplete(todo, li));

  const editBtn = document.createElement("button");
  editBtn.textContent = "✏️ Edit";
  editBtn.addEventListener("click", () => editTodo(todo, span));

  const delBtn = document.createElement("button");
  delBtn.textContent = "🗑️ Delete";
  delBtn.addEventListener("click", () => deleteTodo(todo, li));

  li.appendChild(span);
  li.appendChild(editBtn);
  li.appendChild(delBtn);
  todoList.appendChild(li);
}

function saveToLocalStorage(todo) {
  const todos = JSON.parse(localStorage.getItem('todos')) || [];
  todos.push(todo);
  localStorage.setItem('todos', JSON.stringify(todos));
}

function loadTodos() {
  const todoList = document.getElementById("todo-list");
  if (!todoList) return;
  
  const todos = JSON.parse(localStorage.getItem('todos')) || [];
  todoList.innerHTML = '';
  todos.forEach(todo => renderTodo(todo));
}

function toggleComplete(todo, li) {
  li.classList.toggle("completed");
  todo.completed = !todo.completed;
  updateLocalStorage();
  updateHomeStats();
  showNotification(todo.completed ? 'Task completed! 🎉' : 'Task reopened!', 'success');
}

function editTodo(todo, span) {
  const newText = prompt("Edit task:", todo.text);
  if (newText && newText.trim()) {
    todo.text = newText.trim();
    span.textContent = newText.trim();
    updateLocalStorage();
    showNotification('Task updated!', 'success');
  }
}

function deleteTodo(todo, li) {
  if (confirm('Are you sure you want to delete this task?')) {
    li.style.animation = 'taskSlideOut 0.5s ease';
    setTimeout(() => {
      li.remove();
      const todos = JSON.parse(localStorage.getItem('todos')) || [];
      const updated = todos.filter(t => t.id !== todo.id);
      localStorage.setItem('todos', JSON.stringify(updated));
      updateHomeStats();
      showNotification('Task deleted!', 'success');
    }, 500);
  }
}

// Add slide out animation
const deleteStyle = document.createElement('style');
deleteStyle.textContent = `
  @keyframes taskSlideOut {
    from { opacity: 1; transform: translateX(0); }
    to { opacity: 0; transform: translateX(-100%); }
  }
`;
document.head.appendChild(deleteStyle);

function clearTodos() {
  if (confirm('Are you sure you want to clear all tasks?')) {
    const todoList = document.getElementById("todo-list");
    const tasks = todoList.querySelectorAll('li');
    
    tasks.forEach((task, index) => {
      setTimeout(() => {
        task.style.animation = 'taskSlideOut 0.5s ease';
        setTimeout(() => task.remove(), 500);
      }, index * 100);
    });
    
    setTimeout(() => {
      localStorage.removeItem('todos');
      updateHomeStats();
      showNotification('All tasks cleared!', 'success');
    }, tasks.length * 100 + 500);
  }
}

function updateLocalStorage() {
  const todoList = document.getElementById("todo-list");
  if (!todoList) return;
  
  const todos = [];
  todoList.querySelectorAll("li").forEach(li => {
    const span = li.querySelector("span");
    if (span) {
      todos.push({
        text: span.textContent,
        completed: li.classList.contains("completed"),
        id: Date.now() + Math.random()
      });
    }
  });
  localStorage.setItem('todos', JSON.stringify(todos));
}

// Enhanced form handlers with animations
document.addEventListener('DOMContentLoaded', function() {
  setTimeout(() => {
    const contactForm = document.getElementById("contactForm");
    const aboutForm = document.getElementById("aboutForm");
    
    if (contactForm) {
      contactForm.addEventListener("submit", function(e) {
        e.preventDefault();
        const button = this.querySelector('button');
        button.style.animation = 'successPulse 0.6s ease';
        showNotification('Message sent successfully! 📧', 'success');
        this.reset();
      });
    }
    
    if (aboutForm) {
      aboutForm.addEventListener("submit", function(e) {
        e.preventDefault();
        const feature = document.getElementById("feature").value;
        const reason = document.getElementById("reason").value;
        const button = this.querySelector('button');
        button.style.animation = 'successPulse 0.6s ease';
        showNotification(`Feature "${feature}" request submitted! 🚀`, 'success');
        this.reset();
      });
    }
  }, 1000);
});
// Home page functions
function updateHomeStats() {
  const todos = JSON.parse(localStorage.getItem('todos')) || [];
  const completed = todos.filter(t => t.completed).length;
  const pending = todos.length - completed;
  
  document.getElementById('total-tasks').textContent = todos.length;
  document.getElementById('completed-tasks').textContent = completed;
  document.getElementById('pending-tasks').textContent = pending;
}

function showRecentTasks() {
  const todos = JSON.parse(localStorage.getItem('todos')) || [];
  const recentList = document.getElementById('recent-list');
  const recent = todos.slice(-5).reverse();
  
  recentList.innerHTML = '';
  recent.forEach(todo => {
    const li = document.createElement('li');
    li.innerHTML = `<span style="${todo.completed ? 'text-decoration: line-through; opacity: 0.7;' : ''}">${todo.text}</span>`;
    recentList.appendChild(li);
  });
}