import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Plus, Check, X } from 'lucide-react';
import { cn } from '../lib/utils';

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const savedTodos = localStorage.getItem('neo-brutalism-todos');
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('neo-brutalism-todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    if (newTodo.trim() !== '') {
      const todo = {
        id: Date.now(),
        text: newTodo.trim(),
        completed: false,
        createdAt: new Date().toISOString()
      };
      setTodos([todo, ...todos]);
      setNewTodo('');
    }
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addTodo();
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.4 }
    },
    exit: {
      opacity: 0,
      x: 100,
      transition: { duration: 0.3 }
    }
  };

  const buttonVariants = {
    hover: {
      scale: 1.05,
      transition: { duration: 0.2 }
    },
    tap: {
      scale: 0.95,
      transition: { duration: 0.1 }
    }
  };

  return (
    <motion.div
      className="max-w-2xl mx-auto p-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-5xl font-black text-black mb-2 transform -rotate-1">
          TODO
        </h1>
        <div className="w-24 h-2 bg-yellow-400 transform rotate-1 border-4 border-black"></div>
      </motion.div>

      {/* Add Todo Input */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Add a new task..."
              className="w-full px-4 py-3 text-lg font-bold bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] focus:outline-none transition-all duration-200"
            />
          </div>
          <motion.button
            onClick={addTodo}
            className="px-6 py-3 bg-green-400 border-4 border-black font-black text-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all duration-200"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <Plus size={24} />
          </motion.button>
        </div>
      </motion.div>

      {/* Filter Buttons */}
      <motion.div
        className="mb-6 flex gap-2"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        {['all', 'active', 'completed'].map((filterType) => (
          <motion.button
            key={filterType}
            onClick={() => setFilter(filterType)}
            className={cn(
              "px-4 py-2 font-bold border-3 border-black transition-all duration-200 capitalize",
              filter === filterType
                ? "bg-blue-400 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                : "bg-white hover:bg-gray-100 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
            )}
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            {filterType}
          </motion.button>
        ))}
      </motion.div>

      {/* Todo Stats */}
      {todos.length > 0 && (
        <motion.div
          className="mb-6 p-4 bg-purple-300 border-4 border-black transform -rotate-1"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <p className="font-bold text-lg">
            {todos.filter(todo => !todo.completed).length} active, {todos.filter(todo => todo.completed).length} completed
          </p>
        </motion.div>
      )}

      {/* Todo List */}
      <motion.div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {filteredTodos.map((todo, index) => (
            <motion.div
              key={todo.id}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              layout
              className={cn(
                "flex items-center gap-4 p-4 border-4 border-black transition-all duration-200",
                todo.completed
                  ? "bg-gray-200 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                  : "bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]",
                index % 2 === 0 ? "transform rotate-1" : "transform -rotate-1"
              )}
              whileHover={{
                scale: 1.02,
                rotate: 0,
                transition: { duration: 0.2 }
              }}
            >
              <motion.button
                onClick={() => toggleTodo(todo.id)}
                className={cn(
                  "flex-shrink-0 w-8 h-8 border-3 border-black flex items-center justify-center font-bold transition-all duration-200",
                  todo.completed
                    ? "bg-green-400 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                    : "bg-white hover:bg-green-100 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                )}
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                {todo.completed && <Check size={16} />}
              </motion.button>

              <div className="flex-1">
                <p className={cn(
                  "text-lg font-bold transition-all duration-200",
                  todo.completed && "line-through text-gray-600"
                )}>
                  {todo.text}
                </p>
              </div>

              <motion.button
                onClick={() => deleteTodo(todo.id)}
                className="flex-shrink-0 p-2 bg-red-400 border-3 border-black hover:bg-red-500 transition-all duration-200 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <Trash2 size={16} />
              </motion.button>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Empty State */}
      {filteredTodos.length === 0 && (
        <motion.div
          className="text-center py-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="inline-block p-6 bg-yellow-300 border-4 border-black transform rotate-3 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <p className="text-xl font-black">
              {filter === 'all' ? 'No tasks yet!' : `No ${filter} tasks!`}
            </p>
            {filter === 'all' && (
              <p className="text-lg font-bold mt-2">Add one above to get started!</p>
            )}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default TodoList;