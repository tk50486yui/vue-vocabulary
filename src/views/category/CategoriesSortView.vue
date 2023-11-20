<template>
  <template v-if="ready">
    <a-spin :spinning="spinning">
      <div class="draggable-tree-theme" :class="$theme">
        <a-tree
          draggable
          block-node
          :tree-data="dropData"
          @drop="onDrop"
          :field-names="{
            children: 'children',
            title: 'cate_name',
            key: 'id'
          }"
        />
      </div>
    </a-spin>
    <p></p>
    <div>
      <a-button
        class="btn btn-primary btn-outline-light btn-sm"
        @click="onFinish(categoriesForm)"
        :disabled="saveDisabled"
        >儲存</a-button
      >
      <a-button
        class="btn btn-danger btn-outline-light btn-sm"
        style="margin-left: 10px"
        @click="onReset()"
        >還原</a-button
      >
    </div>
  </template>
</template>
<script lang="ts">
import { ref, reactive, defineComponent } from 'vue'
import { mapActions, mapGetters, mapState } from 'vuex'
import { message } from 'ant-design-vue'
import { Category, CategoriesOrder } from '@/interfaces/Categories.ts'

export default defineComponent({
  name: 'CategoriesSortView',
  computed: {
    ...mapGetters('CategoriesStore', ['categories']),
    ...mapState('Theme', ['$theme'])
  },
  methods: {
    ...mapActions('CategoriesStore', ['fetch', 'updateOrder']),
    async onFinish(values: CategoriesOrder[]) {
      try {
        const categoriesArray = Object.values(values).filter(
          (item) => item !== null && typeof item === 'object'
        )
        this.spinning = true
        message.loading({ content: 'Loading..', duration: 1 })
        await new Promise((resolve) => setTimeout(resolve, 800))
        await this.updateOrder(categoriesArray)
        this.dropData = this.categories
        this.categoriesForm.splice(0, this.categoriesForm.length)
        this.spinning = false
        this.saveDisabled = true
      } catch (error) {
        //
      }
    },
    async onReset() {
      try {
        this.spinning = true
        await new Promise((resolve) => setTimeout(resolve, 500))
        await this.fetch()
        this.dropData = this.categories
        this.categoriesForm.splice(0, this.categoriesForm.length)
        this.spinning = false
        this.saveDisabled = true
      } catch (error) {
        //
      }
    }
  },
  async created() {
    await this.fetch()
    this.dropData = this.categories
    this.ready = true
  },
  setup() {
    const ready = ref(false)
    const dropData = ref([])
    const categoriesForm = reactive([] as CategoriesOrder[])
    const saveDisabled = ref(true)
    const spinning = ref(false)
    // 只允許排序同個父節點
    const onDrop = (info) => {
      const currentId = info.dragNode.id
      const currentParentId = info.dragNode.cate_parent_id
      const dropToGap = info.dropToGap
      const targetParentId = info.node.cate_parent_id
      // dropToGap === true 為同一層的情況
      if (currentParentId !== targetParentId && dropToGap === true) {
        return
      }
      if (currentId) {
        let currentNode
        let currentArray = dropData.value
        const currentParents = info.dragNode.parents
        // if 第一層 else 第二層以後
        if (currentParents && currentParents.length === 0) {
          currentNode = dropData.value.findIndex(
            (item: Category) => item.id === currentId
          )
        } else {
          for (const parentId of currentParents) {
            const parent = currentArray.find(
              (item: Category) => item.id === parentId
            )
            if (parent) {
              currentArray = parent.children
            } else {
              break
            }
          }
          currentNode = currentArray.findIndex(
            (item: Category) => item.id === currentId
          )
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
        currentArray = currentArray.map((item: Category, index) => ({
          ...item,
          index
        }))
        currentArray.forEach((item: Category, index: number) => {
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
