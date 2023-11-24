<template>
  <span class="radio-theme" :class="$theme">
    <a-radio-group v-bind="$attrs">
      <a-radio value="or">OR</a-radio>
      <a-radio value="and">AND</a-radio>
      <a-radio value="none">NONE</a-radio>
    </a-radio-group>
  </span>
</template>
<script lang="ts" setup>
import { toRefs } from 'vue'
import { useStore } from 'vuex'
const store = useStore()
const { $theme } = toRefs(store.state.Theme)
</script>

<style lang="scss" scoped>
@import '@/assets/scss/main.scss';
</style>
