<template>
  <div>
    <div class="section-title d-flex justify-content-between align-items-center" :class="$theme">
      <h4>詞組標籤</h4>
      <PlusBtn
        class="btn btn-secondary btn-outline-light btn-sm float-end me-md-2"
        @click="visible = true"
      />
    </div>
    <div class="collapse-theme" :class="$theme">
      <!--  重整區塊  -->
      <a-spin :spinning="spinning">
        <!--  主摺疊  -->
        <a-collapse v-model:activeKey="activeKey">
          <!--  子摺疊區塊  -->
          <a-collapse-panel key="1">
            <div class="menu-scroll">
              <!--  最頂層 -->
              <a-menu
                mode="inline"
                v-model:selectedKeys="selectedKeys"
                v-model:openKeys="openKeys"
                multiple
              >
                <!--  第一層  for 顯示  -->
                <template v-for="data in tags" :key="data.id">
                  <template v-if="data.children && data.children.length">
                    <a-sub-menu :key="data.id">
                      <template #title>
                        <a @click="handleTagsFilter(data.id)" style="display: inline-block">
                          <span class="dropdown-container">
                            {{ data.ts_name }}（{{ data.children.length }}）
                            <template v-if="$filtersTags.includes(data.id)">
                              <CheckOutlined :style="{ 'font-size': '10px' }" :rotate="10" />
                            </template>
                          </span>
                        </a>
                      </template>
                      <TreeTagsMenu :data="data" />
                    </a-sub-menu>
                  </template>
                  <template v-else>
                    <a-menu-item :key="data.id">
                      <a @click="handleTagsFilter(data.id)" style="display: inline-block">
                        <span class="dropdown-container">
                          # {{ data.ts_name }}
                          <template v-if="$filtersTags.includes(data.id)">
                            <span style="margin-left: 6px">
                              <CheckOutlined :style="{ 'font-size': '10px' }" />
                            </span>
                          </template>
                        </span>
                      </a>
                    </a-menu-item>
                  </template>
                </template>
                <!--  第一層  for 結束  -->
              </a-menu>
              <!--  最頂層 結束  -->
            </div>
          </a-collapse-panel>
        </a-collapse>
      </a-spin>
    </div>
  </div>
  <p></p>
  <!-- Modal  -->
  <TagsModalView v-model:open="visible" />
</template>
<script lang="ts" setup>
import { ref, toRefs, onMounted, computed, watchEffect } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import { PlusBtn } from '@/components/button'
import TreeTagsMenu from '@/components/tree-menu/TreeTagsMenu.vue'
import TagsModalView from '@/views/tag/TagsModalView.vue'
import { Tag } from '@/interfaces/Tags'

const store = useStore()
const { $theme } = toRefs(store.state.Theme)
const { $filtersTags, $filtersTagsState } = toRefs(store.state.Search)

const $route = useRoute()
const $router = useRouter()

const tags = computed(() => store.getters['TagsStore/tags'])
const recentTagsArray = computed(() => store.getters['TagsStore/recentTagsArray'])
const hasChildrenArray = computed(() =>
  recentTagsArray.value.filter((tag: Tag) => tag.children.length > 0)
)
const noChildrenArray = computed(() =>
  $filtersTags.value.filter(
    (tagId: number) => !hasChildrenArray.value.some((tag: Tag) => tag.id === tagId)
  )
)

const activeKey = ref<string[]>(['1'])
const spinning = ref<boolean>(false)
const selectedKeys = ref([])
const openKeys = ref()
const visible = ref<boolean>(false)

const handleTagsFilter = async (id: number): Promise<void> => {
  await store.dispatch('Search/pushFiltersTags', id)
  store.dispatch('Search/updateSearchClass', 'word')
  if (String($route.name) !== 'wordsGrid') {
    $router.push({ name: 'wordsGrid' })
  }
}

onMounted(async () => {
  spinning.value = true
  await store.dispatch('TagsStore/fetch')
  await store.dispatch('TagsStore/fetchRecent')
  spinning.value = false
  selectedKeys.value = noChildrenArray.value
})

watchEffect(() => {
  if (!$filtersTagsState.value) {
    selectedKeys.value = noChildrenArray.value
  }
})
</script>

<style lang="scss" scoped>
@import '@/assets/scss/main.scss';

.dropdown-container {
  display: flex;
  align-items: center;
}

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

.menu-scroll {
  position: relative;
  height: 350px;
  overflow: scroll;
}
</style>
