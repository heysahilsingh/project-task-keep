// FUNCTION - RENDER HOME PAGE
function renderHomePage() {
  const homePage = createElement("div", { class: "home-page page" });

  // TOP =========================================================
  const top = createElement("div", { class: "top" });
  const topWrapper = () => {
    const topWrapperParent = createElement("div");
    // Top Container
    const container = createElement("div", { class: "container" });
    const userName = createElement("p", { class: "user-name" }, dbUserName);
    const moreOptions = createElement(
      "div",
      { class: "more-options" },
      "More Options"
    );
    const moreOptionsHandler = createElement("span", {
      class: "more-options-handler",
    });

    // More Options Wrapper
    const moreOptionsWrapper = createElement("div", {
      class: "more-options-wrapper",
    });
    const optionEditUserName = createElement(
      "span",
      { class: "option icon-true my-name" },
      "Edit My Name"
    );
    const optionResetApp = createElement(
      "span",
      { class: "option icon-true reset" },
      "Reset App"
    );
    const optionSupportMe = createElement(
      "span",
      { class: "option icon-true support" },
      "Support"
    );

    appendElement(
      [optionEditUserName, optionSupportMe, optionResetApp],
      moreOptionsWrapper
    );
    appendElement([moreOptionsHandler, moreOptionsWrapper], moreOptions);
    appendElement([userName, moreOptions], container);

    // Search Bar
    const searchBar = createElement("div", { class: "search icon-true" });
    const searchInput = createElement("input", {
      type: "search",
      placeholder: "Search task here",
    });

    appendElement(searchInput, searchBar);

    // TOP - Appendng and Events
    // Container and Search Bar in Top
    appendElement([container, searchBar], topWrapperParent);

    // More Options Handler Event
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

    // Edit User Name
    optionEditUserName.addEventListener("click", () => {
      editUserName(dbUserName)
    })

    // Reset App
    optionResetApp.addEventListener("click", resetApp)

    return topWrapperParent;
  };

  // MIDDLE =========================================================
  const middle = createElement("div", { class: "middle" });
  const middleWrapper = () => {
    const middleWrapperParent = createElement("div");

    // Default List
    const dListSection = createElement("div", {
      class: "default-list-section",
    });
    // const dListSectionHeading = compSectionHeading("Default Lists");
    const dlistsSectionWrapper = createElement("div", {
      class: "default-lists-wrapper",
    });
    // Each Default List
    const dListNames = [
      {
        heading: "Today",
        taskStatus: "",
      },
      {
        heading: "Important",
        taskStatus: "",
      },
      {
        heading: "Upcoming",
        taskStatus: "",
      },
      {
        heading: "Completed",
        taskStatus: true,
      },
      {
        heading: "All",
        taskStatus: "",
      },
    ];

    const dLists = dListNames.map((list) => {
      const dlist = createElement("div", {
        class: `dlist dlist${list.heading}`,
      });
      let dlistName;

      if (list.heading === "Today") {
        dlistName = createElement(
          "div",
          { class: "dlist-name icon-true", today: new Date().getDate() },
          list.heading
        );
      } else {
        dlistName = createElement(
          "div",
          { class: "dlist-name icon-true" },
          list.heading
        );
      }

      const dlistContent = createElement(
        "div",
        { class: "dlist-content" },
        dListData(list.heading).count
      );

      // Append them
      appendElement([dlistName, dlistContent], dlist);

      dlist.addEventListener("click", () => {
        eventRenderListPage(
          list.heading,
          dListData(list.heading).tasksName,
          list.taskStatus
        );
      });

      return dlist;
    });

    appendElement(dLists, dlistsSectionWrapper);
    // appendElement([dListSectionHeading, dlistsSectionWrapper], dListSection);
    appendElement(dlistsSectionWrapper, dListSection);

    // List
    const listSection = createElement("div", { class: "list-section" });
    const addListButton = createElement("span", {
      class: "add-list-button icon-true",
    });
    const listSectionHeading = compSectionHeading("My Lists", addListButton);
    const listSectionLists = returnList(undefined, true);

    appendElement(addListButton, listSectionHeading);
    appendElement([listSectionHeading, listSectionLists], listSection);

    // Middle wrapper in Middle
    appendElement([dListSection, listSection], middleWrapperParent);

    // Add List Button Event
    addListButton.addEventListener("click", () => {
      addList("Add New List", "", undefined, "Cancel", "Save", () => {
        reRenderHomePage();
      });
    });

    return middleWrapperParent;
  };

  // BOTTOM =========================================================
  const bottom = createElement(
    "div",
    { class: "bottom button icon-true" },
    "New Task"
  );

  bottom.addEventListener("click", () => {
    addTask("add-task", "Add New Task", undefined, "Cancel", "Save");
  });

  // HOME - Appending and Event =========================================================
  appendElement(middleWrapper(), middle);
  appendElement(topWrapper(), top);
  appendElement([top, middle, bottom], homePage);
  appendElement(homePage, appColumn1);
}

// FUNCTION - RETURN DLIST DATA (TASKS ARRAY AND COUNT OF UNCOMPLETE TASKS) FOR EACH DLIST
function dListData(dListHeading) {
  const todaysdate = dateFormat(new Date());
  let tasksName = [];
  let count = 0;

  // Iterate over all the dbTasks
  for (let i = 0; i < dbTasks.length; i++) {
    const taskCompleteDate = dateFormat(dbTasks[i].taskCompleteDate);
    const taskCompleted = dbTasks[i].isCompleted;

    if (dListHeading === "Today") {
      if (todaysdate == taskCompleteDate) {
        tasksName.push(dbTasks[i].taskName);
        if (taskCompleted === false) {
          count += 1;
        }
      }
    }
    if (dListHeading === "Important") {
      if (dbTasks[i].isImportant === true) {
        tasksName.push(dbTasks[i].taskName);
        if (taskCompleted === false) {
          count += 1;
        }
      }
    }
    if (dListHeading === "Upcoming") {
      if (todaysdate < taskCompleteDate) {
        tasksName.push(dbTasks[i].taskName);
        if (taskCompleted === false) {
          count += 1;
        }
      }
    }
    if (dListHeading === "Completed") {
      if (dbTasks[i].isCompleted === true) {
        tasksName.push(dbTasks[i].taskName);
        count += 1;
      }
    }
    if (dListHeading === "All") {
      tasksName.push(dbTasks[i].taskName);
      count += 1;
    }
  }

  const countText = getCountText(count);

  return {
    tasksName: tasksName,
    count: countText,
  };
}

// HELPER FUNCTION
function getCountText(count) {
  if (count <= 1) {
    return count + " Task";
  } else {
    return count + " Tasks";
  }
}
