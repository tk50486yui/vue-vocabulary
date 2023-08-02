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
import { ref, reactive } from 'vue'
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
    const categoriesForm = reactive([])
    /* 只允許排序同個父節點 */
    const onDrop = info => {
      console.log(info)
      const currentId = info.dragNode.id
      const currentParentId = info.dragNode.cate_parent_id
      const dropToGap = info.dropToGap
      // categoriesForm[currentId] = {}
      const targetLevel = parseInt(info.node.cate_level)
      const targetParentId = info.node.cate_parent_id
      // dropToGap === true 為同一層的情況
      if ((currentParentId !== targetParentId) && (dropToGap === true)) {
        console.log('parent of inconsistency')
        return
      }
      if (targetLevel > 0) {
        let currentNode
        let currentArray = dropData.value
        const currentParents = info.dragNode.parents
        // if 第一層 else 第二層以後
        if (currentParents && currentParents.length === 0) {
          currentNode = dropData.value.findIndex(item => item.id === currentId)
        } else {
          for (const parentId of currentParents) {
            const parent = currentArray.find(item => item.id === parentId)
            if (parent) {
              currentArray = parent.children
            } else {
              break
            }
          }
          currentNode = currentArray.findIndex(item => item.id === currentId)
        }

        let newNode = info.dropPosition
        // -1為拖曳至最前方的情況, dropToGap為false則是拖曳至父節點之下首位的情況
        if (info.dropPosition === -1 || dropToGap === false) {
          newNode = 0
        } else {
          if (currentNode < newNode) {
            newNode = info.dropPosition - 1
          } else {
            newNode = info.dropPosition
          }
        }

        const element = currentArray.splice(currentNode, 1)[0]
        currentArray.splice(newNode, 0, element)
        currentArray = currentArray.map((item, index) => ({ ...item, index }))
        currentArray.forEach((item, index) => {
          if (!categoriesForm[item.id]) {
            categoriesForm[item.id] = {}
          }
          categoriesForm[item.id].id = item.id
          categoriesForm[item.id].cate_order = index
          console.log(`Index: ${index}, Data:`, item.cate_name, ' ' + item.id)
        })
        console.log(currentArray)
        console.log(categoriesForm)
      } else {
        console.log('else')
      }
    }
    return {
      ready,
      dropData,
      categoriesForm,
      onDrop
    }
  }
})
</script>
