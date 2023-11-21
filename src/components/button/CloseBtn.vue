<template>
  <a class="main-body" :class="$theme">
    <el-icon>
      <el-CircleCloseFilled />
    </el-icon>
  </a>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { mapState } from 'vuex'
export default defineComponent({
  name: 'CloseBtn',
  computed: {
    ...mapState('Theme', ['$theme'])
  }
})
</script>
<style lang="scss" scoped>
@import '@/assets/scss/main.scss';
</style>
