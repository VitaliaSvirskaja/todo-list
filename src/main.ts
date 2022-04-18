import "./style.css";
import { createToDoDialog } from "./todo-dialog";
import { getAllToDos, initializeNewToDo } from "./create-new-todo";
import { renderToDos } from "./render-todos";

createToDoDialog();
initializeNewToDo();
const ToDos = getAllToDos();
renderToDos(ToDos);
