export const globalErrorHandler = (error, vm, info) => {
  console.error('全局錯誤：', error)
  console.error('訊息：', info)
}

export const windowOnError = (message, source, lineno, colno, error) => {
  if (message.includes('CKEditor')) {
    console.log('CKEditor Error:', message)
    return true
  }
}

export const windowErrorListener = function onError(e) {
  console.log('window')
  if (e.lineno === 5 && e.colno === 389560) {
    console.log(
      'CKEditorError: Permission denied to access property Symbol.toStringTag'
    )
    e.stopPropagation()
    e.stopImmediatePropagation()
  }
  // Ignore ResizeObserver error
  if (e.message === 'ResizeObserver loop limit exceeded') {
    console.log('window in ResizeObserver loop limit exceeded')
    e.stopPropagation()
    e.stopImmediatePropagation()
  }
  if (
    e.message === 'ResizeObserver loop completed with undelivered notifications'
  ) {
    console.log(
      'window in ResizeObserver loop completed with undelivered notifications'
    )
    e.stopPropagation()
    e.stopImmediatePropagation()
  }
}
