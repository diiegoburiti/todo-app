const listsContainer = document.querySelector('[data-lists]');
const newListForm = document.querySelector('[data-new-list-form]');
const newListInput = document.querySelector('[data-new-list-input]');
const deleteListButton = document.querySelector('[data-delete-list-button]');

const listDisplayContainer = document.querySelector('[data-list-display-container]');
const listCountElement = document.querySelector('[data-list-count]');
const listTitleElement = document.querySelector('[data-list-title]');
const tasksContainer = document.querySelector('[data-tasks]');
const taskTemplate = document.getElementById('task-template');

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
})

listsContainer.addEventListener('click', (event) => {
  if (event.target.tagName.toLowerCase() === 'li') {
    selectedListId = event.target.dataset.listId;
    saveAndRender();
  }
})

deleteListButton.addEventListener('click', (event) => {
  lists = lists.filter(list => list.id !== selectedListId);
  selectedListId = null
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

function createList(name) {
  return { id: Date.now().toString(), name: name, tasks: [] }
}

function render() {
  clearElement(listsContainer)
  renderList();
  const selectList = lists.find(list => list.id === selectedListId)
  if (selectedListId === null) {
    listDisplayContainer.style.display = 'none';
  } else {
    listDisplayContainer.style.display = 'block';
    listTitleElement.innerText = selectList.name;
    rederTaskCount(selectList);
    clearElement(tasksContainer);
    renderTasks(selectList);
  }
}

function renderTasks(selectList) {
  selectList.tasks.forEach(task => {
    const taskElement = document.importNode(taskTemplate.content, true);
    const checkbox = taskElement.querySelector('checkbox');
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