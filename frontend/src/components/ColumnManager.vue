<template>
    <div v-if="showColumnModal" class="modal-overlay">
      <div class="modal-backdrop" @click="closeModal"></div>
      <div class="modal-content">
        <div class="modal-header">
          <h3>Add New Column</h3>
          <button @click="closeModal" class="modal-close-button">
            &times;
          </button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <input 
              v-model="newColumnTitle"
              type="text"
              placeholder="Column title"
              class="modal-input"
              @keyup.enter="validateAndAddColumn"
            >
            <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
          </div>
          <button @click="validateAndAddColumn" class="modal-submit-button">
            Add Column
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, defineExpose } from 'vue'
  import { useBoardStore } from '@/stores/BoardStore'
  import { toast } from 'vue3-toastify';
  
  const boardStore = useBoardStore()
  const showColumnModal = ref(false)
  const newColumnTitle = ref('')
  const errorMessage = ref('')
  
  const openModal = () => {
    showColumnModal.value = true
    errorMessage.value = ''
  }
  
  const closeModal = () => {
    showColumnModal.value = false
    newColumnTitle.value = ''
    errorMessage.value = ''
  }
  
  const validateColumn = () => {
    errorMessage.value = ''
    
    if (!newColumnTitle.value.trim()) {
      errorMessage.value = 'Column title cannot be empty'
      return false
    }
    
    const columnExists = boardStore.columns.some(
      column => column.title.toLowerCase() === newColumnTitle.value.trim().toLowerCase()
    )
    
    if (columnExists) {
      errorMessage.value = 'A column with this name already exists'
      return false
    }
    
    if (newColumnTitle.value.length > 30) {
      errorMessage.value = 'Column title cannot exceed 30 characters'
      return false
    }
    
    return true
  }
  
  const validateAndAddColumn = () => {
    if (validateColumn()) {
      try {
        boardStore.addColumn(newColumnTitle.value.trim())

        closeModal()
      } catch (error) {
        
        console.error('Error adding column:', error)
      }
    } else {
      toast.error(errorMessage.value)
    }
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
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
  }
  
  .modal-content {
    position: relative;
    background: white;
    border-radius: 0.5rem;
    width: 100%;
    max-width: 24rem;
    padding: 1.5rem;
    z-index: 10;
  }
  
  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }
  
  .modal-close-button {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: #64748b;
  }
  
  .modal-input {
    width: 100%;
    padding: 0.5rem 1rem;
    border: 1px solid #e2e8f0;
    border-radius: 0.375rem;
    margin-bottom: 0.5rem;
  }
  
  .modal-input:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 1px #3b82f6;
  }
  
  .modal-submit-button {
    width: 100%;
    padding: 0.5rem 1rem;
    background-color: #3b82f6;
    color: white;
    border: none;
    border-radius: 0.375rem;
    cursor: pointer;
    transition: background-color 0.2s;
  }
  
  .modal-submit-button:hover {
    background-color: #2563eb;
  }
  
  .error-message {
    color: #ef4444;
    font-size: 0.875rem;
    margin-top: 0.25rem;
  }
  
  .form-group {
    margin-bottom: 1rem;
  }
  </style>