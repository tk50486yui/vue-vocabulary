<template>
  <a-button size="small" class="button-container">
    <font-awesome-icon :icon="['fas', 'plus']" />
  </a-button>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'PlusBtn'
})
</script>
<style lang="scss" scoped>
.button-container {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
