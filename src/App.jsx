import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, X, Check, Trash2, Edit3 } from 'lucide-react'
import { cn } from './lib/utils'

function App() {
  const [todos, setTodos] = useState([])
  const [newTodo, setNewTodo] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editText, setEditText] = useState('')
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    const savedTodos = localStorage.getItem('neo-brutalism-todos')
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('neo-brutalism-todos', JSON.stringify(todos))
  }, [todos])

  const addTodo = () => {
    if (newTodo.trim()) {
      const todo = {
        id: Date.now(),
        text: newTodo.trim(),
        completed: false,
        createdAt: new Date().toISOString()
      }
      setTodos([todo, ...todos])
      setNewTodo('')
    }
  }

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id))
  }

  const toggleTodo = (id) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }

  const startEditing = (id, text) => {
    setEditingId(id)
    setEditText(text)
  }

  const saveEdit = () => {
    if (editText.trim()) {
      setTodos(todos.map(todo => 
        todo.id === editingId ? { ...todo, text: editText.trim() } : todo
      ))
    }
    setEditingId(null)
    setEditText('')
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditText('')
  }

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed
    if (filter === 'completed') return todo.completed
    return true
  })

  const handleKeyPress = (e, action) => {
    if (e.key === 'Enter') {
      action()
    }
  }

  return (
    <div className="min-h-screen bg-yellow-300 p-4 font-mono">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-8"
        >
          <h1 className="text-6xl font-black text-black mb-4 transform -rotate-2 bg-white p-4 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] inline-block">
            TODO
          </h1>
          <p className="text-xl font-bold text-black mt-4">
            Get stuff done with style! 💥
          </p>
        </motion.div>

        {/* Add Todo Form */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mb-8 bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6"
        >
          <div className="flex gap-4">
            <input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              onKeyPress={(e) => handleKeyPress(e, addTodo)}
              placeholder="What needs to be done?"
              className="flex-1 p-4 text-xl font-bold border-4 border-black bg-pink-200 placeholder-black focus:outline-none focus:bg-cyan-200 transition-colors"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={addTodo}
              className="px-6 py-4 bg-green-400 border-4 border-black font-black text-xl hover:bg-green-300 transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px]"
            >
              <Plus size={24} />
            </motion.button>
          </div>
        </motion.div>

        {/* Filter Buttons */}
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="mb-6 flex gap-4 flex-wrap"
        >
          {['all', 'active', 'completed'].map((filterType) => (
            <motion.button
              key={filterType}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilter(filterType)}
              className={cn(
                "px-6 py-3 border-4 border-black font-black text-lg uppercase transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px]",
                filter === filterType
                  ? "bg-purple-400 text-black"
                  : "bg-white text-black hover:bg-purple-200"
              )}
            >
              {filterType}
            </motion.button>
          ))}
        </motion.div>

        {/* Todo List */}
        <div className="space-y-4">
          <AnimatePresence>
            {filteredTodos.map((todo, index) => (
              <motion.div
                key={todo.id}
                initial={{ x: -300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 300, opacity: 0 }}
                transition={{ delay: index * 0.1 }}
                className={cn(
                  "bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 transform transition-transform hover:rotate-1",
                  todo.completed && "bg-gray-200"
                )}
              >
                <div className="flex items-center gap-4">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => toggleTodo(todo.id)}
                    className={cn(
                      "w-8 h-8 border-4 border-black flex items-center justify-center font-black transition-colors",
                      todo.completed
                        ? "bg-green-400 text-black"
                        : "bg-white hover:bg-green-200"
                    )}
                  >
                    {todo.completed && <Check size={16} />}
                  </motion.button>

                  {editingId === todo.id ? (
                    <div className="flex-1 flex gap-2">
                      <input
                        type="text"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        onKeyPress={(e) => handleKeyPress(e, saveEdit)}
                        className="flex-1 p-2 text-lg font-bold border-4 border-black bg-cyan-200 focus:outline-none"
                        autoFocus
                      />
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={saveEdit}
                        className="px-3 py-2 bg-green-400 border-4 border-black font-black hover:bg-green-300 transition-colors"
                      >
                        <Check size={16} />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={cancelEdit}
                        className="px-3 py-2 bg-red-400 border-4 border-black font-black hover:bg-red-300 transition-colors"
                      >
                        <X size={16} />
                      </motion.button>
                    </div>
                  ) : (
                    <>
                      <span
                        className={cn(
                          "flex-1 text-lg font-bold text-black",
                          todo.completed && "line-through opacity-60"
                        )}
                      >
                        {todo.text}
                      </span>
                      <div className="flex gap-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => startEditing(todo.id, todo.text)}
                          className="p-2 bg-blue-400 border-4 border-black font-black hover:bg-blue-300 transition-colors"
                        >
                          <Edit3 size={16} />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => deleteTodo(todo.id)}
                          className="p-2 bg-red-400 border-4 border-black font-black hover:bg-red-300 transition-colors"
                        >
                          <Trash2 size={16} />
                        </motion.button>
                      </div>
                    </>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Stats */}
        {todos.length > 0 && (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="mt-8 bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6"
          >
            <div className="flex justify-between items-center text-lg font-black">
              <span>Total: {todos.length}</span>
              <span>Active: {todos.filter(t => !t.completed).length}</span>
              <span>Completed: {todos.filter(t => t.completed).length}</span>
            </div>
          </motion.div>
        )}

        {filteredTodos.length === 0 && todos.length > 0 && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center py-12"
          >
            <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 inline-block transform -rotate-2">
              <p className="text-2xl font-black text-black">
                No {filter} todos! 🎉
              </p>
            </div>
          </motion.div>
        )}

        {todos.length === 0 && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center py-12"
          >
            <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 inline-block transform rotate-2">
              <p className="text-2xl font-black text-black mb-2">
                No todos yet! 
              </p>
              <p className="text-lg font-bold text-black">
                Add one above to get started! ⬆️
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default App