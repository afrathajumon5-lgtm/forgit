let subjects = JSON.parse(localStorage.getItem("subjects")) || [];
let taskFilter="all";
subjects.forEach(subject => {
    if (!subject.tasks) {
        subject.tasks = [];
    }
});
function saveSubjects() {
    localStorage.setItem("subjects", JSON.stringify(subjects));
}
function updateDashboard() {
    document.getElementById("totalCount").textContent = subjects.length;

    let completed = subjects.filter(subject => subject.completed).length;

    document.getElementById("completedCount").textContent = completed;
    document.getElementById("pendingCount").textContent = subjects.length - completed;

    let percentage = 0;

    if (subjects.length > 0) {
        percentage = Math.round((completed / subjects.length) * 100);
    }

    document.getElementById("progressFill").style.width = percentage + "%";

    document.getElementById("progressText").textContent = percentage + "% Completed";
}
function displaySubjects() {
    let list = document.getElementById("subjectList");
    list.innerHTML = "";
    if (subjects.length === 0) {
    let emptyMessage = document.createElement("li");
   emptyMessage.className="empty-message";
    emptyMessage.textContent = "No subjects yet! Add your first subject 😊";
    list.appendChild(emptyMessage);
    updateDashboard();
    return;
}

    subjects.forEach((subject, index) => {
        let li = document.createElement("li");

        // Checkbox
        let checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = subject.completed;

        // Subject text
        let subjectText = document.createElement("span");
        subjectText.textContent = subject.name;

        if (subject.completed) {
            subjectText.classList.add("completed");
            
        }

        checkbox.onchange = function () {
            subjects[index].completed = checkbox.checked;
            saveSubjects();
            displaySubjects();
        };

        // Delete button
        let deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";

        deleteBtn.onclick = function () {
            subjects.splice(index, 1);
            saveSubjects();
            displaySubjects();
        };
// Edit button
let editBtn = document.createElement("button");
editBtn.textContent = "Edit";

editBtn.onclick = function () {
    let newName = prompt("Enter new subject name:", subject.name);

    if (newName !== null && newName.trim() !== "") {
        subjects[index].name = newName.trim();
        saveSubjects();
        displaySubjects();
    }
};
        li.appendChild(checkbox);
li.appendChild(subjectText);
li.appendChild(editBtn);
li.appendChild(deleteBtn);
// Task section
let taskSection = document.createElement("div");
taskSection.className = "task-section";

let taskList = document.createElement("ul");
if (subject.tasks.length === 0) {
    let emptyTask = document.createElement("li");
    emptyTask.textContent = "No tasks yet. Add your first task!";
    taskList.appendChild(emptyTask);
}

subject.tasks.forEach((task, taskIndex) => {
    if (taskFilter === "pending" && task.completed) {
    return;
}

if (taskFilter === "completed" && !task.completed) {
    return;
}
    let taskItem = document.createElement("li");

    let taskCheckbox = document.createElement("input");
    taskCheckbox.type = "checkbox";
    taskCheckbox.checked = task.completed;

    let taskText = document.createElement("span");
    taskText.textContent = task.name;
    if (task.dueDate !== "") {
    let dueDateText = document.createElement("span");

    let today = new Date();
    today.setHours(0, 0, 0, 0);

    let due = new Date(task.dueDate + "T00:00:00");
    due.setHours(0, 0, 0, 0);

    if (task.completed) {
        dueDateText.textContent = "Completed";
        dueDateText.className = "status-completed";
    } else if (due < today) {
        dueDateText.textContent = "Overdue";
        dueDateText.className = "status-overdue";
    } else if (due.getTime() === today.getTime()) {
        dueDateText.textContent = "Due Today";
        dueDateText.className = "status-today";
    } else {
        dueDateText.textContent = "Upcoming";
        dueDateText.className = "status-upcoming";
    }

    taskItem.appendChild(dueDateText);
}
    if (task.completed) {
        taskText.classList.add("completed");
    }

    taskCheckbox.onchange = function () {
      subjects[index].tasks[taskIndex].completed = taskCheckbox.checked;

// Check whether all tasks are completed
let allTasksCompleted = subjects[index].tasks.every(task => task.completed);

if (subjects[index].tasks.length > 0 && allTasksCompleted) {
    subjects[index].completed = true;
} else {
    subjects[index].completed = false;
}

saveSubjects();
displaySubjects();
    }
// Edit Task button
// Edit Task button
let editTaskBtn = document.createElement("button");
editTaskBtn.textContent = "Edit";

editTaskBtn.onclick = function () {
    let newTaskName = prompt("Edit task name:", task.name);

    if (newTaskName === null || newTaskName.trim() === "") {
        return;
    }

    let newDueDate = prompt("Enter new due date (YYYY-MM-DD):", task.dueDate);

    if (newDueDate !== null) {
        subjects[index].tasks[taskIndex].name = newTaskName.trim();
        subjects[index].tasks[taskIndex].dueDate = newDueDate.trim();

        saveSubjects();
        displaySubjects();
    }
};

taskItem.appendChild(editTaskBtn);
    taskItem.appendChild(taskCheckbox);
taskItem.appendChild(taskText);

// Delete Task button
let deleteTaskBtn = document.createElement("button");
deleteTaskBtn.textContent = "Delete";

deleteTaskBtn.onclick = function () {
    subjects[index].tasks.splice(taskIndex, 1);
    saveSubjects();
    displaySubjects();
};

taskItem.appendChild(deleteTaskBtn);
taskList.appendChild(taskItem);
});

let taskInput = document.createElement("input");
taskInput.type = "text";
taskInput.placeholder = "Enter a study task...";
let dateInput = document.createElement("input");
dateInput.type = "date";

let taskButton = document.createElement("button");
taskButton.textContent = "Add Task";

taskButton.onclick = function () {
    let taskName = taskInput.value.trim();

    if (taskName === "") {
        alert("Enter a task first!");
        return;
    }

    subjects[index].tasks.push({
        name: taskName,
        completed: false,
        dueDate: dateInput.value
    });

    saveSubjects();
    displaySubjects();
};

taskSection.appendChild(taskList);
taskSection.appendChild(taskInput);
taskSection.appendChild(dateInput);
taskSection.appendChild(taskButton);

li.appendChild(taskSection);

list.appendChild(li);
    });
    updateDashboard();
}

function addSubject() {
    let input = document.getElementById("subjectInput");
    let subject = input.value.trim();

    if (subject === "") {
        alert("Please enter a subject name!");
        return;
    }

    subjects.push({
        name: subject,
        completed: false,
        tasks:[]
    });

    saveSubjects();
    displaySubjects();

    input.value = "";
}

// Load saved subjects when page opens
displaySubjects();
function searchSubjects() {
    let searchValue = document.getElementById("searchInput").value.toLowerCase();

    let listItems = document.querySelectorAll("#subjectList li");

    listItems.forEach(item => {
        let subjectName = item.querySelector("span").textContent.toLowerCase();

        if (subjectName.includes(searchValue)) {
            item.style.display = "flex";
        } else {
            item.style.display = "none";
        }
    });
}
function clearAllSubjects() {
    if (confirm("Are you sure you want to delete all subjects?")) {
        subjects = [];
        saveSubjects();
        displaySubjects();
    }
}

function setTaskFilter(filter) {
    taskFilter = filter;
    displaySubjects();
}