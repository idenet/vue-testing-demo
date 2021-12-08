import { shallowMount } from '@vue/test-utils'
import todoItemVue from '../todoItem.vue'

describe('todoItem', () => {
  /** @type {import('@vue/test-utils').Wrapper} */
  let wrapper = null
  let todo = null
  beforeEach(() => {
    todo = {
      id: 1,
      text: 'play',
      done: true
    }
    wrapper = shallowMount(todoItemVue, {
      propsData: {
        todo
      }
    })
  })
  it('text', () => {
    expect(wrapper.find('[data-testid="todo-text"]').text()).toBe(todo.text)
  })

  it('done', async () => {
    const done = wrapper.find('[data-testid="todo-done"]')
    const todoItem = wrapper.find('[data-testid="todo-item"]')
    expect(done.element.checked).toBeTruthy()
    expect(todoItem.classes()).toContain('completed')

    await done.setChecked(false)

    expect(todoItem.classes('completed')).toBeFalsy()
  })

  it('deletItem', async () => {
    const deletebtn = wrapper.find('button[data-testid="todo-delete"]')
    await deletebtn.trigger('click')
    expect(wrapper.emitted()['delete-todo']).toBeTruthy()
    expect(wrapper.emitted()['delete-todo'][0][0]).toBe(todo.id)
  })

  it('edit todo style', async () => {
    const label = wrapper.find('[data-testid="todo-text"]')
    const todoItem = wrapper.find('[data-testid="todo-item"]')
    const todoEdit = wrapper.find('[data-testid="todo-edit"]')
    await label.trigger('dblclick')
    expect(todoItem.classes()).toContain('editing')

    await todoEdit.trigger('blur')
    expect(todoItem.classes('editing')).toBeFalsy()
  })

  it('save edit todo', async () => {
    const label = wrapper.find('[data-testid="todo-text"]')
    const todoEdit = wrapper.find('[data-testid="todo-edit"]')
    await label.trigger('dblclick')

    // 编辑文本框中的内容展示
    expect(todoEdit.element.value).toBe(todo.text)

    // 修改文本框中的值
    const text = 'hello'
    await todoEdit.setValue(text)
    // 回撤保存事件

    await todoEdit.trigger('keyup.enter')

    // 断言数据被修改
    // expect(todo.text).toBe(text)
    expect(wrapper.emitted()['edit-todo']).toBeTruthy()
    expect(wrapper.emitted()['edit-todo'][0][0]).toEqual({
      id: todo.id,
      text
    })
    expect(wrapper.vm.isEditing).toBeFalsy()
  })

  it('cancel edit todo', async () => {
    const label = wrapper.find('[data-testid="todo-text"]')
    const todoEdit = wrapper.find('[data-testid="todo-edit"]')
    await label.trigger('dblclick')

    const text = wrapper.vm.todo.text

    await todoEdit.setValue('bbb')

    // 触发取消事件
    todoEdit.trigger('keyup.esc')
    // 验证字段没有被修改
    expect(wrapper.vm.todo.text).toBe(text)
    // 验证编辑状态被取消
    expect(wrapper.vm.isEditing).toBeFalsy()
  })

  it('snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot()
  })
})
