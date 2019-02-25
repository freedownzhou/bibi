const state = {
  goEasy: null
}
const getters = {
  getGoEasy: state => {
    return state.goEasy
  }
}
const mutations = {
  setGoEasy: (state, goEasy) => {
    state.goEasy = goEasy
  }
}

export default {
  state,
  getters,
  mutations
}
