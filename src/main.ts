import "./styles/style.css";
import { createToDoDialog } from "./todo-dialog";
import { getAllToDos, initializeNewToDo } from "./create-new-todo";
import { renderToDos } from "./render-todos";
import { initializeNewProject } from "./create-new-project";

createToDoDialog();
initializeNewToDo();
initializeNewProject();
const toDos = getAllToDos();
renderToDos(toDos);
