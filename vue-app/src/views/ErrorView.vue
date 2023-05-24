<template>
    <div>
        <h1 class="hl-title" :class="[this.$theme]"> This is error page</h1>
    </div>
  </template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'ErrorView',
  computed: {
    ...mapState('Theme', ['$theme'])
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/main.scss';

.hl-title {
  &.dark {
    color: var(--h1-color) !important;
  }

  &.light {
    color: var(--h1-color) !important;
  }
}
</style>
