// FUNCTION - RENDER TASK PAGE
function renderTaskPage(
  taskName,
  taskNotes,
  taskCreatedDate,
  taskCompleteDate,
  isCompleted,
  isImportant,
  listId
) {
  const taskPage = createElement("div", { class: "task-page page" });

  // TOP =========================================================
  const top = createElement("div", { class: "top" });
  const topWrapper = () => {
    const topWrapperParent = createElement("div");

    // Top Container
    const container = createElement("div", { class: "container" });
    const goBack = createElement("span", { class: "go-back icon-true" });
    const moreOptions = createElement(
      "div",
      { class: "more-options" },
      "More Options"
    );

    appendElement([goBack, moreOptions], container);

    const moreOptionsHandler = createElement("span", {
      class: "more-options-handler",
    });

    // More Options Wrapper
    const moreOptionsWrapper = createElement("div", {
      class: "more-options-wrapper",
    });
    const optionEdit = createElement(
      "span",
      { class: "option icon-true edit" },
      "Edit"
    );
    const optionMove = createElement(
      "span",
      { class: "option icon-true move" },
      "Move to"
    );
    const optionDelete = createElement(
      "span",
      { class: "option icon-true delete" },
      "Delete"
    );

    appendElement([optionEdit, optionMove, optionDelete], moreOptionsWrapper);
    appendElement([moreOptionsHandler, moreOptionsWrapper], moreOptions);

    // Events
    moreOptionsHandler.addEventListener("click", () => {
      moreOptionsWrapper.classList.toggle("active");
    });

    document.addEventListener("click", (event) => {
      if (
        !moreOptionsWrapper.contains(event.target) &&
        !moreOptionsHandler.contains(event.target)
      ) {
        moreOptionsWrapper.classList.remove("active");
      }
    });

    goBack.addEventListener("click", () => {
      appColumn3.classList.remove("active");
      document.querySelector(".task-page")?.remove();
    });

    optionEdit.addEventListener("click", () => {
      addTask(
        "edit-task",
        "Edite Task",
        [
          taskName,
          taskNotes,
          taskCreatedDate,
          taskCompleteDate,
          listId,
          isCompleted,
        ],
        "Cancel",
        "Save",
        taskName
      );
    });

    optionMove.addEventListener("click", () => {
      addTask(
        "move-task",
        "Move to Another List",
        [
          taskName,
          taskNotes,
          taskCreatedDate,
          taskCompleteDate,
          listId,
          isCompleted,
        ],
        "Cancel",
        "Move",
        dbTasks.find((obj) => obj.taskName === taskName)?.taskName
      );
    });

    optionDelete.addEventListener("click", () => {
      deleteTask(taskName);
    });

    // Appeding
    appendElement(container, topWrapperParent);
    return topWrapperParent;
  };

  appendElement(topWrapper(), top);

  // MIDDLE =========================================================
  const middle = createElement("div", { class: "middle" });
  const middleWrapper = () => {
    const middleWrapperParent = createElement("div");

    // Info wrapper
    const infoWrapper = createElement("div", { class: "task-info-wrapper" });
    const tName = createElement("h2", { class: "task-name" }, taskName);
    const middleHeading = compMiddleHeading("Task Notes");
    const tNotes = createElement("p", { class: "task-notes" }, taskNotes);
    appendElement([tName, middleHeading, tNotes], infoWrapper);

    // Extra info wrapper
    const extraInfoWrapper = createElement("div", {
      class: "task-extra-info-wrapper",
    });
    const middleHeading2 = compMiddleHeading("Extra Informations");
    const extraInfoBox = createElement("div", { class: "task-extra-info-box" });
    appendElement([middleHeading2, extraInfoBox], extraInfoWrapper);

    // Extra info content
    const tCreatedDate = createElement(
      "p",
      { class: "task-created-date", createdDate: dateFormat2(taskCreatedDate) },
      "Added on"
    );
    const tCompleteDate = createElement(
      "p",
      { class: "task-complete-date", dueDate: dateFormat2(taskCompleteDate) },
      "Due Date"
    );
    const tListName = createElement(
      "p",
      {
        class: "task-list-name",
        listName: dbLists.find((key) => key.listId === listId).listName,
      },
      "List Name"
    );
    const tStatus = createElement(
      "p",
      {
        class: "task-completion-status",
        status: isCompleted === true ? "Task completed" : "Not completed yet",
      },
      "Status"
    );
    appendElement(
      [tCreatedDate, tCompleteDate, tListName, tStatus],
      extraInfoBox
    );

    appendElement([infoWrapper, extraInfoWrapper], middleWrapperParent);

    return middleWrapperParent;
  };

  appendElement(middleWrapper(), middle);

  // BOTTOM =========================================================
  const bottomClass =
    isCompleted === true ? "task-completed" : "task-not-completed";
  const bottomText =
    isCompleted === true ? "Task has been completed." : "Mark as Complete";
  const bottom = createElement(
    "div",
    { class: `bottom button icon-true ${bottomClass}` },
    bottomText
  );

  bottom.addEventListener("click", () => {
    toggleTaskComplete(taskName);
    if (bottom.classList.contains("not-completed")) {
      bottom.classList.replace("not-completed", "completed");
    } else {
      bottom.classList.replace("completed", "not-completed");
    }
  });

  // LIST - Appending and Event =========================================================
  appendElement([top, middle, bottom], taskPage);
  appendElement(taskPage, appColumn3);
}
