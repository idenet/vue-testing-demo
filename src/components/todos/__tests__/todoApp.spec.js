import { shallowMount } from '@vue/test-utils'
import Vue from 'vue'
import todoItemVue from '../todoItem.vue'
import todosApp from '../todosApp.vue'

describe('todoApp.vue', () => {
  /** @type {import('@vue/test-utils').Wrapper} */
  let wrapper = null
  let todos = null

  const $route = {
    path: '/'
  }

  beforeEach(async () => {
    wrapper = shallowMount(todosApp, {
      mocks: {
        $route
      }
    })
    todos = [
      { id: 1, text: 'eat', done: false },
      { id: 2, text: 'play', done: true },
      { id: 3, text: 'sleep', done: false }
    ]
    await wrapper.setData({
      todos
    })
  })
  it('new todo', () => {
    const text = 'play'
    wrapper.vm.handleNewTodo(text)
    const todo = wrapper.vm.todos.find(t => t.text === text)
    expect(todo).toBeTruthy()
  })

  it('todo list', async () => {
    expect(wrapper.findAllComponents(todoItemVue).length).toBe(todos.length)
  })

  it('deleteTodo', async () => {
    await wrapper.vm.handleDelete(1)
    expect(wrapper.vm.todos.length).toBe(2)
    expect(wrapper.findAllComponents(todoItemVue).length).toBe(2)
  })

  it('edit todo', async () => {
    const todo = { id: 2, text: 'abc' }
    await wrapper.vm.handleEditTodo(todo)
    expect(todos[1].text).toBe(todo.text)

    todo.text = ''
    await wrapper.vm.handleEditTodo(todo)

    expect(todos.find(t => t.id === todo.id)).toBeFalsy()
  })

  it('toggle all', async () => {
    const toggleAll = wrapper.find('[data-testid="toggle-all"]')
    await toggleAll.setChecked()

    // 断言所有子任务被选中
    wrapper.vm.todos.forEach(todo => {
      expect(todo.done).toBeTruthy()
    })

    // 取消完成状态
    await toggleAll.setChecked(false)
    wrapper.vm.todos.forEach(todo => {
      expect(todo.done).toBeFalsy()
    })
  })

  it('toggle all state', async () => {
    const toggleAll = wrapper.find('[data-testid="toggle-all"]')

    // 让所有任务都变成完成状态
    wrapper.vm.todos.forEach(todo => {
      todo.done = true
    })
    await Vue.nextTick()
    // 断言 toggleall 选中
    expect(toggleAll.element.checked).toBeTruthy()

    // 取消某个任务未完成
    wrapper.vm.todos[0].done = false
    await Vue.nextTick()
    // 断言toggleall未完成
    expect(toggleAll.element.checked).toBeFalsy()
  })

  it('clear all completed', async () => {
    wrapper.vm.handleClearCompleted()
    await Vue.nextTick()
    expect(wrapper.vm.todos).toEqual([
      { id: 1, text: 'eat', done: false },
      { id: 3, text: 'sleep', done: false }
    ])
  })

  it('filter Todos', async () => {
    // 将路由导航到 。/
    wrapper.vm.$route.path = '/'
    await Vue.nextTick()
    // 断言 filterTodos = 任务列表
    expect(wrapper.vm.filterTodos).toEqual(todos)

    wrapper.vm.$route.path = '/active'
    await Vue.nextTick()

    expect(wrapper.vm.filterTodos).toEqual([
      { id: 1, text: 'eat', done: false },
      { id: 3, text: 'sleep', done: false }
    ])

    wrapper.vm.$route.path = '/completed'
    await Vue.nextTick()

    expect(wrapper.vm.filterTodos).toEqual([
      { id: 2, text: 'play', done: true }
    ])
  })

  it('snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot()
  })
})
