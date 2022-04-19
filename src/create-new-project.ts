import { hideOverlay, showOverlay } from "./todo-dialog";
import { clearField } from "./utils";
import { Project } from "./interfaces/project-interface";

const projectDialog = document.querySelector("#new-project-dialog");
const overlay = document.querySelector("#overlay");
const openNewProjectDialogBtn = document.querySelector(
  "#open-new-project-dialog"
);
const closeProjectDialogBtn = document.querySelector("#close-project-dialog");
const newProjectForm = document.querySelector(
  "#new-project-form"
) as HTMLFormElement;

export function initializeNewProject() {
  openNewProjectDialogBtn?.addEventListener("click", () => {
    projectDialog?.setAttribute("open", "");
    overlay?.classList.add("blur");
    showOverlay();
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
}

export function closeNewProjectDialog() {
  projectDialog?.removeAttribute("open");
  hideOverlay();
  clearField("new-project");
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

export function renderProjects() {
  const projectList = document.querySelector(".projectList");
  projectList!.innerHTML = "";
  const projects = getProjects();
  projects.forEach((project) => {
    const projectName = document.createElement("div");
    projectName.innerHTML = project.name;
    projectList?.appendChild(projectName);
  });
}
