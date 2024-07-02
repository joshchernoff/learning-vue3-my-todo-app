<!-- src/components/Footer.vue -->
<template>
  <footer class="footer">
    <p>
      View the source code on
      <a
        href="https://github.com/joshchernoff/learning-vue3-my-todo-app"
        target="_blank"
        rel="noopener noreferrer"
      >
        GitHub
      </a>
    </p>
  </footer>
</template>

<script>
export default {
  name: 'Footer',
};
</script>

<style scoped>
.footer {
  text-align: center;
  padding: 1em;
  background: #f8f8f8;
  border-top: 1px solid #e7e7e7;
  position: fixed;
  width: 100%;
  bottom: 0;
}

.footer a {
  color: #007bff;
  text-decoration: none;
}

.footer a:hover {
  text-decoration: underline;
}
</style>
