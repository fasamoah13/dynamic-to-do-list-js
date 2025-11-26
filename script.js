// Persisted To-Do List with Local Storage
document.addEventListener('DOMContentLoaded', function () {
    // Select DOM elements
    const addButton = document.getElementById('add-task-btn');
    const taskInput = document.getElementById('task-input');
    const taskList = document.getElementById('task-list');

    // In-memory tasks array (keeps sync with localStorage)
    let tasks = [];

    /**
     * Save the current tasks array to localStorage
     */
    function saveTasksToLocalStorage() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    /**
     * Create a DOM list item for a task and append it to the list.
     * @param {string} taskText - Text of the task
     */
    function createTaskElement(taskText) {
        const li = document.createElement('li');
        li.textContent = taskText;

        const removeBtn = document.createElement('button');
        removeBtn.textContent = 'Remove';
        removeBtn.classList.add('remove-btn');

        // Remove task from DOM and from tasks array/localStorage
        removeBtn.addEventListener('click', function () {
            // Remove from DOM
            taskList.removeChild(li);

            // Remove one occurrence of the task from tasks array
            const index = tasks.indexOf(taskText);
            if (index > -1) {
                tasks.splice(index, 1);
                saveTasksToLocalStorage();
            }
        });

        li.appendChild(removeBtn);
        taskList.appendChild(li);
    }

    /**
     * Add a new task.
     * If `taskText` is omitted, read from the input field.
     * If save === true, update localStorage (default).
     * @param {string} [taskTextFromArg]
     * @param {boolean} [save=true]
     */
    function addTask(taskTextFromArg, save = true) {
        const taskText = (typeof taskTextFromArg === 'string')
            ? taskTextFromArg.trim()
            : taskInput.value.trim();

        if (taskText === '') {
            alert('Please enter a task.');
            return;
        }

        // Create and append the task element
        createTaskElement(taskText);

        // Update in-memory array and localStorage if required
        if (save) {
            tasks.push(taskText);
            saveTasksToLocalStorage();
        }

        // Clear input only when adding from the input field
        if (typeof taskTextFromArg !== 'string') {
            taskInput.value = '';
        }
    }

    /**
     * Load tasks from localStorage and render them.
     * Uses addTask(taskText, false) so they are not saved again.
     */
    function loadTasks() {
        const stored = JSON.parse(localStorage.getItem('tasks') || '[]');
        tasks = Array.isArray(stored) ? stored.slice() : [];

        // Clear current DOM list (in case)
        taskList.innerHTML = '';

        tasks.forEach(taskText => {
            addTask(taskText, false);
        });
    }

    // Attach event listeners
    addButton.addEventListener('click', function () {
        addTask();
    });

    taskInput.addEventListener('keypress', function (event) {
        if (event.key === 'Enter') {
            addTask();
        }
    });

    // Initialize by loading tasks from localStorage
    loadTasks();
});
