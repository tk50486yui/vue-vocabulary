<template>
  <div class="menu-modal" ref="cateMod" :class="$theme">
    <a-modal :getContainer="() => $refs.cateMod" v-bind="$attrs" :footer="null">
      <template #title>
        <span class="section-title" :class="$theme">
          <h4>新增分類</h4>
        </span>
      </template>
      <p></p>
      <CategoriesAddView />
    </a-modal>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { mapState } from 'vuex'
import CategoriesAddView from '@/views/category/CategoriesAddView.vue'

export default defineComponent({
  name: 'CategoriesModalView',
  components: {
    CategoriesAddView
  },
  computed: {
    ...mapState('Theme', ['$theme'])
  }
})
</script>

<style lang="scss" scoped>
@import '@/assets/scss/main.scss';

.section-title {
  margin-bottom: 8px;
}

.section-title h4:after {
  position: absolute;
  left: 0;
  bottom: -4px;
  height: 2px;
  width: 70px;
  background: #efffb4;
  content: '';
}
</style>
