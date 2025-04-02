<template>
    <div class="kanban-container">
        <div class="board-header">
            <div class="header-content">
                <div class="header-text">
                    <h1 class="board-title">{{ boardTitle }}</h1>
                    <div class="greeting-text">
                        <UserIcon class="user-icon" />
                        <span>Hello, {{ userName }}! 👋</span>
                    </div>
                    <p class="subtext">
                        <CalendarIcon class="icon-sm" />
                        {{ currentDate }}                     
                    </p>
                </div>
                
                <div class="header-controls">
                    <div class="search-box">
                        <input 
                        type="text" 
                        v-model="searchQuery"
                        placeholder="Search tasks..."
                        class="search-input"
                        >
                        <SearchIcon class="search-icon" />
                    </div>
                    
                    <div class="secondary-actions">
                        <button 
                        @click="undoLastAction" 
                        class="small-button"
                        :disabled="!boardStore.canUndo"
                        title="Undo last action"
                        >
                        <UndoIcon class="small-icon" />
                        <span>Undo</span>
                        </button>
                        
                        <button @click="openColumnModal" class="small-button">
                        <PlusIcon class="small-icon" />
                        <span>Add Column</span>
                        </button>
                        
                        <button @click="openTaskModal" class="action-button">
                        <PlusIcon class="icon" />
                        Add Task
                        </button>
                    </div>
                </div>
            </div>
        </div>
  
      <div class="kanban-board">
        <div class="columns-grid">
            <div 
            v-for="column in boardStore.columns" 
            :key="column.id"
            class="column-item"
            :class="columnClass(column.id) || 'column-default'"
          >
            <div class="column-header">
              <div class="column-header-div">
                <h2>{{ column.title }}</h2>
                <span class="task-count">{{ filteredTasks(column.id).length }}</span>            
              </div>
              <button @click="removeColumn(column.id)" class="column-delete">
                &times;
              </button>
            </div>
            
            <draggable
              :list="filteredTasks(column.id)"
              group="tasks"
              item-key="id"
              @change="(event) => handleTaskMove(event, column.id)"
              class="tasks-container"
            >
              <template #item="{ element }">
                <TaskCard 
                  :task="element" 
                  @edit="handleEditTask"
                  @delete="handleDeleteTask"
                />
              </template>
            </draggable>
          </div>
        </div>
      </div>
      
      <AddTaskModal ref="addTaskModal" />
      <ColumnManager ref="columnManager" />
    </div>
  </template>
  
<script setup>
  import { ref, computed, onMounted } from 'vue'
  import { useBoardStore } from '@/stores/BoardStore'
  import draggable from 'vuedraggable'
  import TaskCard from './TaskCard.vue'
  import SearchIcon from './icons/SearchIcon.vue'
  import PlusIcon from './icons/PlusIcon.vue'
  import AddTaskModal from './AddTaskModal.vue'
  import ColumnManager from './ColumnManager.vue'
  import { toast } from 'vue3-toastify';
  import UndoIcon from './icons/UndoIcon.vue'
  import CalendarIcon from './icons/CalendarIcon.vue'
  import UserIcon from './icons/UserIcon.vue'

  const boardStore = useBoardStore()
  const boardTitle = 'Task Manager'
  const searchQuery = ref('')
  const addTaskModal = ref(null)
  const columnManager = ref(null)
  
  const userName = ref('Guest')

  onMounted(async () => {
    await boardStore.initialize()
  })
  onMounted(() => {
    try {
        const savedUser = localStorage.getItem('userName')
        console.log(savedUser)
        if (savedUser) {
            userName.value = savedUser
        }
    } catch (error) {
        toast.error('Failed to load user preferences')
        console.error('Error loading username:', error)
    }
})
  const currentDate = computed(() => new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'long', 
    day: 'numeric' 
  }))

  const openTaskModal = () => {
    addTaskModal.value?.openModal()
  }
  
  const openColumnModal = () => {
    columnManager.value?.openModal()
  }
  
  const undoLastAction = () => {
    if (boardStore.undo()) {
        toast.success('Last action undone')
    } else {
        toast.info('Nothing to undo')
    }
    }
  const removeColumn = async (columnId) => {
    try {
        const tasksInColumn = boardStore.tasks.filter(task => task.status === columnId)
        
        if (tasksInColumn.length > 0) {
        const confirmDelete = await new Promise((resolve) => {
            resolve(window.confirm(
            `This column contains ${tasksInColumn.length} task(s). Delete anyway?`
            ))
        })
        
        if (!confirmDelete) return
        }
        
        boardStore.removeColumn(columnId)
        toast.success('Column removed successfully')
        
    } catch (error) {
        toast.error(error.message || 'Failed to remove column')
        console.error('Error removing column:', error)
    }
    }
  
  const filteredTasks = (status) => {
    let tasks = boardStore.tasks.filter(task => task.status === status)
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      tasks = tasks.filter(task => 
        task.title.toLowerCase().includes(query) || 
        task.type.toLowerCase().includes(query)
      )
    }
    return tasks
  }
  
  const columnClass = (columnId) => {
    return {
      'Task Ready': 'column-ready',
      'Needs Review': 'column-review',
      'Done': 'column-done'
    }[columnId]
  }
  
  const handleTaskMove = (event, newStatus) => {
    if (event.added) {
      const taskId = event.added.element.id
      boardStore.moveTask(taskId, newStatus)
    }
  }
  
  const handleEditTask = (taskId) => {
    console.log('Edit task:', taskId)
  }
  
  const handleDeleteTask = (taskId) => {
    console.log('Delete task:', taskId)
  }
</script>

<style>
    :root {
        --gradient-start: #f3e7ff;
        --gradient-mid: #e8deff;  
        --gradient-end: #f0e9ff;  
    }

    body {
    background: linear-gradient(
        var(--gradient-start),
        var(--gradient-mid),
        var(--gradient-end)
    );
    min-height: 100vh;
    margin: 0;
    background-attachment: fixed;
    }
</style>

<style scoped>
    .kanban-container {
        padding: 2rem;
        max-width: 100%;
        margin: 0 auto;
    }

    .board-header {
        padding: 1.25rem;
        background: white;
        border-radius: 12px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        margin-bottom: 2rem;
    }

    .header-content {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .header-text {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .greeting-text {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.9rem;
        color: #64748b;
    }

    .header-controls {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
    }

    .search-box {
        position: relative;
        width: 100%;
    }

    .secondary-actions {
        display: flex;
        gap: 0.5rem;
        align-items: center;
    }

    .small-button {
        display: flex;
        align-items: center;
        gap: 0.25rem;
        padding: 0.35rem 0.75rem;
        background-color: #f1f5f9;
        color: #334155;
        border: none;
        border-radius: 6px;
        font-size: 0.75rem;
        cursor: pointer;
        transition: all 0.2s;
    }

    .small-button:hover {
        background-color: #e2e8f0;
    }

    .small-button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    .small-icon {
        width: 0.9rem;
        height: 0.9rem;
    }

    .header-title-section {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 1rem;
    }

    .greeting-section {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .board-title {
        font-size: 1.8rem;
        font-weight: 700;
        margin: 0;
        color: #1e293b;
    }


    .subtext {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.875rem;
        color: #64748b;
        margin: 0;
    }

    .user-icon {
        width: 1rem;
        height: 1rem;
        color: #3b82f6;
    }

    .icon-sm {
        width: 0.8rem;
        height: 0.8rem;
        color: #94a3b8;
    }

    .search-input {
        width: 100%;
        padding: 0.5rem 1rem 0.5rem 2.5rem;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        font-size: 0.875rem;
        transition: all 0.2s;
        background: rgba(255, 255, 255, 0.8);
    }

    .search-input:focus {
        outline: none;
        border-color: #3b82f6;
        box-shadow: 0 0 0 1px #3b82f6;
    }

    .search-icon {
        position: absolute;
        left: 0.75rem;
        top: 50%;
        transform: translateY(-50%);
        width: 1rem;
        height: 1rem;
        color: #64748b;
    }

    .add-task-button {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem 1rem;
        background-color: #3b82f6;
        color: white;
        border: none;
        border-radius: 8px;
        font-size: 0.875rem;
        font-weight: 500;
        cursor: pointer;
        transition: background-color 0.2s;
    }

    .add-task-button:hover {
        background-color: #2563eb;
    }

    .plus-icon {
        width: 1rem;
        height: 1rem;
    }

    .column-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
        padding-bottom: 0.75rem;
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    }

    .column-header-div{
        display: flex;
        gap: .5rem;
    }

    .column-ready {
        background-color: #EFF6FF;
        border-top: 4px solid #3B82F6;
    }

    .column-review {
        background-color: #FEF3C7;
        border-top: 4px solid #F59E0B;
    }

    .column-done {
        background-color: #ECFDF5; 
        border-top: 4px solid #10B981; 
    }

    .column-header h2 {
        font-size: 1rem;
        font-weight: 600;
        color: #1e293b;
        margin: 0;
    }

    .task-count {
        background: rgba(255, 255, 255, 0.8);
        padding: 0.25rem 0.5rem;
        border-radius: 9999px;
        font-size: 0.75rem;
        font-weight: 500;
        color: #475569;
    }

    .tasks-container {
        min-height: 100px;
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
    }

    .action-buttons {
        display: flex;
        gap: 0.75rem;
    }

    .action-button {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem 1rem;
        background-color: #3b82f6;
        color: white;
        border: none;
        border-radius: 8px;
        font-size: 0.875rem;
        font-weight: 500;
        cursor: pointer;
        transition: background-color 0.2s;
        margin-left: auto;
    }

    .action-button:hover {
        background-color: #2563eb;
    }

    .column-header {
        position: relative;
    }

    .column-delete {
        position: relative;
        right: 0;
        top: 0;
        background: none;
        border: none;
        color: #64748b;
        cursor: pointer;
        font-size: 1.25rem;
        padding: 0 0.5rem;
    }

    .column-delete:hover {
        color: #ef4444;
    }
    .columns-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 1rem;
        padding-bottom: 1rem;
    }

    .column-item {
        border-radius: 12px;
        padding: 1rem;
        backdrop-filter: blur(5px);
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        min-height: 200px;
    }

    .action-button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        background-color: #94a3b8;
    }

    .action-button:disabled:hover {
        background-color: #94a3b8;
    }

    .column-default {
        background-color: #F8FAFC;
        border-top: 4px solid #E2E8F0;
    }

    .column-ready {
        background-color: #EFF6FF;
        border-top: 4px solid #3B82F6;
    }

    .column-review {
        background-color: #FEF3C7;
        border-top: 4px solid #F59E0B;
    }

    .column-done {
        background-color: #ECFDF5;
        border-top: 4px solid #10B981;
    }

    @media (max-width: 1400px) {
        .columns-grid {
            grid-template-columns: repeat(3, 1fr);
        }
    }

    @media (max-width: 1100px) {
        .columns-grid {
            grid-template-columns: repeat(2, 1fr);
        }
    }

    @media (max-width: 768px) {
        .columns-grid {
            grid-template-columns: 1fr;
        }
    }

</style>