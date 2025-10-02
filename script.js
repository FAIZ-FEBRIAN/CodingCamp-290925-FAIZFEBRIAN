// Elemen DOM
const todoForm = document.getElementById('todo-form');
const taskInput = document.getElementById('task-input');
const taskDate = document.getElementById('task-date');
const taskList = document.getElementById('task-list');
const emptyState = document.getElementById('empty-state');
const taskCount = document.getElementById('task-count');
const filterBtns = document.querySelectorAll('.filter-btn');
const errorMessage = document.getElementById('error-message');

// Data tugas
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentFilter = 'all';

// Inisialisasi tanggal dengan hari ini
taskDate.valueAsDate = new Date();

// Fungsi untuk menyimpan tugas ke localStorage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Fungsi untuk membuat elemen tugas
function createTaskElement(task) {
    const taskItem = document.createElement('div');
    taskItem.className = `task-item ${task.completed ? 'completed' : ''}`;
    taskItem.dataset.id = task.id;
    
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'task-checkbox';
    checkbox.checked = task.completed;
    checkbox.addEventListener('change', () => toggleTask(task.id));
    
    const taskContent = document.createElement('div');
    taskContent.className = 'task-content';
    
    const taskText = document.createElement('div');
    taskText.className = 'task-text';
    taskText.textContent = task.text;
    
    const taskDate = document.createElement('div');
    taskDate.className = 'task-date';
    taskDate.textContent = formatDate(task.date);
    
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.innerHTML = '×';
    deleteBtn.addEventListener('click', () => deleteTask(task.id));
    
    taskContent.appendChild(taskText);
    taskContent.appendChild(taskDate);
    
    taskItem.appendChild(checkbox);
    taskItem.appendChild(taskContent);
    taskItem.appendChild(deleteBtn);
    
    return taskItem;
}

// Fungsi untuk memformat tanggal
function formatDate(dateString) {
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
}

// Fungsi untuk menampilkan tugas
function renderTasks() {
    taskList.innerHTML = '';
    
    // Filter tugas berdasarkan status
    let filteredTasks = tasks;
    if (currentFilter === 'active') {
        filteredTasks = tasks.filter(task => !task.completed);
    } else if (currentFilter === 'completed') {
        filteredTasks = tasks.filter(task => task.completed);
    }
    
    // Tampilkan pesan jika tidak ada tugas
    if (filteredTasks.length === 0) {
        taskList.appendChild(emptyState);
        emptyState.style.display = 'block';
    } else {
        emptyState.style.display = 'none';
        filteredTasks.forEach(task => {
            taskList.appendChild(createTaskElement(task));
        });
    }
    
    // Update statistik
    updateStats();
}

// Fungsi untuk menambah tugas baru
function addTask(e) {
    e.preventDefault();
    
    const text = taskInput.value.trim();
    const date = taskDate.value;
    
    // Validasi input
    if (text === '') {
        errorMessage.textContent = 'Deskripsi tugas harus diisi';
        return;
    }
    
    if (date === '') {
        errorMessage.textContent = 'Tanggal harus diisi';
        return;
    }
    
    // Reset pesan error
    errorMessage.textContent = '';
    
    const newTask = {
        id: Date.now(),
        text: text,
        date: date,
        completed: false
    };
    
    tasks.push(newTask);
    saveTasks();
    renderTasks();
    
    // Reset form
    taskInput.value = '';
    taskDate.valueAsDate = new Date();
    taskInput.focus();
}

// Fungsi untuk menandai tugas sebagai selesai/belum selesai
function toggleTask(id) {
    tasks = tasks.map(task => {
        if (task.id === id) {
            return { ...task, completed: !task.completed };
        }
        return task;
    });
    
    saveTasks();
    renderTasks();
}

// Fungsi untuk menghapus tugas
function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveTasks();
    renderTasks();
}

// Fungsi untuk memperbarui statistik
function updateStats() {
    const activeTasks = tasks.filter(task => !task.completed).length;
    taskCount.textContent = `${activeTasks} tugas tersisa`;
}

// Event Listeners
todoForm.addEventListener('submit', addTask);

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Hapus kelas active dari semua tombol
        filterBtns.forEach(b => b.classList.remove('active'));
        
        // Tambahkan kelas active ke tombol yang diklik
        btn.classList.add('active');
        
        // Perbarui filter
        currentFilter = btn.dataset.filter;
        renderTasks();
    });
});

// Render tugas saat pertama kali memuat
renderTasks();