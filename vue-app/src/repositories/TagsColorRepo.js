import api from '@/api/api.js'

export default {
  async get () {
    const response = await api.get('/tagscolor')
    return response.data
  },

  async getById (id) {
    const response = await api.get(`/tagscolor/${id}`)
    return response.data
  },

  async add (data) {
    const response = await api.post('/tagscolor', data)
    return response.data
  },

  async update (id, data) {
    const response = await api.put(`/tagscolor/${id}`, data)
    return response.data
  },

  async deleteById (id) {
    const response = await api.delete(`/tagscolor/${id}`)
    return response.data
  }
}
