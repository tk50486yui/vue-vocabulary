import api from '@/api/interceptors'
import { WordsGroupsForm } from '@/interfaces/WordsGroups'

export default {
  async get() {
    const response = await api.get('/wordsgroups')
    return response.data
  },

  async getById(id: number) {
    const response = await api.get(`/wordsgroups/${id}`)
    return response.data
  },

  async add(data: WordsGroupsForm) {
    const response = await api.post('/wordsgroups', data)
    return response.data
  },

  async update(id: number, data: WordsGroupsForm) {
    const response = await api.put(`/wordsgroups/${id}`, data)
    return response.data
  },

  async deleteById(id: number) {
    const response = await api.delete(`/wordsgroups/${id}`)
    return response.data
  }
}
