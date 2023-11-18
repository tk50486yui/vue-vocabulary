<template>
  <a class="main-body" :class="$theme">
    <el-icon>
      <el-CircleCloseFilled />
    </el-icon>
  </a>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'CloseBtn',
  computed: {
    ...mapState('Theme', ['$theme'])
  }
}
</script>
<style lang="scss" scoped>
@import '@/assets/scss/main.scss';
</style>
