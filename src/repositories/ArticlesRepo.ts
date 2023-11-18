import api from '@/api/interceptors.ts'

export default {
  async get() {
    const response = await api.get('/articles')
    return response.data
  },

  async getById(id: number) {
    const response = await api.get(`/articles/${id}`)
    return response.data
  },

  async add<T>(data: T) {
    const response = await api.post('/articles', data)
    return response.data
  },

  async update<T>(id: number, data: T) {
    const response = await api.put(`/articles/${id}`, data)
    return response.data
  },

  async deleteById(id: number) {
    const response = await api.delete(`/articles/${id}`)
    return response.data
  }
}
