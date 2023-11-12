<template>
  <template v-if="Ready">
    <a-back-top />
    <div class="section-title">
      <h4>文章列表</h4>
    </div>
    <a-spin :indicator="indicator" :spinning="spinning">
      <div class="tab-theme" :class="this.$theme">
        <a-tabs v-model:activeKey="activeTab" type="card" :tab-position="tabPosition">
          <!-- tab 1 -->
          <a-tab-pane key="1" tab="全部">
            <!-- 篩選 選擇 搜索列表 -->
            <div class="filter-block d-flex">
              <div class="select-theme" :class="this.$theme">
                  <span class="span-text">每頁：</span>
                  <a-select
                      ref="select"
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
                            關鍵字：` {{ this.$keyword }} `
                        </span>
                    </template>
                    <template v-else>
                        <span style="padding-right: 6px;">
                            關鍵字：無
                        </span>
                    </template>
                  共  {{ this.filterArticles(this.$keyword, this.$filters).length }} 筆
                  </span>
                  <span style="padding-left: 12px;">
                    <template v-if="this.$keyword != ''">
                      <a-button type="primary" size="small" shape="round" @click="onResetSearch()" danger>清除搜尋</a-button>
                    </template>
                  </span>
                  <p></p>
              </div>
            </div>
            <!-- 文章列表 -->
            <div class="article-list-theme" :class="this.$theme">
              <a-list :data-source="this.filterArticles(this.$keyword, this.$filters)"
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
                    <br>
                    <span class="article-date">
                      <template v-if="this.$keyword != '' && this.$filters.includes('created_at') && item.created_at.includes(this.$keyword)">
                        建立時間：
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
                        <span class="article-date">建立時間： {{ item.created_at }}</span>
                      </template>
                    </span>
                    <!-- 下方 -->
                    <template #actions>
                      <template v-if="item.articles_tags.values != null && item.articles_tags.values != ''"></template>
                        <span v-for="(tag, index) in item.articles_tags.values" :key="tag.ts_id + index">
                          #{{ tag.ts_name }}
                        </span>
                      <template v-if="item.articles_tags.values != null && item.articles_tags.values != ''"></template>
                    </template>
                  </a-list-item>
                </template>
                <!-- 最底部 -->
                <template #footer>
                  <span class="span-text">
                    共 {{ this.filterArticles(this.$keyword, this.$filters).length }} 筆
                  </span>
                </template>
              </a-list>
            </div>
          </a-tab-pane>
          <!-- tab 2 -->
          <a-tab-pane key="2" tab="+">
            <a-form
              ref="formRef"
              :model="formState"
              :validate-messages="validateMsg"
              name="articlesform"
              @finish="onFinish">
              <a-form-item class="input-theme" :class="this.$theme" :name="['article', 'arti_title']" :rules="[{ required: true }]">
                <a-input  v-model:value="formState.article.arti_title"  placeholder="輸入標題" allow-clear />
              </a-form-item>
              <p></p>
              <a-form-item :name="['article', 'arti_content']">
                <div class="article-editor" :class="this.$theme">
                  <ckeditor v-model="formState.article.arti_content" :editor="editor" :config="articleEditor.Config" />
                </div>
              </a-form-item>
              <p></p>
              <a-form-item>
                <a-button class="btn btn-primary btn-outline-light btn-sm" html-type="submit">儲存</a-button>
              </a-form-item>
            </a-form>
          </a-tab-pane>
        </a-tabs>
      </div>
    </a-spin>
  </template>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'
import { ref, reactive, onMounted, h } from 'vue'
import { message } from 'ant-design-vue'
import { LoadingOutlined } from '@ant-design/icons-vue'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'

export default {
  name: 'ArticlesView',
  computed: {
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
      addArticle: 'add'
    }),
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
    async onFinish (values) {
      try {
        message.loading({ content: 'Loading..', duration: 1 })
        await new Promise(resolve => setTimeout(resolve, 1000))
        await this.addArticle(values.article)
        await this.fetch()
        this.formRef.resetFields()
        window.scrollTo({ top: 100, behavior: 'smooth' })
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

    const formRef = ref()
    const formState = reactive({
      article: {}
    })

    const { articleForm } = mapGetters('ArticlesStore', ['articleForm'])

    const articleEditor = reactive({
      id: '',
      arti_title: '',
      arti_content: '',
      Config: {
        autoGrow: true,
        placeholder: '請輸入文章...'
      }
    })

    onMounted(() => {
      formState.article = { ...articleForm }
    })

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

    const validateMsg = {
      required: ''
    }

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
      articleEditor,
      editor: ClassicEditor,
      formRef,
      formState,
      articleForm,
      validateMsg
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

.button-container {
display: flex;
justify-content: center;
align-items: center;
margin-bottom: 8px
}

</style>
