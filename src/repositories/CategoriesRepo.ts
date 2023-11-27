import api from '@/api/interceptors'
import { CategoryForm, CategoriesOrder } from '@/interfaces/Categories'

export default {
  async get() {
    const response = await api.get('/categories')
    return response.data
  },

  async getRecent() {
    const response = await api.get('/categories/recent')
    return response.data
  },

  async getById(id: number) {
    const response = await api.get(`/categories/${id}`)
    return response.data
  },

  async add(data: CategoryForm) {
    const response = await api.post('/categories', data)
    return response.data
  },

  async update(id: number, data: CategoryForm) {
    const response = await api.put(`/categories/${id}`, data)
    return response.data
  },

  async updateOrder(data: CategoriesOrder[]) {
    const response = await api.patch('/categories/sort', data)
    return response.data
  },

  async deleteById(id: number) {
    const response = await api.delete(`/categories/${id}`)
    return response.data
  }
}
