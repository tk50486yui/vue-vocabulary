<template>
    <div class="toggle-theme" :class="$theme">
      <a-radio-group v-model:value="sideGroup">
          <a-radio-button value="1">類別</a-radio-button>
          <a-radio-button value="2">標籤</a-radio-button>
          <template v-if="updateNow === false">
          <a-badge :count="this.$WordsGroupsView.groupArray.length" color="magenta">
              <a-radio-button value="3">群組</a-radio-button>
          </a-badge>
          </template>
          <template v-else>
          <a-badge :count="'編輯中'" color="blue">
              <a-radio-button value="3">群組</a-radio-button>
          </a-badge>
          </template>
      </a-radio-group>
    </div>
    <p></p>
    <keep-alive>
      <template v-if="sideGroup === '1'">
          <CategoriesMenuView />
      </template>
      <template v-else-if="sideGroup === '2'">
          <TagsMenuView />
      </template>
      <template v-else-if="sideGroup === '3'">
          <WordsGroupsView/>
      </template>
    </keep-alive>
</template>
<script>
import { ref } from 'vue'
import { mapState } from 'vuex'
import CategoriesMenuView from '@/views/category/CategoriesMenuView.vue'
import TagsMenuView from '@/views/tag/TagsMenuView.vue'
import WordsGroupsView from '@/views/wordsgroup/WordsGroupsView.vue'

export default {
  name: 'SideMenuView',
  components: {
    CategoriesMenuView,
    TagsMenuView,
    WordsGroupsView
  },
  computed: {
    updateNow () {
      return this.$WordsGroupsDetailsView.updateNow
    },
    ...mapState('Views', ['$WordsGroupsView']),
    ...mapState('Views', ['$WordsGroupsDetailsView']),
    ...mapState('Theme', ['$theme'])
  },
  methods: {
  },
  setup () {
    const sideGroup = ref('1')
    const groupCount = ref('1')
    return {
      sideGroup,
      groupCount
    }
  }
}
</script>

  <style lang="scss" scoped>
  @import '@/assets/scss/main.scss';

  </style>
