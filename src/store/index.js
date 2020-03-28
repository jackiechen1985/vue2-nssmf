import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    scriptList: []
  },
  mutations: {
    saveScript (state, scriptList) {
      state.scriptList = scriptList
    }
  },
  actions: {
  },
  modules: {
  }
})
