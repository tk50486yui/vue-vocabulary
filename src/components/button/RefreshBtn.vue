<template>
  <a-button size="small" class="button-container">
    <SyncOutlined :spin="spin" />
  </a-button>
</template>
<script setup lang="ts">
import { SyncOutlined } from '@ant-design/icons-vue'
defineProps({
  spin: Boolean
})
</script>
<style lang="scss" scoped>
.button-container {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
