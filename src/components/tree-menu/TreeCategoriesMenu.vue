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
<script setup lang="ts">
import { PropType } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { Category } from '@/interfaces/Categories'

const store = useStore()

const $router = useRouter()

defineProps({
  data: { type: Object as PropType<Category>, required: true }
})

const handleCategoryFilter = async (cateName: string): Promise<void> => {
  store.dispatch('Search/updateSearchClass', 'word')
  store.dispatch('Search/updateFilters', ['cate_name'])
  store.dispatch('Search/updateKeyword', cateName)
  $router.push({ name: 'wordsGrid' })
}
</script>
