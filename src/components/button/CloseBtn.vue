<template>
  <a class="main-body" :class="$theme">
    <el-icon>
      <el-CircleCloseFilled />
    </el-icon>
  </a>
</template>
<script lang="ts" setup>
import { toRefs } from 'vue'
import { useStore } from 'vuex'
const store = useStore()
const { $theme } = toRefs(store.state.Theme)
</script>
<style lang="scss" scoped>
@import '@/assets/scss/main.scss';
a {
  cursor: pointer;
}
</style>
