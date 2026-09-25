const taskInput = document.getElementById("taskInput");
const category = document.getElementById("category");
const priority = document.getElementById("priority");
const dueDate = document.getElementById("dueDate");

const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");

const searchInput = document.getElementById("searchInput");
const filter = document.getElementById("filter");

const totalTasks = document.getElementById("totalTasks");
const completedTasks = document.getElementById("completedTasks");
const pendingTasks = document.getElementById("pendingTasks");

const emptyMessage = document.getElementById("emptyMessage");
const darkModeBtn = document.getElementById("darkModeBtn");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

let editTaskId = null;


// Add / Update Task
addTaskBtn.addEventListener("click", () => {

    const title = taskInput.value.trim();

    // Validation
    if (title === "") {
        alert("Please enter a task.");
        taskInput.focus();
        return;
    }

    if (editTaskId !== null) {

        const task = tasks.find(task => task.id === editTaskId);

        task.title = title;
        task.category = category.value;
        task.priority = priority.value;
        task.dueDate = dueDate.value;

        editTaskId = null;
        addTaskBtn.textContent = "Add Task";

    } else {

        const newTask = {
            id: Date.now(),
            title: title,
            category: category.value,
            priority: priority.value,
            dueDate: dueDate.value,
            completed: false
        };

        tasks.push(newTask);
    }

    saveTasks();
    renderTasks();
    clearForm();
});


// Display Tasks
function renderTasks() {

    taskList.innerHTML = "";

    const searchText = searchInput.value.toLowerCase();
    const selectedFilter = filter.value;

    const filteredTasks = tasks.filter(task => {

        const matchesSearch =
            task.title.toLowerCase().includes(searchText);

        const matchesFilter =
            selectedFilter === "all" ||
            (selectedFilter === "completed" && task.completed) ||
            (selectedFilter === "pending" && !task.completed);

        return matchesSearch && matchesFilter;
    });

    if (filteredTasks.length === 0) {
        emptyMessage.style.display = "block";
    } else {
        emptyMessage.style.display = "none";
    }

    filteredTasks.forEach(task => {

        const li = document.createElement("li");

        li.className = `task ${task.completed ? "completed" : ""}`;

        li.innerHTML = `
            <div class="task-info">

                <div class="task-title">
                    ${escapeHTML(task.title)}
                </div>

                <div class="task-details">

                    <span class="badge">
                        ${escapeHTML(task.category)}
                    </span>

                    <span class="badge priority-${task.priority.toLowerCase()}">
                        ${escapeHTML(task.priority)}
                    </span>

                    ${
                        task.dueDate
                        ? `<span class="badge">
                            📅 ${task.dueDate}
                           </span>`
                        : ""
                    }

                    <span class="badge">
                        ${task.completed ? "✅ Completed" : "⏳ Pending"}
                    </span>

                </div>
            </div>

            <div class="task-actions">

                <button
                    class="complete-btn"
                    onclick="toggleTask(${task.id})">
                    ${task.completed ? "↩️" : "✓"}
                </button>

                <button
                    class="edit-btn"
                    onclick="editTask(${task.id})">
                    ✏️
                </button>

                <button
                    class="delete-btn"
                    onclick="deleteTask(${task.id})">
                    🗑️
                </button>

            </div>
        `;

        taskList.appendChild(li);
    });

    updateStats();
}


// Complete / Pending
function toggleTask(id) {

    const task = tasks.find(task => task.id === id);

    if (task) {
        task.completed = !task.completed;
    }

    saveTasks();
    renderTasks();
}


// Edit Task
function editTask(id) {

    const task = tasks.find(task => task.id === id);

    if (!task) return;

    taskInput.value = task.title;
    category.value = task.category;
    priority.value = task.priority;
    dueDate.value = task.dueDate;

    editTaskId = id;

    addTaskBtn.textContent = "Update Task";

    taskInput.focus();
}


// Delete Task
function deleteTask(id) {

    const confirmDelete = confirm(
        "Are you sure you want to delete this task?"
    );

    if (!confirmDelete) return;

    tasks = tasks.filter(task => task.id !== id);

    saveTasks();
    renderTasks();
}


// Update Statistics
function updateStats() {

    const total = tasks.length;

    const completed = tasks.filter(
        task => task.completed
    ).length;

    const pending = total - completed;

    totalTasks.textContent = total;
    completedTasks.textContent = completed;
    pendingTasks.textContent = pending;
}


// Local Storage
function saveTasks() {

    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );
}


// Clear Form
function clearForm() {

    taskInput.value = "";
    dueDate.value = "";

    category.value = "Personal";
    priority.value = "Low";

    editTaskId = null;

    addTaskBtn.textContent = "Add Task";
}


// Search
searchInput.addEventListener("input", renderTasks);


// Filter
filter.addEventListener("change", renderTasks);


// Dark Mode
darkModeBtn.addEventListener("click", () => {

    document.body.classList.toggle("dark");

    const darkMode =
        document.body.classList.contains("dark");

    localStorage.setItem(
        "darkMode",
        darkMode
    );

    darkModeBtn.textContent =
        darkMode ? "☀️" : "🌙";
});


// Load Dark Mode
function loadDarkMode() {

    const darkMode =
        localStorage.getItem("darkMode") === "true";

    if (darkMode) {
        document.body.classList.add("dark");
        darkModeBtn.textContent = "☀️";
    }
}


// Prevent HTML injection
function escapeHTML(text) {

    const div = document.createElement("div");

    div.textContent = text;

    return div.innerHTML;
}


// Initial Load
loadDarkMode();
renderTasks();

