// FUNCTION - RENDER LIST PAGE
function renderListPage(
  pmPageHeading,
  pmTasksNameArray,
  pmTasksCompleteStatus
) {
  const listPage = createElement("div", { class: "list-page page" });

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

    appendElement(
      dbLists.find(
        (list) =>
          list.listName == pmPageHeading && list.listName != "Default List"
      )
        ? [goBack, moreOptions]
        : goBack,
      container
    );

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
      "Edit List Name"
    );
    const optionDelete = createElement(
      "span",
      { class: "option icon-true delete" },
      "Delete This List"
    );

    appendElement([moreOptionsHandler, moreOptionsWrapper], moreOptions);
    appendElement([optionEdit, optionDelete], moreOptionsWrapper);

    // Search Bar
    const searchBar = createElement("div", { class: "search icon-true" });
    const searchInput = createElement("input", {
      type: "search",
      placeholder: "Search task here",
    });

    appendElement(searchInput, searchBar);

    // TOP - APPENDING AND EVENTS
    // APPENDING
    appendElement([container, searchBar], topWrapperParent);

    // EVENTS
    // More options wrappper
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

    // Go back
    goBack.addEventListener("click", () => {
      appColumn3.classList.remove("active");
      appColumn2.classList.remove("active");
      document.querySelector(".task-page")?.remove();
      document.querySelector(".list-page")?.remove();
    });

    // Option Edit
    optionEdit.addEventListener("click", () => {
      let pageHeadingElement = document.querySelector(
        ".list-page .section-heading"
      );
  
      let pageHeading = pageHeadingElement
        ? pageHeadingElement.textContent
        : pmPageHeading;
  
      const listId = dbLists.find(
        (obj) => obj.listName === pmPageHeading
      )?.listId;

      addList("Edit List", pageHeading, listId, "Cancel", "Save", () => {
        const listName = dbLists.find((obj) => obj.listId === listId)?.listName;
        pageHeading = listName;
        reRenderListPage(pageHeading, pmTasksNameArray, pmTasksCompleteStatus);
        reRenderHomePage();
        reRenderTaskPage();
      });
    });

    // Option Delete
    optionDelete.addEventListener("click", () => {
      const listId = dbLists.find(
        (obj) => obj.listName === pmPageHeading
      )?.listId
      deleteList(listId, () => {
        reRenderHomePage();
      });
    });

    return topWrapperParent;
  };

  // MIDDLE =========================================================
  const middle = createElement("div", { class: "middle" });
  const middleWrapper = () => {
    const middleWrapperParent = createElement("div");

    const sectionHeading = compSectionHeading(
      pmPageHeading,
      createElement("div", {
        class: "icon icon-true " + pmPageHeading,
      }),
      "row-reverse"
    );
    const sectionContent = createElement("div", { class: "section-content" });

    // Completed Task Section
    const completedSection = createElement("div", {
      class: "completed-task-section",
    });
    const completedHeading = compMiddleHeading("Completed");
    const completedTasks = returnTask(pmTasksNameArray, true, true);
    appendElement([completedHeading, completedTasks], completedSection);

    // Uncompleted Task Section
    const unompletedSection = createElement("div", {
      class: "uncompleted-task-section",
    });
    const unompletedHeading = compMiddleHeading("Not Completed");
    const unompletedTasks = returnTask(pmTasksNameArray, false, true);
    appendElement([unompletedHeading, unompletedTasks], unompletedSection);

    // Append task section as per the status value
    const sectionToAppend =
      pmTasksCompleteStatus === true
        ? completedSection
        : pmTasksCompleteStatus === false
        ? unompletedSection
        : [unompletedSection, completedSection];
    appendElement(sectionToAppend, sectionContent);

    // MIDDLE - Appendng and Events
    appendElement([sectionHeading, sectionContent], middleWrapperParent);

    return middleWrapperParent;
  };

  // BOTTOM =========================================================
  const bottom = createElement(
    "div",
    { class: "bottom button icon-true" },
    "New Task"
  );

  bottom.addEventListener("click", () => {
    addTask(
      "add-task",
      "Add New Task",
      undefined,
      "Cancel",
      "Save",
      undefined,
      () => {
        reRenderHomePage();
      }
    );
  });

  // HOME - Appending and Event =========================================================
  appendElement(topWrapper(), top);
  appendElement(middleWrapper(), middle);
  appendElement([top, middle, bottom], listPage);
  appendElement([listPage], appColumn2);
}
