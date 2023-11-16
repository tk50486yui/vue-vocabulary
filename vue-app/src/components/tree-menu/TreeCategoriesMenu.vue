<template>
    <div>
        <template v-for="item in data.children" :key="item.id">
            <template v-if="item.children && item.children.length">
              <a-sub-menu :key="item.id" :title="item.cate_name">
                  <template #title>
                    <a @click="handleCategoryFilter(item.cate_name)">
                      {{ item.cate_name}}
                    </a>
                  </template>
                  <TreeCategoriesMenu :data="item"></TreeCategoriesMenu>
              </a-sub-menu>
            </template>
            <template v-else>
              <a-menu-item :key="item.id">
                <a @click="handleCategoryFilter(item.cate_name)">
                  {{ item.cate_name}}
                </a>
              </a-menu-item>
            </template>
        </template>
    </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'TreeCategoriesMenu',
  props: {
    data: Object,
    parentId: String
  },
  methods: {
    ...mapActions('Search', ['updateKeyword', 'updateFilters', 'updateSearchClass']),
    async handleCategoryFilter (cateName) {
      this.updateSearchClass('word')
      this.updateFilters(['cate_name'])
      this.updateKeyword(cateName)
      this.$router.push({ name: 'wordsGrid' })
    }
  }
}
</script>
