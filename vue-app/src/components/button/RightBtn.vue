<template>
    <button type="button" class="button-container">
      <font-awesome-icon :icon="['fas', 'chevron-right']" />
    </button>
</template>

<script>
export default {
  name: 'RightBtn'
}
</script>
<style lang="scss" scoped>
.button-container {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
