<template>
    <button type="button" class="button-container">
      <font-awesome-icon :icon="['fas', 'chevron-left']" />
    </button>
</template>

<script>
export default {
  name: 'LeftBtn'
}
</script>
<style lang="scss" scoped>
.button-container {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
