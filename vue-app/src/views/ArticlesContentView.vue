<template>
    <template v-if="Ready">
        <a-back-top />
        <div class="descriptions-theme" :class="this.$theme">
            <h5>
                <router-link :to="{ name: 'articles' }" @click="setGridState()"> Back </router-link>
            </h5>
            <div class="d-flex justify-content-end">
              <EditOutlined class="button-edit " :class="this.$theme" @click="onEdit()"/>
            </div>
            <a-descriptions
                :column="{ xxl: 1, xl: 1, lg: 1, md: 1, sm: 1, xs: 1 }"
                :layout="descriptionsLayout"
                class="table-container"
            >
              <a-descriptions-item>
                <template v-if="editShow">
                    <div class="input-theme" :class="this.$theme">
                        <a-input
                            v-model:value="formState.article.arti_title"
                            size="large"
                            style="width: 450px;background-color:transparent"
                            :bordered="false"
                        />
                    </div>
                </template>
                <template v-else>
                    <div>
                        <span class="h3 fw-bolder">{{ article.arti_title }}</span>
                    </div>
                </template>
              </a-descriptions-item>
              <a-descriptions-item>
                <template v-if="editShow">
                  <div class="article-editor" :class="this.$theme">
                    <ckeditor v-model="formState.article.arti_content" :editor="editor" :config="articleEditor.Config" />
                  </div>
                </template>
                <template v-else>
                  <h4><div v-html="article.arti_content"></div></h4>
                </template>
              </a-descriptions-item>
            </a-descriptions>
              <template v-if="editShow">
                <p></p>
                <div>
                  <a-button type="primary" @click="onEditFinish()">儲存</a-button>
                  <a-button style="margin-left: 10px" @click="onEditCancel()" danger>取消</a-button>
                </div>
              </template>
        </div>
    </template>
  </template>

<script>
import { mapActions, mapState, mapGetters } from 'vuex'
import { ref, reactive, onMounted } from 'vue'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import { EditOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'

export default {
  name: 'ArticlesContentView',
  components: {
    EditOutlined
  },
  computed: {
    ...mapGetters('ArticlesStore', ['articleById']),
    ...mapState('Theme', ['$theme']),
    ...mapState('Screen', ['$mobile']),
    ...mapState('Screen', ['$tablet']),
    articleId () {
      return this.$route.params.id
    },
    article () {
      return this.articleById(this.articleId)
    }
  },
  methods: {
    ...mapActions('ArticlesStore', ['fetch']),
    ...mapActions('ArticlesStore', {
      updateArticle: 'update'
    }),
    ...mapActions('Views', ['updateArticlesView']),
    onEdit () {
      this.editShow = !this.editShow
      this.formState.article = Object.assign({}, this.formState.article, this.article)
    },
    async onEditFinish () {
      try {
        message.loading({ content: 'Loading..', duration: 1 })
        await new Promise(resolve => setTimeout(resolve, 1000))
        await this.updateArticle({ id: this.formState.article.id, data: this.formState.article })
        await this.fetch()
        this.onEditCancel()
      } catch (error) {}
    },
    onEditCancel () {
      if (this.editShow) {
        this.editShow = false
      }
      if (!this.editShow) {
        this.$nextTick(() => {
          window.scrollTo({ top: 160, behavior: 'auto' })
        })
      }
    },
    /* handleTagsSelectChange (value) {
      this.formState.word.words_tags.array = typeof value !== 'undefined' ? value : []
    }, */
    setGridState () {
      this.updateArticlesView({ variable: 'jumpPage', data: true })
      this.updateArticlesView({ variable: 'jumpScroll', data: true })
    }
  },
  async created () {
    try {
      window.scrollTo({ top: 120, behavior: 'instant' })
      await this.fetch()
      this.Ready = true
    } catch (error) {}
  },
  setup () {
    const Ready = ref(false)
    const descriptionsLayout = ref('vertical')
    const editShow = ref(false)
    const formRef = ref()
    const formState = reactive({
      article: {}
    })
    const { articleForm } = mapGetters('ArticlesStore', ['articleForm'])

    onMounted(() => {
      formState.article = { ...articleForm }
    })

    const articleEditor = reactive({
      Config: {
        autoGrow: true,
        placeholder: '尚無內容'
      }
    })

    const validateMsg = {
      required: 'required'
    }

    return {
      Ready,
      descriptionsLayout,
      editShow,
      formRef,
      formState,
      validateMsg,
      articleEditor,
      editor: ClassicEditor
    }
  }

}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/main.scss';

.table-container {
    width: 100%;
    overflow-x: auto;
}

.button-edit {
    &.dark{
        color:var(--edit-icon);
    }
    &.light{
        color:var(--edit-icon);
    }
}

</style>
