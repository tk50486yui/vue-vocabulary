<template>
  <div>
    <template v-for="item in data.children" :key="item.id">
      <template v-if="item.children && item.children.length">
        <a-sub-menu :key="item.id">
          <template #title>
            <a @click="handleTagsFilter(item.id)" style="display: inline-block">
              <span class="dropdown-container">
                {{ item.ts_name }} （{{ item.children.length }}）
                <template v-if="$filtersTags.includes(item.id)">
                  <span style="margin-left: 6px">
                    <CheckOutlined :style="{ 'font-size': '10px' }" />
                  </span>
                </template>
              </span>
            </a>
          </template>
          <TreeTagsMenu :data="item" />
        </a-sub-menu>
      </template>
      <template v-else>
        <a-menu-item :key="item.id">
          <a @click="handleTagsFilter(item.id)" style="display: inline-block">
            <span class="dropdown-container">
              # {{ item.ts_name }}
              <template v-if="$filtersTags.includes(item.id)">
                <span style="margin-left: 6px">
                  <CheckOutlined :style="{ 'font-size': '10px' }" />
                </span>
              </template>
            </span>
          </a>
        </a-menu-item>
      </template>
    </template>
  </div>
</template>
<script setup lang="ts">
import { PropType } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import { Tag } from '@/interfaces/Tags'

const store = useStore()
const { $filtersTags } = store.state.Search
const $route = useRoute()
const $router = useRouter()

defineProps({
  data: { type: Object as PropType<Tag>, required: true }
})

const handleTagsFilter = async (id: number): Promise<void> => {
  await store.dispatch('Search/pushFiltersTags', id)
  store.dispatch('Search/updateSearchClass', 'word')

  if (String($route.name) !== 'wordsGrid') {
    $router.push({ name: 'wordsGrid' })
  }
}
</script>
<style scoped>
.dropdown-container {
  display: flex;
  align-items: center;
}

.card-router-link {
  display: inline !important;
}
</style>
