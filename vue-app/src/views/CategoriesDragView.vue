<template>
    <template v-if="ready">
        <a-tree
        class="draggable-tree"
        draggable
        block-node
        :tree-data="dropData"
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
    this.dropData = this.categories
    this.ready = true
  },
  setup () {
    const ready = ref(false)
    const dropData = ref([])

    const onDrop = info => {
      console.log(info)
      // const dropPos = info.dragNode.pos.split('-')
      // console.log(dropPos[1] + ' ' + info.dropPosition)
      const targetId = info.dragNode.id
      const currentData = dropData.value.find(item => item.id === targetId) // 第一層

      if (currentData && currentData.parents.length === 0) {
        const currentNode = dropData.value.findIndex(item => item.id === targetId)
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

        const element = dropData.value.splice(currentNode, 1)[0]
        dropData.value.splice(newNode, 0, element)

        dropData.value = dropData.value.map((item, index) => ({ ...item, index }))
      } else {
        console.log('in')
      }
    }
    return {
      ready,
      dropData,
      onDrop
    }
  }
})
</script>
