
const useTodoStore = create(
  persist(
    (set, get) => ({
      todos: [],
      filter: 'all', // 'all', 'active', 'completed'
      nextId: 1,

      // Add a new todo
      addTodo: (text) => {
        if (!text.trim()) return
        
        const newTodo = {
          id: get().nextId,
          text: text.trim(),
          completed: false,
          createdAt: new Date().toISOString(),
          priority: 'medium' // 'low', 'medium', 'high'
        }

        set((state) => ({
          todos: [...state.todos, newTodo],
          nextId: state.nextId + 1
        }))
      },

      // Toggle todo completion
      toggleTodo: (id) => {
        set((state) => ({
          todos: state.todos.map((todo) =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
          )
        }))
      },

      // Delete a todo
      deleteTodo: (id) => {
        set((state) => ({
          todos: state.todos.filter((todo) => todo.id !== id)
        }))
      },

      // Edit todo text
      editTodo: (id, newText) => {
        if (!newText.trim()) return
        
        set((state) => ({
          todos: state.todos.map((todo) =>
            todo.id === id ? { ...todo, text: newText.trim() } : todo
          )
        }))
      },

      // Set todo priority
      setPriority: (id, priority) => {
        set((state) => ({
          todos: state.todos.map((todo) =>
            todo.id === id ? { ...todo, priority } : todo
          )
        }))
      },

      // Clear all completed todos
      clearCompleted: () => {
        set((state) => ({
          todos: state.todos.filter((todo) => !todo.completed)
        }))
      },

      // Toggle all todos
      toggleAll: () => {
        const { todos } = get()
        const allCompleted = todos.every((todo) => todo.completed)
        
        set((state) => ({
          todos: state.todos.map((todo) => ({
            ...todo,
            completed: !allCompleted
          }))
        }))
      },

      // Set filter
      setFilter: (filter) => {
        set({ filter })
      },

      // Reorder todos (for drag and drop)
      reorderTodos: (startIndex, endIndex) => {
        set((state) => {
          const result = Array.from(state.todos)
          const [removed] = result.splice(startIndex, 1)
          result.splice(endIndex, 0, removed)
          
          return { todos: result }
        })
      },

      // Get filtered todos
      getFilteredTodos: () => {
        const { todos, filter } = get()
        
        switch (filter) {
          case 'active':
            return todos.filter((todo) => !todo.completed)
          case 'completed':
            return todos.filter((todo) => todo.completed)
          default:
            return todos
        }
      },

      // Get todos by priority
      getTodosByPriority: (priority) => {
        const { todos } = get()
        return todos.filter((todo) => todo.priority === priority)
      },

      // Get todo statistics
      getStats: () => {
        const { todos } = get()
        const total = todos.length
        const completed = todos.filter((todo) => todo.completed).length
        const active = total - completed
        const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0

        const priorityStats = {
          high: todos.filter((todo) => todo.priority === 'high' && !todo.completed).length,
          medium: todos.filter((todo) => todo.priority === 'medium' && !todo.completed).length,
          low: todos.filter((todo) => todo.priority === 'low' && !todo.completed).length
        }

        return {
          total,
          completed,
          active,
          completionRate,
          priorityStats
        }
      },

      // Search todos
      searchTodos: (query) => {
        if (!query.trim()) return get().todos
        
        const { todos } = get()
        const searchTerm = query.toLowerCase().trim()
        
        return todos.filter((todo) =>
          todo.text.toLowerCase().includes(searchTerm)
        )
      },

      // Bulk operations
      bulkDelete: (ids) => {
        set((state) => ({
          todos: state.todos.filter((todo) => !ids.includes(todo.id))
        }))
      },

      bulkToggle: (ids, completed) => {
        set((state) => ({
          todos: state.todos.map((todo) =>
            ids.includes(todo.id) ? { ...todo, completed } : todo
          )
        }))
      },

      bulkSetPriority: (ids, priority) => {
        set((state) => ({
          todos: state.todos.map((todo) =>
            ids.includes(todo.id) ? { ...todo, priority } : todo
          )
        }))
      },

      // Import/Export functionality
      exportTodos: () => {
        const { todos } = get()
        return JSON.stringify(todos, null, 2)
      },

      importTodos: (todosJson) => {
        try {
          const importedTodos = JSON.parse(todosJson)
          if (Array.isArray(importedTodos)) {
            const maxId = Math.max(0, ...importedTodos.map(todo => todo.id || 0))
            set((state) => ({
              todos: [...state.todos, ...importedTodos],
              nextId: Math.max(state.nextId, maxId + 1)
            }))
            return true
          }
          return false
        } catch (error) {
          console.error('Failed to import todos:', error)
          return false
        }
      },

      // Reset store
      reset: () => {
        set({
          todos: [],
          filter: 'all',
          nextId: 1
        })
      }
    }),
    {
      name: 'neo-brutalism-todo-storage',
      version: 1,
      migrate: (persistedState, version) => {
        // Handle version migrations if needed
        if (version === 0) {
          // Migration from version 0 to 1
          return {
            ...persistedState,
            nextId: Math.max(1, ...persistedState.todos.map(t => t.id || 0)) + 1
          }
        }
        return persistedState
      }
    }
  )
)

export default useTodoStore