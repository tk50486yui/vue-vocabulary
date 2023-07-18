import api from '@/api/interceptors.js'

export default {
  async get () {
    const response = await api.get('/wordsgroups')
    return response.data
  },

  async getById (id) {
    const response = await api.get(`/wordsgroups/${id}`)
    return response.data
  },

  async add (data) {
    const response = await api.post('/wordsgroups', data)
    return response.data
  },

  async update (id, data) {
    const response = await api.put(`/wordsgroups/${id}`, data)
    return response.data
  }
}
