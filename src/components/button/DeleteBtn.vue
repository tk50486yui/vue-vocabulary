<template>
  <a-popconfirm title="確定要刪除嗎？" ok-text="是" cancel-text="否">
    <DeleteFilled class="button-delete" />
  </a-popconfirm>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/main.scss';

.button-delete {
  color: rgb(231, 121, 121);
  padding-left: 6px;
}
</style>
