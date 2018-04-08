import Vue from 'vue'
import Vuex from 'vuex'
import gql from 'graphql-tag'
import apollo from './apolloClient'

Vue.use(Vuex)

const state = {
  languages: []
}

const mutations = {
  SET_LANGUAGES (state, { languages }) {
    state.languages = [...state.languages, ...languages]
  }
}

const actions = {
  async getLanguage({ commit }, id) {
    console.time(`getLangById ${id}`)

    const query = gql`
      query GetLanguage($id: ID!) {
        getLanguage(id: $id) {
          id
          name
          frameworksById
        }
      }`

    const variables = {
      id: id 
    }

    const response = await apollo.query({
      query, variables
    })

    console.log(response)

    console.timeEnd(`getLangById ${id}`)
  },

  async getLanguages({ commit }) {
    console.time('getLanguages')

    const response = await apollo.query({
      query: gql`
      query Languages {
        languages {
          id
          name
        }
      }
      `
    })

    const { languages } = response.data
    commit('SET_LANGUAGES', { languages })

    console.timeEnd('getLanguages')
  }
}

const getters = {
  getLanguageById: (state) => (id) => {
    return state.languages.find(x => x.id === id)
  }
}

export default new Vuex.Store({
  state, mutations, actions, getters
})

