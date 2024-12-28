const addBtn = document.getElementById('add-btn');
const todoInput = document.getElementById('todo-input');
const prioritySelect = document.getElementById('priority-select');
const todoList = document.getElementById('todo-list');
const clearAllBtn = document.getElementById('clear-all-btn');
const searchInput = document.getElementById('search-input');
const sortSelect = document.getElementById('sort-select');
const progressBar = document.getElementById('progress-bar');
const progressText = document.getElementById('progress-text');
const themeToggle = document.getElementById('theme-toggle');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// Load tasks on page load
window.onload = () => {
  renderTasks();
  updateProgress();
};

// Add task
addBtn.addEventListener('click', addTask);
function addTask() {
  const taskText = todoInput.value.trim();
  const priority = prioritySelect.value;

  if (taskText === '') {
    alert('Please enter a task!');
    return;
  }

  const task = {
    id: Date.now(),
    text: taskText,
    priority,
    completed: false,
  };

  tasks.push(task);
  saveTasks();
  renderTasks();
  todoInput.value = '';
}

// Render tasks
function renderTasks() {
  todoList.innerHTML = '';
  tasks.forEach(createTaskElement);
  updateProgress();
}

// Create task element
function createTaskElement(task) {
  const listItem = document.createElement('li');
  listItem.draggable = true;
  listItem.addEventListener('dragstart', handleDragStart);
  listItem.addEventListener('drop', handleDrop);
  listItem.addEventListener('dragover', (e) => e.preventDefault());

  if (task.completed) listItem.classList.add('completed');

  const taskSpan = document.createElement('span');
  taskSpan.textContent = task.text;
  taskSpan.addEventListener('dblclick', () => editTask(task.id));

  const prioritySpan = document.createElement('span');
  prioritySpan.textContent = task.priority.toUpperCase();
  prioritySpan.classList.add('priority', task.priority);

  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = 'Delete';
  deleteBtn.addEventListener('click', () => deleteTask(task.id));

  listItem.appendChild(taskSpan);
  listItem.appendChild(prioritySpan);
  listItem.appendChild(deleteBtn);
  todoList.appendChild(listItem);
}

// Edit task
function editTask(id) {
  const newText = prompt('Edit task:');
  if (newText) {
    const task = tasks.find((t) => t.id === id);
    task.text = newText;
    saveTasks();
    renderTasks();
  }
}

// Delete task
function deleteTask(id) {
  tasks = tasks.filter((t) => t.id !== id);
  saveTasks();
  renderTasks();
}

// Sort tasks
sortSelect.addEventListener('change', () => {
  const sortBy = sortSelect.value;
  if (sortBy === 'name') {
    tasks.sort((a, b) => a.text.localeCompare(b.text));
  } else if (sortBy === 'priority') {
    const priorityOrder = { high: 1, medium: 2, low: 3 };
    tasks.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
  } else if (sortBy === 'status') {
    tasks.sort((a, b) => a.completed - b.completed);
  }
  renderTasks();
});

// Search tasks
searchInput.addEventListener('input', () => {
  const query = searchInput.value.toLowerCase();
  const filteredTasks = tasks.filter((t) => t.text.toLowerCase().includes(query));
  todoList.innerHTML = '';
  filteredTasks.forEach(createTaskElement);
});

// Clear all tasks
clearAllBtn.addEventListener('click', () => {
  if (confirm('Are you sure you want to clear all tasks?')) {
    tasks = [];
    saveTasks();
    renderTasks();
  }
});

// Save tasks
function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Update progress bar
function updateProgress() {
  const completedTasks = tasks.filter((t) => t.completed).length;
  const totalTasks = tasks.length;
  const progress = totalTasks ? (completedTasks / totalTasks) * 100 : 0;
  progressBar.value = progress;
  progressText.textContent = `${Math.round(progress)}% completed`;
}

// Drag-and-drop functionality
let draggedTask;
function handleDragStart(e) {
  draggedTask = tasks.find((t) => t.text === e.target.querySelector('span').textContent);
}

function handleDrop(e) {
  const dropTarget = tasks.find((t) => t.text === e.target.querySelector('span').textContent);
  const draggedIndex = tasks.indexOf(draggedTask);
  const dropIndex = tasks.indexOf(dropTarget);

  tasks.splice(draggedIndex, 1);
  tasks.splice(dropIndex, 0, draggedTask);

  saveTasks();
  renderTasks();
}

// Toggle dark mode
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
});
