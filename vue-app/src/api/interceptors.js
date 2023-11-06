import api from '@/api/api.js'
import openNotification from '@/components/notification/openNotification.js'

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
      if (response.config.method === 'post' ||
          response.config.method === 'put' ||
          response.config.method === 'delete') {
        openNotification(response)
      }
    }
    return response
  },
  (error) => {
    openNotification(error.response)
    return Promise.reject(error)
  }
)

export default api
