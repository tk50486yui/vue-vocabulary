<template>
  <template v-if="Ready">
    <div class="section-title">
      <h4>文章總覽</h4>
    </div>
    <div class="tab-theme" :class="$theme">
      <a-tabs v-model:activeKey="activeTab" type="card" :tab-position="tabPosition">
        <!-- tab 1 -->
        <a-tab-pane key="1" tab="全部">
          <!-- 篩選 選擇 搜索列表 -->
          <!-- 第一層 tags select -->
          <a-input-group>
            <a-row :gutter="4">
              <a-col :span="18">
                <TagsTreeSelect
                  ref="filtersTagsTreeSelectRef"
                  size="small"
                  placeholder="以標籤過濾資料"
                  style="width: 100%"
                  v-model:value="tagsArray"
                  :treeDefaultExpandedKeys="tagsArray"
                  multiple
                />
              </a-col>
              <a-col :span="2" class="d-flex align-items-center">
                <template v-if="tagsArray.length > 0">
                  <CloseBtn class="d-flex align-items-center" @click="onResetTags()" />
                </template>
              </a-col>
            </a-row>
          </a-input-group>
          <p></p>
          <!-- 第二層 tags filter -->
          <span class="tab-body-text d-flex align-items-center">
            <el-tag effect="dark" type="warning" :color="labelColor" round> 標籤條件 </el-tag>
            <span style="margin-left: 8px">
              <OperatorRadio v-model:value="tagsOperator" />
            </span>
          </span>
          <p></p>
          <div class="select-theme" :class="$theme" ref="selectMod">
            <a-space size="small" wrap>
              <span class="span-text d-flex align-items-center">
                每頁：
                <a-select
                  v-model:value="selectPageSize"
                  :getPopupContainer="() => $refs.selectMod"
                  size="small"
                  style="width: 80px"
                  @change="setPageSize()"
                >
                  <a-select-option value="5">5 筆</a-select-option>
                  <a-select-option value="10">10 筆</a-select-option>
                  <a-select-option value="20">20 筆</a-select-option>
                  <a-select-option value="50">50 筆</a-select-option>
                  <a-select-option value="100">100 筆</a-select-option>
                  <a-select-option :value="articles.length">全部</a-select-option>
                </a-select>
              </span>
              <span class="span-text d-flex align-items-center">
                當前：
                <a-select
                  v-model:value="currentPage"
                  :getPopupContainer="() => $refs.selectMod"
                  size="small"
                  style="width: 85px"
                  @change="setCurrentPage()"
                >
                  <template v-for="index in articlesCount" :key="index">
                    <a-select-option :value="index">第 {{ index }} 頁</a-select-option>
                  </template>
                </a-select>
              </span>
              <span class="span-text">
                <el-tag effect="dark" type="warning" :color="labelColor" round>
                  顯示內容：
                  <a-switch v-model:checked="showContent" size="small" />
                </el-tag>
              </span>
              <span class="d-flex align-items-center">
                <el-tag effect="dark" size="small" type="success" color="black" round>
                  關鍵字：
                  <template v-if="$keyword != '' && $filters.length > 0">
                    `<span class="keyword-text">{{ $keyword }}</span> `
                  </template>
                  <template v-else> 無 </template>
                </el-tag>
              </span>
              <template v-if="$filtersCategoryId !== 0">
                <span class="d-flex align-items-center">
                  <el-tag
                    class="d-flex align-items-center"
                    effect="dark"
                    size="small"
                    type="warning"
                    color="black"
                    round
                  >
                    主題分類：
                    <span class="category-keyword-text">{{ $filtersCategoryName }}</span>
                  </el-tag>
                </span>
              </template>
              <span class="d-flex align-items-center">
                <el-tag effect="dark" size="small" color="black" round>
                  共 {{ filterdResult.length }} 筆
                </el-tag>
              </span>
              <span class="d-flex align-items-center">
                <template v-if="$keyword != '' || $filtersCategoryName != ''">
                  <CloseBtn @click="onResetSearch()" />
                </template>
              </span>
            </a-space>
          </div>
          <p></p>
          <!-- 文章列表 -->
          <div class="article-list-theme" :class="$theme">
            <span v-if="ReadySpinning" class="ready-spinning">
              <a-spin :spinning="ReadySpinning" size="middle" />
            </span>
            <template v-if="!ReadySpinning">
              <a-list
                :data-source="filterdResult"
                :pagination="pagination"
                item-layout="vertical"
                size="large"
                bordered
              >
                <template #renderItem="{ item }">
                  <a-list-item key="item.arti_title">
                    <!-- 上方 -->
                    <a-list-item-meta>
                      <!-- 頭像 -->
                      <template #avatar>
                        <a-avatar :src="avatar" />
                      </template>
                      <!-- 標題 -->
                      <template #title>
                        <template v-if="item.cate_name !== '' && item.cate_name !== null">
                          <span class="span-text h5">
                            【
                            <a @click="handleCategoryFilter(item.cate_id, item.cate_name)">
                              <template v-if="$filtersCategoryName != ''">
                                <span class="category-keyword-text">
                                  {{ $filtersCategoryName }}
                                </span>
                              </template>
                              <template v-else>
                                {{ item.cate_name }}
                              </template>
                            </a>
                            】
                          </span>
                        </template>
                        <template
                          v-if="
                            $keyword != '' &&
                            $filters.includes('arti_title') &&
                            item.arti_title.includes($keyword)
                          "
                        >
                          <router-link
                            :to="{
                              name: 'articlesContent',
                              params: { id: item.id }
                            }"
                          >
                            <span class="title-link h5">
                              <template
                                v-for="(char, index) in splitTitle(item.arti_title, $keyword)"
                                :key="index + char"
                              >
                                <span v-if="char === $keyword" class="keyword-text">
                                  {{ char }}
                                </span>
                                <span v-else>
                                  {{ char }}
                                </span>
                              </template>
                            </span>
                          </router-link>
                        </template>
                        <template v-else>
                          <router-link
                            :to="{
                              name: 'articlesContent',
                              params: { id: item.id }
                            }"
                          >
                            <span class="title-link h5">{{ item.arti_title }}</span>
                          </router-link>
                        </template>
                      </template>
                    </a-list-item-meta>
                    <!-- 內容-->
                    <template v-if="showContent">
                      <div v-html="item.arti_content"></div>
                    </template>
                    <template v-else>
                      <a class="list-link"></a>
                    </template>
                    <template v-if="showContent">
                      <br />
                      <span class="article-date">
                        <template
                          v-if="
                            $keyword != '' &&
                            $filters.includes('created_at') &&
                            item.created_at.includes($keyword)
                          "
                        >
                          <template
                            v-for="(char, index) in splitTitle(item.created_at, $keyword)"
                            :key="index + char"
                          >
                            <span v-if="char === $keyword" class="keyword-text">
                              {{ char }}
                            </span>
                            <span v-else>
                              {{ char }}
                            </span>
                          </template>
                        </template>
                        <template v-else>
                          <span class="article-date">{{ item.created_at }}</span>
                        </template>
                      </span>
                    </template>
                    <!-- 下方 -->
                    <template #actions>
                      <template
                        v-if="
                          item.articles_tags.values != null && item.articles_tags.values.length > 0
                        "
                      >
                        <span
                          v-for="(tag, index) in item.articles_tags.values"
                          :key="tag.ts_id + index"
                        >
                          <a-tag
                            :style="
                              'background:' +
                              tag.tc_background +
                              ';color:' +
                              tag.tc_color +
                              ';border-color:' +
                              tag.tc_border
                            "
                          >
                            {{ tag.ts_name }}
                          </a-tag>
                        </span>
                      </template>
                    </template>
                  </a-list-item>
                </template>
                <!-- 最底部 -->
                <template #footer>
                  <span class="span-text"> 共 {{ filterdResult.length }} 筆 </span>
                </template>
              </a-list>
            </template>
          </div>
        </a-tab-pane>
        <!-- tab 2 -->
        <a-tab-pane key="2">
          <template #tab>
            <font-awesome-icon :icon="['fas', 'plus']" />
          </template>
          <ArticlesAddView />
        </a-tab-pane>
      </a-tabs>
    </div>
    <a-back-top />
  </template>
</template>
<script lang="ts" setup>
import { ref, reactive, toRefs, watch, computed, onMounted, onActivated, nextTick } from 'vue'
import { useStore } from 'vuex'
import { onBeforeRouteLeave } from 'vue-router'
import { CloseBtn } from '@/components/button'
import ArticlesAddView from '@/views/article/ArticlesAddView.vue'
import TagsTreeSelect from '@/components/tree-select/TagsTreeSelect.vue'
import OperatorRadio from '@/components/radio/OperatorRadio.vue'
import avatar from '@/assets/img/avatar.png'

const store = useStore()
const { $theme } = toRefs(store.state.Theme)
const { $keyword, $filters, $filtersCategoryId, $filtersCategoryName, $filtersTags } = toRefs(
  store.state.Search
)
const { $ArticlesView } = toRefs(store.state.Views)

const articles = computed(() => store.getters['ArticlesStore/articles'])
const filterArticles = computed(() => store.getters['ArticlesStore/filterArticles'])

const filterdResult = computed(() =>
  filterArticles.value(
    $keyword.value,
    $filters.value,
    $filtersCategoryId.value,
    $filtersTags.value,
    tagsOperator.value
  )
)
const articlesCount = computed(
  () => Math.ceil(articles.value.length / Number(selectPageSize.value)) || 1
)

const Ready = ref<boolean>(false)
const AfterReady = ref<boolean>(false)
const ReadySpinning = ref<boolean>(false)
const activeTab = ref<string>('1')
const tabPosition = ref<string>('top')
const filtersTagsTreeSelectRef = ref()
const selectPageSize = ref<string>('5')
const currentPage = ref<number>(1)
const showContent = ref<boolean>(true)
const tagsArray = ref<number[]>([])
const tagsOperator = ref<string>('or')
const labelColor = ref<string>('rgba(59, 39, 12, 1)')

const pagination = reactive({
  onChange: (page: number) => {
    currentPage.value = page
    pagination.current = currentPage.value
  },
  pageSize: Number(selectPageSize.value),
  position: 'top',
  current: currentPage.value
})

const splitTitle = (title: string, keyword: string): string[] => {
  const regex = new RegExp(`(${keyword})`, 'i')
  const parts = title.split(regex)
  return parts.filter((part) => part !== '')
}

const onResetSearch = () => {
  store.dispatch('Search/updateKeyword', '')
  store.dispatch('Search/updateFiltersCategory', {
    id: 0,
    name: ''
  })
}

const onResetTags = async (): Promise<void> => {
  tagsArray.value = []
  filtersTagsTreeSelectRef.value.clearValue()
}
// filters
const handleCategoryFilter = async (id: number, name: string): Promise<void> => {
  store.dispatch('Search/updateFiltersCategory', {
    id: id,
    name: name
  })
  await new Promise((resolve) => setTimeout(resolve, 100))
  window.scrollTo({ top: 180, behavior: 'instant' })
}

// set default
const setPagination = () => {
  pagination.pageSize = Number($ArticlesView.value.currentPageSize)
  selectPageSize.value = $ArticlesView.value.currentPageSize
  pagination.current = Number($ArticlesView.value.currentPage)
  currentPage.value = pagination.current
}

const setDefaultFromState = () => {
  tagsArray.value = $filtersTags.value
  AfterReady.value = true
}

const setPageSize = () => {
  pagination.pageSize = Number(selectPageSize.value)
  pagination.current = 1
  currentPage.value = pagination.current
}

const setCurrentPage = () => {
  pagination.current = Number(currentPage.value)
}

const setContentClick = async (): Promise<void> => {
  const scrollY = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop
  store.dispatch('Views/updateArticlesView', { variable: 'currentScrollY', data: scrollY })
  store.dispatch('Views/updateArticlesView', {
    variable: 'currentPage',
    data: currentPage.value
  })
  store.dispatch('Views/updateArticlesView', { variable: 'jumpPage', data: false })
  store.dispatch('Views/updateArticlesView', {
    variable: 'currentPageSize',
    data: selectPageSize.value
  })
}

onMounted(async () => {
  try {
    ReadySpinning.value = true
    await store.dispatch('ArticlesStore/fetch')
    Ready.value = true
    ReadySpinning.value = false
    setDefaultFromState()
  } catch (e) {
    //
  }
})

onBeforeRouteLeave(async (to, from, next) => {
  await setContentClick()
  Ready.value = false
  AfterReady.value = false
  next()
})

onActivated(async () => {
  Ready.value = true
  setDefaultFromState()
})

watch(Ready, (val) => {
  if (val) {
    nextTick(() => {
      if ($ArticlesView.value.jumpPage === true) {
        setPagination()
      }
    })
  }
})

watch(AfterReady, (val) => {
  if (val) {
    nextTick(() => {
      if ($ArticlesView.value.jumpScroll === true) {
        window.scrollTo({
          top: $ArticlesView.value.currentScrollY,
          behavior: 'instant'
        })

        store.dispatch('Views/updateArticlesView', { variable: 'jumpScroll', data: false })
      }
    })
  }
})

watch(tagsArray, () => {
  store.dispatch('Search/updateFiltersTags', tagsArray.value)
})
</script>

<style lang="scss" scoped>
@import '@/assets/scss/main.scss';
.ready-spinning {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 60vh;
}

.ready-spinning :deep(.ant-spin-dot-item) {
  background: #{$articles-main-color};
}
.section-title {
  margin-bottom: 12px;
}
.section-title h4:after {
  position: absolute;
  left: 0;
  bottom: -4px;
  height: 2px;
  width: 70px;
  background: #{$articles-main-color};
  content: '';
}

.keyword-text {
  color: $keyword-color;
}

.category-keyword-text {
  color: $category-keyword-color;
}

.article-date {
  padding-top: 18px;
  font-size: 12px;
}

/*---------------------
    scss color
-----------------------*/
.dark {
  --tab-background: rgb(50, 40, 47);
  --tab-background-active: #{$articles-main-color};
  --tab-background-active-hover: #{$articles-main-color};
}

/*---------------------
    Article List
-----------------------*/
.article-list-theme {
  &.dark :deep(.ant-list-item) {
    background: var(--article-list-background);
    color: var(--table-text);
  }
  &.dark :deep(.ant-list-item-meta-title a) {
    color: var(--table-text);
  }
  &.dark :deep(.ant-list-item-meta-description) {
    color: var(--table-text);
  }

  &.dark :deep(.ant-list-item-action li) {
    color: var(--table-text);
  }
  /* 自定義類別 */
  a {
    text-decoration: none;
  }
  &.dark :deep(a.list-link) {
    color: var(--link-text);
  }

  &.dark :deep(.title-link) {
    color: var(--title-link-text);
  }
  &.dark :deep(.title-link:hover) {
    color: var(--title-link-text-hover);
  }

  &.dark :deep(span.span-text) {
    color: var(--table-text);
  }

  &.dark :deep(.article-date) {
    color: var(--article-date-text);
  }

  // card pagination
  &.dark :deep(.ant-pagination-item) {
    color: var(--pagination-text);
    background: var(--pagination-background);
  }

  &.dark :deep(.ant-pagination-item:hover) {
    color: var(--pagination-text-active);
    background: var(--pagination-background-active);
    border-color: var(--pagination-border);
  }

  &.dark :deep(.ant-pagination-item-link) {
    color: var(--pagination-text);
    background: var(--pagination-background);
  }

  &.dark :deep(.ant-pagination-item-link:disabled) {
    color: var(--pagination-text);
    background: var(--pagination-link-disabled);
  }

  &.dark :deep(.ant-pagination-item-active) {
    color: var(--pagination-text-active);
    background: var(--pagination-background-active);
    border-color: var(--pagination-border);
  }

  &.dark :deep(.ant-pagination-item-active:hover) {
    color: var(--pagination-text-active);
    background: var(--pagination-background-active);
    border-color: var(--pagination-border);
  }

  &.dark :deep(.ant-pagination-item-ellipsis) {
    color: var(--pagination-text-active);
  }
}
</style>
