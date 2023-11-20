<template>
  <div>
    <template v-for="item in data.children" :key="item.id">
      <template v-if="item.children && item.children.length">
        <a-sub-menu :key="item.id" :title="item.cate_name">
          <template #title>
            <a @click="handleCategoryFilter(item.cate_name)">
              {{ item.cate_name }}（{{ item.children.length }}）
            </a>
          </template>
          <TreeCategoriesMenu :data="item"></TreeCategoriesMenu>
        </a-sub-menu>
      </template>
      <template v-else>
        <a-menu-item :key="item.id">
          <a @click="handleCategoryFilter(item.cate_name)">
            {{ item.cate_name }}
          </a>
        </a-menu-item>
      </template>
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { mapActions } from 'vuex'

export default defineComponent({
  name: 'TreeCategoriesMenu',
  props: {
    data: Object,
    parentId: String
  },
  methods: {
    ...mapActions('Search', [
      'updateKeyword',
      'updateFilters',
      'updateSearchClass'
    ]),
    async handleCategoryFilter(cateName: string) {
      this.updateSearchClass('word')
      this.updateFilters(['cate_name'])
      this.updateKeyword(cateName)
      this.$router.push({ name: 'wordsGrid' })
    }
  }
})
</script>
