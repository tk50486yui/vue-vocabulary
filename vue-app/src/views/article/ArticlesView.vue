<template>
  <template v-if="Ready">
    <a-back-top />
    <div class="section-title">
      <h4>文章總覽</h4>
    </div>
    <a-spin :indicator="indicator" :spinning="spinning">
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
                          key: 'id'}"
                      multiple
                    />
                  </a-col>
                  <a-col :span="2">
                    <template v-if="tagsArray.length > 0">
                      <XmarkBtn @click="tagsArray = []" />
                    </template>
                  </a-col>
                </a-row>
              </a-input-group>
              <p></p>
              <!-- 第二層 tags filter -->
              <span class="tab-body-text">
                標籤：
                （
                <span class="radio-theme" :class="$theme">
                  <a-radio-group v-model:value="tagsOperator">
                    <a-radio value="or">OR</a-radio>
                    <a-radio value="and">AND</a-radio>
                    <a-radio value="none">NONE</a-radio>
                  </a-radio-group>
                </span>
                ）
              </span>
              <p></p>
            <div class="filter-block d-flex">
              <div class="select-theme" :class="$theme" ref="selectMod">
                  <span class="span-text">每頁：</span>
                  <a-select
                      ref="select"
                      :getPopupContainer="()=>this.$refs.selectMod"
                      v-model:value="selectPageSize"
                      size="small"
                      style="width: 80px"
                      @change="setPageSize()"
                      >
                      <a-select-option value="3">3 筆</a-select-option>
                      <a-select-option value="10">10 筆</a-select-option>
                      <a-select-option value="20">20 筆</a-select-option>
                      <a-select-option value="50">50 筆</a-select-option>
                      <a-select-option value="100">100 筆</a-select-option>
                      <a-select-option :value="this.articles.length">全部</a-select-option>
                  </a-select>
                  <span class="span-text" style="padding-left: 6px;">當前：</span>
                  <a-select
                      ref="selectCurrent"
                      :getPopupContainer="()=>this.$refs.selectMod"
                      v-model:value="currentPage"
                      size="small"
                      style="width: 80px"
                      @change="setCurrentPage()"
                      >
                      <template v-for="index in Math.ceil(this.articles.length/this.selectPageSize)" :key="index">
                        <a-select-option :value="index">第 {{ index }} 頁</a-select-option>
                      </template>
                  </a-select>
                  <span class="span-text" style="padding-left: 6px;">
                    顯示內容：<a-switch v-model:checked="showContent" size="small" />
                  </span>
                  <span class="span-text" style="padding-left: 6px;">
                    <template v-if="this.$keyword != '' && this.$filters.length > 0">
                        <span style="padding-right: 6px;">
                            關鍵字：`<span class="keyword-text">{{ this.$keyword }}</span> `
                        </span>
                    </template>
                    <template v-else>
                        <span style="padding-right: 6px;">
                            關鍵字：無
                        </span>
                    </template>
                  共  {{ this.filterdResult.length }} 筆
                  </span>
                  <span style="padding-left: 12px;">
                    <template v-if="this.$keyword != ''">
                      <XmarkBtn @click="onResetSearch()" />
                    </template>
                  </span>
                  <p></p>
              </div>
            </div>
            <!-- 文章列表 -->
            <div class="article-list-theme" :class="$theme">
              <a-list :data-source="this.filterdResult"
                :pagination="pagination" item-layout="vertical" size="large" bordered>
                <template #renderItem="{ item }">
                  <a-list-item key="item.arti_title">
                    <!-- 上方 -->
                    <a-list-item-meta>
                      <!-- 頭像 -->
                      <template #avatar>
                        <a-avatar :src="require('@/assets/img/avatar.png')" />
                      </template>
                      <!-- 標題 -->
                      <template #title>
                        <span class="span-text h5" style="white-space: pre">#{{ item.id }}&nbsp;</span>
                        <template v-if="this.$keyword != '' && this.$filters.includes('arti_title') && item.arti_title.includes(this.$keyword)">
                          <router-link :to="{ name: 'articlesContent', params: { id: item.id } }">
                            <span class="title-link h5">
                              <template v-for="(char, index) in splitTitle(item.arti_title, this.$keyword)" :key="index + char">
                                <span v-if="char === this.$keyword" class="keyword-text">
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
                          <router-link :to="{ name: 'articlesContent', params: { id: item.id } }">
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
                      <a class="list-link" @click="Expand"></a>
                    </template>
                    <template v-if="showContent">
                      <br>
                      <span class="article-date">
                        <template v-if="this.$keyword != '' && this.$filters.includes('created_at') && item.created_at.includes(this.$keyword)">
                          <template v-for="(char, index) in splitTitle(item.created_at, this.$keyword)" :key="index + char">
                            <span v-if="char === this.$keyword" class="keyword-text">
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
                      <template v-if="item.articles_tags.values != null && item.articles_tags.values.length > 0">
                        <span v-for="(tag, index) in item.articles_tags.values" :key="tag.ts_id + index">
                          <template v-if="tag.tc_color && tag.tc_background && tag.tc_border">
                            <a-tag :style="'background:' + tag.tc_background
                                  + ';color:'+ tag.tc_color
                                  +';border-color:'+ tag.tc_border">
                              {{ tag.ts_name }}
                            </a-tag>
                          </template>
                          <template v-else>
                            <a-tag color="default">
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
                    共 {{ this.filterdResult.length }} 筆
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
    </a-spin>
  </template>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'
import { ref, reactive, h } from 'vue'
import { LoadingOutlined } from '@ant-design/icons-vue'
import ArticlesAddView from '@/views/article/ArticlesAddView.vue'
import TagsTreeSelect from '@/components/tree-select/TagsTreeSelect.vue'
import XmarkBtn from '@/components/button/XmarkBtn.vue'

export default {
  name: 'ArticlesView',
  components: {
    ArticlesAddView,
    TagsTreeSelect,
    XmarkBtn
  },
  computed: {
    filterdResult () {
      return this.filterArticles(
        this.$keyword, this.$filters, this.tagsArray, this.tagsOperator
      )
    },
    ...mapGetters('ArticlesStore', ['articles']),
    ...mapGetters('ArticlesStore', ['filterArticles']),
    ...mapState('Search', ['$keyword']),
    ...mapState('Search', ['$searchClass']),
    ...mapState('Search', ['$filters']),
    ...mapState('Views', ['$ArticlesView']),
    ...mapState('Theme', ['$theme']),
    ...mapState('Screen', ['$tablet']),
    ...mapState('Screen', ['$mobile'])
  },
  methods: {
    ...mapActions('ArticlesStore', ['fetch']),
    ...mapActions('ArticlesStore', {
      updateArticle: 'update'
    }),
    ...mapActions('Search', ['updateKeyword']),
    ...mapActions('Search', ['updateFilters']),
    ...mapActions('Search', ['updateSearchClass']),
    ...mapActions('Views', ['updateArticlesView']),
    // actions
    async refreshArticles () {
      try {
        this.spinning = true
        await new Promise(resolve => setTimeout(resolve, 400))
        this.spinning = false
      } catch (error) {}
    },
    // articles tiltle
    splitTitle (title, keyword) {
      const regex = new RegExp(`(${keyword})`, 'i')
      const parts = title.split(regex)
      return parts.filter(part => part !== '')
    },
    onResetSearch () {
      this.updateKeyword('')
    },
    // set value in vuex
    setDefaultFromState () {
      this.pagination.pageSize = Number(this.$ArticlesView.currentPageSize)
      this.selectPageSize = this.$ArticlesView.currentPageSize
      this.pagination.current = Number(this.$ArticlesView.currentPage)
      this.currentPage = this.pagination.current
      this.AfterReady = true
    },
    // pagination
    setPageSize () {
      this.pagination.pageSize = Number(this.selectPageSize)
      this.pagination.current = 1
      this.currentPage = this.pagination.current
    },
    setCurrentPage () {
      this.pagination.current = Number(this.currentPage)
    },
    // scroll setting
    setContentClick () {
      const scrollY = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop
      this.updateArticlesView({ variable: 'currentScrollY', data: scrollY })
      this.updateArticlesView({ variable: 'currentPage', data: this.currentPage })
      this.updateArticlesView({ variable: 'jumpPage', data: false })
      this.updateArticlesView({ variable: 'currentPageSize', data: this.selectPageSize })
    }
  },
  async created () {
    try {
      await this.fetch()
      this.Ready = true
    } catch (error) {}
  },
  beforeRouteLeave (to, from, next) {
    this.setContentClick()
    next()
  },
  watch: {
    Ready (newVal) {
      if (newVal) {
        this.$nextTick(() => {
          if (this.$ArticlesView.jumpPage === true) {
            this.setDefaultFromState()
          }
        })
      }
    },
    AfterReady (newVal) {
      if (newVal) {
        this.$nextTick(() => {
          if (this.$ArticlesView.jumpScroll === true) {
            window.scrollTo({ top: this.$ArticlesView.currentScrollY, behavior: 'instant' })
            this.updateArticlesView({ variable: 'jumpScroll', data: false })
          }
        })
      }
    },
    $keyword (newVal) {
      if (newVal) {
        this.$nextTick(() => {
          this.refreshArticles()
        })
      }
    }
  },
  setup () {
    const Ready = ref(false)
    const AfterReady = ref(false)
    const spinning = ref(false)
    const activeTab = ref('1')
    const tabPosition = ref('top')
    const selectPageSize = ref('3')
    const currentPage = ref(1)
    const showContent = ref(true)
    const tagsArray = ref([])
    const tagsOperator = ref('or')

    const expandContent = reactive([{
      id: '',
      expand: false
    }])

    const indicator = h(LoadingOutlined, {
      style: {
        fontSize: '48px'
      },
      spin: false
    })

    const pagination = reactive({
      onChange: page => {
        currentPage.value = page
        pagination.current = currentPage.value
      },
      pageSize: Number(selectPageSize.value),
      position: 'top'
    })

    return {
      Ready,
      AfterReady,
      spinning,
      indicator,
      tabPosition,
      activeTab,
      selectPageSize,
      currentPage,
      pagination,
      showContent,
      expandContent,
      tagsArray,
      tagsOperator
    }
  }
}
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
  content: "";
}
.keyword-text{
    color:$keyword-color;
}
.filter-block{
  padding-bottom: 6px;
}

.article-date{
  padding-top: 18px;
  font-size:12px;
}

</style>
