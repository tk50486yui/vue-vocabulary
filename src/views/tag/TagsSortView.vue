<template>
  <template v-if="ready">
    <a-spin :spinning="spinning">
      <div class="draggable-tree-theme" :class="$theme">
        <a-tree draggable block-node :tree-data="dropData" @drop="onDrop" :field-names="{
          children: 'children',
          title: 'ts_name',
          key: 'id'
        }" />
      </div>
    </a-spin>
    <p></p>
    <div>
      <a-button class="btn btn-primary btn-outline-light btn-sm" @click="onFinish(tagsForm)" :disabled="saveDisabled">
        儲存
      </a-button>
      <a-button class="btn btn-danger btn-outline-light btn-sm" style="margin-left: 10px" @click="onReset()">還原</a-button>
    </div>
  </template>
</template>
<script>
import { ref, reactive } from 'vue'
import { mapActions, mapGetters, mapState } from 'vuex'
import { message } from 'ant-design-vue'

export default {
  name: 'TagsSortView',
  computed: {
    ...mapGetters('TagsStore', ['tags']),
    ...mapState('Theme', ['$theme'])
  },
  methods: {
    ...mapActions('TagsStore', ['fetch', 'updateOrder']),
    async onFinish(values) {
      try {
        const tagsArray = Object.values(values).filter(
          (item) => item !== null && typeof item === 'object'
        )
        this.spinning = true
        message.loading({ content: 'Loading..', duration: 1 })
        await new Promise((resolve) => setTimeout(resolve, 800))
        await this.updateOrder(tagsArray)
        this.dropData = this.tags
        this.tagsForm.splice(0, this.tagsForm.length)
        this.spinning = false
        this.saveDisabled = true
      } catch (error) { }
    },
    async onReset() {
      try {
        this.spinning = true
        await new Promise((resolve) => setTimeout(resolve, 500))
        await this.fetch()
        this.dropData = this.tags
        this.tagsForm.splice(0, this.tagsForm.length)
        this.spinning = false
        this.saveDisabled = true
      } catch (error) { }
    }
  },
  async created() {
    await this.fetch()
    this.dropData = this.tags
    this.ready = true
  },
  setup() {
    const ready = ref(false)
    const dropData = ref([])
    const tagsForm = reactive([])
    const saveDisabled = ref(true)
    const spinning = ref(false)
    /* 只允許排序同個父節點 */
    const onDrop = (info) => {
      const currentId = info.dragNode.id
      const currentParentId = info.dragNode.cate_parent_id
      const dropToGap = info.dropToGap
      const targetParentId = info.node.cate_parent_id
      // dropToGap === true 為同一層的情況
      if (currentParentId !== targetParentId && dropToGap === true) {
        console.log('parent of inconsistency')
        return
      }
      if (currentId) {
        let currentNode
        let currentArray = dropData.value
        const currentParents = info.dragNode.parents
        // if 第一層 else 第二層以後
        if (currentParents && currentParents.length === 0) {
          currentNode = dropData.value.findIndex(
            (item) => item.id === currentId
          )
        } else {
          for (const parentId of currentParents) {
            const parent = currentArray.find((item) => item.id === parentId)
            if (parent) {
              currentArray = parent.children
            } else {
              break
            }
          }
          currentNode = currentArray.findIndex((item) => item.id === currentId)
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
          if (!tagsForm[item.id]) {
            tagsForm[item.id] = {}
          }
          tagsForm[item.id].id = item.id
          tagsForm[item.id].ts_order = index
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
      tagsForm,
      saveDisabled,
      spinning,
      onDrop
    }
  }
}
</script>
<style lang="scss" scoped>
@import '@/assets/scss/main.scss';
</style>
