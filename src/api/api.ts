import axios from 'axios'

const apiBaseUrl = import.meta.env.VITE_APP_API_BASE_URL

export default axios.create({
  baseURL: apiBaseUrl
})
