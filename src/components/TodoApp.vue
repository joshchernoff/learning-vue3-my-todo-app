<template>
  <div class="max-w-md mx-auto p-4 bg-white rounded shadow-md">
    <h1 class="text-2xl font-bold mb-4">Todo App</h1>
    <input
      v-model="newTodoText"
      @keyup.enter="handleAddTodo"
      placeholder="Add a new todo"
      class="w-full p-2 border rounded mb-4"
    />
    <ul>
      <li
        v-for="todo in todos"
        :key="todo.id"
        class="flex items-center justify-between mb-2"
      >
        <label class="flex items-center">
          <input
            type="checkbox"
            :checked="todo.completed"
            @change="() => handleToggleTodoCompletion(todo.id)"
            class="mr-2"
          />
          <span :class="{ 'line-through text-gray-500': todo.completed }">
            {{ todo.text }}
          </span>
        </label>
        <button
          @click="() => handleRemoveTodo(todo.id)"
          class="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
        >
          Remove
        </button>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted, onUnmounted } from 'vue';
import { useTodoStore, Todo } from '../store/todoStore';
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query';
import { supabase } from '../lib/supabaseClient';

export default defineComponent({
  name: 'TodoApp',
  setup() {
    const todoStore = useTodoStore();
    const queryClient = useQueryClient();
    const newTodoText = ref<string>('');
    const localIds = new Set();

    const { data, refetch } = useQuery<Todo[], Error>({
      queryKey: ['todos'],
      queryFn: todoStore.loadTodos,
    });

    const todos = computed(() => todoStore.todos);

    const addTodoMutation = useMutation({
      mutationFn: todoStore.addTodo,
      onMutate: async (newTodo) => {
        // Add a temporary unique identifier
        const tempId = Date.now();
        localIds.add(tempId);
        return { tempId };
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['todos'] });
      },
      onSettled: (_data, _error, _newTodo, context) => {
        if (context?.tempId) {
          localIds.delete(context.tempId);
        }
      },
    });

    const toggleTodoCompletionMutation = useMutation({
      mutationFn: todoStore.toggleTodoCompletion,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['todos'] });
      },
    });

    const removeTodoMutation = useMutation({
      mutationFn: todoStore.removeTodo,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['todos'] });
      },
    });

    const handleAddTodo = () => {
      if (newTodoText.value.trim() !== '') {
        addTodoMutation.mutate(newTodoText.value);
        newTodoText.value = '';
      }
    };

    const handleToggleTodoCompletion = (id: number) => {
      toggleTodoCompletionMutation.mutate(id);
    };

    const handleRemoveTodo = (id: number) => {
      removeTodoMutation.mutate(id);
    };

    const handleRealtimeUpdate = (payload: any) => {
      console.log('Change received!', payload);
      if (payload.eventType === 'INSERT') {
        if (!todoStore.todos.some((todo) => todo.id === payload.new.id)) {
          todoStore.todos.push(payload.new);
        }
      } else if (payload.eventType === 'UPDATE') {
        const index = todoStore.todos.findIndex(
          (todo) => todo.id === payload.new.id
        );
        if (index !== -1) {
          todoStore.todos[index] = payload.new;
        }
      } else if (payload.eventType === 'DELETE') {
        todoStore.todos = todoStore.todos.filter(
          (todo) => todo.id !== payload.old.id
        );
      }
    };

    onMounted(() => {
      const channel = supabase
        .channel('public:todos')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'todos' },
          handleRealtimeUpdate
        )
        .subscribe();

      onUnmounted(() => {
        supabase.removeChannel(channel);
      });
    });

    return {
      newTodoText,
      todos,
      handleAddTodo,
      handleToggleTodoCompletion,
      handleRemoveTodo,
    };
  },
});
</script>

<style scoped>
/* Scoped styles can be used in conjunction with Tailwind classes if needed */
</style>
