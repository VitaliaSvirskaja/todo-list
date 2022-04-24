import { format } from "date-fns";
import { v4 as uuidV4 } from "uuid";

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
let selectedProject: string | null = null;
let selectedtoDoID: string | null = null;

const toDos = getAllToDos();
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
  const toDo: ToDo = {
    id: uuidV4(),
    title: String(formData.get("title")),
    description: String(formData.get("description")),
    dueDate: format(date, "yyyy-MM-dd"),
    priority: formData.get("priority") as Priority,
    project: String(formData.get("project")),
    done: false,
  };
  if (dialogType === "create") {
    addAnotherToDo(toDo);
  } else {
    editTodo(toDo, selectedtoDoID);
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
function editTodo(editedToDo: ToDo, toDoId: string | null) {
  if (toDoId === null) {
    return;
  }
  const allToDos = getAllToDos();
  const indexOfToDoToBeEdited = allToDos.findIndex((toDo) => {
    return toDo.id === toDoId;
  });
  allToDos[indexOfToDoToBeEdited] = editedToDo;
  saveAllToDos(allToDos);
  renderToDos(allToDos);
}

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

function addAnotherToDo(todo: ToDo) {
  const allToDos = getAllToDos();
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
    projectName.classList.add("project");
    projectName.innerHTML = project.name;
    projectName?.addEventListener("click", () => {
      selectedProject = projectName.innerHTML;
      console.log(selectedProject);
      renderToDos(getAllToDos());
    });
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
  defaultOption.setAttribute("disabled", "");
  projectSelection?.appendChild(defaultOption);
  projects.forEach((project) => {
    const projectOption = document.createElement("option");
    projectOption.value = project.name;
    projectOption.innerHTML = project.name;
    projectSelection?.appendChild(projectOption);
  });
}

function renderToDos(toDos: ToDo[]) {
  const selectedToDos = toDos.filter(
    (todo) => todo.project === selectedProject
  );
  const contentContainer = document.querySelector(".content-container");
  contentContainer!.innerHTML = "";
  const toDoTemplate = document.querySelector(
    "#todo-item"
  ) as HTMLTemplateElement;
  selectedToDos.forEach((toDo) => {
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
      changePriority(toDo.id);
    });

    const deleteToDoIcon = outerToDoContainer.querySelector(".deleteIcon");
    deleteToDoIcon?.addEventListener("click", () => {
      deleteToDo(toDo.id);
    });
    const editIcon = outerToDoContainer?.querySelector(".editIcon");
    editIcon?.addEventListener("click", () => {
      dialogType = "edit";
      selectedtoDoID = toDo.id;
      fillInputs(toDo);
      openTodoDialog();
    });

    const checkboxToDo = outerToDoContainer.querySelector(
      ".checkbox"
    ) as HTMLInputElement;
    checkboxToDo?.addEventListener("click", () => switchDoneState(toDo.id));

    const task = outerToDoContainer.querySelector(".task") as HTMLLabelElement;
    if (toDo.done) {
      checkboxToDo.setAttribute("checked", "");
      task.style.textDecoration = "line-through";
    } else {
      checkboxToDo.removeAttribute("checked");
      task.style.textDecoration = "none";
    }

    contentContainer?.appendChild(outerToDoContainer);
  });
  renderProjects();
}

function switchDoneState(toDoID: string) {
  const allToDos = getAllToDos();
  let toDoToBeMarkedDone = allToDos.find((todo) => {
    return todo.id === toDoID;
  });
  if (toDoToBeMarkedDone === undefined) {
    return;
  }
  toDoToBeMarkedDone.done = !toDoToBeMarkedDone.done;

  saveAllToDos(allToDos);
  renderToDos(allToDos);
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

function deleteToDo(toDoId: string) {
  const toDos = getAllToDos();
  const toDoToBeDeleted = toDos.filter((toDo) => {
    return toDo.id !== toDoId;
  });
  saveAllToDos(toDoToBeDeleted);
  renderToDos(toDoToBeDeleted);
}

function changePriority(toDoId: string) {
  const toDos = getAllToDos();
  const toDoToBeChanged = toDos.find((todo) => {
    return todo.id === toDoId;
  });
  if (toDoToBeChanged === undefined) {
    return;
  }
  switch (toDoToBeChanged.priority) {
    case "low":
      toDoToBeChanged.priority = "medium";
      break;
    case "medium":
      toDoToBeChanged.priority = "high";
      break;
    case "high":
      toDoToBeChanged.priority = "low";
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

function getAllToDos(): ToDo[] {
  const stringifiedToDos = localStorage.getItem("todos");
  const toDos: ToDo[] = JSON.parse(stringifiedToDos ?? "[]");
  return toDos;
}

// function showToDosofProject() {
//   const todos = getToDosFromProject();
//   renderToDos(todos);
// }

function saveAllToDos(todos: ToDo[]) {
  const stringifiedTodos = JSON.stringify(todos);
  localStorage.setItem("todos", stringifiedTodos);
}
