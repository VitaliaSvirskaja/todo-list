import "./styles/todo-dialog.css";
import { clearField } from "./utils";
import { closeNewProjectDialog } from "./create-new-project";

const todoDialog = document.querySelector("#new-todo-dialog");
const overlay = document.querySelector("#overlay");

function changeOverlay(string: "none" | "block") {
  let overlay = document.getElementById("overlay");
  if (overlay === null) {
    return;
  }
  overlay.style.display = string;
}

export function showOverlay() {
  changeOverlay("block");
}
export function hideOverlay() {
  changeOverlay("none");
  overlay?.classList.remove("blur");
}

function clearAllFields() {
  clearField("title");
  clearField("description");
  clearField("dueDate");
}

export function createToDoDialog() {
  const createBtn = document.querySelector(".createBtn");
  createBtn?.addEventListener("click", () => {
    clearAllFields();
    todoDialog?.setAttribute("open", "");
    overlay?.classList.add("blur");
    showOverlay();
    console.log("test");
  });
}

overlay?.addEventListener("click", () => {
  todoDialog?.removeAttribute("open");
  hideOverlay();
  closeNewProjectDialog();
});
