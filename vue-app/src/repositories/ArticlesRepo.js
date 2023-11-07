import api from '@/api/interceptors.js'

export default {
  async get () {
    const response = await api.get('/articles')
    return response.data
  },

  async getById (id) {
    const response = await api.get(`/articles/${id}`)
    return response.data
  },

  async add (data) {
    const response = await api.post('/articles', data)
    return response.data
  },

  async update (id, data) {
    const response = await api.put(`/articles/${id}`, data)
    return response.data
  },

  async deleteById (id) {
    const response = await api.delete(`/articles/${id}`)
    return response.data
  }
}
