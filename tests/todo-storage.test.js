import assert from "node:assert/strict";
import test from "node:test";
import { loadTasks, MAX_TITLE_LENGTH, saveTasks, STORAGE_KEY } from "../app.js";

const validTasks = [
  { id: "task-1", title: "Buy oat milk", completed: false, createdAt: 100 },
  { id: "task-2", title: "Read a chapter", completed: true, createdAt: 200 },
];

function createStorage(initialValue = null) {
  let value = initialValue;
  return {
    getItem(key) {
      assert.equal(key, STORAGE_KEY);
      return value;
    },
    setItem(key, nextValue) {
      assert.equal(key, STORAGE_KEY);
      value = nextValue;
    },
  };
}

test("loadTasks returns an empty list when the key is absent", () => {
  assert.deepEqual(loadTasks(createStorage()), []);
});

test("saveTasks and loadTasks preserve task order and completion state", () => {
  const storage = createStorage();

  assert.deepEqual(saveTasks(validTasks, storage), { ok: true });
  assert.deepEqual(loadTasks(storage), validTasks);
});

test("loadTasks rejects malformed JSON and invalid snapshots as a whole", () => {
  const invalidSnapshots = [
    "{not json",
    JSON.stringify({ tasks: validTasks }),
    JSON.stringify([validTasks[0], { ...validTasks[1], completed: "yes" }]),
    JSON.stringify([validTasks[0], { ...validTasks[1], id: validTasks[0].id }]),
  ];

  for (const raw of invalidSnapshots) {
    assert.deepEqual(loadTasks(createStorage(raw)), []);
  }
});

test("loadTasks returns an empty list when reading storage throws", () => {
  const storage = { getItem() { throw new Error("blocked"); } };
  assert.deepEqual(loadTasks(storage), []);
});

test("saveTasks rejects invalid and over-limit task data", () => {
  const storage = createStorage();
  const tooLong = { ...validTasks[0], title: "a".repeat(MAX_TITLE_LENGTH + 1) };

  assert.deepEqual(saveTasks([tooLong], storage), { ok: false });
  assert.deepEqual(saveTasks([validTasks[0], { ...validTasks[1], id: validTasks[0].id }], storage), { ok: false });
  assert.deepEqual(saveTasks([{ ...validTasks[0], title: "  " }], storage), { ok: false });
});

test("saveTasks reports storage write errors without throwing", () => {
  const storage = { setItem() { throw new Error("quota exceeded"); } };
  assert.deepEqual(saveTasks(validTasks, storage), { ok: false });
});
