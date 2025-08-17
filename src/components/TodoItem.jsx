import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trash2, Edit3, Check, X } from 'lucide-react'

const TodoItem = ({ todo, onToggle, onDelete, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editText, setEditText] = useState(todo.text)

  const handleSave = () => {
    if (editText.trim()) {
      onEdit(todo.id, editText.trim())
      setIsEditing(false)
    }
  }

  const handleCancel = () => {
    setEditText(todo.text)
    setIsEditing(false)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSave()
    }
    if (e.key === 'Escape') {
      handleCancel()
    }
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -50, scale: 0.9, x: 300 }}
      transition={{ 
        duration: 0.3,
        type: "spring",
        stiffness: 300,
        damping: 25
      }}
      whileHover={{ 
        scale: 1.02,
        transition: { duration: 0.2 }
      }}
      className="group relative"
    >
      <div className={`
        relative bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000] 
        p-4 transition-all duration-200 hover:shadow-[12px_12px_0px_0px_#000]
        hover:translate-x-[-2px] hover:translate-y-[-2px]
        ${todo.completed ? 'bg-green-100' : 'bg-white'}
      `}>
        <div className="flex items-center gap-4">
          {/* Checkbox */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onToggle(todo.id)}
            className={`
              flex-shrink-0 w-6 h-6 border-3 border-black 
              flex items-center justify-center font-bold text-lg
              transition-all duration-200 hover:shadow-[4px_4px_0px_0px_#000]
              ${todo.completed 
                ? 'bg-green-400 hover:bg-green-500' 
                : 'bg-white hover:bg-gray-100'
              }
            `}
          >
            <AnimatePresence>
              {todo.completed && (
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: 180 }}
                  transition={{ duration: 0.2 }}
                >
                  <Check size={16} className="text-black" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>

          {/* Todo Text or Edit Input */}
          <div className="flex-grow">
            <AnimatePresence mode="wait">
              {isEditing ? (
                <motion.input
                  key="input"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  onKeyDown={handleKeyPress}
                  onBlur={handleSave}
                  autoFocus
                  className="w-full px-3 py-2 border-2 border-black bg-yellow-100 
                           font-bold text-lg focus:outline-none focus:bg-yellow-200
                           shadow-[4px_4px_0px_0px_#000]"
                />
              ) : (
                <motion.p
                  key="text"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className={`
                    font-bold text-lg transition-all duration-200
                    ${todo.completed 
                      ? 'line-through text-gray-600' 
                      : 'text-black'
                    }
                  `}
                >
                  {todo.text}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <AnimatePresence>
              {isEditing ? (
                <motion.div
                  key="edit-actions"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex gap-2"
                >
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleSave}
                    className="p-2 bg-green-400 border-2 border-black 
                             hover:bg-green-500 transition-colors duration-200
                             shadow-[4px_4px_0px_0px_#000] hover:shadow-[6px_6px_0px_0px_#000]
                             hover:translate-x-[-1px] hover:translate-y-[-1px]"
                  >
                    <Check size={16} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleCancel}
                    className="p-2 bg-gray-400 border-2 border-black 
                             hover:bg-gray-500 transition-colors duration-200
                             shadow-[4px_4px_0px_0px_#000] hover:shadow-[6px_6px_0px_0px_#000]
                             hover:translate-x-[-1px] hover:translate-y-[-1px]"
                  >
                    <X size={16} />
                  </motion.button>
                </motion.div>
              ) : (
                <motion.div
                  key="normal-actions"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex gap-2"
                >
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsEditing(true)}
                    className="p-2 bg-blue-400 border-2 border-black 
                             hover:bg-blue-500 transition-colors duration-200
                             shadow-[4px_4px_0px_0px_#000] hover:shadow-[6px_6px_0px_0px_#000]
                             hover:translate-x-[-1px] hover:translate-y-[-1px]"
                  >
                    <Edit3 size={16} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => onDelete(todo.id)}
                    className="p-2 bg-red-400 border-2 border-black 
                             hover:bg-red-500 transition-colors duration-200
                             shadow-[4px_4px_0px_0px_#000] hover:shadow-[6px_6px_0px_0px_#000]
                             hover:translate-x-[-1px] hover:translate-y-[-1px]"
                  >
                    <Trash2 size={16} />
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Completion Animation Overlay */}
        <AnimatePresence>
          {todo.completed && (
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              exit={{ scaleX: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="absolute inset-0 bg-green-200 opacity-20 origin-left"
            />
          )}
        </AnimatePresence>

        {/* Hover Effect Accent */}
        <motion.div
          className="absolute -inset-1 bg-gradient-to-r from-purple-400 to-pink-400 opacity-0 
                     group-hover:opacity-20 transition-opacity duration-200 -z-10"
          style={{ filter: 'blur(8px)' }}
        />
      </div>
    </motion.div>
  )
}

export default TodoItem