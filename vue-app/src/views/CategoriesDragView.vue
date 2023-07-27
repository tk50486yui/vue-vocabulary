<template>
    <template v-if="ready">
        <a-tree
        class="draggable-tree"
        draggable
        block-node
        :tree-data="gData"
        @drop="onDrop"
        :field-names="{
            children: 'children',
            title: 'cate_name',
            key: 'id'}"
        />
    </template>
  </template>
<script>
import { ref } from 'vue'
import { mapActions, mapGetters, mapState } from 'vuex'

export default ({
  name: 'CategoriesDragView',
  computed: {
    ...mapGetters('CategoriesStore', ['categories']),
    ...mapState('Theme', ['$theme'])
  },
  methods: {
    ...mapActions('CategoriesStore', ['fetch'])
  },
  async created () {
    await this.fetch()
    this.rowData = this.categories
    this.gData = this.rowData
    this.ready = true
  },
  setup () {
    const ready = ref(false)
    const expandedKeys = ref(['1'])
    const rowData = []
    const gData = ref(rowData)

    const onDrop = info => {
      console.log(info)
      // const dropPos = info.dragNode.pos.split('-')
      // console.log(dropPos[1] + ' ' + info.dropPosition)
      const elementId = info.dragNode.id
      const currentData = gData.value.find(item => item.id === elementId)
      const currentNode = gData.value.findIndex(item => item.id === elementId)

      if (currentData && currentData.parents.length === 0) {
        let newNode = info.dropPosition - 1

        if (info.dropPosition === -1) {
          // 拖曳到目標節點前面的情況
          newNode = 0
        } else {
          if (currentNode < newNode) {
            newNode = info.dropPosition - 1
          } else {
            newNode = info.dropPosition
          }
          console.log(currentNode + ' ' + newNode)
        }

        // const data = [...gData.value]
        const element = gData.value.splice(currentNode, 1)[0] // Remove the element from the original position and get the element itself
        gData.value.splice(newNode, 0, element)

        gData.value = gData.value.map((item, index) => ({ ...item, index }))
      } else {
        console.log('in')
      }
    }
    return {
      ready,
      expandedKeys,
      rowData,
      gData,
      onDrop
    }
  }
})
</script>
