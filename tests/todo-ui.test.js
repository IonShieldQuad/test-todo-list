import assert from "node:assert/strict";
import test from "node:test";
import { createTask, deleteTask, MAX_TITLE_LENGTH, toggleTask } from "../app.js";

const tasks = [
  { id: "task-1", title: "First task", completed: false, createdAt: 100 },
  { id: "task-2", title: "Second task", completed: true, createdAt: 200 },
];

test("createTask trims a title and uses the supplied id and time", () => {
  assert.deepEqual(createTask("  Buy oat milk  ", 123, "task-new"), {
    id: "task-new",
    title: "Buy oat milk",
    completed: false,
    createdAt: 123,
  });
});

test("createTask rejects blank and non-string titles", () => {
  assert.equal(createTask("   ", 123, "task-new"), null);
  assert.equal(createTask(42, 123, "task-new"), null);
});

test("createTask rejects titles longer than the configured limit", () => {
  assert.equal(createTask("a".repeat(MAX_TITLE_LENGTH + 1), 123, "task-new"), null);
});

test("toggleTask flips only the selected task in both directions", () => {
  const once = toggleTask(tasks, "task-1");
  const twice = toggleTask(once, "task-1");

  assert.equal(once[0].completed, true);
  assert.equal(once[1].completed, true);
  assert.equal(twice[0].completed, false);
  assert.equal(twice[1].completed, true);
});

test("deleteTask removes only the selected task", () => {
  assert.deepEqual(deleteTask(tasks, "task-1"), [tasks[1]]);
});

test("task operations keep inputs unchanged and unknown IDs are no-ops", () => {
  const original = structuredClone(tasks);
  const toggled = toggleTask(tasks, "missing");
  const deleted = deleteTask(tasks, "missing");

  assert.deepEqual(tasks, original);
  assert.deepEqual(toggled, original);
  assert.deepEqual(deleted, original);
  assert.notEqual(toggled, tasks);
  assert.notEqual(deleted, tasks);
});
