export function addValueKey (data) {
  const newData = JSON.parse(JSON.stringify(data))

  function recursiveAddValueKey (data) {
    data.forEach((item) => {
      item.value = item.cate_name

      if (item.children && item.children.length > 0) {
        recursiveAddValueKey(item.children)
      }
    })
  }

  recursiveAddValueKey(newData)

  return newData
}
