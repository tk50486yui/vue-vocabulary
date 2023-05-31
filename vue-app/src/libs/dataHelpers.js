/* 添加名為"value"的key 並指定以哪個key當作"value"的值 */
export function addValueKey (data, nameKey) {
  const newData = JSON.parse(JSON.stringify(data))

  function recursiveAddValueKey (data) {
    data.forEach((item) => {
      item.value = item[nameKey]

      if (item.children && item.children.length > 0) {
        recursiveAddValueKey(item.children)
      }
    })
  }

  recursiveAddValueKey(newData)

  return newData
}
