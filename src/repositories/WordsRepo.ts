import api from '@/api/interceptors.ts'

export default {
  async get() {
    const response = await api.get('/words')
    return response.data
  },

  async getById(id: number) {
    const response = await api.get(`/words/${id}`)
    return response.data
  },

  async add<T>(data: T) {
    const response = await api.post('/words', data)
    return response.data
  },

  async update<T>(id: number, data: T) {
    const response = await api.put(`/words/${id}`, data)
    return response.data
  },

  async updateCommon<T>(id: number, data: T) {
    const response = await api.patch(`/words/common/${id}`, data, {
      tagType: 'star'
    })
    return response.data
  },

  async updateImportant<T>(id: number, data: T) {
    const response = await api.patch(`/words/important/${id}`, data, {
      tagType: 'heart'
    })
    return response.data
  },

  async deleteById(id: number) {
    const response = await api.delete(`/words/${id}`)
    return response.data
  }
}
