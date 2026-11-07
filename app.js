export const STORAGE_KEY = "todo-list:v1";
export const MAX_TITLE_LENGTH = 200;

/** @typedef {{ id: string, title: string, completed: boolean, createdAt: number }} Task */
/** @typedef {{ getItem(key: string): string | null, setItem(key: string, value: string): void }} StoragePort */

function isTask(value) {
  return value !== null
    && typeof value === "object"
    && typeof value.id === "string"
    && value.id.length > 0
    && typeof value.title === "string"
    && value.title.length > 0
    && value.title.length <= MAX_TITLE_LENGTH
    && value.title.trim() === value.title
    && typeof value.completed === "boolean"
    && Number.isFinite(value.createdAt)
    && value.createdAt >= 0;
}

function isTaskList(value) {
  if (!Array.isArray(value) || !value.every(isTask)) {
    return false;
  }

  const ids = value.map((task) => task.id);
  return new Set(ids).size === ids.length;
}

/**
 * Read and validate the complete saved task list.
 * @param {StoragePort} [storage]
 * @returns {Task[]}
 */
export function loadTasks(storage) {
  try {
    const store = storage ?? globalThis.localStorage;
    const raw = store.getItem(STORAGE_KEY);
    if (raw === null) {
      return [];
    }

    const parsed = JSON.parse(raw);
    return isTaskList(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * Replace the saved task snapshot.
 * @param {Task[]} tasks
 * @param {StoragePort} [storage]
 * @returns {{ ok: true } | { ok: false }}
 */
export function saveTasks(tasks, storage) {
  try {
    if (!isTaskList(tasks)) {
      return { ok: false };
    }

    const store = storage ?? globalThis.localStorage;
    store.setItem(STORAGE_KEY, JSON.stringify(tasks));
    return { ok: true };
  } catch {
    return { ok: false };
  }
}

/**
 * Create a task from user input.
 * @param {string} title
 * @param {number} [now]
 * @param {string} [id]
 * @returns {Task | null}
 */
export function createTask(title, now = Date.now(), id = globalThis.crypto.randomUUID()) {
  if (typeof title !== "string" || typeof id !== "string" || id.length === 0) {
    return null;
  }

  const normalizedTitle = title.trim();
  if (normalizedTitle.length === 0 || normalizedTitle.length > MAX_TITLE_LENGTH) {
    return null;
  }

  if (!Number.isFinite(now) || now < 0) {
    return null;
  }

  return {
    id,
    title: normalizedTitle,
    completed: false,
    createdAt: now,
  };
}

/**
 * Return a copy of the task list with one task's completion state toggled.
 * @param {Task[]} tasks
 * @param {string} id
 * @returns {Task[]}
 */
export function toggleTask(tasks, id) {
  return tasks.map((task) => task.id === id
    ? { ...task, completed: !task.completed }
    : task);
}

/**
 * Return a copy of the task list with the selected task removed.
 * @param {Task[]} tasks
 * @param {string} id
 * @returns {Task[]}
 */
export function deleteTask(tasks, id) {
  return tasks.filter((task) => task.id !== id);
}

export const STORAGE_NOTICE = "Не удалось сохранить изменения. Они останутся на экране, пока открыта страница.";

function taskWord(count) {
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod10 === 1 && mod100 !== 11) {
    return "задача";
  }
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) {
    return "задачи";
  }
  return "задач";
}

/**
 * Connect the task interface to the list and browser storage.
 * @param {Document} [root]
 * @param {StoragePort} [storagePort]
 * @returns {boolean}
 */
export function initTodoApp(root = globalThis.document, storagePort) {
  if (!root || typeof root.getElementById !== "function") {
    return false;
  }

  const form = root.getElementById("task-form");
  const input = root.getElementById("task-input");
  const list = root.getElementById("task-list");
  const emptyState = root.getElementById("empty-state");
  const feedback = root.getElementById("task-feedback");
  const count = root.getElementById("task-count");
  const progress = root.getElementById("task-progress");

  if (!form || !input || !list || !emptyState || !feedback || !count || !progress) {
    return false;
  }

  let tasks = loadTasks(storagePort);

  function setFeedback(message = "") {
    feedback.textContent = message;
  }

  function render() {
    list.replaceChildren();
    emptyState.hidden = tasks.length > 0;
    count.textContent = `${tasks.length} ${taskWord(tasks.length)}`;

    const completedCount = tasks.filter((task) => task.completed).length;
    progress.textContent = tasks.length === 0
      ? "Начните с первого шага"
      : `Выполнено ${completedCount} из ${tasks.length}`;

    for (const task of tasks) {
      const item = root.createElement("li");
      item.className = task.completed ? "task-item is-complete" : "task-item";

      const checkbox = root.createElement("input");
      checkbox.className = "task-checkbox";
      checkbox.type = "checkbox";
      checkbox.checked = task.completed;
      checkbox.dataset.taskId = task.id;
      checkbox.setAttribute(
        "aria-label",
        task.completed
          ? `Вернуть задачу в активный список: ${task.title}`
          : `Отметить задачу выполненной: ${task.title}`,
      );

      const title = root.createElement("span");
      title.className = "task-title";
      title.textContent = task.title;

      const deleteButton = root.createElement("button");
      deleteButton.className = "delete-button";
      deleteButton.type = "button";
      deleteButton.dataset.taskId = task.id;
      deleteButton.setAttribute("aria-label", `Удалить задачу: ${task.title}`);
      deleteButton.textContent = "×";

      item.append(checkbox, title, deleteButton);
      list.append(item);
    }
  }

  function captureFocus() {
    const active = root.activeElement;
    if (!active || typeof active.closest !== "function" || !list.contains(active)) {
      return null;
    }

    const taskId = active.dataset && active.dataset.taskId;
    if (!taskId) {
      return null;
    }

    const items = [...list.querySelectorAll(".task-item")];
    return {
      taskId,
      control: active.classList.contains("delete-button") ? "delete-button" : "task-checkbox",
      index: items.indexOf(active.closest(".task-item")),
    };
  }

  function restoreFocus(focus) {
    if (!focus) {
      return;
    }

    const same = list.querySelector(`.${focus.control}[data-task-id="${focus.taskId}"]`);
    if (same) {
      same.focus();
      return;
    }

    // The focused row was removed; keep the keyboard position inside the list.
    const items = [...list.querySelectorAll(".task-item")];
    const fallbackItem = items[Math.min(Math.max(focus.index, 0), items.length - 1)];
    const target = (fallbackItem && (fallbackItem.querySelector(`.${focus.control}`)
      || fallbackItem.querySelector(".task-checkbox")))
      || (items.length === 0 ? input : null);
    if (target && typeof target.focus === "function") {
      target.focus();
    }
  }

  function persist(nextTasks) {
    const focus = captureFocus();
    tasks = nextTasks;
    render();
    restoreFocus(focus);
    const result = saveTasks(tasks, storagePort);
    setFeedback(result.ok ? "" : STORAGE_NOTICE);
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const normalizedTitle = input.value.trim();

    if (normalizedTitle.length === 0) {
      setFeedback("Введите название задачи.");
      input.focus();
      return;
    }

    if (normalizedTitle.length > MAX_TITLE_LENGTH) {
      setFeedback(`Задача не должна быть длиннее ${MAX_TITLE_LENGTH} символов.`);
      input.focus();
      return;
    }

    const task = createTask(normalizedTitle);
    if (!task) {
      setFeedback("Не удалось добавить задачу. Проверьте её название.");
      input.focus();
      return;
    }

    input.value = "";
    persist([...tasks, task]);
    input.focus();
  });

  list.addEventListener("change", (event) => {
    const target = event.target;
    if (!target || typeof target.closest !== "function") {
      return;
    }

    const checkbox = target.closest("input[type='checkbox'][data-task-id]");
    if (checkbox && list.contains(checkbox)) {
      persist(toggleTask(tasks, checkbox.dataset.taskId));
    }
  });

  list.addEventListener("click", (event) => {
    const target = event.target;
    if (!target || typeof target.closest !== "function") {
      return;
    }

    const button = target.closest("button[data-task-id]");
    if (button && list.contains(button)) {
      persist(deleteTask(tasks, button.dataset.taskId));
    }
  });

  render();
  return true;
}

if (typeof document !== "undefined") {
  initTodoApp(document);
}
