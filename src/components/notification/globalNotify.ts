import { ElNotification, ElMessage } from 'element-plus'
import { messageMap } from './messageMap.ts'

function globalNotify(response) {
  let type = ''
  let tagType = ''
  let errorKey = ''
  switch (response.status) {
    case 200:
      type = 'success'
      break
    default:
      type = 'error'
      errorKey = response.status
  }
  if (response.config.tagType) {
    tagType = response.config.tagType
  }

  if (tagType) {
    ElMessage({
      message: messageMap[response.config.method].default,
      type: type
    })
  } else {
    if (errorKey) {
      ElNotification({
        message: messageMap[errorKey].default,
        type: type
      })
    } else {
      ElNotification({
        message: messageMap[response.config.method].default,
        type: type
      })
    }
  }
}

export default globalNotify
