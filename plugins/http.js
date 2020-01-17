import axios from 'axios'

export default ({ app, store, redirect }, inject) => { 
    let instance = axios.create({
        baseURL: process.env.apiUrl
    })

    const {
        i18n
    } = app
    
    instance.interceptors.request.use((request) => {
        if(store.state.user.accessToken)
            request.headers.Authorization = 'Token ' + (app.$cookies.get('accessToken') || store.state.user.accessToken )
        return request
    })
    instance.interceptors.response.use((response) => {
        return response
    }, error => {
        if(error.response && error.response.status == 401) {
            store.dispatch('user/logout')
            // return redirect('/' + i18n.locale + '/login')
            return redirect('/login')
        }
        return Promise.reject(error)
    })
    inject('http', instance)
  }