import Cookies from 'js-cookie'
import axios from 'axios'
export const state = () => ({
    error: '',
    accessToken: '',
    title: '',
  })

export const getters = {
    HasToken: state => !!(state.accessToken)
}

export const mutations = {
    setAccessToken(state,token) {
        state.accessToken = token
    },
    setError (state, error) {
        state.error = error
    },
    setTitle (state, title) {
        state.title = title
    },
    resetAccessToken (state) {
        state.accessToken = null
    }
}
export const actions = {
    async login({commit}, user) {
        await axios.post(process.env.apiUrl + '/user/auth/', user).then((data) => {
            console.log('login', data.data);
            if (data.data.token) {
                if (state.remember) {
                    window.$nuxt.$cookies.set('accessToken', data.data.token, {maxAge: 86400 * 7})
                } else {
                    window.$nuxt.$cookies.set('accessToken', data.data.token, {maxAge: 86400})
                }
                window.$nuxt.$cookies.set('username', user.username);
                commit('setAccessToken', data.data.token);

                return true
            } else {
                commit('setError', data.data);
                return false
            }
        }).catch((e) => {
            if (e.response) {
                commit('setError', e.response.data[0])
            } else {
                console.log(e)
            }
            return false
        });
        return 1
    },

    resetAuth({commit}) {
        commit('resetAccessToken')
        window.$nuxt.$cookies.remove('accessToken')
        window.$nuxt.$cookies.remove('username')
    }
}
