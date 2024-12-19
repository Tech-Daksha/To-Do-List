document.getElementById('add-button').addEventListener('click', addTask);

function addTask() {
  const taskInput = document.getElementById('todo-input');
  const taskText = taskInput.value.trim();

  if (taskText === '') {
    alert('Please enter a task!');
    return;
  }

  const todoList = document.getElementById('todo-list');

  const listItem = document.createElement('li');
  listItem.className = 'todo-item';

  const taskSpan = document.createElement('span');
  taskSpan.textContent = taskText;

  const deleteButton = document.createElement('button');
  deleteButton.textContent = '✔️ Done';
  deleteButton.addEventListener('click', () => {
    listItem.classList.add('fade-out');
    setTimeout(() => {
      todoList.removeChild(listItem);
    }, 500);
  });

  listItem.appendChild(taskSpan);
  listItem.appendChild(deleteButton);

  todoList.appendChild(listItem);

  taskInput.value = '';
}
