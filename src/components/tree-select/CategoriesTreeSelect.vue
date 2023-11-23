<template>
  <div class="select-theme" :class="$theme" ref="selectMod">
    <a-tree-select
      :getPopupContainer="() => $refs.selectMod"
      v-bind="$attrs"
      v-model:searchValue="searchValue"
      show-search
      allow-clear
      :tree-line="treeLine && { showLeafIcon }"
      :tree-data="categories"
      :field-names="{
        children: 'children',
        label: 'cate_name',
        value: 'id',
        key: 'id'
      }"
    >
      <template #title="{ value: val, cate_name }">
        <b v-if="val === 1" style="color: #08c">{{ val }}</b>
        <template v-else>
          <template
            v-for="(fragment, i) in cate_name
              .toString()
              .split(new RegExp(`(?<=${searchValue})|(?=${searchValue})`, 'i'))"
          >
            <span
              v-if="fragment.toLowerCase() === searchValue.toLowerCase()"
              :key="i"
              style="color: #08c"
            >
              {{ fragment }}
            </span>
            <template v-else>{{ fragment }}</template>
          </template>
        </template>
      </template>
    </a-tree-select>
  </div>
</template>
<script lang="ts" setup>
import { ref, toRefs, onMounted, computed } from 'vue'
import { useStore } from 'vuex'

const store = useStore()
const { $theme } = toRefs(store.state.Theme)

const categories = computed(() => store.getters['CategoriesStore/categories'])

const searchValue = ref<string>('')
const treeLine = ref<boolean>(true)
const showLeafIcon = ref<boolean>(false)

onMounted(async () => {
  try {
    await store.dispatch('CategoriesStore/fetch')
  } catch (e) {
    //
  }
})
</script>

<style lang="scss" scoped>
@import '@/assets/scss/main.scss';
</style>
