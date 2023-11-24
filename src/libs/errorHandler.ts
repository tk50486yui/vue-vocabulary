export const warningHandler = (err: string) => {
  if (err === 'Duplicate keys found during update:0Make sure keys are unique.') {
    return false
  }
  console.log(err)
  return true
}

export const windowOnError = (message: string | Event) => {
  if (typeof message === 'string' && message.includes('CKEditor')) {
    console.log('CKEditor Error:', message)
    return true
  }
}

export const windowErrorListener = function onError(e: {
  lineno: number
  colno: number
  stopPropagation: () => void
  stopImmediatePropagation: () => void
  message: string
}) {
  console.log('window')
  if (e.lineno === 5 && e.colno === 389560) {
    console.log('CKEditorError: Permission denied to access property Symbol.toStringTag')
    e.stopPropagation()
    e.stopImmediatePropagation()
  }
  // Ignore ResizeObserver error
  if (e.message === 'ResizeObserver loop limit exceeded') {
    console.log('window in ResizeObserver loop limit exceeded')
    e.stopPropagation()
    e.stopImmediatePropagation()
  }
  if (e.message === 'ResizeObserver loop completed with undelivered notifications') {
    console.log('window in ResizeObserver loop completed with undelivered notifications')
    e.stopPropagation()
    e.stopImmediatePropagation()
  }
}
