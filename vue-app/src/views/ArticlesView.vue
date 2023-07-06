<template>
  <template v-if="Ready">
    <a-back-top />
    <div class="tab-theme" :class="this.$theme">
      <a-tabs v-model:activeKey="activeTab" type="card" :tab-position="tabPosition">
        <!-- tab 1 -->
        <a-tab-pane key="1" tab="全部">
          <div class="select-theme" :class="this.$theme">
              <span class="span-text">每頁顯示：</span>
              <a-select
                  ref="select"
                  v-model:value="selectPageSize"
                  size="small"
                  style="width: 80px"
                  @change="handlePageSize()"
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
                  @change="handleCurrentPage()"
                  >
                  <template v-for="index in Math.ceil(this.articles.length/this.selectPageSize)" :key="index">
                    <a-select-option :value="index">第 {{ index }} 頁</a-select-option>
                  </template>
              </a-select>
              <p></p>
            </div>
          <div class="article-list-theme" :class="this.$theme">
            <a-list item-layout="vertical" size="large" bordered :pagination="pagination" :data-source="articles">
              <template #footer>
                <span class="span-text">共 {{this.articles.length}} 筆</span>
              </template>
              <template #renderItem="{ item }">
                <a-list-item key="item.arti_title">
                  <template #actions>
                    <span v-for="{ type, text } in actions" :key="type">
                      <component :is="type" style="margin-right: 8px" />
                      {{ text }}
                    </span>
                  </template>
                  <template #extra v-if="articleExtra">
                    <img
                      width="262"
                      height="126"
                      alt="logo"
                      :src="require('@/assets/img/nihongo.png')"
                    />
                  </template>
                  <a-list-item-meta>
                    <template #title>
                      <span class="span-text h5" style="white-space: pre">#{{ item.id }}&nbsp;</span>
                      <a class="title-link h5">{{ item.arti_title }}</a>
                    </template>
                    <template #avatar><a-avatar :src="require('@/assets/img/avatar.png')" /></template>
                  </a-list-item-meta>
                    <template v-if="item.arti_content.length > 50  ">
                      <template v-if="!expandContent">
                        <div v-html="item.arti_content.slice(0, 50)"></div>
                        <p></p>
                        <a class="list-link" @click="handleExpand">繼續展開</a>
                      </template>
                      <template v-else>
                        <div v-html="item.arti_content"></div>
                        <p></p>
                        <a class="list-link" @click="handleCollapse">收起</a>
                      </template>
                    </template>
                    <template v-else>
                      <div v-html="item.arti_content"></div>
                    </template>
                </a-list-item>
              </template>
            </a-list>
          </div>
        </a-tab-pane>
        <!-- tab 2 -->
        <a-tab-pane key="2" tab="2">
          <RefreshBtn class="button-container btn-info" :spin="SyncOutlinedSpin[0]"  @click="refreshTable(0)"/>
          <div class="table-theme" :class="this.$theme">
            <a-table :dataSource="this.articlesArray"
              :columns="columns"
              :scroll="{ y: 600, x: 450 }"
              :loading="TableLoading[0]"
              :indentSize="12"
            >
              <template #bodyCell="{ column, text, record }">
                <template v-if="['arti_title'].includes(column.dataIndex)">
                  <template v-if="column.dataIndex === 'arti_title'">
                    <a @click="showContent(record)">{{ text }}</a>
                  </template>
                  <template v-else>
                  {{ text }}
                  </template>
                </template>
              </template>
            </a-table>
          </div>
        </a-tab-pane>
        <!-- tab 3 -->
        <a-tab-pane key="3" tab="3">
          <a-form-item class="input-theme" :class="this.$theme">
            <a-input  v-model:value="articleEditor.arti_title"  placeholder="輸入標題" allow-clear />
          </a-form-item>
          <p></p>
          <div class="article-editor" :class="this.$theme">
          <ckeditor v-model="articleEditor.arti_content" :editor="editor" :config="articleEditor.Config" />
          </div>
          <p></p>
          <button class="btn btn-info btn-outline-light btn-sm" @click="onEdit(articleEditor)">儲存</button>
        </a-tab-pane>
        <!-- tab 4 -->
        <a-tab-pane key="4" tab="+">
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
        <!-- tab 5 -->
        <a-tab-pane key="5" tab="5">
          <div class="show-block" :class="this.$theme">
            <div v-html="articleEditor.arti_content"></div>
          </div>
        </a-tab-pane>
      </a-tabs>
    </div>
</template>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'
import { ref, reactive, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import { StarOutlined, LikeOutlined, MessageOutlined } from '@ant-design/icons-vue'
import RefreshBtn from '@/components/button/RefreshBtn.vue'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'

const listData = []
for (let i = 0; i < 23; i++) {
  listData.push({
    href: 'https://www.antdv.com/',
    title: `ant design vue part ${i}`,
    avatar: 'avatar.png',
    description: 'Ant Design, a design language for background applications, is refined by Ant UED Team.',
    content: 'We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.'
  })
}

export default {
  name: 'ArticlesView',
  components: {
    RefreshBtn,
    StarOutlined,
    LikeOutlined,
    MessageOutlined
  },
  computed: {
    ...mapGetters('ArticlesStore', ['articlesArray']),
    ...mapGetters('ArticlesStore', ['articles']),
    ...mapState('Theme', ['$theme']),
    ...mapState('Screen', ['$tablet']),
    ...mapState('Screen', ['$mobile'])
  },
  watch: {
    $mobile: function (val) {
      this.changeTabPosition(val)
    },
    $tablet: function (val) {
      this.changeTabPosition(val)
    }
  },
  methods: {
    ...mapActions('ArticlesStore', ['fetch']),
    ...mapActions('ArticlesStore', {
      addArticle: 'add'
    }),
    ...mapActions('ArticlesStore', {
      updateArticle: 'update'
    }),
    async refreshTable (index) {
      try {
        this.SyncOutlinedSpin[index] = true
        this.TableLoading[index] = true
        await new Promise(resolve => setTimeout(resolve, 1000))
        if (index === 0) {
          await this.fetch()
        }
        this.SyncOutlinedSpin[index] = false
        this.TableLoading[index] = false
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
    async onEdit (values) {
      try {
        message.loading({ content: 'Loading..', duration: 1 })
        await new Promise(resolve => setTimeout(resolve, 1000))
        await this.updateArticle({ id: values.id, data: values })
        await this.fetch()
      } catch (error) {}
    },
    showContent (record) {
      this.articleEditor.id = record.id
      this.articleEditor.arti_title = record.arti_title
      this.articleEditor.arti_content = record.arti_content
    },
    handlePageSize () {
      this.pagination.pageSize = Number(this.selectPageSize)
      this.pagination.current = 1
      this.currentPage = this.pagination.current
    },
    handleCurrentPage () {
      this.pagination.current = Number(this.currentPage)
    },
    handleExpand () {
      this.expandContent = true
    },
    handleCollapse () {
      this.expandContent = false
    },
    changeTabPosition (isScreenSmall) {
      if (isScreenSmall) {
        this.articleExtra = false
      } else {
        this.articleExtra = true
      }
    }
  },
  async created () {
    try {
      this.changeTabPosition(this.$mobile)
      this.changeTabPosition(this.$tablet)
      await this.fetch()
      this.Ready = true
    } catch (error) {}
  },
  setup () {
    const Ready = ref(false)
    const TableLoading = ref([false, false, false])
    const SyncOutlinedSpin = ref([false, false, false])
    const activeTab = ref('1')
    const tabPosition = ref('top')
    const selectPageSize = ref('3')
    const currentPage = ref(1)
    const expandContent = ref(false)
    const articleExtra = ref(true)
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

    const validateMsg = {
      required: ''
    }

    const columns = [
      {
        title: '文章列表',
        dataIndex: 'arti_title',
        width: '60%'
      },
      {
        title: '建立時間',
        dataIndex: 'created_at',
        width: '40%'
      }
    ]

    const pagination = reactive({
      onChange: page => {
        currentPage.value = page
        pagination.current = currentPage.value
      },
      pageSize: Number(selectPageSize.value),
      position: 'top'
    })
    const actions = [{
      type: 'StarOutlined',
      text: '156'
    }, {
      type: 'LikeOutlined',
      text: '156'
    }, {
      type: 'MessageOutlined',
      text: '2'
    }]

    return {
      Ready,
      TableLoading,
      SyncOutlinedSpin,
      columns,
      activeTab,
      tabPosition,
      selectPageSize,
      currentPage,
      expandContent,
      articleExtra,
      formRef,
      formState,
      articleForm,
      validateMsg,
      articleEditor,
      editor: ClassicEditor,
      listData,
      pagination,
      actions
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/main.scss';

.button-container {
display: flex;
justify-content: center;
align-items: center;
margin-bottom: 8px
}

</style>
