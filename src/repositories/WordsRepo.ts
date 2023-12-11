import api from '@/api/interceptors'
import { WordForm } from '@/interfaces/Words'
import { CustomAxiosConfig } from '@/interfaces/axios/CustomAxios'

export default {
  async get() {
    const response = await api.get('/words')
    return response.data
  },

  async getById(id: number) {
    const response = await api.get(`/words/${id}`)
    return response.data
  },

  async add(data: WordForm) {
    const response = await api.post('/words', data)
    return response.data
  },

  async update(id: number, data: WordForm) {
    const response = await api.put(`/words/${id}`, data)
    return response.data
  },

  async updateCommon(id: number, data: { ws_is_common: boolean }, config: CustomAxiosConfig) {
    const response = await api.patch(`/words/common/${id}`, data, config)
    return response.data
  },

  async updateImportant(id: number, data: { ws_is_important: boolean }, config: CustomAxiosConfig) {
    const response = await api.patch(`/words/important/${id}`, data, config)
    return response.data
  },

  async deleteById(id: number) {
    const response = await api.delete(`/words/${id}`)
    return response.data
  },

  async getFiles() {
    const response = await api.get('/words/uploads')
    return response.data
  },

  async upload(data: WordForm) {
    const response = await api.post('/words/upload', data, {
      headers: {
        'Content-Type': 'multipart/form-data' // axios maybe auto setting
      }
    })
    return response.data
  },

  async deleteFile(id: string) {
    const response = await api.delete(`/words/upload/${id}`)
    return response.data
  }
}
