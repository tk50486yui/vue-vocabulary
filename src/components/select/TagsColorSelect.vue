<template>
  <div class="select-theme" :class="$theme" ref="selectMod">
    <a-tree-select
      :getPopupContainer="() => $refs.selectMod"
      v-bind="$attrs"
      :tree-data="tagsColor"
      v-model:value="selectedValue"
      @change="handleChange"
      show-search
      allow-clear
      :field-names="{
        children: 'children',
        label: 'ts_name',
        value: 'id',
        key: 'id'
      }"
    >
      <template #title="{ id, tc_color, tc_background, tc_border }">
        <a-tag
          :style="
            'background:' + tc_background + ';color:' + tc_color + ';border-color:' + tc_border
          "
        >
          #{{ id }} default
        </a-tag>
      </template>
      <template #tagRender="{ label, option }">
        <a-tag
          :style="
            'background:' +
            option.tc_background +
            ';color:' +
            option.tc_color +
            ';border-color:' +
            option.tc_border
          "
        >
          {{ label }}
        </a-tag>
      </template>
    </a-tree-select>
  </div>
</template>
<script lang="ts" setup>
import { ref, toRefs, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
const store = useStore()
const { $theme } = toRefs(store.state.Theme)

const tagsColor = computed(() => store.getters['TagsColorStore/tagsColor'])

const props = defineProps(['value'])
const emit = defineEmits(['update:value', 'change']) // 'change' is resolve warning
const selectedValue = ref<number | null>(props.value)

const handleChange = (value: number | undefined): void => {
  selectedValue.value = typeof value !== 'undefined' ? value : null
  emit('update:value', selectedValue.value)
  emit('change', selectedValue.value) // resolve warning and synchronize parent's change
}

const clearValue = (): void => {
  selectedValue.value = null
  emit('update:value', selectedValue.value)
}

defineExpose({
  clearValue
})

onMounted(async () => {
  try {
    await store.dispatch('TagsColorStore/fetch')
  } catch (e) {
    //
  }
})
</script>

<style lang="scss" scoped>
@import '@/assets/scss/main.scss';
</style>
