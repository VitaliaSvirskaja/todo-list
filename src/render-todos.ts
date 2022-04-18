import { ToDo } from "./todo-interface";
import { getAllToDos, saveAllToDos } from "./create-new-todo";

export function renderToDos(toDos: ToDo[]) {
  console.log("render");
  const contentContainer = document.querySelector(".content-container");
  contentContainer!.innerHTML = "";
  const toDoTemplate = document.querySelector(
    "#todo-item"
  ) as HTMLTemplateElement;
  toDos.forEach((toDo, toDoIndex) => {
    const outerToDoContainer = document.createElement("div");
    outerToDoContainer.classList.add("todo-item");
    outerToDoContainer.appendChild(toDoTemplate.content.cloneNode(true));
    outerToDoContainer.querySelector(".task")!.textContent = toDo.title;

    const deleteToDoIcon = outerToDoContainer.querySelector(".deleteIcon");
    deleteToDoIcon?.addEventListener("click", () => {
      deleteToDo(toDoIndex);
    });

    contentContainer?.appendChild(outerToDoContainer);
  });
}

export function deleteToDo(ToDoIndex: number) {
  const ToDos = getAllToDos();
  ToDos.splice(ToDoIndex, 1);
  saveAllToDos(ToDos);
  renderToDos(ToDos);
}
