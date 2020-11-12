import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    vueChartData: null,
    vuePlanetsData: null
  },
  mutations: {
    vueChartData(state, payload) {
      state.vueChartData = payload;
    },
    vuePlanetsData(state, payload) {
      state.vuePlanetsData = payload;
    },
  },
  actions: {
  },
  modules: {
  }
})
