import { createLocalVue, mount } from '@vue/test-utils'
import VueRouter from 'vue-router'
import todoFooter from '../todoFooter.vue'

const localVue = createLocalVue()
localVue.use(VueRouter)
const router = new VueRouter({
  linkActiveClass: 'selected'
})

describe('TodoApp.vue', () => {
  /** @type {import('@vue/test-utils').Wrapper} */
  let wrapper = null
  beforeEach(async () => {
    const todos = [
      { id: 1, text: 'eat', done: false },
      { id: 2, text: 'play', done: true },
      { id: 3, text: 'sleep', done: false }
    ]
    wrapper = mount(todoFooter, {
      propsData: {
        todos
      },
      localVue,
      router
    })
  })

  it('done todos Count', () => {
    const count = wrapper.vm.todos.filter(t => !t.done).length
    const countEl = wrapper.find('[data-testid="done-todo-count"]')
    expect(Number.parseInt(countEl.text())).toBe(count)
  })

  it('clear completed show', async () => {
    const button = wrapper.find('[data-testid="clear-completed"]')
    expect(button.exists()).toBeTruthy()

    // 清除所有任务完成状态，判断button 不存在
    wrapper = mount(todoFooter, {
      propsData: {
        todos: [
          { id: 1, text: 'eat', done: false },
          { id: 2, text: 'play', done: false },
          { id: 3, text: 'sleep', done: false }
        ]
      },
      localVue,
      router
    })

    expect(wrapper.find('[data-testid="clear-completed"]').exists()).toBeFalsy()
  })

  it('clear completed', async () => {
    const button = wrapper.find('[data-testid="clear-completed"]')
    await button.trigger('click')
    expect(wrapper.emitted()['clear-completed']).toBeTruthy()
  })

  it('Router link activeClass', async () => {
    const links = wrapper.findAllComponents({ name: 'RouterLink' })

    await testRouterLink(router, links, '/active')
    await testRouterLink(router, links, '/completed')
    await testRouterLink(router, links, '/')
  })

  it('snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot()
  })
})

async function testRouterLink (router, links, path) {
  router.push(path)
  await localVue.nextTick()

  for (let i = 0; i < links.length; i++) {
    const link = links.at(i)
    if (link.vm.to === path) {
      expect(link.classes()).toContain('selected')
    } else {
      expect(link.classes('selected')).toBeFalsy()
    }
  }
}
