import api from '@/api/interceptors.ts'

export default {
  async get() {
    const response = await api.get('/categories')
    return response.data
  },

  async getRecent() {
    const response = await api.get('/categories/recent/all')
    return response.data
  },

  async getById(id: number) {
    const response = await api.get(`/categories/${id}`)
    return response.data
  },

  async add<T>(data: T) {
    const response = await api.post('/categories', data)
    return response.data
  },

  async update<T>(id: number, data: T) {
    const response = await api.put(`/categories/${id}`, data)
    return response.data
  },

  async updateOrder<T>(data: T) {
    const response = await api.patch('/categories/order/all', data)
    return response.data
  },

  async deleteById(id: number) {
    const response = await api.delete(`/categories/${id}`)
    return response.data
  }
}
