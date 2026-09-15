document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('task-input');
    const taskList = document.getElementById('task-list');
    const emptyImage = document.querySelector('.empty-image');
    const todosContainer = document.querySelector('.todos-container');
    const form = document.querySelector('.input-area');
    const progressBar = document.getElementById('progress');
    const progressNumbers = document.getElementById('numbers');

    // -------------------------
    // Empty state
    // -------------------------

    function toggleEmptyState() {
        emptyImage.style.display =
            taskList.children.length === 0 ? 'block' : 'none';

        todosContainer.style.width =
            taskList.children.length > 0 ? '100%' : '50%';
    }


    // -------------------------
    // Progress
    // -------------------------

    function updateProgress() {
        const totalTasks = taskList.children.length;

        const completedTasks =
            taskList.querySelectorAll('.checkbox:checked').length;

        const percentage =
            totalTasks > 0
                ? (completedTasks / totalTasks) * 100
                : 0;

        progressBar.style.width = `${percentage}%`;

        progressNumbers.textContent =
            `${completedTasks} / ${totalTasks}`;
    }


    // -------------------------
    // Confetti
    // -------------------------

    function launchConfetti() {
        confetti({
            particleCount: 150,
            spread: 100,
            origin: {
                y: 0.6
            }
        });
    }


    // -------------------------
    // Save tasks
    // -------------------------

    function saveTaskToLocalStorage() {
        const tasks = Array.from(
            taskList.querySelectorAll('li')
        ).map(li => ({
            text: li.querySelector('span').textContent,
            completed: li.querySelector('.checkbox').checked
        }));

        localStorage.setItem(
            'tasks',
            JSON.stringify(tasks)
        );
    }


    // -------------------------
    // Load tasks
    // -------------------------

    function loadTasksFromLocalStorage() {
        const savedTasks =
            JSON.parse(localStorage.getItem('tasks')) || [];

        savedTasks.forEach(({ text, completed }) => {
            addTask(text, completed, false);
        });

        toggleEmptyState();
        updateProgress();
    }


    // -------------------------
    // Add task
    // -------------------------

    function addTask(
        taskText = taskInput.value.trim(),
        completed = false,
        shouldSave = true
    ) {
        taskText = taskText.trim();

        if (!taskText) {
            return;
        }

        const li = document.createElement('li');

        li.innerHTML = `
            <input type="checkbox" class="checkbox">

            <span></span>

            <div class="task-buttons">
                <button type="button" class="edit-btn">
                    <i class="fa-solid fa-pen"></i>
                </button>

                <button type="button" class="delete-btn">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>
        `;


        // -------------------------
        // Task text
        // -------------------------

        const span = li.querySelector('span');

        // textContent prevents HTML injection
        span.textContent = taskText;


        // -------------------------
        // Elements
        // -------------------------

        const checkbox = li.querySelector('.checkbox');
        const editBtn = li.querySelector('.edit-btn');
        const deleteBtn = li.querySelector('.delete-btn');


        // -------------------------
        // Restore completed state
        // -------------------------

        checkbox.checked = completed;

        li.classList.toggle(
            'completed',
            completed
        );

        editBtn.disabled = completed;

        editBtn.style.opacity =
            completed ? '0.5' : '1';

        editBtn.style.pointerEvents =
            completed ? 'none' : 'auto';


        // -------------------------
        // Complete task
        // -------------------------

        checkbox.addEventListener('change', () => {
            const isChecked = checkbox.checked;

            li.classList.toggle(
                'completed',
                isChecked
            );

            editBtn.disabled = isChecked;

            editBtn.style.opacity =
                isChecked ? '0.5' : '1';

            editBtn.style.pointerEvents =
                isChecked ? 'none' : 'auto';


            updateProgress();
            saveTaskToLocalStorage();


            // Check if all tasks are complete

            const totalTasks =
                taskList.children.length;

            const completedTasks =
                taskList.querySelectorAll(
                    '.checkbox:checked'
                ).length;


            if (
                isChecked &&
                totalTasks > 0 &&
                completedTasks === totalTasks
            ) {
                launchConfetti();
            }
        });


        // -------------------------
        // Edit task
        // -------------------------

        editBtn.addEventListener('click', () => {
            if (checkbox.checked) {
                return;
            }

            taskInput.value =
                span.textContent;

            li.remove();

            toggleEmptyState();
            updateProgress();
            saveTaskToLocalStorage();

            taskInput.focus();
        });


        // -------------------------
        // Delete task
        // -------------------------

        deleteBtn.addEventListener('click', () => {
            li.remove();

            toggleEmptyState();
            updateProgress();
            saveTaskToLocalStorage();
        });


        // -------------------------
        // Add task to list
        // -------------------------

        taskList.appendChild(li);

        taskInput.value = '';

        toggleEmptyState();
        updateProgress();


        // Don't save while loading
        if (shouldSave) {
            saveTaskToLocalStorage();
        }
    }


    // -------------------------
    // Form submit
    // -------------------------

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        addTask();
    });


    // -------------------------
    // Initial state
    // -------------------------

    toggleEmptyState();
    updateProgress();

    loadTasksFromLocalStorage();
});