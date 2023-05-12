import api from '@/api/api.js'

export default {
  async get () {
    const response = await api.get('/words')
    return response.data
  },

  async getById (id) {
    const response = await api.get(`/words/${id}`)
    return response.data
  },

  async add (word) {
    const response = await api.post('/words', word)
    return response.data
  },

  async update (id, word) {
    const response = await api.put(`/words/${id}`, word)
    return response.data
  }
}
