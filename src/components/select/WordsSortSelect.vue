<template>
  <div class="select-theme" :class="$theme" ref="selectMod">
    <a-select
      :getPopupContainer="() => $refs.selectMod"
      v-bind="$attrs"
      v-model:value="selectedValue"
      @change="handleChange"
      allow-clear
    >
      <a-select-opt-group>
        <template #label>
          <span> 依更新日期 </span>
        </template>
        <a-select-option value="created_at,desc">日期（新－舊）</a-select-option>
        <a-select-option value="created_at,asc">日期（舊－新）</a-select-option>
      </a-select-opt-group>
      <a-select-opt-group>
        <template #label>
          <span> 依程度條 </span>
        </template>
        <a-select-option value="ws_forget_count,desc">程度條（高－低）</a-select-option>
        <a-select-option value="ws_forget_count,asc">程度條（低－高）</a-select-option>
      </a-select-opt-group>
      <a-select-opt-group>
        <template #label>
          <span> 依標籤數 </span>
        </template>
        <a-select-option value="words_tags_length,desc">標籤（多－少）</a-select-option>
        <a-select-option value="words_tags_length,asc">標籤（少－多）</a-select-option>
      </a-select-opt-group>
    </a-select>
  </div>
</template>
<script lang="ts" setup>
import { ref, toRefs } from 'vue'
import { useStore } from 'vuex'
const store = useStore()
const { $theme } = toRefs(store.state.Theme)

const props = defineProps(['value'])
const emit = defineEmits(['update:value', 'change']) // 'change' is resolve warning
const selectedValue = ref<string | null>(props.value)

const handleChange = (value: string | undefined): void => {
  selectedValue.value = typeof value !== 'undefined' ? value : null
  emit('update:value', selectedValue.value)
  emit('change', selectedValue.value)
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/main.scss';
</style>
