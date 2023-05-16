import api from '@/api/api.js'
import router from '@/router/route'

// 請求攔截器
api.interceptors.request.use(
  (config) => {
    // 在請求發送前執行的程式碼
    return config
  },
  (error) => {
    // 處理請求錯誤
    return Promise.reject(error)
  }
)

// 響應攔截器
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // 處理響應錯誤
    if (error.response.status === 409) {
      console.log('error409')
    }
    return Promise.reject(error)
  }
)

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
      if (error.response && error.response.status === 409) {
      // 根据需要执行对应的操作，例如导航到相应页面
        console.log('409409409')
        router.push({ name: 'error' })
      } else {
        throw error // 抛出其他错误
      }
    }
  },

  async update (id, data) {
    const response = await api.put(`/words/${id}`, data)
    return response.data
  }
}
