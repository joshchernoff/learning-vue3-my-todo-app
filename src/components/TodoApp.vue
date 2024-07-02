<!-- src/components/TodoApp.vue -->
<template>
  <div>
    <h1>Todo App</h1>
    <input
      v-model="newTodoText"
      @keyup.enter="addTodo"
      placeholder="Add a new todo"
    />
    <ul>
      <li v-for="todo in todos" :key="todo.id">
        <label>
          <input
            type="checkbox"
            :checked="todo.completed"
            @change="toggleTodoCompletion(todo.id)"
          />
          <span :class="{ completed: todo.completed }">{{ todo.text }}</span>
          <button @click="removeTodo(todo.id)">Remove</button>
        </label>
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
.completed {
  text-decoration: line-through;
}
</style>
