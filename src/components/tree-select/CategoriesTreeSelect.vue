<template>
  <template v-if="Ready">
    <div class="select-theme" :class="$theme" ref="selectMod">
      <a-tree-select
        :getPopupContainer="() => $refs.selectMod"
        v-bind="$attrs"
        v-model:searchValue="searchValue"
        v-model:value="selectedValue"
        @search="handleSearch"
        @change="handleChange"
        show-search
        allow-clear
        :tree-line="treeLine && { showLeafIcon }"
        :tree-data="categories"
        treeNodeFilterProp="cate_name"
        :field-names="{
          children: 'children',
          label: 'cate_name',
          value: 'id',
          key: 'id'
        }"
      >
        <template #title="{ cate_name }">
          <template
            v-for="(fragment, i) in cate_name
              .toString()
              .split(new RegExp(`(?<=${searchValue})|(?=${searchValue})`, 'i'))"
          >
            <span
              v-if="fragment.toLowerCase() === searchValue.toLowerCase()"
              :key="i"
              style="color: rgb(70, 190, 250)"
            >
              {{ fragment }}
            </span>
            <template v-else> {{ fragment }}</template>
          </template>
        </template>
      </a-tree-select>
    </div>
  </template>
</template>
<script lang="ts" setup>
import { ref, toRefs, onBeforeMount, computed } from 'vue'
import { useStore } from 'vuex'

const store = useStore()
const { $theme } = toRefs(store.state.Theme)

const categories = computed(() => store.getters['CategoriesStore/categories'])

const props = defineProps(['value'])
const emit = defineEmits(['update:value'])
const selectedValue = ref<number | null>(props.value)

const Ready = ref<boolean>(false)
const searchValue = ref<string>('')
const treeLine = ref<boolean>(true)
const showLeafIcon = ref<boolean>(false)

const handleSearch = (value: string): void => {
  console.log(value + 'in')
}

const handleChange = (value: number | undefined): void => {
  selectedValue.value = typeof value !== 'undefined' ? value : null
  emit('update:value', selectedValue.value)
}

const clearValue = (): void => {
  selectedValue.value = null
  emit('update:value', selectedValue.value)
}
defineExpose({
  clearValue
})
onBeforeMount(async () => {
  try {
    await store.dispatch('CategoriesStore/fetch')
    Ready.value = true
  } catch (e) {
    //
  }
})
</script>

<style lang="scss" scoped>
@import '@/assets/scss/main.scss';
</style>
