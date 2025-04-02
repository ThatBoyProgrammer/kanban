import { ref } from 'vue'

export function useDragAndDrop() {
  const draggedTask = ref(null)

  const onDragStart = (task) => {
    draggedTask.value = task
  }

  const onDrop = (status, boardStore) => {
    if (draggedTask.value) {
      boardStore.moveTask(draggedTask.value.id, status)
      draggedTask.value = null
    }
  }

  return { draggedTask, onDragStart, onDrop }
}