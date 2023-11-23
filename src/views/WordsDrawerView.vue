<template>
  <!-- drawer words add -->
  <div class="drawer-theme" ref="wordsDrawer" :class="$theme">
    <a-drawer
      :getContainer="() => $refs.wordsDrawer"
      v-bind="$attrs"
      placement="left"
      :width="drawerWidth"
    >
      <WordsAddView />
    </a-drawer>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch, toRefs, defineExpose } from 'vue'
import { useStore } from 'vuex'
import WordsAddView from '@/views/WordsAddView.vue'

const store = useStore()
const { $theme } = toRefs(store.state.Theme)
const { $desktop, $tablet, $mobile } = toRefs(store.state.Screen)

const drawerWidth = ref<number>(500)
const drawerWidthMap = {
  desktop: 500 as number,
  tablet: 400 as number,
  mobile: 300 as number
}
const setDrawerStyle = (): void => {
  drawerWidth.value =
    drawerWidthMap[
      $desktop.value
        ? 'desktop'
        : $tablet.value
          ? 'tablet'
          : $mobile.value
            ? 'mobile'
            : 'desktop'
    ]
}

onMounted(() => {
  setDrawerStyle()
})

watch([$desktop, $tablet, $mobile], () => {
  setDrawerStyle()
})

defineExpose({
  setDrawerStyle
})
</script>

<style lang="scss" scoped>
@import '@/assets/scss/main.scss';
</style>
