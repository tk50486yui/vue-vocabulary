import api from '@/api/interceptors.ts'

export default {
  async get() {
    const response = await api.get('/tagscolor')
    return response.data
  },

  async getById(id: number) {
    const response = await api.get(`/tagscolor/${id}`)
    return response.data
  },

  async add<T>(data: T) {
    const response = await api.post('/tagscolor', data)
    return response.data
  },

  async update<T>(id: number, data: T) {
    const response = await api.put(`/tagscolor/${id}`, data)
    return response.data
  },

  async deleteById(id: number) {
    const response = await api.delete(`/tagscolor/${id}`)
    return response.data
  }
}
