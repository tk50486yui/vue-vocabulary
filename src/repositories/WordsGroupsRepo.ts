import api from '@/api/interceptors.ts'

export default {
  async get() {
    const response = await api.get('/wordsgroups')
    return response.data
  },

  async getById(id: number) {
    const response = await api.get(`/wordsgroups/${id}`)
    return response.data
  },

  async add<T>(data: T) {
    const response = await api.post('/wordsgroups', data)
    return response.data
  },

  async update<T>(id: number, data: T) {
    const response = await api.put(`/wordsgroups/${id}`, data)
    return response.data
  },

  async deleteById(id: number) {
    const response = await api.delete(`/wordsgroups/${id}`)
    return response.data
  }
}
