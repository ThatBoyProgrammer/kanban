<template>
    <div class="task-card" :class="statusClass">
      <div class="task-header">
        <div>
          <h3 class="task-title">{{ task.title }}</h3>
          <p class="task-description">{{ task.description }}</p>
        </div>
        <div class="task-menu-container">
          <button @click.stop="toggleMenu" class="task-menu-button">
            <DotsVerticalIcon class="menu-icon" />
          </button>
          <div v-if="showMenu" class="task-menu">
            <button @click="handleDelete" class="menu-item delete">Delete</button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted, onUnmounted, defineProps } from 'vue'
  import DotsVerticalIcon from './icons/DotsVerticalIcon.vue'
  import { useBoardStore } from '@/stores/BoardStore'

  const boardStore = useBoardStore()
  const props = defineProps({
    task: {
      type: Object,
      required: true
    }
  })
  
  const showMenu = ref(false)
  
  const statusClass = computed(() => {
    return {
      'Task Ready': 'status-ready',
      'Needs Review': 'status-review',
      'Done': 'status-done'
    }[props.task.status]
  })
  
  const toggleMenu = () => {
    showMenu.value = !showMenu.value
  }
  
  const handleDelete = async () => {
    try {
      showMenu.value = false
      
      if (confirm('Are you sure you want to delete this task?')) {
        try {
          await boardStore.deleteTask(props.task.id)
        } catch (error) {
          console.error('Failed to delete task:', error)
        }
      }
    } catch (error) {
      console.error('Error handling delete:', error)
    }
  }
  
  const onClickOutside = (event) => {
    if (!event.target.closest('.task-menu-container')) {
      showMenu.value = false
    }
  }
  
  onMounted(() => {
    document.addEventListener('click', onClickOutside)
  })
  
  onUnmounted(() => {
    document.removeEventListener('click', onClickOutside)
  })
  </script>
  
<style scoped>
  .task-card {
    background: white;
    border-radius: 8px;
    padding: 12px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    position: relative;
    border-left: 4px solid transparent;
  }
  
  .task-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 8px;
  }
  
  .task-type {
    display: inline-block;
    padding: 2px 8px;
    border-radius: 9999px;
    font-size: 11px;
    font-weight: 500;
    margin-bottom: 6px;
  }
  
  .copywriting {
    background: #dbeafe;
    color: #1e40af;
  }
  
  .udesign {
    background: #f3e8ff;
    color: #6b21a8;
  }
  
  .illustration {
    background: #dcfce7;
    color: #166534;
  }
  
  .task-title {
    font-size: 14px;
    font-weight: 500;
    color: #1e293b;
    margin: 0;
  }

  .task-description{
    font-size: 12px;
    padding: 0;
    color: #797575;
  }
  
  .task-menu-container {
    position: relative;
  }
  
  .task-menu-button {
    background: none;
    border: none;
    padding: 4px;
    cursor: pointer;
    color: #64748b;
    border-radius: 4px;
  }
  
  .task-menu-button:hover {
    background: #f1f5f9;
  }
  
  .menu-icon {
    width: 16px;
    height: 16px;
  }
  
  .task-menu {
    position: absolute;
    right: 0;
    top: 24px;
    background: white;
    border-radius: 6px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    z-index: 10;
    min-width: 120px;
    overflow: hidden;
  }
  
  .menu-item {
    display: block;
    width: 100%;
    padding: 8px 12px;
    text-align: left;
    background: none;
    border: none;
    font-size: 13px;
    color: #334155;
    cursor: pointer;
  }
  
  .menu-item:hover {
    background: #f8fafc;
  }
  
  .menu-item.delete {
    color: #ef4444;
  }
  
  .task-footer {
    display: flex;
    gap: 12px;
    font-size: 11px;
  }
  
  .comments, .due-date {
    display: flex;
    align-items: center;
    gap: 4px;
    color: #64748b;
  }
  
  .icon {
    width: 12px;
    height: 12px;
  }
  
  .overdue {
    color: #ef4444;
  }
  
  .overdue .icon {
    color: #ef4444;
  }
  
  .status-ready {
    border-left-color: #3b82f6;
  }
  
  .status-review {
    border-left-color: #f59e0b;
  }
  
  .status-done {
    border-left-color: #10b981;
  }
</style>