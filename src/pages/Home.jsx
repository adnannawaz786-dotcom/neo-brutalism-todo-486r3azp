import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Trash2, CheckCircle2, Circle, Filter } from 'lucide-react'
import TodoList from '../components/TodoList'

export default function Home() {
  const [todos, setTodos] = useState([])
  const [newTodo, setNewTodo] = useState('')
  const [filter, setFilter] = useState('all')
  const [isLoading, setIsLoading] = useState(false)

  // Load todos from localStorage on mount
  useEffect(() => {
    const savedTodos = localStorage.getItem('neo-brutalism-todos')
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos))
    }
  }, [])

  // Save todos to localStorage whenever todos change
  useEffect(() => {
    localStorage.setItem('neo-brutalism-todos', JSON.stringify(todos))
  }, [todos])

  const addTodo = async (e) => {
    e.preventDefault()
    if (!newTodo.trim()) return

    setIsLoading(true)
    
    const todo = {
      id: Date.now(),
      text: newTodo.trim(),
      completed: false,
      createdAt: new Date().toISOString()
    }

    // Simulate API delay for better UX
    setTimeout(() => {
      setTodos(prev => [todo, ...prev])
      setNewTodo('')
      setIsLoading(false)
    }, 200)
  }

  const toggleTodo = (id) => {
    setTodos(prev => prev.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }

  const deleteTodo = (id) => {
    setTodos(prev => prev.filter(todo => todo.id !== id))
  }

  const clearCompleted = () => {
    setTodos(prev => prev.filter(todo => !todo.completed))
  }

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed
    if (filter === 'completed') return todo.completed
    return true
  })

  const completedCount = todos.filter(todo => todo.completed).length
  const activeCount = todos.length - completedCount

  return (
    <div className="min-h-screen bg-yellow-300 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mb-8"
        >
          <h1 className="text-6xl md:text-8xl font-black text-black mb-4 transform -rotate-2 drop-shadow-[8px_8px_0px_rgba(0,0,0,1)]">
            TODO
          </h1>
          <p className="text-xl md:text-2xl font-bold text-black transform rotate-1">
            Get stuff done with style! 💪
          </p>
        </motion.div>

        {/* Add Todo Form */}
        <motion.form
          onSubmit={addTodo}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="mb-8"
        >
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                placeholder="What needs to be done?"
                className="w-full px-6 py-4 text-xl font-bold text-black bg-white border-4 border-black rounded-none shadow-[8px_8px_0px_rgba(0,0,0,1)] focus:outline-none focus:shadow-[12px_12px_0px_rgba(0,0,0,1)] transition-all duration-200"
                disabled={isLoading}
              />
            </div>
            <motion.button
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={isLoading || !newTodo.trim()}
              className="px-8 py-4 bg-red-500 text-white font-black text-xl border-4 border-black shadow-[8px_8px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_rgba(0,0,0,1)] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
                />
              ) : (
                <Plus size={24} />
              )}
            </motion.button>
          </div>
        </motion.form>

        {/* Stats */}
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.3 }}
          className="mb-6 flex flex-wrap gap-4"
        >
          <div className="px-4 py-2 bg-blue-500 text-white font-black border-4 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] transform -rotate-1">
            Active: {activeCount}
          </div>
          <div className="px-4 py-2 bg-green-500 text-white font-black border-4 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] transform rotate-1">
            Done: {completedCount}
          </div>
          <div className="px-4 py-2 bg-purple-500 text-white font-black border-4 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)]">
            Total: {todos.length}
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.3 }}
          className="mb-8 flex flex-wrap gap-4 items-center"
        >
          <div className="flex gap-2">
            {['all', 'active', 'completed'].map((filterType) => (
              <motion.button
                key={filterType}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setFilter(filterType)}
                className={`px-6 py-2 font-black text-lg border-4 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] transition-all duration-200 ${
                  filter === filterType
                    ? 'bg-black text-white'
                    : 'bg-white text-black hover:bg-gray-100'
                }`}
              >
                {filterType.toUpperCase()}
              </motion.button>
            ))}
          </div>
          
          {completedCount > 0 && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={clearCompleted}
              className="px-6 py-2 bg-red-500 text-white font-black text-lg border-4 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_rgba(0,0,0,1)] transition-all duration-200 flex items-center gap-2"
            >
              <Trash2 size={20} />
              CLEAR DONE
            </motion.button>
          )}
        </motion.div>

        {/* Todo List */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <TodoList
            todos={filteredTodos}
            onToggle={toggleTodo}
            onDelete={deleteTodo}
          />
        </motion.div>

        {/* Empty State */}
        <AnimatePresence>
          {filteredTodos.length === 0 && (
            <motion.div
              initial={{ scale: 0, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 10 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="text-center py-16"
            >
              <div className="text-8xl mb-4">
                {filter === 'completed' ? '🎉' : filter === 'active' ? '🚀' : '✨'}
              </div>
              <h3 className="text-3xl font-black text-black mb-2 transform -rotate-1">
                {filter === 'completed' 
                  ? 'No completed tasks!' 
                  : filter === 'active' 
                    ? 'No active tasks!' 
                    : 'No tasks yet!'}
              </h3>
              <p className="text-xl font-bold text-black opacity-75 transform rotate-1">
                {filter === 'completed' 
                  ? 'Get to work and complete some tasks!' 
                  : filter === 'active' 
                    ? 'All done! Time to celebrate! 🎊' 
                    : 'Add your first task to get started!'}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="mt-16 text-center"
        >
          <p className="text-lg font-bold text-black opacity-75 transform -rotate-1">
            Made with 💪 and Neo-Brutalism vibes
          </p>
        </motion.footer>
      </div>
    </div>
  )
}