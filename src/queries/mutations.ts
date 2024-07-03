// src/queries/mutations.ts
import { supabase } from '../lib/supabaseClient';
import { Todo } from './todos';

export const addTodo = async (text: string): Promise<Todo> => {
  const { data, error } = await supabase
    .from('todos')
    .insert([{ text, completed: false }])
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data as Todo;
};

export const updateTodo = async (
  id: number,
  completed: boolean
): Promise<Todo> => {
  const { data, error } = await supabase
    .from('todos')
    .update({ completed })
    .eq('id', id)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data as Todo;
};

export const deleteTodo = async (id: number): Promise<void> => {
  const { error } = await supabase.from('todos').delete().eq('id', id);
  if (error) throw new Error(error.message);
};
