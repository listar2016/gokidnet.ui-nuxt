export default function ({ store, redirect, app }) {
    if (app.$cookies.get('accessToken') != store.state.user.accessToken) {
        store.commit('user/setAccessToken', app.$cookies.get('accessToken'))
    }
  }
