import api from '@/api/api.ts'
import globalNotify from '@/components/notification/globalNotify.ts'

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
      if (
        response.config.method === 'post' ||
        response.config.method === 'put' ||
        response.config.method === 'patch' ||
        response.config.method === 'delete'
      ) {
        globalNotify(response)
      }
    }
    return response
  },
  (error) => {
    globalNotify(error.response)
    return Promise.reject(error)
  }
)

export default api
