<template>
  <template v-if="Ready">
    <div class="tab-theme" :class="this.$theme">
      <a-tabs v-model:activeKey="activeTab" type="card">
        <!-- tab 1 -->
        <a-tab-pane key="1" tab="所有文章">
          <RefreshBtn class="button-container btn-info" :spin="SyncOutlinedSpin[0]"  @click="refreshTable(0)"/>
          <div class="table-theme" :class="this.$theme">
            <a-table :dataSource="this.articlesArray"
              :columns="columns"
              :scroll="{ y: 600 }"
              :loading="TableLoading[0]"
              :indentSize="12"
            >
              <template #bodyCell="{ column, text, record }">
                <template v-if="['arti_title'].includes(column.dataIndex)">
                  <template v-if="column.dataIndex === 'arti_title'">
                    <a @click="showContent(record.arti_content)">{{ text }}</a> {{ record.id }}
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
          <div class="article-editor" :class="this.$theme">
          <ckeditor v-model="articleEditor.description" :editor="editor" :config="articleEditor.Config" />
          </div>
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
            <div v-html="articleEditor.description"></div>
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
    ...mapState('Theme', ['$theme'])
  },
  methods: {
    ...mapActions('ArticlesStore', ['fetch']),
    ...mapActions('ArticlesStore', {
      addArticle: 'add'
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
        // this.formRef.resetFields()
        window.scrollTo({ top: 100, behavior: 'smooth' })
      } catch (error) {}
    },
    showContent (content) {
      this.articleEditor.description = content
    }
  },
  async created () {
    try {
      await this.fetch()
      this.Ready = true
    } catch (error) {}
  },
  setup () {
    const Ready = ref(false)
    const TableLoading = ref([false, false, false])
    const SyncOutlinedSpin = ref([false, false, false])
    const activeTab = ref('1')
    const formRef = ref()
    const formState = reactive({
      article: {}
    })
    const { articleForm } = mapGetters('ArticlesStore', ['articleForm'])
    const articleEditor = reactive({
      description: '',
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

.add-button-container {
display: flex;
justify-content: flex-end;
align-items: center;
margin-top: 10px;
}

.add-clear-button {
margin-right: auto;
}

.add-cancel-button {
margin-right: 10px;
}

.add-submit-button {
margin-left: 10px;
}

.button-edit-container {
display: flex;
justify-content: space-between;
align-items: center;
}
.button-edit{
display: flex;
justify-content: center;
color:#6A6AFF;
}
.button-edit-check{
margin-right: 10px;
color:#00DB00;
}
.button-edit-close{
margin-left: auto;
color:#EA0000;
}

</style>
