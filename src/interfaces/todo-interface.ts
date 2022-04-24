export interface ToDo {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: "low" | "medium" | "high";
  project: string;
  done: boolean;
}
