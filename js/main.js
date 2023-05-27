// SELECTING IMPORTANT ELEMENT FROM DOCUMENT
const main = document.querySelector("main");
const app = document.querySelector(".app");
const appWrapper = document.querySelector(".app-wrapper");
const appColumn1 = document.querySelector(".app-wrapper .column-1");
const appColumn2 = document.querySelector(".app-wrapper .column-2");
const appColumn3 = document.querySelector(".app-wrapper .column-3");
const lightBox = document.querySelector(".lightbox");
const lightBoxWrapper = document.querySelector(".lightbox-wrapper");

// HOME =========================================================
// FUNCTION - EDIT USER NAME
function editUserName(cureentUserName){
  
  const input = createElement("input", {class: "edit-user-name-input", type: "text", placeholder: "Type Your Name", value: cureentUserName});
  const dialogBox = compLightBox("edit-user-name", "Edit Name", input, "Cancel", "Save");

  appendElement(dialogBox, lightBoxWrapper);
  lightBox.classList.add("active");
  input.focus();
  input.setSelectionRange(input.value.length, input.value.length);

  //Events
  // btn-1
  dialogBox.querySelector(".box-btns .btn-1").addEventListener("click", () => {
    lightBox.classList.remove("active");
    dialogBox.remove();
  });

  // btn-2
  dialogBox.querySelector(".box-btns .btn-2").addEventListener("click", () => {
    dbUserName = input.value;
    updateDB();
    reRenderHomePage();
    lightBox.classList.remove("active");
    dialogBox.remove();
  });
}

// FUNCTION - RESET APP
function resetApp(){
  const dialogBox = compLightBox(
    "reset-app",
    "Reset App?",
    "Are you sure you want to reset this app? All the data of this app will be deleted. \nThis action can't be undone.",
    "Cancel",
    "Reset"
  );

  appendElement(dialogBox, lightBoxWrapper);
  lightBox.classList.add("active");

  //Events
  // btn-1
  dialogBox.querySelector(".box-btns .btn-1").addEventListener("click", () => {
    lightBox.classList.remove("active");
    dialogBox.remove();
  });

  // btn-2
  dialogBox.querySelector(".box-btns .btn-2").addEventListener("click", () => {
    resetDB();
    location.reload();
  });
}

// EVENT - RE-RENDER HOME PAGE
function reRenderHomePage() {
  document.querySelector(".home-page")?.remove();
  renderHomePage();
}

// LIST =========================================================
// FUNCTION - RETURN LIST
function returnList(listIds, event) {
  const listsWrapper = createElement("div", {
    class: "lists-wrapper",
  });

  // Process list function
  const processList = (pmListObj) => {
    const count = dbTasks.filter(
      (task) => task.listId === pmListObj.listId
    ).length;

    const listWrapper = createElement("div", {
      class: "list-wrapper",
      list_id: pmListObj.listId,
    });
    const listIcon1 = createElement("span", {
      class: "list-icon list-icon-1",
    });
    const listIcon2 = createElement("span", {
      class: "list-icon list-icon-2",
    });
    const listDataWrapper = createElement("div", {
      class: "list-data-wrapper",
    });
    const listName = createElement(
      "p",
      { class: "list-name" },
      pmListObj.listName
    );
    const listContent = createElement(
      "p",
      { class: "list-content" },
      `${count} ${count <= "1" ? "Task" : "Tasks"}`
    );

    appendElement([listName, listContent], listDataWrapper);
    appendElement([listIcon1, listDataWrapper, listIcon2], listWrapper);
    appendElement(listWrapper, listsWrapper);

    if (event === true) {
      listWrapper.addEventListener("click", () => {
        const tasksNameArray = dbTasks
          .filter((task) => task.listId === pmListObj.listId)
          .map((task) => task.taskName);
        eventRenderListPage(pmListObj.listName, tasksNameArray);
      });
    }
  };

  // if listIds parameter is provide and is an array
  if (listIds && Array.isArray(listIds)) {
    listIds
      .map((listId) => dbLists.find((list) => list.listId === listId))
      .filter(Boolean)
      .forEach(processList);
  }
  // Else process all lists
  else {
    dbLists.forEach(processList);
  }

  return listsWrapper;
}

// FUNCTION - ADD LIST
function addList(heading, name, id, btn_1, btn_2, callback) {
  const input = createElement("input", {
    class: "new-list",
    type: "text",
    placeholder: "Type List Name",
    value: name ? name : "",
  });

  const dialogBox = compLightBox("add-list", heading, input, btn_1, btn_2);

  appendElement(dialogBox, lightBoxWrapper);
  lightBox.classList.add("active");
  input.focus();
  input.setSelectionRange(input.value.length, input.value.length);

  //Events
  // btn-1
  dialogBox.querySelector(".box-btns .btn-1").addEventListener("click", () => {
    lightBox.classList.remove("active");
    dialogBox.remove();
  });

  // btn-2
  dialogBox.querySelector(".box-btns .btn-2").addEventListener("click", () => {
    if (input.value.trim() !== "" && !dbLists.some(list => list.listName === input.value)) {
      console.log("Added")
      dbAddList(input.value, id);
      lightBox.classList.remove("active");
      dialogBox.remove();

      // Call the callback function
      if (typeof callback === "function") {
        callback();
      }
    }
  });
}

// FUNCTION - DELETE LIST
function deleteList(id, callback) {
  const dialogBox = compLightBox(
    "delete-list",
    "Delete This List?",
    "Are you sure you want to delete this list? All tasks within this list will also be deleted.",
    "Cancel",
    "Delete"
  );

  appendElement(dialogBox, lightBoxWrapper);
  lightBox.classList.add("active");

  //Events
  // btn-1
  dialogBox.querySelector(".box-btns .btn-1").addEventListener("click", () => {
    lightBox.classList.remove("active");
    dialogBox.remove();
  });

  // btn-2
  dialogBox.querySelector(".box-btns .btn-2").addEventListener("click", () => {
    dbDeleteList(id);
    appColumn3.classList.remove("active");
    appColumn2.classList.remove("active");
    document.querySelector(".task-page")?.remove();
    document.querySelector(".list-page")?.remove();
    lightBox.classList.remove("active");
    dialogBox.remove();

    // Call the callback function
    if (typeof callback === "function") {
      callback();
    }
  });
}

// EVENT - RENDER LIST PAGE
function eventRenderListPage(listName, tasksNameArray, tasksCompleteStatus) {
  const listPage = document.querySelector(".list-page");

  if (listPage) {
    listPage.remove();
    document.querySelector(".task-page")?.remove();
    appColumn3.classList.remove("active");
  }

  renderListPage(listName, tasksNameArray, tasksCompleteStatus);
  appColumn2.classList.add("active");
}

// EVENT - RE-RENDER LIST PAGE
function reRenderListPage(heading, tasksArray, tasksStatus) {
  document.querySelector(".list-page")?.remove();
  renderListPage(heading, tasksArray, tasksStatus);
}

// EVENT - HELPER RE-RENDER LIS PAGE FOR TASK"S ONLY
function taskreRenderListPage(additionalTaskName, removeTaskName) {
  // Select List Page
  const listPage = document.querySelector(".list-page");

  if (listPage) {
    const listPageName = listPage.querySelector(".section-heading").textContent;

    // Get Current Tasks Array From Current List Page
    const tasksNameArray = Array.from(
      listPage.querySelectorAll(".task-name")
    ).map((taskName) => taskName.textContent);

    // If want to add task name in tasksNameArray
    if (additionalTaskName && !tasksNameArray.includes(additionalTaskName)) {
        tasksNameArray.push(additionalTaskName);
    }
    // If want to remove task name in tasksNameArray
    if (removeTaskName) {
      const index = tasksNameArray.indexOf(removeTaskName);
      if (index !== -1) {
        tasksNameArray.splice(index, 1);
      } else {
        console.log(`Task '${removeTaskName}' not found in the array.`);
      }
    }

    reRenderListPage(listPageName, tasksNameArray);
  }
}

// TASK =========================================================
// FUNCTION - RETURN TASK
function returnTask(pmTasksNameArray, pmTaskCompleteStatus, pmTaskCanEvent) {
  const tasksWrapper = createElement("div", {
    class: "tasks-wrapper tasks-wrapper",
  });

  // Process Task
  const processTasks = (tasks) => {
    tasks.forEach((task) => {
      if (
        pmTaskCompleteStatus === undefined ||
        task.isCompleted === pmTaskCompleteStatus
      ) {
        const taskElement = compTask(task, pmTaskCanEvent);
        appendElement(taskElement, tasksWrapper);
      }
    });
  };

  // Return tasks based on the second parameter
  // if passed array with tasknames
  if (pmTasksNameArray.length >= 0) {
    pmTasksNameArray.forEach((taskName) => {
      const tasks = dbTasks.filter((task) => task.taskName === taskName);
      processTasks(tasks);
    });
  }
  // if not
  else {
    processTasks(dbTasks);
  }

  return tasksWrapper;
}

// FUNCTION - ADD TASK
function addTask(
  lightBoxClass,
  heading,
  wrapperContent,
  firstBtn,
  secondBtn,
  existingName,
  callback
) {
  const arrArg = Array.isArray(wrapperContent) ? wrapperContent : null;

  const [
    taskName,
    taskNotes,
    taskCreatedDate,
    taskCompleteDate,
    taskListId,
    isCompleted,
  ] = arrArg ?? [null, null, null, null, null];

  const optionWrapper = createElement("div", { class: "wrapper" });
  const nameOption = createElement("input", {
    class: "new-task-name",
    type: "text",
    placeholder: "Take Name",
    value: taskName ? taskName : "",
  });

  const notesOption = createElement("input", {
    class: "new-task-notes",
    type: "text",
    placeholder: "Task Note",
    value: taskNotes ? taskNotes : "",
  });

  const dateOption = createElement("input", {
    class: "new-task-date",
    type: "date",
    value: taskCompleteDate
      ? dateFormat(taskCompleteDate)
      : new Date().toISOString().split("T")[0],
  });

  const listOptionWrapper = createElement("div", { class: "new-task-list" });

  let listOption = taskListId
    ? returnList([taskListId])
    : createElement("div", { class: "select-list icon-true" }, "Select List");

  appendElement(listOption, listOptionWrapper);
  appendElement(
    [nameOption, notesOption, dateOption, listOptionWrapper],
    optionWrapper
  );

  const dialogBox = compLightBox(
    lightBoxClass,
    heading,
    optionWrapper,
    firstBtn,
    secondBtn
  );

  appendElement(dialogBox, lightBoxWrapper);
  lightBox.classList.add("active");

  //EVENTS
  // Select List Event Listener
  listOption.addEventListener("click", () => {
    returnTaskId(dialogBox);
  });

  // Select List Function - Return Selected Task Id
  function returnTaskId(siblingElement, previousListId) {
    siblingElement.style.display = "none";

    // Create new dialog box to show all the lists present in db
    const dialogBox = compLightBox(
      lightBoxClass,
      "Select a List",
      returnList(),
      "Cancel",
      "ok"
    );

    appendElement(dialogBox, lightBoxWrapper);

    // Select the task wrapper (each list wrapper)
    const dialogBoxtask = dialogBox.querySelectorAll(".list-wrapper");
    let selectedListId = previousListId ? previousListId : String(1);

    dialogBoxtask.forEach((task) => {
      // Add Eventlistener to each list
      task.addEventListener("click", () => {
        dialogBoxtask.forEach((task) => task.classList.remove("selected"));
        task.classList.add("selected");
        selectedListId = task.getAttribute("list_id");
      });
      // Click that list which has "list_id" attr equals to selectedlistId variable
      if (task.getAttribute("list_id") === selectedListId) {
        task.click();
      }
    });

    // New dialog box btn 1 eventlistener
    dialogBox
      .querySelector(".box-btns .btn-1")
      .addEventListener("click", () => {
        dialogBox.remove();
        siblingElement.style.display = "";
      });

    // New dialog box btn 2 eventlistener
    dialogBox
      .querySelector(".box-btns .btn-2")
      .addEventListener("click", () => {
        listOption.remove();
        updateSelectList(selectedListId);
        dialogBox.remove();
        siblingElement.style.display = "";
      });
  }

  // Select List Function - Update "List"
  function updateSelectList(a) {
    listOption = returnList([a]);
    appendElement(listOption, listOptionWrapper);

    listOption.addEventListener("click", () => {
      returnTaskId(dialogBox, a);
    });
  }

  // btn-1
  dialogBox.querySelector(".box-btns .btn-1").addEventListener("click", () => {
    lightBox.classList.remove("active");
    dialogBox.remove();
  });

  // btn-2
  dialogBox.querySelector(".box-btns .btn-2").addEventListener("click", () => {
    if (
      nameOption.value.trim() &&
      notesOption.value.trim() &&
      dateOption.value.trim() &&
      document.querySelector(".light-box .list-wrapper") &&
      !dbTasks.some(task => task.taskName === nameOption.value)
    ) {
      dbAddTask(
        nameOption.value,
        notesOption.value,
        taskCreatedDate ? taskCreatedDate : new Date(),
        dateOption.value,
        isCompleted ? true : false,
        false,
        document
          .querySelector(".light-box .list-wrapper")
          .getAttribute("list_id"),
        existingName
      );
      reRenderHomePage(); // Render Home Page
      taskreRenderListPage(nameOption.value); // Update List Page if Exist
      eventRenderTaskPage(nameOption.value); // Update task page if exist
      lightBox.classList.remove("active");
      dialogBox.remove();

      // Call the callback function
      if (typeof callback === "function") {
        callback();
      }
    }
  });
}

// FUNCTION - DELETE TASK
function deleteTask(taskName) {
  const dialogBox = compLightBox(
    "delete-task",
    "Delete This Task?",
    "Are you sure you want to delete this task? This can't be undone.",
    "Cancel",
    "Delete"
  );

  appendElement(dialogBox, lightBoxWrapper);
  lightBox.classList.add("active");

  //Events
  // btn-1
  dialogBox.querySelector(".box-btns .btn-1").addEventListener("click", () => {
    lightBox.classList.remove("active");
    dialogBox.remove();
  });

  // btn-2
  dialogBox.querySelector(".box-btns .btn-2").addEventListener("click", () => {
    dbDeleteTask(taskName);
    reRenderHomePage();
    taskreRenderListPage();
    
    appColumn3.classList.remove("active");
    document.querySelector(".task-page")?.remove();
    lightBox.classList.remove("active");
    dialogBox.remove();
  });
}

// FUNCTION - TOGGLE IMPORTANT STATUS OF TASK
function toggleTaskImportant(taskName) {
  let task = dbTasks.find((task) => task.taskName === taskName);
  if (task) {
    task.isImportant = !task.isImportant;
    reRenderTaskPage();
    taskreRenderListPage();
    reRenderHomePage();
  } else {
    console.log("Task not found: " + taskName);
  }
}

// FUNCTION - TOGGLE COMPLETE STATUS OF TASK
function toggleTaskComplete(taskName) {
  let task = dbTasks.find((task) => task.taskName === taskName);
  if (task) {
    task.isCompleted = !task.isCompleted;
    reRenderTaskPage();
    taskreRenderListPage();
    reRenderHomePage();
  } else {
    console.log("Task not found: " + taskName);
  }
}

// EVENT - RENDER TASK PAGE{
function eventRenderTaskPage(taskName) {
  const taskObj = dbTasks.find((taskObj) => taskObj.taskName === taskName);

  document.querySelector(".task-page")?.remove();

  if (taskObj) {
    renderTaskPage(
      taskObj.taskName,
      taskObj.taskNotes,
      taskObj.taskCreatedDate,
      taskObj.taskCompleteDate,
      taskObj.isCompleted,
      taskObj.isImportant,
      taskObj.listId
    );
  }

  appColumn3.classList.add("active");
}

// EVENT - RE-RENDER TASK PAGE
function reRenderTaskPage() {
  const taskPage = document.querySelector(".task-page");
  if (taskPage) {
    taskName = taskPage.querySelector(".task-name").textContent;
    taskPage.remove();
    eventRenderTaskPage(taskName);
  }
}

// MISC. =========================================================
// FUNCTION - CREATE HTML ELEMENTS
function createElement(tagName, attributes = {}, content = "") {
  const element = document.createElement(tagName);

  for (const [key, value] of Object.entries(attributes)) {
    if (typeof value === "function") {
      element.setAttribute(key, value());
    } else {
      element.setAttribute(key, value);
    }
  }

  if (typeof content === "function") {
    const renderedContent = content();
    if (renderedContent instanceof Node) {
      element.appendChild(renderedContent);
    } else {
      element.textContent = renderedContent;
    }
  } else if (content instanceof Node) {
    element.appendChild(content);
  } else {
    element.textContent = content;
  }

  return element;
}

// FUNCTION - APPEND HTML ELEMENT
function appendElement(child, parent) {
  if (Array.isArray(child)) {
    for (let i = 0; i < child.length; i++) {
      parent.appendChild(child[i]);
    }
  } else {
    parent.appendChild(child);
  }
}

// FUNCTION - DATE FORMAT "YYYY-MM-DD"
function dateFormat(date) {
  const currentDate = new Date(date);
  const year = currentDate.getFullYear();
  const month = ("0" + (currentDate.getMonth() + 1)).slice(-2);
  const day = ("0" + currentDate.getDate()).slice(-2);
  const formattedDate = year + "-" + month + "-" + day;
  return formattedDate;
}

// FUNCTION - DATE FORMAT 2 "Month DD YYYY"
function dateFormat2(date) {
  const currentDate = new Date(date);
  const year = currentDate.getFullYear();
  const month = currentDate.toLocaleString("en-US", { month: "long" });
  const day = ("0" + currentDate.getDate()).slice(-2);
  const formattedDate = day + " " + month + " " + year;
  return formattedDate;
}

// COMPONENT - SECTION HEADING
function compSectionHeading(headingTitle, otherHTMLElement, flexDirection) {
  let a = createElement("div", {
    class: `section-heading-wrapper ${
      flexDirection == "row-reverse" ? "row-reverse" : ""
    }`,
  });
  let b = createElement("h2", { class: "section-heading" }, headingTitle);
  let c = createElement("div", { class: "section-heading-content" });

  if (otherHTMLElement) {
    appendElement([b, c], a);
    appendElement(otherHTMLElement, c);
  } else {
    appendElement(b, a);
  }

  return a;
}

// COMPONENT - MIDDLE HEADING
function compMiddleHeading(headingTitle) {
  const a = createElement("div", { class: "middle-heading" });
  const b = createElement(
    "span",
    { class: "middle-heading-wrapper" },
    headingTitle
  );
  appendElement(b, a);
  return a;
}

// COMPONENT - DIALOG BOX
function compLightBox(
  boxName,
  boxHeading,
  boxContent,
  firstButton,
  secondButton
) {
  const box = createElement("div", {
    class: "light-box " + boxName,
    id: boxName,
  });
  const heading = createElement("p", { class: "box-heading" }, boxHeading);
  const content = createElement("div", { class: "box-content" }, boxContent);
  const btns = createElement("div", { class: "box-btns" });
  const btn_1 = createElement("button", { class: "btn-1" }, firstButton);
  const btn_2 = createElement("button", { class: "btn-2" }, secondButton);

  // appendElement(box, boxWrapper)
  appendElement([heading, content, btns], box);
  appendElement([btn_1, btn_2], btns);

  return box;
}

// COMPONENT - TASK WRAPPER (Single task wrapper)
function compTask(taskObject, taskEvent) {
  const taskWrapper = createElement("div", { class: "task-wrapper" });
  const taskIcon1 = createElement("span", {
    class: "task-icon task-icon-1",
  });
  const taskIcon2 = createElement("span", {
    class: `task-icon task-icon-2 ${
      taskObject.isImportant ? "important" : "not-important"
    }`,
  });
  const taskIcon3 = createElement("span", {
    class: `task-icon task-icon-3 ${
      taskObject.isCompleted ? "completed" : "not-completed"
    }`,
  });
  const taskDataWrapper = createElement("div", {
    class: "task-data-wrapper",
  });
  const taskName = createElement(
    "p",
    { class: "task-name" },
    taskObject.taskName
  );
  const taskContent = createElement(
    "p",
    { class: "task-content" },
    taskObject.taskNotes
  );

  appendElement([taskName, taskContent], taskDataWrapper);
  appendElement(
    [taskIcon1, taskDataWrapper, taskIcon2, taskIcon3],
    taskWrapper
  );

  // Icon2 event
  taskIcon2.addEventListener("click", () => {
    toggleTaskImportant(taskObject.taskName);
    if (taskIcon2.classList.contains("not-important")) {
      taskIcon2.classList.replace("not-important", "important");
    } else {
      taskIcon2.classList.replace("important", "not-important");
    }
  });

  // Icon3 event
  taskIcon3.addEventListener("click", () => {
    toggleTaskComplete(taskObject.taskName);
    if (taskIcon3.classList.contains("not-completed")) {
      taskIcon3.classList.replace("not-completed", "completed");
    } else {
      taskIcon3.classList.replace("completed", "not-completed");
    }
  });

  // task wrapper event
  if (taskEvent) {
    taskWrapper.addEventListener("click", (trigger) => {
      if (trigger.target !== taskIcon2 && trigger.target !== taskIcon3) {
        eventRenderTaskPage(taskObject.taskName);
      }
    });
  }

  return taskWrapper;
}

