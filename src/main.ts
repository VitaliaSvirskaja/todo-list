import "./style.css";

interface ToDo {
  title: string;
  description: string;
  dueDate: Date;
  priority: "low" | "medium" | "high";
}
