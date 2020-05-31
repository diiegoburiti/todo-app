const listsContainer = document.querySelector('[data-lists]');
const newListForm = document.querySelector('[data-new-list-form]');
const newListInput = document.querySelector('[data-new-list-input]');
const deleteListButton = document.querySelector('[data-delete-list-button]');

const listDisplayContainer = document.querySelector('[data-list-display-container]');
const listCountElement = document.querySelector('[data-list-count]');
const listTitleElement = document.querySelector('[data-list-title]');
const tasksContainer = document.querySelector('[data-tasks]');
const taskTemplate = document.getElementById('task-template');
const newTaskForm = document.querySelector('[data-new-task-form]');
const newTaskInput = document.querySelector('[data-new-task-input]');
const clearCompleteTaskButton = document.querySelector('[data-clear-complete-tasks-button]');

const LOCAL_STORAGE_LIST_KEY = 'task.list';
const LOCAL_STORAGE_SELECTED_LIST_ID_KEY = 'task.selectedListId';
let lists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) || [];
let selectedListId = localStorage.getItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY);

newListForm.addEventListener('submit', event => {
  event.preventDefault()
  const listName = newListInput.value;
  if (listName === null || listName === undefined) return;
  const list = createList(listName);
  newListInput.value = null;
  lists.push(list);
  saveAndRender();
});

newTaskForm.addEventListener('submit', event => {
  event.preventDefault()
  const taskName = newTaskInput.value;
  if (taskName === null || taskName === '') return;
  const task = createTask(taskName);
  newTaskInput.value = null;
  const selectedList = lists.find(list => list.id === selectedListId);
  selectedList.tasks.push(task);
  saveAndRender();
})


function createList(name) {
  return { id: Date.now().toString(), name: name, tasks: [] }
}

function createTask(name) {
  return { id: Date.now().toString(), name: name, complete: false }
}

listsContainer.addEventListener('click', (event) => {
  if (event.target.tagName.toLowerCase() === 'li') {
    selectedListId = event.target.dataset.listId;
    saveAndRender();
  }
})

tasksContainer.addEventListener('click', (event) => {
  if (event.target.tagName.toLowerCase() === 'input') {
    const selectedList = lists.find(list => list.id === selectedListId);
    const selectedTask = selectedList.tasks.find(task => task.id === event.target.id);
    selectedTask.complete = event.target.checked;
    save();
    rederTaskCount(selectedList);
  }
})

deleteListButton.addEventListener('click', (event) => {
  lists = lists.filter(list => list.id !== selectedListId);
  selectedListId = null
  saveAndRender();
})

clearCompleteTaskButton.addEventListener('click', (event) => {
  const selectList = list.find(list => list.id === selectedListId);
  selectList.tasks = selectedList.tasks.filter(task => !task.complete);
  saveAndRender();
})

function saveAndRender() {
  save();
  render();
}

function save() {
  localStorage.setItem(LOCAL_STORAGE_LIST_KEY, JSON.stringify(lists));
  localStorage.setItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY, selectedListId);
}

function render() {
  clearElement(listsContainer)
  renderList();
  const selectList = lists.find(list => list.id === selectedListId)
  if (selectedListId === null) {
    listDisplayContainer.style.display = 'none';
  } else {
    listDisplayContainer.style.display = '';
    listTitleElement.innerText = selectList.name;
    rederTaskCount(selectList);
    clearElement(tasksContainer);
    renderTasks(selectList);
  }
}

function renderTasks(selectList) {
  selectList.tasks.forEach(task => {
    const taskElement = document.importNode(taskTemplate.content, true);
    const checkbox = taskElement.querySelector('input');
    checkbox.id = task.id
    checkbox.checke = task.complete
    const label = taskElement.querySelector('label');
    label.htmlFor = task.id;
    label.append(task.name);
    tasksContainer.appendChild(taskElement);
  });
}

function rederTaskCount(selectList) {
  const incompleteTasks = selectList.tasks.filter(task => !task.complete).length
  const taskString = incompleteTasks === 1 ? 'task' : 'tasks';
  listCountElement.innerText = `${incompleteTasks} ${taskString} remaning`;
}
function renderList() {
  lists.forEach((list) => {
    const listElement = document.createElement('li');
    listElement.dataset.listId = list.id;
    listElement.classList.add('list-name');
    listElement.innerText = list.name;
    if (list.id === selectedListId) {
      listElement.classList.add('active-list');
    }
    listsContainer.appendChild(listElement);
  });
}

function clearElement(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild)
  }
}

render();