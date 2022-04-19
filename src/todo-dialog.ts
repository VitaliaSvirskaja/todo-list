import "./todo-dialog.css";

const dialog = document.querySelector("dialog");
const mainElement = document.querySelector("#overlay");

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
}

function clearField(inputID: string) {
  let inputElement = document.getElementById(inputID) as HTMLInputElement;
  if (inputElement === null) {
    return;
  }
  inputElement.value = "";
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
    dialog?.setAttribute("open", "");
    mainElement?.classList.add("blur");
    showOverlay();
    console.log("test");
  });
}

mainElement?.addEventListener("click", () => {
  dialog?.removeAttribute("open");
  mainElement?.classList.remove("blur");
  hideOverlay();
});
