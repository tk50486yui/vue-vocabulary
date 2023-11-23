<template>
  <div class="toggle-theme" :class="$theme">
    <a-radio-group v-model:value="sideGroup">
      <a-radio-button value="1">標籤</a-radio-button>
      <a-radio-button value="2">類別</a-radio-button>
      <a-badge :count="$WordsGroupsView.groupArray.length" color="magenta">
        <a-radio-button value="3">群組</a-radio-button>
      </a-badge>
    </a-radio-group>
  </div>
  <p></p>
  <keep-alive>
    <template v-if="sideGroup === '1'">
      <TagsMenuView />
    </template>
    <template v-else-if="sideGroup === '2'">
      <CategoriesMenuView />
    </template>
    <template v-else-if="sideGroup === '3'">
      <WordsGroupsView />
    </template>
  </keep-alive>
</template>
<script lang="ts" setup>
import { ref, watchEffect, onMounted, toRefs, computed } from 'vue'
import { useStore } from 'vuex'
import CategoriesMenuView from '@/views/category/CategoriesMenuView.vue'
import TagsMenuView from '@/views/tag/TagsMenuView.vue'
import WordsGroupsView from '@/views/wordsgroup/WordsGroupsView.vue'

const store = useStore()
const { $theme } = toRefs(store.state.Theme)
const { $WordsGroupsView, $WordsGroupsDetailsView } = toRefs(store.state.Views)

const updateNow = computed(() => {
  return $WordsGroupsDetailsView.value.updateNow
})

const sideGroup = ref<string>('1')

const setUpdateNow = (val: boolean) => {
  if (val) {
    sideGroup.value = '3'
  }
}

watchEffect(() => {
  setUpdateNow(updateNow.value)
})

onMounted(() => {
  setUpdateNow(updateNow.value)
})
</script>

<style lang="scss" scoped>
@import '@/assets/scss/main.scss';
</style>
