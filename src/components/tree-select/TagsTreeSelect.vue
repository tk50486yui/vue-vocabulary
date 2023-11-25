<template>
  <template v-if="Ready">
    <div class="select-theme" :class="$theme" ref="selectMod">
      <a-tree-select
        :getPopupContainer="() => $refs.selectMod"
        v-bind="$attrs"
        v-model:searchValue="searchValue"
        v-model:value="selectedValue"
        @change="handleChange"
        show-search
        allow-clear
        :tree-line="treeLine && { showLeafIcon }"
        :tree-data="tags"
        treeNodeFilterProp="ts_name"
        :field-names="{
          children: 'children',
          label: 'ts_name',
          value: 'id',
          key: 'id'
        }"
      >
        <template #title="{ ts_name, tc_color, tc_background, tc_border }">
          <a-tag
            v-if="tc_color && tc_background && tc_border"
            :style="
              'background:' + tc_background + ';color:' + tc_color + ';border-color:' + tc_border
            "
          >
            <template
              v-for="(fragment, i) in ts_name
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
          </a-tag>
          <a-tag v-else style="color: #fff; background: #000">
            <template
              v-for="(fragment, i) in ts_name
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
          </a-tag>
        </template>
        <template #tagRender="{ closable, onClose, option }">
          <template v-if="option.tc_color && option.tc_background && option.tc_border">
            <a-tag
              @close="onClose"
              :closable="closable"
              :style="
                'background:' +
                option.tc_background +
                ';color:' +
                option.tc_color +
                ';border-color:' +
                option.tc_border
              "
            >
              {{ option.ts_name }}
            </a-tag>
          </template>
          <template v-else>
            <a-tag @close="onClose" :closable="closable" style="color: #fff; background: #000">
              {{ option.ts_name }}
            </a-tag>
          </template>
        </template>
      </a-tree-select>
    </div>
  </template>
</template>
<script lang="ts" setup>
import { ref, toRefs, onMounted, computed, inject } from 'vue'
import { useStore } from 'vuex'

const store = useStore()
const { $theme } = toRefs(store.state.Theme)

const tags = computed(() => store.getters['TagsStore/tags'])

const props = defineProps(['value'])
const emit = defineEmits(['update:value'])

const mode = inject('mode', null)

const selectedValue = ref<number | number[] | null>(props.value)

const Ready = ref<boolean>(false)
const searchValue = ref<string>('')
const treeLine = ref<boolean>(true)
const showLeafIcon = ref<boolean>(false)

const handleChange = (value: number | number[] | undefined): void => {
  if (mode === 'single') {
    selectedValue.value = typeof value !== 'undefined' ? value : null
  } else {
    selectedValue.value = typeof value !== 'undefined' ? value : []
  }
  emit('update:value', selectedValue.value)
}

const setValue = (value: number | number[]): void => {
  selectedValue.value = value
  emit('update:value', selectedValue.value)
}

const clearValue = (): void => {
  if (mode === 'single') {
    selectedValue.value = null
  } else {
    selectedValue.value = []
  }
  emit('update:value', selectedValue.value)
}

defineExpose({
  clearValue,
  setValue
})

onMounted(async () => {
  try {
    await store.dispatch('TagsStore/fetch')
    Ready.value = true
  } catch (e) {
    //
  }
})
</script>

<style lang="scss" scoped>
@import '@/assets/scss/main.scss';
</style>
