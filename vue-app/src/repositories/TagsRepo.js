import api from '@/api/api.js'

export default {
  async get () {
    const response = await api.get('/tags')
    return response.data
  },

  async getRecent () {
    const response = await api.get('/tags/recent/all')
    return response.data
  },

  async getById (id) {
    const response = await api.get(`/tags/${id}`)
    return response.data
  },

  async add (data) {
    const response = await api.post('/tags', data)
    return response.data
  },

  async update (id, data) {
    const response = await api.put(`/tags/${id}`, data)
    return response.data
  },

  async updateOrder (data) {
    const response = await api.patch('/tags/order/all', data)
    return response.data
  },

  async deleteById (id) {
    const response = await api.delete(`/tags/${id}`)
    return response.data
  }
}
