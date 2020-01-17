export default async function (ctx) {
  const { app: { i18n }, route, redirect } = ctx
  const langsArr = i18n.locales.map( item => item.code)
  const r = await route.path.split('/').filter(item => langsArr.indexOf(item) != -1)

  console.log('r', r)

  if (r.length > 1) {
    const rPop = r.pop()
    const lastLangPrefixIndex = route.path.indexOf(rPop)
    const pathPostfix = route.path.slice(lastLangPrefixIndex + 2)
    const newPath = `/${rPop}${pathPostfix}`

    // debugger

    if (newPath != route.path) {
      redirect(newPath)
    }
  }
  // else return redirect(`/${i18n.locale}`)


  return ctx
}
