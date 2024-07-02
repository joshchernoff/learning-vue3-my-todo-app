// src/store/todoStore.ts
import { defineStore } from 'pinia';
import { reactive, watch } from 'vue';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

export const useTodoStore = defineStore('todo', () => {
  const state = reactive({
    todos: [] as Todo[],
    nextId: 1,
  });

  // Load todos from local storage
  const loadTodos = () => {
    const storedTodos = localStorage.getItem('todos');
    const storedNextId = localStorage.getItem('nextId');
    if (storedTodos) {
      state.todos = JSON.parse(storedTodos);
    }
    if (storedNextId) {
      state.nextId = Number(storedNextId);
    }
  };

  loadTodos();

  // Save todos to local storage whenever they change
  watch(
    () => state.todos,
    (newTodos) => {
      localStorage.setItem('todos', JSON.stringify(newTodos));
    },
    { deep: true }
  );

  watch(
    () => state.nextId,
    (newNextId) => {
      localStorage.setItem('nextId', newNextId.toString());
    }
  );

  const addTodo = (text: string) => {
    state.todos.push({ id: state.nextId++, text, completed: false });
  };

  const toggleTodoCompletion = (id: number) => {
    const todo = state.todos.find(todo => todo.id === id);
    if (todo) {
      todo.completed = !todo.completed;
      console.log('Toggled todo:', todo);
    }
  };

  const removeTodo = (id: number) => {
    const index = state.todos.findIndex(todo => todo.id === id);
    if (index !== -1) {
      state.todos.splice(index, 1);
    }
  };

  return {
    todos: state.todos,
    addTodo,
    toggleTodoCompletion,
    removeTodo,
  };
});
