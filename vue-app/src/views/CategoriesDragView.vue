<template>
    <template v-if="ready">
      <a-spin :spinning="spinning">
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
      </a-spin>
      <p></p>
      <div>
        <a-button type="primary" @click="onFinish(categoriesForm)" :disabled="saveDisabled">儲存</a-button>
        <a-button style="margin-left: 10px" @click="onReset()" danger>重置</a-button>
      </div>
    </template>
  </template>
<script>
import { ref, reactive } from 'vue'
import { mapActions, mapGetters, mapState } from 'vuex'
import { message } from 'ant-design-vue'

export default ({
  name: 'CategoriesDragView',
  computed: {
    ...mapGetters('CategoriesStore', ['categories']),
    ...mapState('Theme', ['$theme'])
  },
  methods: {
    ...mapActions('CategoriesStore', ['fetch']),
    ...mapActions('CategoriesStore', {
      updateCategoryOrder: 'updateOrder'
    }),
    async onFinish (values) {
      try {
        const categoriesArray = Object.values(values).filter(item => item !== null && typeof item === 'object')
        this.spinning = true
        message.loading({ content: 'Loading..', duration: 1 })
        await new Promise(resolve => setTimeout(resolve, 1000))
        await this.updateCategoryOrder(categoriesArray)
        await this.fetch()
        this.dropData = this.categories
        this.categoriesForm.splice(0, this.categoriesForm.length)
        this.spinning = false
        this.saveDisabled = true
      } catch (error) {}
    },
    async onReset () {
      try {
        this.spinning = true
        await new Promise(resolve => setTimeout(resolve, 500))
        await this.fetch()
        this.dropData = this.categories
        this.categoriesForm.splice(0, this.categoriesForm.length)
        this.spinning = false
        this.saveDisabled = true
      } catch (error) {}
    }
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
    const saveDisabled = ref(true)
    const spinning = ref(false)
    /* 只允許排序同個父節點 */
    const onDrop = info => {
      console.log(info)
      const currentId = info.dragNode.id
      const currentParentId = info.dragNode.cate_parent_id
      const dropToGap = info.dropToGap
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
          // console.log(`Index: ${index}, Data:`, item.cate_name, ' ' + item.id)
        })
        saveDisabled.value = false
      } else {
        console.log('exception')
      }
    }
    return {
      ready,
      dropData,
      categoriesForm,
      saveDisabled,
      spinning,
      onDrop
    }
  }
})
</script>
<style lang="scss" scoped>
@import '@/assets/scss/main.scss';

</style>
