<template>
    <transition name="modal">
      <div v-if="isOpen" class="modal-overlay">
        <!-- Overlay -->
        <div class="modal-backdrop"></div>
        
        <!-- Modal Container -->
        <div class="modal-container">
          <!-- Modal Content -->
          <div class="modal-content">
            <div class="modal-header">
              <h3>Add New Task</h3>
              <button @click="closeModal" class="modal-close-button">
                <svg class="modal-close-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
  
            <form @submit.prevent="handleSubmit" class="modal-form">
              <div class="form-group">
                <label for="title">Task Title</label>
                <input
                  v-model="form.title"
                  type="text"
                  id="title"
                  required
                  class="form-input"
                >
              </div>
  
              <div class="form-group">
                <label for="description">Description</label>
                <textarea
                  v-model="form.description"
                  id="description"
                  rows="3"
                  class="form-textarea"
                ></textarea>
              </div>
  
              <div class="form-group">
                <label for="status">Status</label>
                <select
                  v-model="form.status"
                  id="status"
                  required
                  class="form-select"
                >
                  <option value="Task Ready">Task Ready</option>
                  <option value="Needs Review">Needs Review</option>
                  <option value="Done">Done</option>
                </select>
              </div>
  
              <div class="form-actions">
                <button
                  type="button"
                  @click="closeModal"
                  class="cancel-button"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  class="submit-button"
                >
                  Add Task
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </transition>
  </template>
  
  <script setup>
  import { ref, defineEmits, defineExpose } from 'vue'
  import { useBoardStore } from '@/stores/BoardStore'
  
  const boardStore = useBoardStore()
  const isOpen = ref(false)
  
  const form = ref({
    title: '',
    description: '',
    status: 'Task Ready'
  })
  
  const emit = defineEmits(['taskAdded'])
  
  const openModal = () => {
    isOpen.value = true
  }
  
  const closeModal = () => {
    isOpen.value = false
    resetForm()
  }
  
  const resetForm = () => {
    form.value = {
      title: '',
      description: '',
      status: 'Task Ready'
    }
  }
  
  const handleSubmit = () => {
    const newTask = {
      id: Date.now().toString(),
      title: form.value.title,
      description: form.value.description,
      status: form.value.status,
      dueDate: new Date().toISOString(),
      overdue: false
    }

    console.log(newTask)
    
    // Add task to store
    boardStore.addTask(newTask)
    
    // Emit event
    emit('taskAdded', newTask)
    
    // Close modal
    closeModal()
  }
  
  defineExpose({
    openModal,
    closeModal
  })
  </script>
  
<style scoped>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 50;
    overflow-y: auto;
  }
  
  .modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    transition: opacity 0.3s ease;
  }
  
  .modal-container {
    display: flex;
    min-height: 100%;
    align-items: center;
    justify-content: center;
    padding: 1rem;
    text-align: center;
  }
  
  .modal-content {
    position: relative;
    width: 100%;
    max-width: 28rem;
    overflow: hidden;
    border-radius: 0.75rem;
    background-color: white;
    padding: 1.5rem;
    text-align: left;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    animation: modal-in 0.3s ease-out;
  }
  
  /* Header styles */
  .modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1rem;
  }
  
  .modal-header h3 {
    font-size: 1.125rem;
    font-weight: 500;
    color: #111827;
  }
  
  .modal-close-button {
    color: #9ca3af;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.25rem;
  }
  
  .modal-close-button:hover {
    color: #6b7280;
  }
  
  .modal-close-icon {
    width: 1.5rem;
    height: 1.5rem;
  }
  
  .modal-form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
  .form-group {
    margin-bottom: 1rem;
  }
  
  .form-group label {
    display: block;
    font-size: 0.875rem;
    font-weight: 500;
    color: #374151;
    margin-bottom: 0.5rem;
  }
  
  .form-input,
  .form-textarea,
  .form-select {
    display: block;
    width: 100%;
    padding: 0.5rem 0.75rem;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    font-size: 0.875rem;
    line-height: 1.25rem;
  }
  
  .form-input:focus,
  .form-textarea:focus,
  .form-select:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 1px #3b82f6;
  }
  
  .form-textarea {
    min-height: 5rem;
    resize: vertical;
  }
  
  .form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 0.75rem;
    margin-top: 1rem;
  }
  
  .cancel-button,
  .submit-button {
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
    font-weight: 500;
    border-radius: 0.375rem;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  
  .cancel-button {
    border: 1px solid #d1d5db;
    background-color: white;
    color: #374151;
  }
  
  .cancel-button:hover {
    background-color: #f9fafb;
  }
  
  .cancel-button:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
  }
  
  .submit-button {
    border: 1px solid transparent;
    background-color: #2563eb;
    color: white;
  }
  
  .submit-button:hover {
    background-color: #1d4ed8;
  }
  
  .submit-button:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
  }
  
  .modal-enter-active,
  .modal-leave-active {
    transition: opacity 0.3s ease;
  }
  
  .modal-enter-from,
  .modal-leave-to {
    opacity: 0;
  }
  
  @keyframes modal-in {
    from {
      transform: translateY(-20px) scale(0.95);
      opacity: 0;
    }
    to {
      transform: translateY(0) scale(1);
      opacity: 1;
    }
  }
</style>