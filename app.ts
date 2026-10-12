
import {
  Task,
  TaskStatus,
  addTask,
  completeTask,
  filterByStatus,
  deleteTask
} from "./model.js";

let tasks: Task[] = [];
let currentFilter: "all" | TaskStatus = "all";

const titleInput = document.getElementById("title") as HTMLInputElement;
const addButton = document.getElementById("add") as HTMLButtonElement;
const list = document.getElementById("list") as HTMLUListElement;
const chips = document.getElementById("chips") as HTMLDivElement;
const emptyMessage = document.getElementById("empty") as HTMLParagraphElement;

function render(): void {
  list.innerHTML = "";

  const visibleTasks =
    currentFilter === "all"
      ? tasks
      : filterByStatus(tasks, currentFilter);

  emptyMessage.style.display =
    visibleTasks.length === 0 ? "block" : "none";

  visibleTasks.forEach((task) => {
    const item = document.createElement("li");
    item.className = "task";

    const taskTitle = document.createElement("span");
    taskTitle.className = "task-title";
    taskTitle.textContent = task.title;

    const badge = document.createElement("span");
    badge.className = "badge";
    badge.textContent = task.status;

    const advanceButton = document.createElement("button");

    if (task.status === "todo") {
      advanceButton.textContent = "Start →";
      advanceButton.onclick = () => {
        tasks = tasks.map((currentTask) =>
          currentTask.id === task.id
            ? { ...currentTask, status: "in-progress" }
            : currentTask
        );
        render();
      };
    } else if (task.status === "in-progress") {
      advanceButton.textContent = "Complete ✓";
      advanceButton.onclick = () => {
        tasks = completeTask(tasks, task.id);
        render();
      };
    } else {
      advanceButton.textContent = "Done ✓";
      advanceButton.disabled = true;
    }

    const deleteButton = document.createElement("button");
    deleteButton.className = "delete";
    deleteButton.textContent = "✕";
    deleteButton.setAttribute("aria-label", "Delete " + task.title);
    deleteButton.onclick = () => {
      tasks = deleteTask(tasks, task.id);
      render();
    };

    item.append(taskTitle, badge, advanceButton, deleteButton);
    list.appendChild(item);
  });
}

addButton.onclick = () => {
  const title = titleInput.value.trim();

  if (title === "") {
    titleInput.focus();
    return;
  }

  tasks = addTask(tasks, title);
  titleInput.value = "";
  render();
};

titleInput.addEventListener("keydown", (event: KeyboardEvent) => {
  if (event.key === "Enter") {
    addButton.click();
  }
});

chips.querySelectorAll("button").forEach((button) => {
  button.onclick = () => {
    const selectedFilter = button.dataset.filter;

    if (
      selectedFilter === "all" ||
      selectedFilter === "todo" ||
      selectedFilter === "in-progress" ||
      selectedFilter === "done"
    ) {
      currentFilter = selectedFilter;
      chips.querySelectorAll("button").forEach((chip) => {
        chip.classList.remove("active");
      });
      button.classList.add("active");
      render();
    }
  };
});

render();
