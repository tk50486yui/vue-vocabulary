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
            title: 'ts_name',
            key: 'id'
          }"
        />
      </div>
    </a-spin>
    <p></p>
    <div>
      <a-button
        class="btn btn-primary btn-outline-light btn-sm"
        @click="onFinish(tagsForm)"
        :disabled="saveDisabled"
      >
        儲存
      </a-button>
      <a-button
        class="btn btn-danger btn-outline-light btn-sm"
        style="margin-left: 10px"
        @click="onReset()"
      >
        還原
      </a-button>
    </div>
  </template>
</template>
<script lang="ts" setup>
import { ref, reactive, toRefs, onMounted, computed } from 'vue'
import { useStore } from 'vuex'
import { message } from 'ant-design-vue'
import { Tag, TagsOrder } from '@/interfaces/Tags'
import type { AntTreeNodeDropEvent } from 'ant-design-vue/es/tree'

const store = useStore()
const { $theme } = toRefs(store.state.Theme)

const tags = computed(() => store.getters['TagsStore/tags'])

const Ready = ref<boolean>(false)
const dropData = ref<Tag[]>([])
const tagsForm = reactive<Record<number, TagsOrder>>({})
const saveDisabled = ref<boolean>(true)
const spinning = ref<boolean>(false)

const onFinish = async (values: Record<number, TagsOrder>): Promise<void> => {
  try {
    const tagsArray = Object.values(values).filter(
      (item) => item !== null && typeof item === 'object'
    )
    spinning.value = true
    message.loading({ content: 'Loading..', duration: 1 })
    await new Promise((resolve) => setTimeout(resolve, 800))
    await store.dispatch('TagsStore/updateOrder', tagsArray)
    dropData.value = tags.value
    Object.keys(tagsForm).forEach((key) => {
      delete tagsForm[Number(key)]
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
    await store.dispatch('TagsStore/fetch')
    dropData.value = tags.value
    Object.keys(tagsForm).forEach((key) => {
      delete tagsForm[Number(key)]
    })
    spinning.value = false
    saveDisabled.value = true
  } catch (e) {
    //
  }
}

/* 只允許排序同個父節點 */
const onDrop = (info: AntTreeNodeDropEvent) => {
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
    let currentArray: Tag[]
    currentArray = dropData.value
    const currentParents = info.dragNode.parents
    // if 第一層 else 第二層以後
    if (currentParents && currentParents.length === 0) {
      currentNode = dropData.value.findIndex((item: Tag) => item.id === currentId)
    } else {
      for (const parentId of currentParents) {
        let parent: Tag | undefined
        parent = currentArray.find((item: Tag) => item.id === parentId)
        if (parent) {
          currentArray = parent.children
        } else {
          break
        }
      }
      currentNode = currentArray.findIndex((item: Tag) => item.id === currentId)
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
    currentArray = currentArray.map((item: Tag, index) => ({
      ...item,
      index
    }))
    currentArray.forEach((item: Tag, index: number) => {
      if (!tagsForm[item.id]) {
        tagsForm[item.id] = {} as TagsOrder
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

onMounted(async () => {
  try {
    await store.dispatch('TagsStore/fetch')
    dropData.value = tags.value
    Ready.value = true
  } catch (e) {
    //
  }
})
</script>
<style lang="scss" scoped>
@import '@/assets/scss/main.scss';
</style>
