// Zistenie názvu stránky
const page = window.location.pathname.split("/").pop();

// Nastavenie storage kľúča podľa stránky
let storageKey = "tasks_daily";

if (page === "weekly.html") storageKey = "tasks_weekly";
if (page === "monthly.html") storageKey = "tasks_monthly";

// Výber správneho UL podľa stránky
let list;

if (page === "index.html") list = document.getElementById("dailyList");
if (page === "weekly.html") list = document.getElementById("weeklyList");
if (page === "monthly.html") list = document.getElementById("monthlyList");

// Input + button
const input = document.getElementById("taskInput");
const button = document.querySelector(".btn1");

// Progress bar
const progressText = document.getElementById("progressText");
const progressFill = document.getElementById("progressFill");

// Načítanie uložených úloh
let tasks = JSON.parse(localStorage.getItem(storageKey)) || [];

// Uloženie úloh
function saveTasks() {
    localStorage.setItem(storageKey, JSON.stringify(tasks));
}

// Progress Bar
function updateProgress() {
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;

    const percentage = total > 0
        ? Math.round((completed / total) * 100)
        : 0;

    progressText.textContent = percentage + "% dokončené";
    progressFill.style.width = percentage + "%";
}

// Zobrazenie úloh
function renderTasks() {
    list.innerHTML = "";

    tasks.forEach((task, index) => {
        const li = document.createElement("li");

        const taskText = document.createElement("span");
        taskText.textContent = task.text;

        if (task.completed) {
            taskText.classList.add("completed");
        }

        // Dokončenie úlohy
        const completeButton = document.createElement("button");
        completeButton.textContent = "✅";

        completeButton.addEventListener("click", function() {
            tasks[index].completed = !tasks[index].completed;
            saveTasks();
            renderTasks();
        });

        // Odstránenie úlohy
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "❌";

        deleteButton.addEventListener("click", function() {
            tasks.splice(index, 1);
            saveTasks();
            renderTasks();
        });

        li.appendChild(taskText);
        li.appendChild(completeButton);
        li.appendChild(deleteButton);

        list.appendChild(li);
    });

    updateProgress();
}

// Pridanie novej úlohy
button.addEventListener("click", function() {
    const text = input.value.trim();

    if (text === "") {
        alert("Napíš úlohu!");
        return;
    }

    tasks.push({
        text: text,
        completed: false
    });

    input.value = "";

    saveTasks();
    renderTasks();
});

// Zobrazenie pri spustení stránky
renderTasks();
