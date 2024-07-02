<template>
  <div class="max-w-md mx-auto p-4 bg-white rounded shadow-md">
    <h1 class="text-2xl font-bold mb-4">Todo App</h1>
    <input
      v-model="newTodoText"
      @keyup.enter="addTodo"
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
            @change="toggleTodoCompletion(todo.id)"
            class="mr-2"
          />
          <span :class="{ 'line-through text-gray-500': todo.completed }">
            {{ todo.text }}
          </span>
        </label>
        <button
          @click="removeTodo(todo.id)"
          class="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
        >
          Remove
        </button>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useTodoStore } from '../store/todoStore';

export default defineComponent({
  name: 'TodoApp',
  setup() {
    const todoStore = useTodoStore();
    const newTodoText = ref('');

    const addTodo = () => {
      if (newTodoText.value.trim() !== '') {
        todoStore.addTodo(newTodoText.value);
        newTodoText.value = '';
      }
    };

    const toggleTodoCompletion = (id: number) => {
      todoStore.toggleTodoCompletion(id);
    };

    const removeTodo = (id: number) => {
      todoStore.removeTodo(id);
    };

    return {
      newTodoText,
      todos: todoStore.todos,
      addTodo,
      toggleTodoCompletion,
      removeTodo,
    };
  },
});
</script>

<style scoped>
/* Scoped styles can be used in conjunction with Tailwind classes if needed */
</style>
