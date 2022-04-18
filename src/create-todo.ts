import "./create-to-do.css";

const dialog = document.querySelector("dialog");
const mainElement = document.querySelector("#overlay");

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
}

export function createTodo() {
  const createBtn = document.querySelector(".createBtn");
  createBtn?.addEventListener("click", () => {
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
