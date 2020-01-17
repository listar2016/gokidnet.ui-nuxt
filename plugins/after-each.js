export default async ({ app: { router, i18n } }) => {
  router.beforeEach((to, from, next) => {
    if (i18n.locale != 'en') {
      if (to.path.indexOf(i18n.locale) == -1) {
        next('/' + i18n.locale + to.path)
        return
      }
    }
    next()
   })

  router.afterEach((to, from) => {
    // console.log('after each')
    $(".preloader").fadeOut();
  });

}