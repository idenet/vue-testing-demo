<template>
  <!-- This footer should be hidden by default and shown when there are todos -->
  <footer class="footer">
    <!-- This should be `0 items left` by default -->
    <span class="todo-count">
      <strong data-testid="done-todo-count">{{doneTodosCount}}</strong> item left
    </span>
    <!-- Remove this if you don't implement routing -->
    <ul class="filters">
      <li>
        <!-- <a class="selected" href="#/">All</a> -->
        <router-link exact to="/"></router-link>
      </li>
      <li>
        <router-link to="/active">Active</router-link>
        <!-- <a href="#/active">Active</a> -->
      </li>
      <li>
        <router-link to="/completed">Completed</router-link>
        <!-- <a href="#/completed">Completed</a> -->
      </li>
    </ul>
    <!-- Hidden if no completed items are left ↓ -->
    <button v-if="isClearCompletedShow" class="clear-completed" data-testid="clear-completed" @click="$emit('clear-completed')">Clear completed</button>
  </footer>
</template>

<script>
export default {
  name: 'todoFooter',
  props: {
    todos: {
      type: Array,
      require: true
    }
  },
  computed: {
    doneTodosCount () {
      return this.todos.filter(t => !t.done).length
    },
    isClearCompletedShow () {
      return this.todos.find(t => t.done)
    }
  }
}
</script>

<style lang='scss' scoped>
</style>
