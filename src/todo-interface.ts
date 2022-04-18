export interface ToDo {
  title: string;
  description: string;
  dueDate: string;
  priority: "low" | "medium" | "high";
  project: string;
}
