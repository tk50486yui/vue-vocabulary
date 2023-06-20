<template>
  <template v-if="Ready">
    <div class="tab-theme" :class="this.$theme">
      <a-tabs v-model:activeKey="activeTab" type="card" :tab-position="tabPosition">
        <!-- tab 1 -->
        <a-tab-pane key="1" tab="所有文章">
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
        <!-- tab 2 -->
        <a-tab-pane key="2" tab="近期">123</a-tab-pane>
        <!-- tab 3 -->
        <a-tab-pane key="3" tab="編輯">
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
        <a-tab-pane key="4" tab="＋添加文章">
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
        <a-tab-pane key="5" tab="顯示">
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
import RefreshBtn from '@/components/button/RefreshBtn.vue'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'

export default {
  name: 'ArticlesView',
  components: {
    RefreshBtn
  },
  computed: {
    ...mapGetters('ArticlesStore', ['articlesArray']),
    ...mapState('Theme', ['$theme']),
    ...mapState('Screen', ['$mobile'])
  },
  watch: {
    $mobile: function (val) {
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
    changeTabPosition (isScreenSmall) {
      if (isScreenSmall) {
        this.tabPosition = 'left'
      } else {
        this.tabPosition = 'top'
      }
    }
  },
  async created () {
    try {
      this.changeTabPosition(this.$mobile)
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

    return {
      Ready,
      TableLoading,
      SyncOutlinedSpin,
      columns,
      activeTab,
      tabPosition,
      formRef,
      formState,
      articleForm,
      validateMsg,
      articleEditor,
      editor: ClassicEditor
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
