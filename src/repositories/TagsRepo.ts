import api from '@/api/interceptors'
import { TagForm, TagsOrder } from '@/interfaces/Tags'

export default {
  async get() {
    const response = await api.get('/tags')
    return response.data
  },

  async getRecent() {
    const response = await api.get('/tags/recent')
    return response.data
  },

  async getById(id: number) {
    const response = await api.get(`/tags/${id}`)
    return response.data
  },

  async add(data: TagForm) {
    const response = await api.post('/tags', data)
    return response.data
  },

  async update(id: number, data: TagForm) {
    const response = await api.put(`/tags/${id}`, data)
    return response.data
  },

  async updateOrder(data: TagsOrder[]) {
    const response = await api.patch('/tags/sort', data)
    return response.data
  },

  async deleteById(id: number) {
    const response = await api.delete(`/tags/${id}`)
    return response.data
  }
}
