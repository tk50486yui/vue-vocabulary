<template>
  <template v-if="Ready">
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
<script lang="ts" setup>
import { ref, reactive, toRefs, onMounted, computed } from 'vue'
import { useStore } from 'vuex'
import { message } from 'ant-design-vue'
import { Category, CategoriesOrder } from '@/interfaces/Categories'
import type { AntTreeNodeDropEvent } from 'ant-design-vue/es/tree'

const store = useStore()
const { $theme } = toRefs(store.state.Theme)

const categories = computed(() => store.getters['CategoriesStore/categories'])

const Ready = ref<boolean>(false)
const dropData = ref<Category[]>([])
const categoriesForm = reactive<Record<number, CategoriesOrder>>({})
const saveDisabled = ref<boolean>(true)
const spinning = ref<boolean>(false)

const onFinish = async (values: Record<number, CategoriesOrder>): Promise<void> => {
  try {
    const categoriesArray = Object.values(values).filter(
      (item) => item !== null && typeof item === 'object'
    )
    spinning.value = true
    message.loading({ content: 'Loading..', duration: 1 })
    await new Promise((resolve) => setTimeout(resolve, 800))
    await store.dispatch('CategoriesStore/updateOrder', categoriesArray)
    dropData.value = categories.value
    Object.keys(categoriesForm).forEach((key) => {
      delete categoriesForm[Number(key)]
    })
    spinning.value = false
    saveDisabled.value = true
  } catch (e) {
    //
  }
}
const onReset = async (): Promise<void> => {
  try {
    spinning.value = true
    await new Promise((resolve) => setTimeout(resolve, 500))
    await store.dispatch('CategoriesStore/fetch')
    dropData.value = categories.value
    Object.keys(categoriesForm).forEach((key) => {
      delete categoriesForm[Number(key)]
    })
    spinning.value = false
    saveDisabled.value = true
  } catch (e) {
    //
  }
}
const onDrop = (info: AntTreeNodeDropEvent) => {
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
    let currentArray: Category[]
    currentArray = dropData.value
    const currentParents = info.dragNode.parents
    // if 第一層 else 第二層以後
    if (currentParents && currentParents.length === 0) {
      currentNode = dropData.value.findIndex((item: Category) => item.id === currentId)
    } else {
      for (const parentId of currentParents) {
        let parent: Category | undefined
        parent = currentArray.find((item: Category) => item.id === parentId)
        if (parent) {
          currentArray = parent.children
        } else {
          break
        }
      }
      currentNode = currentArray.findIndex((item: Category) => item.id === currentId)
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
        categoriesForm[item.id] = {} as CategoriesOrder
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

onMounted(async () => {
  try {
    await store.dispatch('CategoriesStore/fetch')
    dropData.value = categories.value
    Ready.value = true
  } catch (e) {
    //
  }
})
</script>

<style lang="scss" scoped>
@import '@/assets/scss/main.scss';
</style>
