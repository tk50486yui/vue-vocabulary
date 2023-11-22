<template>
  <template v-if="Ready">
    <div class="section-title">
      <h4>文章總覽</h4>
    </div>
    <div class="tab-theme" :class="$theme">
      <a-tabs
        v-model:activeKey="activeTab"
        type="card"
        :tab-position="tabPosition"
      >
        <!-- tab 1 -->
        <a-tab-pane key="1" tab="全部">
          <!-- 篩選 選擇 搜索列表 -->
          <!-- 第一層 tags select -->
          <a-input-group>
            <a-row :gutter="4">
              <a-col :span="18">
                <TagsTreeSelect
                  size="small"
                  ref="TagsTreeSelect"
                  placeholder="以標籤過濾資料"
                  style="width: 100%"
                  v-model:value="tagsArray"
                  :treeDefaultExpandedKeys="tagsArray"
                  :field-names="{
                    children: 'children',
                    label: 'ts_name',
                    value: 'id',
                    key: 'id'
                  }"
                  multiple
                />
              </a-col>
              <a-col :span="2" class="d-flex align-items-center">
                <template v-if="tagsArray.length > 0">
                  <CloseBtn
                    class="d-flex align-items-center"
                    @click="tagsArray = []"
                  />
                </template>
              </a-col>
            </a-row>
          </a-input-group>
          <p></p>
          <!-- 第二層 tags filter -->
          <span class="tab-body-text d-flex align-items-center">
            <el-tag effect="dark" type="warning" :color="labelColor" round>
              標籤條件
            </el-tag>
            <span style="margin-left: 8px">
              <OperatorRadio v-model:value="tagsOperator" />
            </span>
          </span>
          <p></p>

          <div
            class="select-theme d-flex align-items-center"
            style="margin-bottom: 8px"
            :class="$theme"
            ref="selectMod"
          >
            <span class="span-text">每頁：</span>
            <a-select
              v-model:value="selectPageSize"
              :getPopupContainer="() => $refs.selectMod"
              size="small"
              style="width: 80px"
              @change="setPageSize()"
            >
              <a-select-option value="3">3 筆</a-select-option>
              <a-select-option value="10">10 筆</a-select-option>
              <a-select-option value="20">20 筆</a-select-option>
              <a-select-option value="50">50 筆</a-select-option>
              <a-select-option value="100">100 筆</a-select-option>
              <a-select-option :value="articles.length">全部</a-select-option>
            </a-select>
            <span class="span-text" style="margin-left: 8px">當前：</span>
            <a-select
              v-model:value="currentPage"
              :getPopupContainer="() => $refs.selectMod"
              size="small"
              style="width: 80px"
              @change="setCurrentPage()"
            >
              <template
                v-for="index in Math.ceil(
                  articles.length / Number(selectPageSize)
                )"
                :key="index"
              >
                <a-select-option :value="index"
                  >第 {{ index }} 頁</a-select-option
                >
              </template>
            </a-select>
            <span class="span-text" style="margin-left: 8px">
              <el-tag effect="dark" type="warning" :color="labelColor" round>
                顯示內容：
                <a-switch v-model:checked="showContent" size="small" />
              </el-tag>
            </span>
            <span style="margin-left: 8px">
              <el-tag
                class="d-flex align-items-center"
                effect="dark"
                size="small"
                type="success"
                color="black"
                round
              >
                關鍵字：
                <template v-if="$keyword != '' && $filters.length > 0">
                  `<span class="keyword-text">{{ $keyword }}</span> `
                </template>
                <template v-else> 無 </template>
              </el-tag>
            </span>
            <span style="margin-left: 8px">
              <el-tag
                class="d-flex align-items-center"
                effect="dark"
                size="small"
                color="black"
                round
              >
                共 {{ filterdResult.length }} 筆
              </el-tag>
            </span>
            <span style="margin-left: 6px">
              <template v-if="$keyword != ''">
                <CloseBtn
                  class="d-flex align-items-center"
                  @click="onResetSearch()"
                />
              </template>
            </span>
          </div>
          <!-- 文章列表 -->
          <div class="article-list-theme" :class="$theme">
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
                      <span class="span-text h5" style="white-space: pre"
                        >#{{ item.id }}&nbsp;</span
                      >
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
                              v-for="(char, index) in splitTitle(
                                item.arti_title,
                                $keyword
                              )"
                              :key="index + char"
                            >
                              <span
                                v-if="char === $keyword"
                                class="keyword-text"
                              >
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
                          <span class="title-link h5">{{
                            item.arti_title
                          }}</span>
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
                          v-for="(char, index) in splitTitle(
                            item.created_at,
                            $keyword
                          )"
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
                        item.articles_tags.values != null &&
                        item.articles_tags.values.length > 0
                      "
                    >
                      <span
                        v-for="(tag, index) in item.articles_tags.values"
                        :key="tag.ts_id + index"
                      >
                        <template
                          v-if="
                            tag.tc_color && tag.tc_background && tag.tc_border
                          "
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
                        </template>
                        <template v-else>
                          <a-tag color="default" style="color: #fff">
                            {{ tag.ts_name }}
                          </a-tag>
                        </template>
                      </span>
                    </template>
                  </template>
                </a-list-item>
              </template>
              <!-- 最底部 -->
              <template #footer>
                <span class="span-text">
                  共 {{ filterdResult.length }} 筆
                </span>
              </template>
            </a-list>
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
  </template>
</template>

<script lang="ts">
import { ref, reactive, defineComponent } from 'vue'
import { mapActions, mapGetters, mapState } from 'vuex'
import { CloseBtn } from '@/components/button'
import ArticlesAddView from '@/views/article/ArticlesAddView.vue'
import TagsTreeSelect from '@/components/tree-select/TagsTreeSelect.vue'
import OperatorRadio from '@/components/radio/OperatorRadio.vue'
import avatar from '@/assets/img/avatar.png'

export default defineComponent({
  name: 'ArticlesView',
  components: {
    ArticlesAddView,
    TagsTreeSelect,
    OperatorRadio,
    CloseBtn
  },
  computed: {
    filterdResult() {
      return this.filterArticles(
        this.$keyword,
        this.$filters,
        this.tagsArray,
        this.tagsOperator
      )
    },
    ...mapGetters('ArticlesStore', ['articles', 'filterArticles']),
    ...mapState('Search', ['$keyword', '$searchClass', '$filters']),
    ...mapState('Views', ['$ArticlesView']),
    ...mapState('Theme', ['$theme']),
    ...mapState('Screen', ['$tablet', '$mobile'])
  },
  methods: {
    ...mapActions('ArticlesStore', ['fetch']),
    ...mapActions('Search', [
      'updateKeyword',
      'updateFilters',
      'updateSearchClass'
    ]),
    ...mapActions('Views', ['updateArticlesView']),
    // articles tiltle
    splitTitle(title: string, keyword: string): string[] {
      const regex = new RegExp(`(${keyword})`, 'i')
      const parts = title.split(regex)
      return parts.filter((part) => part !== '')
    },
    onResetSearch(): void {
      this.updateKeyword('')
    },
    // set value in vuex
    setDefaultFromState(): void {
      this.pagination.pageSize = Number(this.$ArticlesView.currentPageSize)
      this.selectPageSize = this.$ArticlesView.currentPageSize
      this.pagination.current = Number(this.$ArticlesView.currentPage)
      this.currentPage = this.pagination.current
      this.AfterReady = true
    },
    // pagination
    setPageSize(): void {
      this.pagination.pageSize = Number(this.selectPageSize)
      this.pagination.current = 1
      this.currentPage = this.pagination.current
    },
    setCurrentPage(): void {
      this.pagination.current = Number(this.currentPage)
    },
    // scroll setting
    setContentClick(): void {
      const scrollY =
        window.scrollY ||
        document.documentElement.scrollTop ||
        document.body.scrollTop
      this.updateArticlesView({ variable: 'currentScrollY', data: scrollY })
      this.updateArticlesView({
        variable: 'currentPage',
        data: this.currentPage
      })
      this.updateArticlesView({ variable: 'jumpPage', data: false })
      this.updateArticlesView({
        variable: 'currentPageSize',
        data: this.selectPageSize
      })
    }
  },
  async created() {
    try {
      await this.fetch()
      this.Ready = true
    } catch (error) {
      //
    }
  },
  beforeRouteLeave(to, from, next) {
    this.setContentClick()
    next()
  },
  watch: {
    Ready(newVal: boolean) {
      if (newVal) {
        this.$nextTick(() => {
          if (this.$ArticlesView.jumpPage === true) {
            this.setDefaultFromState()
          }
        })
      }
    },
    AfterReady(newVal: boolean) {
      if (newVal) {
        this.$nextTick(() => {
          if (this.$ArticlesView.jumpScroll === true) {
            window.scrollTo({
              top: this.$ArticlesView.currentScrollY,
              behavior: 'instant'
            })
            this.updateArticlesView({ variable: 'jumpScroll', data: false })
          }
        })
      }
    }
  },
  setup() {
    const Ready = ref(false)
    const AfterReady = ref(false)
    const activeTab = ref('1')
    const tabPosition = ref('top')
    const selectPageSize = ref('3')
    const currentPage = ref(1)
    const showContent = ref(true)
    const tagsArray = ref([])
    const tagsOperator = ref('or')
    const labelColor = ref('rgba(59, 39, 12, 1)')

    const expandContent = reactive([
      {
        id: '',
        expand: false
      }
    ])

    const pagination = reactive({
      onChange: (page: number) => {
        currentPage.value = page
        pagination.current = currentPage.value
      },
      pageSize: Number(selectPageSize.value),
      position: 'top',
      current: currentPage.value
    })

    return {
      Ready,
      AfterReady,
      avatar,
      tabPosition,
      activeTab,
      selectPageSize,
      currentPage,
      pagination,
      showContent,
      expandContent,
      tagsArray,
      tagsOperator,
      labelColor
    }
  }
})
</script>

<style lang="scss" scoped>
@import '@/assets/scss/main.scss';

.section-title {
  margin-bottom: 12px;
}

.section-title h4:after {
  position: absolute;
  left: 0;
  bottom: -4px;
  height: 2px;
  width: 70px;
  background: #ffb348;
  content: '';
}

.keyword-text {
  color: $keyword-color;
}

.article-date {
  padding-top: 18px;
  font-size: 12px;
}
</style>