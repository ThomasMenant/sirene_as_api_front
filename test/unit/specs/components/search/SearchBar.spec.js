import { createLocalVue, shallow } from '@vue/test-utils'
import Vuex from 'vuex'
import SearchBar from '@/components/search/SearchBar'
import { __createMocks as createStoreMocks } from '@/store/index.js';

const localVue = createLocalVue()
localVue.use(Vuex)
jest.mock('@/store/index.js')

describe('SearchBar.vue', () => {
  let storeMocks
  let wrapperSearchBar

  beforeEach(() => {
    storeMocks = createStoreMocks()
    
    wrapperSearchBar = shallow(SearchBar, {
      localVue,
      store: storeMocks.store
    })
  })

  test('When searching under 3 chars, a request for suggestions should NOT be made', () => {
    wrapperSearchBar.setData({ fullText: 'ma' })
    expect(storeMocks.actions.executeSearchSuggestions.mock.calls).toHaveLength(0)
  }),

  test('When searching over/equal 3 chars, a request for suggestions should be made', () => {
    wrapperSearchBar.setData({ fullText: 'maRequete' })
    expect(storeMocks.actions.executeSearchSuggestions.mock.calls).toHaveLength(1)
  }),

  test('If the request for suggestions return >= 5 results, 5 suggestions should be displayed', () => {
    wrapperSearchBar.vm.$store.state.suggestions.storedSuggestions = ['Suggest1', 'Suggest2', 'Suggest3', 'Suggest4', 'Suggest5', 'Suggest6']
    // Need to update twice before suggestions are rendered
    wrapperSearchBar.update()
    wrapperSearchBar.update()
    expect(wrapperSearchBar.findAll('li' + '.suggestion__box')).toHaveLength(5)
    expect(wrapperSearchBar.findAll('li' + '.suggestion__box' + '.hidden')).toHaveLength(0)
  }),

  test('If the request for suggestions return 3 results, 3 suggestions should be displayed + 2 hidden', () => {
    storeMocks.state.suggestions.storedSuggestions = ['Suggest1', 'Suggest2', 'Suggest3']
    // Need to update twice before suggestions are rendered
    wrapperSearchBar.update()
    wrapperSearchBar.update()
    expect(wrapperSearchBar.findAll('li' + '.suggestion__box')).toHaveLength(5)
    expect(wrapperSearchBar.findAll('li' + '.suggestion__box' + '.hidden')).toHaveLength(2)
  }),

  test('I can highlight a suggestion by using keydown', () => {
    storeMocks.state.suggestions.storedSuggestions = ['Suggest1', 'Suggest2', 'Suggest3']
    // We go down 3 times to get Suggest3
    wrapperSearchBar.find('input').trigger('keydown.down')
    wrapperSearchBar.find('input').trigger('keydown.down')
    wrapperSearchBar.find('input').trigger('keydown.down')
    expect(wrapperSearchBar.findAll('.active')).toHaveLength(1)
    expect(wrapperSearchBar.find('.active').text()).toBe('Suggest3')
  }),

  test('When highlighting suggestions down, I dont exceed the last suggestion', () => {
    storeMocks.state.suggestions.storedSuggestions = ['Suggest1', 'Suggest2', 'Suggest3']
    // We go down 3 times to get Suggest3
    wrapperSearchBar.find('input').trigger('keydown.down')
    wrapperSearchBar.find('input').trigger('keydown.down')
    wrapperSearchBar.find('input').trigger('keydown.down')
    wrapperSearchBar.find('input').trigger('keydown.down')
    expect(wrapperSearchBar.findAll('.active')).toHaveLength(1)
    expect(wrapperSearchBar.find('.active').text()).toBe('Suggest3')
  }),

  test('I can highlight suggestions up too', () => {
    storeMocks.state.suggestions.storedSuggestions = ['Suggest1', 'Suggest2', 'Suggest3']
    // We go down 3 times to get Suggest3
    wrapperSearchBar.find('input').trigger('keydown.down')
    wrapperSearchBar.find('input').trigger('keydown.up')
    wrapperSearchBar.find('input').trigger('keydown.down')
    expect(wrapperSearchBar.findAll('.active')).toHaveLength(1)
    expect(wrapperSearchBar.find('.active').text()).toBe('Suggest1')
  }),

  test('When highlighting suggestions up, I dont go too far up', () => {
    storeMocks.state.suggestions.storedSuggestions = ['Suggest1', 'Suggest2', 'Suggest3']
    // We go down 3 times to get Suggest3
    wrapperSearchBar.find('input').trigger('keydown.down')
    wrapperSearchBar.find('input').trigger('keydown.up')
    wrapperSearchBar.find('input').trigger('keydown.up')
    wrapperSearchBar.find('input').trigger('keydown.up')
    wrapperSearchBar.find('input').trigger('keydown.down')
    expect(wrapperSearchBar.findAll('.active')).toHaveLength(1)
    expect(wrapperSearchBar.find('.active').text()).toBe('Suggest1')
  }),

  test('I can press enter to launch a search on the highlighted suggestion', () => {
    storeMocks.state.suggestions.storedSuggestions = ['Suggest1', 'Suggest2', 'Suggest3']
    wrapperSearchBar.vm.requestSearch = jest.fn()
    // wrapperSearchBar.vm.$store._mutations.setFullText = jest.fn()
    // We go down 3 times to get Suggest3
    wrapperSearchBar.find('input').trigger('keydown.down')
    wrapperSearchBar.find('input').trigger('keydown.down')
    wrapperSearchBar.find('input').trigger('keydown.down')
    wrapperSearchBar.find('input').trigger('keydown.enter')
    // requestSearch use currentSuggestion as fullText
    expect(wrapperSearchBar.vm.currentSuggestion()).toBe('Suggest3')
    expect(wrapperSearchBar.vm.requestSearch.mock.calls).toHaveLength(1)
  }),

  test('I can click on a suggestion to launch a search', () => {
    storeMocks.state.suggestions.storedSuggestions = ['Suggest1', 'Suggest2', 'Suggest3']
    wrapperSearchBar.vm.requestSearch = jest.fn()  
    wrapperSearchBar.find('li:nth-child(2)').trigger('click')
    expect(wrapperSearchBar.vm.currentSuggestion()).toBe('Suggest2')
    expect(wrapperSearchBar.vm.requestSearch.mock.calls).toHaveLength(1)
  })
})
