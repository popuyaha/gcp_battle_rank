import Vue from 'vue'
import Vuex from 'vuex'
import createPersist from 'vuex-localstorage'
import auth from './modules/auth'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    auth
  },
  // strict: debug,
  strict: false,
  plugins: [
    createPersist({
      namespace: 'battleRank',
      initialState: {},
      // ONE_WEEK
      expires: 7 * 24 * 60 * 60 * 1e3
    })
  ]
})

export default store
