import ResultsDidYouMean from '@/components/results/ResultsDidYouMean.vue'
import Vuex from 'vuex'
import { __createMocks as createStoreMocks } from '@/store/index.js'
import { createLocalVue, shallow, mount } from '@vue/test-utils'

const localVue = createLocalVue()
localVue.use(Vuex)
jest.mock('@/store/index.js')
jest.mock('@/components/results/ResultsDidYouMean.vue')

describe('ResultsDidYouMean.vue', () => {
  let storeMocks
  let wrapperDYM

  beforeEach(() => {
    storeMocks = createStoreMocks()

    wrapperDYM = shallow(ResultsDidYouMean, {
      localVue,
      store: storeMocks.store
    })
  })

  test('Computed value didYouMean return the correct getter', () => {
    expect(wrapperDYM.vm.didYouMean).toBe('mock-spellcheck')
  })

  test('Method didYouMeanSearch sets fullText at param value', () => {
    const didYouMean = 'mock-didYouMean'
    wrapperDYM.vm.didYouMeanSearch(didYouMean)
    expect(storeMocks.mutations.setFullText).toHaveBeenCalledWith(storeMocks.state, didYouMean)
  })

  test('Method didYouMeanSearch launch requestSearch', () => {
    const didYouMean = 'mock-didYouMean'
    wrapperDYM.vm.didYouMeanSearch(didYouMean)
    expect(storeMocks.actions.requestSearch).toHaveBeenCalled()
  })

  test('Clicking on DidYouMean launch didYouMeanSearch', () => {
    wrapperDYM.vm.didYouMeanSearch = jest.fn()
    wrapperDYM.find('.did-you-mean').trigger('click')
    expect(wrapperDYM.vm.didYouMeanSearch).toHaveBeenCalled()
  })
})

describe('ResultsDidYouMean.vue Snapshot test', () => {
  const storeMocks = createStoreMocks()

  const wrapperDYM = mount(ResultsDidYouMean, {
      localVue,
      store: storeMocks.store
    })

  test('Snapshot test', () => {
    expect(wrapperDYM.vm.$el).toMatchSnapshot()
  })
}) 