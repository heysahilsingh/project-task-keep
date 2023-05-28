// GETTING DATA START =========================================
// User name
let dbUserName = localStorage.getItem("userName")
  ? localStorage.getItem("userName")
  : null;

// Lists
let dbLists = getDB("dbLists", true);
// Lists Counter
let dbListsCounter = getDB("dbListsCounter", true);

// Tasks
let dbTasks = getDB("dbTasks", true);
// GETTING DATA END =========================================


// FUNCTION - DB ADD LIST
function dbAddList(name, lid) {
  if (lid) {
    const existingListIndex = dbLists.findIndex((obj) => obj.listId === lid);
    if (existingListIndex !== -1) {
      const existingList = dbLists[existingListIndex];
      existingList.listName = name;
      existingList.listId = lid;
      updateDB();
    }
  } else {
    const id = dbListsCounter.toString();
    dbLists.push({ listName: name, listId: id });
    dbListsCounter++; // Increment the counter for the next ID
    updateDB();
  }
}

// FUNCTION - DB DELETE LIST
function dbDeleteList(id) {
  dbLists = dbLists.filter((obj) => obj.listId !== id);
  dbTasks = dbTasks.filter((obj) => obj.listId !== id);
  updateDB();
}

// FUNCTION - DB ADD TASK
function dbAddTask(
  name,
  notes,
  createdDate,
  completeDate,
  isCompleted,
  isImportant,
  listId,
  existingName
) {
  const newTask = {
    taskName: name,
    taskNotes: notes,
    taskCreatedDate: dateFormat(createdDate),
    taskCompleteDate: dateFormat(completeDate),
    isCompleted,
    isImportant,
    listId,
  };

  const existingTaskIndex = dbTasks.findIndex(
    (obj) => obj.taskName === existingName
  );

  if (existingTaskIndex !== -1) {
    const existingTask = dbTasks[existingTaskIndex];
    Object.assign(existingTask, newTask);
  } else {
    dbTasks.push(newTask);
  }

  updateDB();
}

// FUNCTION - DB DELETE TASK
function dbDeleteTask(taskName) {

  const existingTaskIndex = dbTasks.findIndex(
    (obj) => obj.taskName === taskName
  );

  if (existingTaskIndex !== -1) {
    dbTasks.splice(existingTaskIndex, 1);
  }

}

// FUNCTION - UPDATE DB
function updateDB() {
  localStorage.clear();
  saveDB("userName", dbUserName);
  saveDB("dbLists", dbLists, true);
  saveDB("dbListsCounter", dbListsCounter, true);
  saveDB("dbTasks", dbTasks, true);
}

// FUNCTION - SAVE DB
function saveDB(key, value, strigify) {
  if (strigify === true) {
    localStorage.setItem(key, JSON.stringify(value));
  } else {
    localStorage.setItem(key, value);
  }
}

// FUNCTION - GET DB
function getDB(item, parse) {
  if (parse === true) {
    return JSON.parse(localStorage.getItem(item));
  } else {
    return localStorage.getItem(item);
  }
}


// FUNCTION -RESET DB
function resetDB() {
  localStorage.clear();
  location.reload();
}
