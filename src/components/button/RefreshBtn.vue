<template>
  <a-button size="small" class="button-container">
    <SyncOutlined :spin="spin" />
  </a-button>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { SyncOutlined } from '@ant-design/icons-vue'
export default defineComponent({
  name: 'RefreshBtn',
  props: {
    spin: Boolean
  },
  components: {
    SyncOutlined
  }
})
</script>
<style lang="scss" scoped>
.button-container {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
