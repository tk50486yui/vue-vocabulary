import api from '@/api/api.js'
import router from '@/router/route.js'
import errorUtils from '@/api/errorUtils.js'

// 請求攔截
api.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 回應攔截
api.interceptors.response.use(
  (response) => {
    if (response.status === 200) {
      if (response.config.method === 'post') {
        router.push({ name: 'success' })
      } else if (response.config.method === 'get') {
        console.log('GET')
      }
    }

    return response
  },
  (error) => {
    return errorUtils.handleErrorResponse(error)
  }
)

export default api
