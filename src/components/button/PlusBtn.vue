<template>
  <a-button size="small" class="button-container">
    <font-awesome-icon :icon="['fas', 'plus']" />
  </a-button>
</template>

<script>
export default {
  name: 'PlusBtn'
}
</script>
<style lang="scss" scoped>
.button-container {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
