import { ToDo } from "./interfaces/todo-interface";
import { getAllToDos, saveAllToDos } from "./create-new-todo";

export function renderToDos(toDos: ToDo[]) {
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
    const priorityIcon = outerToDoContainer.querySelector(
      ".priorityIcon"
    ) as HTMLImageElement;
    switch (toDo.priority) {
      case "low":
        priorityIcon.src = "/images/flag-variant-outline-green.png";
        break;
      case "medium":
        priorityIcon.src = "/images/flag-variant-outline-orange.png";
        break;
      case "high":
        priorityIcon.src = "/images/flag-variant-outline-red.png";
        break;
    }
    priorityIcon?.addEventListener("click", () => {
      changePriority(toDoIndex);
    });

    const deleteToDoIcon = outerToDoContainer.querySelector(".deleteIcon");
    deleteToDoIcon?.addEventListener("click", () => {
      console.log("aufgerufen");
      deleteToDo(toDoIndex);
    });
    contentContainer?.appendChild(outerToDoContainer);
  });
}

export function deleteToDo(toDoIndex: number) {
  const toDos = getAllToDos();
  toDos.splice(toDoIndex, 1);
  saveAllToDos(toDos);
  renderToDos(toDos);
}

function changePriority(toDoIndex: number) {
  const toDos = getAllToDos();
  const toDo = toDos[toDoIndex];
  switch (toDo.priority) {
    case "low":
      toDo.priority = "medium";
      break;
    case "medium":
      toDo.priority = "high";
      break;
    case "high":
      toDo.priority = "low";
      break;
  }
  saveAllToDos(toDos);
  renderToDos(toDos);
}
