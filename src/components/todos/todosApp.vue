<template>
  <section class="todoapp">
    <!-- This section should be hidden by default and shown when there are todos -->
    <todoHeader @new-todo="handleNewTodo"></todoHeader>
    <section class="main">
      <input
        data-testid="toggle-all"
        id="toggle-all"
        class="toggle-all"
        type="checkbox"
        v-model="toogleAll"
      />
      <label for="toggle-all">Mark all as complete</label>
      <ul class="todo-list">
        <!-- These are here just to show the structure of the list items -->
        <!-- List items should get the class `editing` when editing and `completed` when marked as completed -->
        <todoItem
          v-for="todo in filterTodos"
          :key="todo.id"
          :todo="todo"
          @delete-todo="handleDelete"
          @edit-todo="handleEditTodo"
        ></todoItem>
      </ul>
    </section>
    <todoFooter :todos="todos" @clear-completed="handleClearCompleted"></todoFooter>
  </section>
</template>

<script >
import todoFooter from './todoFooter.vue'
import todoHeader from './todoHeader.vue'
import todoItem from './todoItem.vue'

export default {
  name: 'todosApp',
  data () {
    return {
      todos: []
    }
  },
  computed: {
    toogleAll: {
      get () {
        // 设置toggleall的选中状态
        return this.todos.length && this.todos.every(t => t.done)
      },
      set (checked) {
        this.todos.forEach(todo => {
          todo.done = checked
        })
      }
    },
    filterTodos () {
      // 获取路由路径
      const path = this.$route.path
      let todos = this.todos
      switch (path) {
        case '/active':
          todos = this.todos.filter(t => !t.done)
          break
        case '/completed':
          todos = this.todos.filter(t => t.done)
          break
      }
      return todos
      // 根据路由路径过滤数据
      // /active 返回所有未完成任务
    }
  },
  methods: {
    handleNewTodo (text) {
      const lastTodo = this.todos[this.todos.length - 1]
      this.todos.push({
        id: lastTodo ? lastTodo.id + 1 : 1,
        text,
        done: false
      })
    },
    handleDelete (todoId) {
      const index = this.todos.findIndex(t => t.id === todoId)
      if (index !== -1) {
        this.todos.splice(index, 1)
      }
    },
    handleEditTodo ({ id, text }) {
      const todo = this.todos.find(t => t.id === id)
      if (!todo) return

      if (!text.trim().length) {
        // 执行删除操作
        this.handleDelete(id)
      }
      todo.text = text
    },
    handleClearCompleted () {
      // 清除所有已完成的任务项
      for (let i = 0; i < this.todos.length; i++) {
        if (this.todos[i].done) {
          this.todos.splice(i, 1)
          i--
        }
      }
    }
  },
  components: {
    todoFooter,
    todoHeader,
    todoItem
  }
}
</script>

<style lang="scss" scoped></style>
