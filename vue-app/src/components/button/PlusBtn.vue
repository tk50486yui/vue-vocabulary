<template>
    <button type="button" class="button-container">
      <font-awesome-icon :icon="['fas', 'plus']" />
    </button>
</template>

<script>
export default {
  name: 'PlusBtn',
  props: {
    spin: Boolean
  },
  components: {

  }
}
</script>
<style lang="scss" scoped>
.button-container {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
