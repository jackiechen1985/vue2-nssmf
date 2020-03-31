import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    designNsstList: [],
    runtimeNsstList: [],
    scriptList: []
  },
  mutations: {
    saveDesignNsstToStore (state, designNsstList) {
      state.designNsstList = designNsstList
    },
    saveRuntimeNsstToStore (state, runtimeNsstList) {
      state.runtimeNsstList = runtimeNsstList
    },
    saveScriptToStore (state, scriptList) {
      state.scriptList = scriptList
    }
  },
  actions: {
  },
  modules: {
  }
})
