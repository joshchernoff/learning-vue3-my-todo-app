// src/store/todoStore.ts
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { supabase } from '../lib/supabaseClient';

export interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

export const useTodoStore = defineStore('todo', () => {
  const todos = ref<Todo[]>([]);

  const loadTodos = async (): Promise<Todo[]> => {
    const { data, error } = await supabase.from('todos').select('*');
    if (error) throw error;
    todos.value = data as Todo[];
    return todos.value;
  };

  const addTodo = async (text: string): Promise<Todo> => {
    const { data, error } = await supabase
      .from('todos')
      .insert([{ text, completed: false }])
      .select('*')
      .single();
    if (error) throw error;
    todos.value.push(data as Todo);
    return data as Todo;
  };

  const toggleTodoCompletion = async (id: number) => {
    const todo = todos.value.find((todo) => todo.id === id);
    if (todo) {
      const { data, error } = await supabase
        .from('todos')
        .update({ completed: !todo.completed })
        .eq('id', id)
        .select('*')
        .single();
      if (error) throw error;
      Object.assign(todo, data);
    }
  };

  const removeTodo = async (id: number) => {
    const { error } = await supabase.from('todos').delete().eq('id', id);
    if (error) throw error;
    todos.value = todos.value.filter((todo) => todo.id !== id);
  };

  return {
    todos,
    loadTodos,
    addTodo,
    toggleTodoCompletion,
    removeTodo,
  };
});
