import { ElNotification, ElMessage, NotificationParams, MessageParams } from 'element-plus'
import { messageMap } from './messageMap'
import { AxiosResponse } from 'axios'
import { CustomAxiosConfig } from '@/interfaces/axios/CustomAxios'

function globalNotify(response: AxiosResponse) {
  let type = ''
  let tagType = ''
  let errorKey = ''
  switch (response.status) {
    case 200:
      type = 'success'
      break
    case 204:
      type = 'success'
      break
    default:
      type = 'error'
      errorKey = String(response.status)
  }
  const method = response.config.method
  const customConfig = response.config as CustomAxiosConfig
  if (customConfig.tagType) {
    tagType = customConfig.tagType
  }
  if (tagType && method) {
    ElMessage({
      message: messageMap[method || 'other'].default,
      type: type
    } as MessageParams)
  } else {
    if (errorKey) {
      ElNotification({
        message: messageMap[errorKey || 'other'].default,
        type: type
      } as NotificationParams)
    } else {
      ElNotification({
        message: messageMap[method || 'other'].default,
        type: type
      } as NotificationParams)
    }
  }
}

export default globalNotify
