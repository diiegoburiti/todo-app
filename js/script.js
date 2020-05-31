const listsContainer = document.querySelector('[data-lists]');
const newListForm = document.querySelector('[data-new-list-form]');
const newListInput = document.querySelector('[data-new-list-input]');

let lists = [{ id: 1, name: "name", }, { id: 2, name: "todo", }]

newListForm.addEventListener('submit', event => {
  event.preventDefault()
  const listName = newListInput.value;
  if (listName === null || listName === undefined) return;
  const list = createList(listName);
  newListInput.value = null;
  lists.push(list);
  render();
})

function createList(name) {
  return { id: Date.now().toString(), name: name, tasks: [] }
}

function render() {
  clearElement(listsContainer)
  lists.forEach((list) => {
    const listElement = document.createElement('li');
    listElement.classList.add('list-name');
    listElement.innerText = list.name;
    listsContainer.appendChild(listElement);
  });

  function clearElement(element) {
    while (element.firstChild) {
      element.removeChild(element.firstChild)
    }
  }
}

render();