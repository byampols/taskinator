//global variables
var formE1 = document.querySelector("#task-form");
var pageContentE1 = document.querySelector("#page-content");
var tasksToDoE1 = document.querySelector("#tasks-to-do");
var tasksInProgressE1 = document.querySelector("#tasks-in-progress");
var tasksCompletedE1 = document.querySelector("#tasks-completed");

var taskIdCounter = 0;
var tasks = [];


//form events
var taskFormHandler = function() {
    event.preventDefault();

    var taskNameInput = document.querySelector("input[name='task-name']").value;
    var taskTypeInput = document.querySelector("select[name='task-type']").value;

    var isEdit = formE1.hasAttribute("data-task-id");

    if (!taskNameInput || !taskTypeInput) {
        alert("You need to fill out the task form!");
        return false;
    }

    formE1.reset();

    //has data attribute, so complete the edit process
    if (isEdit) {
        var taskId = formE1.getAttribute("data-task-id");
        completeEditTask(taskNameInput, taskTypeInput, taskId);
    }
    //no data attribute, create object as normal
    else {
        var taskDataObj = {
            name: taskNameInput,
            type: taskTypeInput,
            status: "to do"
        };

        createTaskE1(taskDataObj);
    }
};

var completeEditTask = function(taskName, taskType, taskId) {
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "'");
    taskSelected.querySelector("h3.task-name").textContent = taskName;
    taskSelected.querySelector("span.task-type").textContent = taskType;

    //loop through tasks array and task object with new content
    for (var i = 0;i < tasks.length; i++) {
        if (tasks[i].id === parseInt(taskId)) {
            tasks[i].name = taskName;
            tasks[i].type = taskType;
        }
    }

    saveTasks();

    alert("Task Updated!");

    formE1.removeAttribute("data-task-id");
    document.querySelector("#save-task").textContent = "Add Task";
};

var createTaskE1 = function(taskDataObj) {
    //create list item
    var listItemE1 = document.createElement("li");
    listItemE1.className = "task-item";

    //add task id
    listItemE1.setAttribute("data-task-id", taskIdCounter);

    //create a div to hold task info and add to list item
    var taskInfoE1 = document.createElement("div");
    taskInfoE1.className = "task-info";
    taskInfoE1.innerHTML = "<h3 class='task-name'>" + taskDataObj.name + "</h3><span class='task-type'>" + taskDataObj.type + "</span>";
    listItemE1.appendChild(taskInfoE1);

    //create task actions
    var taskActionsE1 = createTaskActions(taskIdCounter);
    listItemE1.appendChild(taskActionsE1);

    //add entire item to list
    tasksToDoE1.appendChild(listItemE1);

    //add id to data object
    taskDataObj.id = taskIdCounter;
    tasks.push(taskDataObj);
    saveTasks();

    taskIdCounter++;
};

var createTaskActions = function(taskID) {
    //create div to hold buttons
    var actionContainerE1 = document.createElement("div");
    actionContainerE1.className = "task-actions";

    //create edit button
    var editButtonE1 = document.createElement("button");
    editButtonE1.textContent = "Edit";
    editButtonE1.className = "btn edit-btn";
    editButtonE1.setAttribute("data-task-id", taskID);

    actionContainerE1.appendChild(editButtonE1);

    //create delete button
    var deleteButtonE1 = document.createElement("button");
    deleteButtonE1.textContent = "Delete";
    deleteButtonE1.className = "btn delete-btn";
    deleteButtonE1.setAttribute("data-task-id", taskID);

    actionContainerE1.appendChild(deleteButtonE1);

    //create status select element
    var statusSelectE1 = document.createElement("select");
    statusSelectE1.className = "select-status";
    statusSelectE1.setAttribute("name", "status-change");
    statusSelectE1.setAttribute("data-task-id", taskID);

    var statusChoices = ["To Do", "In Progress", "Completed"];

    for (var i = 0; i < statusChoices.length; i++) {
        var statusOptionE1 = document.createElement("option");
        statusOptionE1.textContent = statusChoices[i];
        statusOptionE1.setAttribute("value", statusChoices[i]);

        statusSelectE1.appendChild(statusOptionE1);
    }

    actionContainerE1.appendChild(statusSelectE1);
    

    return actionContainerE1;
};

formE1.addEventListener("submit", taskFormHandler);

//pageContent Events
var taskButtonHandler = function(event) {
    var targetE1 = event.target;

    if (targetE1.matches(".edit-btn")) {
        var taskId = event.target.getAttribute("data-task-id");
        editTask(taskId);
    }

    if (targetE1.matches(".delete-btn")) {
        var taskId = event.target.getAttribute("data-task-id");
        deleteTask(taskId);
    }

};

var editTask = function(taskId) {
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "'");
    
    //get content from task name and type
    var taskName = taskSelected.querySelector("h3.task-name").textContent;
    var taskType = taskSelected.querySelector("span.task-type").textContent;

    //apply content to form
    document.querySelector("input[name='task-name']").value = taskName;
    document.querySelector("select[name='task-type']").value = taskType;
    document.querySelector("#save-task").textContent = "Save Task";
    formE1.setAttribute("data-task-id", taskId);
};

var deleteTask = function(taskId) {
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "'");
    taskSelected.remove();
    //create a new task list
    var updatedTaskArr = [];
    //loop through tasks array and add all but selected task
    for (var i = 0;i < tasks.length; i++) {
        if (tasks[i].id !== parseInt(taskId)) {
            updatedTaskArr.push(tasks[i]);
        }
    }
    //reassaign tasks array to match updated version
    tasks = updatedTaskArr;
    saveTasks();
};

var taskStatusChangeHandler = function(event) {
    var taskId = event.target.getAttribute("data-task-id");
    var statusValue = event.target.value.toLowerCase();
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "'");

    if (statusValue === "to do") {
        tasksToDoE1.appendChild(taskSelected);
    } else if (statusValue === "in progress") {
        tasksInProgressE1.appendChild(taskSelected);
    } else if (statusValue === "completed") {
        tasksCompletedE1.appendChild(taskSelected);
    }

    //update task's status in task array
    for (var i = 0;i < tasks.length; i++) {
        if (tasks[i].id === parseInt(taskId)) {
            tasks[i].status = statusValue;
        }
    }
    saveTasks();
};

var saveTasks = function() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

var loadTasks = function() {
    //get task items from local storage
    tasks = localStorage.getItem("tasks");
    //convert tasks from string back into an array
    if (tasks === null) {
        tasks = [];
        return false;
    }
    tasks = JSON.parse(tasks);
    //iterate through the array and create task elements on the page from it
    for (var i = 0; i < tasks.length; i++) {
        tasks[i].id = taskIdCounter;

        //create a list element
        var listItemE1 = document.createElement("li");
        listItemE1.className = "task-item";
        listItemE1.setAttribute("data-task-id", tasks[i].id);

        //create a div to hold task info and add to list item
        var taskInfoE1 = document.createElement("div");
        taskInfoE1.className = "task-info";
        taskInfoE1.innerHTML = "<h3 class='task-name'>" + tasks[i].name + "</h3><span class='task-type'>" + tasks[i].type + "</span>";
        listItemE1.appendChild(taskInfoE1);

        //create task actions
        var taskActionsE1 = createTaskActions(tasks[i].id);
        listItemE1.appendChild(taskActionsE1);
        //add entire item to proper list
        if (tasks[i].status.toLowerCase() === "to do") {
            listItemE1.querySelector("select[name='status-change']").selectedIndex = 0;
            tasksToDoE1.appendChild(listItemE1);
        } else if (tasks[i].status.toLowerCase() === "in progress") {
            listItemE1.querySelector("select[name='status-change']").selectedIndex = 1;
            tasksInProgressE1.appendChild(listItemE1);
        } else if (tasks[i].status.toLowerCase() === "completed") {
            listItemE1.querySelector("select[name='status-change']").selectedIndex = 2;
            tasksCompletedE1.appendChild(listItemE1);
        }

        taskIdCounter++;
    }
}

pageContentE1.addEventListener("click", taskButtonHandler);
pageContentE1.addEventListener("change", taskStatusChangeHandler);

loadTasks();