import axios from 'axios'

const apiBaseUrl = process.env.VUE_APP_API_BASE_URL

export default axios.create({
  baseURL: apiBaseUrl
})
