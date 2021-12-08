import { shallowMount } from '@vue/test-utils'
import todoHeader from '../todoHeader.vue'

describe('todoHeader', () => {
  let wrapper = null

  beforeEach(() => {
    wrapper = shallowMount(todoHeader)
  })

  it('new todo', async () => {
    const input = wrapper.find('input[data-testid="new-todo"]')
    const text = 'play'
    await input.setValue(text)
    await input.trigger('keyup.enter')
    expect(wrapper.emitted()['new-todo']).toBeTruthy()
    expect(wrapper.emitted()['new-todo'][0][0]).toBe(text)
    expect(input.element.value).toBe('')
  })

  it('new todo width empty text', async () => {
    const input = wrapper.find('input[data-testid="new-todo"]')
    const text = ''
    await input.setValue(text)
    await input.trigger('keyup.enter')
    expect(wrapper.emitted()['new-todo']).toBeFalsy()
  })

  it('snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot()
  })
})
