import api from '@/api/interceptors.js'

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
    const response = await api.post('/words', data)
    return response.data
  },

  async update (id, data) {
    const response = await api.put(`/words/${id}`, data)
    return response.data
  },

  async updateCommon (id, data) {
    const response = await api.put(`/words/common/${id}`, data)
    return response.data
  },

  async updateImportant (id, data) {
    const response = await api.put(`/words/important/${id}`, data)
    return response.data
  },

  async deleteById (id) {
    const response = await api.delete(`/words/${id}`)
    return response.data
  }
}
