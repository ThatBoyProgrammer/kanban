import { defineStore } from 'pinia'
import { ref, computed, watch, watchEffect } from 'vue'
import { useQuery, useMutation } from '@vue/apollo-composable'
import { gql } from '@apollo/client/core'
import { provideApolloClient } from '@vue/apollo-composable'
import { apolloClient } from '@/apollo'
import { toast } from 'vue3-toastify'

provideApolloClient(apolloClient)

export const useBoardStore = defineStore('board', () => {
  // GraphQL Queries
  const GET_TASKS = gql`
    query GetTasks($user_id: ID!) {
      tasks(user_id: $user_id) {
        id
        title
        description
        status
        dueDate
        user_id
        created_at
        updated_at
      }
    }
  `

  const UPDATE_TASK = gql`
    mutation UpdateTask(
      $id: ID!
      $title: String
      $description: String
      $status: String
      $dueDate: String
    ) {
      updateTask(
        id: $id
        title: $title
        description: $description
        status: $status
        dueDate: $dueDate
      ) {
        id
        title
        description
        status
        dueDate
        user_id
        created_at
        updated_at
      }
    }
  `

  const DELETE_TASK = gql`
    mutation DeleteTask($id: ID!) {
      deleteTask(id: $id) {
        id
      }
    }
  `

  const ADD_TASK = gql`
    mutation CreateTask($input: TaskInput!) {
      createTask(input: $input) {
        id
        title
        description
        status
        dueDate
        user_id
        created_at
        updated_at
      }
    }
  `;

  const state = ref({
    tasks: [],
    columns: [
      { id: 'Task Ready', title: 'Task Ready' },
      { id: 'Needs Review', title: 'Needs Review' },
      { id: 'Done', title: 'Done' }
    ]
  })

  const history = ref([])
  const MAX_HISTORY = 5
  const userId = ref(localStorage.getItem('userId'))

  const tasks = computed(() => state.value.tasks)
  const columns = computed(() => state.value.columns)
  const canUndo = computed(() => history.value.length > 0)

  const formatDateTime = (date) => {
    if (!date) return null;
    
    const d = new Date(date);
    const pad = (num) => num.toString().padStart(2, '0');
    
    return `${pad(d.getDate())}-${pad(d.getMonth() + 1)}-${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  };

  watch(
    () => state.value.columns,
    (newColumns) => {
      localStorage.setItem('kanban-state', JSON.stringify({
        columns: newColumns
      }))
    },
    { deep: true }
  )

  const loadSavedColumns = () => {
    try {
      const saved = localStorage.getItem('kanban-state')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed.columns) {
          state.value.columns = parsed.columns
        }
      }
    } catch (error) {
      console.error('Error loading saved columns:', error)
      toast.error('Failed to load saved columns')
    }
  }

  const initialize = async () => {
    loadSavedColumns()
    await loadInitialState()
  }

  const { result, error, refetch } = useQuery(
    GET_TASKS, 
    { user_id: userId.value }, 
    { fetchPolicy: 'network-only' }
  )

  const loadInitialState = async () => {
    try {
      if (!userId.value) {
        toast.error('User ID not found. Please login again.')
        return
      }

      await refetch()

      watchEffect(() => {
        if (result.value?.tasks) {
          state.value.tasks = result.value.tasks
        }
      })

      if (error.value) {
        throw error.value
      }
    } catch (err) {
      console.error('Initialization error:', err)
      toast.error('Failed to load tasks')
    }
  }

  const refreshTasks = async () => {
    try {
      await refetch()
      if (result.value?.tasks) {
        state.value.tasks = result.value.tasks
        toast.success('Tasks refreshed successfully')
      }
    } catch (error) {
      console.error('Error refreshing tasks:', error)
      toast.error('Failed to refresh tasks')
    }
  }

  const removeColumn = (columnId) => {
    if (state.value.columns.length <= 1) {
      toast.error('Cannot delete the last column')
      return
    }

    history.value.unshift(JSON.parse(JSON.stringify(state.value)))
    if (history.value.length > MAX_HISTORY) history.value.pop()

    const newState = {
      ...state.value,
      columns: state.value.columns.filter(col => col.id !== columnId)
    }

    const newColumnId = newState.columns[0]?.id
    if (newColumnId) {
      newState.tasks = state.value.tasks.map(task => {
        if (task.status === columnId) {
          return { ...task, status: newColumnId }
        }
        return task
      })
    }

    state.value = newState
    toast.success('Column removed successfully')
  }

  const undo = () => {
    if (history.value.length > 0) {
      state.value = history.value.shift()
      toast.success('Action undone')
      return true
    }
    toast.info('Nothing to undo')
    return false
  }

  const addColumn = (title) => {
    if (!title.trim()) {
      toast.error('Column title cannot be empty')
      return
    }

    if (state.value.columns.some(col => col.title === title)) {
      toast.error('Column with this name already exists')
      return
    }

    const newColumn = {
      id: title,
      title: title
    }

    state.value.columns.push(newColumn)
    toast.success(`Column "${title}" added`)
  }

  const moveTask = async (taskId, newStatus) => {
    try {
      const task = state.value.tasks.find(t => t.id === taskId)
      if (!task) {
        throw new Error('Task not found')
      }

      await updateTask(taskId, { status: newStatus })
      toast.success('Task moved successfully')
    } catch (error) {
      console.error('Error moving task:', error)
      toast.error('Failed to move task')
      throw error
    }
  }

  const addTask = async (task) => {
    try {
      if (!task.title?.trim()) throw new Error('Task title is required');
      
      const { mutate } = useMutation(ADD_TASK);

      const input = {
        title: task.title.trim(),
        description: task.description?.trim() || '',
        status: task.status || 'Task Ready',
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString() : null,
        user_id: userId.value,
      };
  
      const { data } = await mutate({ input });
      
      if (!data?.createTask) {
        throw new Error('No data returned from createTask mutation');
      }
  
      state.value.tasks = [...state.value.tasks, data.createTask];
      toast.success('Task added successfully');
      return data.createTask;
    } catch (error) {
      console.error('Error adding task:', error);
      toast.error(`Failed to add task: ${error.message}`);
      throw error;
    }
  };

  const getTask = async (taskId) => {
    try {
      const { result, refetch } = useQuery(
        gql`query GetTask($id: ID!) { task(id: $id) { id title description status dueDate user_id } }`,
        { id: taskId }
      )

      await refetch()
      if (result.value?.task) {
        return result.value.task
      }
      throw new Error('Task not found')
    } catch (error) {
      console.error('Error fetching task:', error)
      toast.error('Failed to fetch task')
      throw error
    }
  }

  const updateTask = async (taskId, updates) => {
    try {
      const task = state.value.tasks.find(t => t.id === taskId);
      if (!task) {
        throw new Error('Task not found');
      }
  
      if (updates.dueDate) {
        updates.dueDate = formatDateTime(updates.dueDate);
      }
  
      const { mutate } = useMutation(UPDATE_TASK);
      const { data } = await mutate({
        id: taskId,
        ...updates
      });
  
      if (!data?.updateTask) {
        throw new Error('Failed to update task');
      }
  
      const index = state.value.tasks.findIndex(t => t.id === taskId);
      if (index !== -1) {
        state.value.tasks[index] = data.updateTask;
      }
  
      toast.success('Task updated successfully');
      return data.updateTask;
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error('Failed to update task');
      throw error;
    }
  };

  const deleteTask = async (taskId) => {
    try {
      const taskExists = state.value.tasks.some(t => t.id === taskId)
      if (!taskExists) {
        throw new Error('Task not found')
      }

      const { mutate } = useMutation(DELETE_TASK)
      await mutate({ id: taskId })

      state.value.tasks = state.value.tasks.filter(t => t.id !== taskId)
      toast.success('Task deleted successfully')
      return true
    } catch (error) {
      console.error('Error deleting task:', error)
      toast.error('Failed to delete task')
      throw error
    }
  }

  return { 
    state,
    tasks,
    columns,
    canUndo,
    initialize,
    addColumn,
    moveTask,
    addTask,
    getTask,
    updateTask,
    deleteTask,
    removeColumn,
    undo,
    refreshTasks
  }
})