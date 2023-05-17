import api from '@/api/api.js'
import router from '@/router/route'

api.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

api.interceptors.response.use(
  (response) => {
    if (response.status === 200) {
      // router.push({ name: 'success' })
    }
    return response
  },
  (error) => {
    return handleErrorResponse(error)
  }
)

function handleErrorResponse (error) {
  if (error.response) {
    const status = error.response.status
    // const routeName = router.currentRoute.value.name
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

export default {
  async get () {
    const response = await api.get('/words')
    return response.data
  },

  async getById (id) {
    const response = await api.get(`/words/${id}`)
    return response.data
  },

  async add (data) {
    try {
      const response = await api.post('/words', data)
      return response.data
    } catch (error) {

    }
  },

  async update (id, data) {
    const response = await api.put(`/words/${id}`, data)
    return response.data
  }
}
