import router from '@/router/route.js'

function handleErrorResponse (error) {
  if (error.response) {
    const status = error.response.status
    const currentRoute = router.currentRoute.value
    const childRoute = currentRoute.matched.find(route => {
      return route.children && route.children.some(child => {
        return child.meta && child.meta.code === status
      })
    })
    if (status === 409) {
      if (childRoute) {
        const matchedChild = childRoute.children.find(child => {
          return child.meta && child.meta.code === status
        })
        router.push({ name: matchedChild.name })
      }
    }
  }

  return Promise.reject(error)
}

const errorUtils = {
  handleErrorResponse
}

export default errorUtils
