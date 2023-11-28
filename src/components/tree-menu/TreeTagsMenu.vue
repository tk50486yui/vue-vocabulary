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
            <span class="dropdown-container"> # {{ item.ts_name }} </span>
          </a>
          <template v-if="$filtersTags.includes(item.id)">
            <span style="margin-left: 6px">
              <CheckOutlined :style="{ 'font-size': '10px' }" />
            </span>
          </template>
        </a-menu-item>
      </template>
    </template>
  </div>
</template>
<script setup lang="ts">
import { PropType, toRefs } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import { Tag } from '@/interfaces/Tags'

const store = useStore()
const { $filtersTags, $autoMove, $isAutoMove } = toRefs(store.state.Search)
const $route = useRoute()
const $router = useRouter()

defineProps({
  data: { type: Object as PropType<Tag>, required: true }
})

const handleTagsFilter = async (id: number): Promise<void> => {
  await store.dispatch('Search/pushFiltersTags', id)
  if ($isAutoMove.value) {
    await moveBegin()
  }
}

const moveBegin = async (): Promise<void> => {
  const routeName = String($route.name)
  if ($autoMove.value === 'words' && routeName !== 'wordsGrid') {
    store.dispatch('Search/updateSearchClass', 'word')
    $router.push({ name: 'wordsGrid' })
  } else if ($autoMove.value === 'articles' && routeName !== 'articles') {
    store.dispatch('Search/updateSearchClass', 'article')
    $router.push({ name: 'articles' })
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
