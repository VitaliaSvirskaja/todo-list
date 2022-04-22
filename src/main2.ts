import { format } from "date-fns";

import { clearField } from "./utils";

import { Project } from "./interfaces/project-interface";
import { DialogType } from "./interfaces/dialogType";
import { ToDo } from "./interfaces/todo-interface";
import { Priority } from "./interfaces/priority";

import "./styles/style.css";
import "./styles/todo-items.css";
import "./styles/todo-dialog.css";

// SELECTORS
const projectDialog = document.querySelector("#new-project-dialog");
const overlay = document.querySelector("#overlay");
const openNewProjectDialogBtn = document.querySelector(
  "#open-new-project-dialog"
);
const closeProjectDialogBtn = document.querySelector("#close-project-dialog");
const newProjectForm = document.querySelector(
  "#new-project-form"
) as HTMLFormElement;
const form = document.querySelector("#new-todo-form") as HTMLFormElement;
const todoDialog = document.querySelector("#new-todo-dialog");
const createBtn = document.querySelector(".createBtn");

// VARIABLES
let dialogType: DialogType = "create";
// TODO: event listener, welche den Wert des selektierten Projekts ändern
let selectedProject: string | null = null;

const toDos = getToDosFromProject();
renderToDos(toDos);

// EVENT LISTENER
openNewProjectDialogBtn?.addEventListener("click", () => {
  openProjectDialog();
});
closeProjectDialogBtn?.addEventListener("click", () => {
  closeNewProjectDialog();
});
newProjectForm.addEventListener("submit", () => {
  const formData = new FormData(newProjectForm);
  createNewProject(String(formData.get("new-project")));
  closeNewProjectDialog();
  renderProjects();
});
form?.addEventListener("submit", () => {
  const formData = new FormData(form);
  const date: Date = new Date(String(formData.get("dueDate")));
  const newToDo: ToDo = {
    title: String(formData.get("title")),
    description: String(formData.get("description")),
    dueDate: format(date, "yyyy-MM-dd"),
    priority: formData.get("priority") as Priority,
    project: String(formData.get("project")),
  };
  if (dialogType === "create") {
    addAnotherToDo(newToDo);
  } else {
    const allToDos = getToDosFromProject();

    saveAllToDos(allToDos);
  }
  hideOverlay();
});

overlay?.addEventListener("click", () => {
  todoDialog?.removeAttribute("open");
  hideOverlay();
  closeNewProjectDialog();
});
createBtn?.addEventListener("click", () => {
  dialogType = "create";
  resetToDoForm();
  openTodoDialog();
});

// FUNCTIONS
function openTodoDialog() {
  todoDialog?.setAttribute("open", "");
  overlay?.classList.add("blur");
  showOverlay();
}

function openProjectDialog() {
  projectDialog?.setAttribute("open", "");
  overlay?.classList.add("blur");
  showOverlay();
}

function closeNewProjectDialog() {
  projectDialog?.removeAttribute("open");
  hideOverlay();
  clearField("new-project");
}

function editTodo(todo: ToDo, index: number) {
  // TODO: Implement
}

function addAnotherToDo(todo: ToDo) {
  const allToDos = getToDosFromProject();
  allToDos.push(todo);
  saveAllToDos(allToDos);
  renderToDos(allToDos);
}

function createNewProject(projectName: string) {
  const newProject: Project = {
    name: projectName,
    toDos: [],
  };
  const projects = getProjects();
  projects.push(newProject);
  saveProjects(projects);
}

function getProjects(): Project[] {
  const stringifiedProjects = localStorage.getItem("projects");
  return JSON.parse(stringifiedProjects ?? "[]");
}

function saveProjects(projects: Project[]) {
  const stringifiedProjects = JSON.stringify(projects);
  localStorage.setItem("projects", stringifiedProjects);
}

function renderProjects() {
  const projectList = document.querySelector(".projectList");
  projectList!.innerHTML = "";
  const projects = getProjects();
  projects.forEach((project) => {
    const projectName = document.createElement("div");
    projectName.innerHTML = project.name;
    projectList?.appendChild(projectName);
  });
  updateProjectSelection(projects);
}

function updateProjectSelection(projects: Project[]) {
  const projectSelection = document.querySelector("#project");
  projectSelection!.innerHTML = "";
  const defaultOption = document.createElement("option");
  defaultOption.value = "default";
  defaultOption.innerHTML = "Choose a project";
  projectSelection?.appendChild(defaultOption);
  projects.forEach((project) => {
    const projectOption = document.createElement("option");
    projectOption.value = project.name;
    projectOption.innerHTML = project.name;
    projectSelection?.appendChild(projectOption);
  });
}

function renderToDos(toDos: ToDo[]) {
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
      deleteToDo(toDoIndex);
    });
    const editIcon = outerToDoContainer?.querySelector(".editIcon");
    editIcon?.addEventListener("click", () => {
      dialogType = "edit";
      fillInputs(toDo);
      openTodoDialog();
    });

    contentContainer?.appendChild(outerToDoContainer);
  });
  renderProjects();
}

function fillInputs(toDo: ToDo) {
  const titleInput = document.querySelector("#title") as HTMLInputElement;
  titleInput.value = toDo.title;
  const descriptionInput = document.querySelector(
    "#description"
  ) as HTMLInputElement;
  descriptionInput.value = toDo.description;
  const dueDateInput = document.querySelector("#dueDate") as HTMLInputElement;
  dueDateInput.value = toDo.dueDate;
  const priorityInput = document.querySelector("#priority") as HTMLInputElement;
  priorityInput.value = toDo.priority;
  const projectInput = document.querySelector("#project") as HTMLInputElement;
  projectInput.value = toDo.project;
}

function deleteToDo(toDoIndex: number) {
  const toDos = getToDosFromProject();
  toDos.splice(toDoIndex, 1);
  saveAllToDos(toDos);
  renderToDos(toDos);
}
function changePriority(toDoIndex: number) {
  const toDos = getToDosFromProject();
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

function changeOverlay(string: "none" | "block") {
  let overlay = document.getElementById("overlay");
  if (overlay === null) {
    return;
  }
  overlay.style.display = string;
}

function showOverlay() {
  changeOverlay("block");
}
function hideOverlay() {
  changeOverlay("none");
  overlay?.classList.remove("blur");
}

function resetToDoForm() {
  clearField("title");
  clearField("description");
  clearField("dueDate");
  let prioritySelection = document.querySelector(
    "#priority"
  ) as HTMLSelectElement;
  prioritySelection.value = "default";
  let projectSelection = document.querySelector(
    "#project"
  ) as HTMLSelectElement;
  projectSelection.value = "default";
}

function getToDosFromProject() {
  const stringifiedTodos = localStorage.getItem("todos");
  const todos: ToDo[] = JSON.parse(stringifiedTodos ?? "[]");
  todos.filter((todo) => todo.project === selectedProject);
  return todos;
}

function saveAllToDos(todos: ToDo[]) {
  const stringifiedTodos = JSON.stringify(todos);
  localStorage.setItem("todos", stringifiedTodos);
}
