import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    vueChartData: null,
  },
  mutations: {
    vueChartData(state, payload) {
      state.vueChartData = payload;
    },
  },
  actions: {
  },
  modules: {
  }
})
