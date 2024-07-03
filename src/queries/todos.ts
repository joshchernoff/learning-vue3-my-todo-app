// src/queries/todos.ts
import { supabase } from '../lib/supabaseClient';

export interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

export const fetchTodos = async (): Promise<Todo[]> => {
  const { data, error } = await supabase.from('todos').select('*');
  if (error) throw new Error(error.message);
  return data as Todo[];
};
