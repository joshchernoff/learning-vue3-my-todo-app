// src/store/todoStore.ts
import { defineStore } from 'pinia';
import { reactive, watch } from 'vue';
import { supabase } from '../lib/supabaseClient';

export interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

export const useTodoStore = defineStore('todo', () => {
  const state = reactive({
    todos: [] as Todo[],
    nextId: 1,
  });

  // Load todos from Supabase
  const loadTodos = async (): Promise<Todo[]> => {
    const { data, error } = await supabase.from('todos').select('*');
    if (error) throw error;
    return data as Todo[];
  };

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

  const addTodo = async (text: string) => {
    const { data, error } = await supabase
      .from('todos')
      .insert([{ text, completed: false }])
      .select('*')
      .single();
    if (error) throw error;
    state.todos.push(data as Todo);
    state.nextId++;
  };

  const toggleTodoCompletion = async (id: number) => {
    const todo = state.todos.find((todo) => todo.id === id);
    if (todo) {
      const { data, error } = await supabase
        .from('todos')
        .update({ completed: !todo.completed })
        .eq('id', id)
        .select('*')
        .single();
      if (error) throw error;
      todo.completed = (data as Todo).completed;
    }
  };

  const removeTodo = async (id: number) => {
    const { error } = await supabase.from('todos').delete().eq('id', id);
    if (error) throw error;
    const index = state.todos.findIndex((todo) => todo.id === id);
    if (index !== -1) {
      state.todos.splice(index, 1);
    }
  };

  return {
    todos: state.todos,
    loadTodos,
    addTodo,
    toggleTodoCompletion,
    removeTodo,
  };
});
