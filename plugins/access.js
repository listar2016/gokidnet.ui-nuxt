export default function (ctx) {
  const {
    app: {
      context: {
        route, redirect
      },
      i18n,
    }
  } = ctx


  console.log('ctx', ctx)

  // if (route.path.indexOf(i18n.locale) == -1) {
    console.log('No locale prefix')
    if (!ctx.app.$cookies.get('accessToken')) {
      console.log('No access')
      // redirect('/' + i18n.locale + '/login')
      redirect('/login')
    } else {
      console.log('Access grant')
      // return redirect('/' + i18n.locale + route.path)
      return redirect(route.path)
    }
  // }  
  

  // if (route.name != 'login') {
  //   console.log('route', i18n.locale, 'path', route.path, store.getters['user/HasToken'])
  //   if (!store.getters['user/HasToken']) {
  //     console.log(11, i18n.locale)
  //     if (route.path.indexOf(i18n.locale) == -1)
  //       return redirect('/' + i18n.locale + '/login')
  //   }

  //   if (!i18n.locales.some(item => item.code == i18n.locale) ||
  //     (route.path.indexOf(i18n.locale) == -1)) {
  //     console.log('No lang set', i18n.locale)
  //     redirect('/' + i18n.locale + route.path)
  //   } else {
  //     console.log(-1)
  //     return ctx
  //   }

  // } else if (store.state.user.accessToken) {
  //   if (route.path != '/' + i18n.locale) {
  //     console.log(33, i18n.locale)
  //     redirect('/' + i18n.locale)
  //   }
  // }
}