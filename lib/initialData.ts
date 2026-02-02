export interface Task {
  id: string;
  content: string;
}

export interface Column {
  id: string;
  title: string;
  tasks: Task[];
}

export interface KanbanData {
  columns: Record<string, Column>;
  columnOrder: string[];
}

const initialData: KanbanData = {
  columns: {
    todo: {
      id: "todo",
      title: "To Do",
      tasks: [{ id: "task-1", content: "Learn Next.js" }]
    },
    inprogress: {
      id: "inprogress",
      title: "In Progress",
      tasks: [{ id: "task-2", content: "Build Kanban Board" }]
    },
    done: {
      id: "done",
      title: "Done",
      tasks: []
    }
  },
  columnOrder: ["todo", "inprogress", "done"]
};

export default initialData;
