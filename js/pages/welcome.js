// Checking if User is Logged in or Not
dbUserName === null ? renderWelcomPage() : renderHomePage();

// Default Data
let demoLists = [
  {
    listName: "Default List",
    listId: "1",
  }
];

let demoListscounter = demoLists.length + 1;

let demoTasks = [
  {
    taskName: "Explore App Features",
    taskNotes: "Take some time to explore all the features and functionalities of the app. Familiarize yourself with creating new tasks, setting due dates, adding task notes, and marking tasks as completed. This will help you make the most out of the app and stay organized.",
    taskCreatedDate: dateFormat(new Date()),
    taskCompleteDate: dateFormat(new Date()),
    isCompleted: false,
    isImportant: true,
    listId: "1",
  }
]

// Function renderWelcomeScreen()
function renderWelcomPage() {
  const welcomePage = createElement("div", { class: "welcome welcome-page" });
  const welcomePageWrapper = createElement("div", {class: "wrapper"});
  const img = createElement("img", { src: "./media/logo.png", alt: "App logo" });

  const headingWrapper = createElement("div", {class: "heading-wrapper"});
  const heading1 = createElement("h1", {}, "Welcome to");
  const heading2 = createElement("span", {}, "Task Keep");
  appendElement([heading1, heading2], headingWrapper)

  const para = createElement(
    "p",
    {},
    "Get organized and stay productive with the ultimate to-do app. Start by creating and managing your task lists effortlessly."
  );

  const input = createElement("input", {
    type: "text",
    placeholder: "Enter Your Name Here",
  });
  const button = createElement("button", { class: "button" }, "Get Started");

  // Append all the elements to Welcome Element
  appendElement([img, headingWrapper, para, input, button], welcomePageWrapper);
  appendElement(welcomePageWrapper, welcomePage)

  // Appending Welcom Screen to appColumn1
  appColumn1.appendChild(welcomePage);
  appendElement(welcomePage, appColumn1);

  // After Clicking on Get Started Button
  button.addEventListener("click", () => {
    if (input.value.trim()) {
      saveDB("userName", input.value);
      saveDB("dbLists", demoLists, true),
      saveDB("dbListsCounter", demoListscounter, true),
      saveDB("dbTasks", demoTasks, true),
      welcomePage.remove();
      location.reload();
    }
  });
}
