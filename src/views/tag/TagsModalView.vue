<template>
  <div class="menu-modal" ref="tagMod" :class="$theme">
    <a-modal :getContainer="() => $refs.tagMod" v-bind="$attrs" :footer="null">
      <template #title>
        <span class="section-title" :class="$theme">
          <h4>新增標籤</h4>
        </span>
      </template>
      <p></p>
      <TagsAddView />
    </a-modal>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import TagsAddView from '@/views/tag/TagsAddView.vue'

export default {
  name: 'TagsModalView',
  components: {
    TagsAddView
  },
  computed: {
    ...mapState('Theme', ['$theme'])
  }
}
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
  background: #f6aaf1;
  content: '';
}
</style>
