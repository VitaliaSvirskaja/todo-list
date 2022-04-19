import "./todo-items.css";
import { hideOverlay } from "./todo-dialog";
import { ToDo } from "./todo-interface";
import { format } from "date-fns";
import { renderToDos } from "./render-todos";
import { Priority } from "./priority";

const mainElement = document.querySelector("#overlay");

export function initializeNewToDo() {
  const form = document.querySelector("form");
  form?.addEventListener("submit", () => {
    const formData = new FormData(form);
    const date: Date = new Date(String(formData.get("dueDate")));
    const newToDo: ToDo = {
      title: String(formData.get("title")),
      description: String(formData.get("description")),
      dueDate: format(date, "yyyy.MM.dd"),
      priority: formData.get("priority") as Priority,
      project: String(formData.get("project")),
    };
    addAnotherToDo(newToDo);
    mainElement?.classList.remove("blur");
    hideOverlay();
  });
}

function addAnotherToDo(ToDo: ToDo) {
  const allToDos = getAllToDos();
  allToDos.push(ToDo);
  saveAllToDos(allToDos);
  renderToDos(allToDos);
}

export function saveAllToDos(ToDos: ToDo[]) {
  const stringifiedToDos = JSON.stringify(ToDos);
  localStorage.setItem("ToDos", stringifiedToDos);
}

export function getAllToDos(): ToDo[] {
  const stringifiedToDos = localStorage.getItem("ToDos");
  if (stringifiedToDos === null) {
    return [];
  }
  return JSON.parse(stringifiedToDos);
}
