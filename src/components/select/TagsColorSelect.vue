<template>
  <div class="select-theme" :class="$theme" ref="selectMod">
    <a-select
      :getPopupContainer="() => $refs.selectMod"
      v-bind="$attrs"
      :options="tagsColor"
      v-model:value="selectedValue"
      @change="handleChange"
      show-search
      allowClear
      :field-names="{
        label: 'id',
        value: 'id'
      }"
    >
      <template #option="{ id, tc_color, tc_background, tc_border }">
        #{{ id }}
        <a-tag
          :style="
            'background:' + tc_background + ';color:' + tc_color + ';border-color:' + tc_border
          "
        >
          default
        </a-tag>
      </template>
    </a-select>
  </div>
</template>
<script lang="ts" setup>
import { ref, toRefs, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
const store = useStore()
const { $theme } = toRefs(store.state.Theme)

const tagsColor = computed(() => store.getters['TagsColorStore/tagsColor'])

const props = defineProps(['value'])
const emit = defineEmits(['update:value'])
const selectedValue = ref<number | null>(props.value)

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
