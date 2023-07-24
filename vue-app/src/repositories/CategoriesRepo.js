import api from '@/api/api.js'

export default {
  async get () {
    const response = await api.get('/categories')
    return response.data
  },

  async getRecent () {
    const response = await api.get('/categories/recent/')
    return response.data
  },

  async getById (id) {
    const response = await api.get(`/categories/${id}`)
    return response.data
  },

  async add (data) {
    const response = await api.post('/categories', data)
    return response.data
  },

  async update (id, data) {
    const response = await api.put(`/categories/${id}`, data)
    return response.data
  }
}
