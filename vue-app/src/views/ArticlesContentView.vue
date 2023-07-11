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
            <p></p>
            <div class="article-theme">
            <br>
            <!-- title -->
              <div class="article-title">
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
              </div>
              <p></p>
              <a-divider style="height: 2px; background-color: #cccccc" />
              <p></p>
              <!-- content -->
              <div class="article-content">
                <template v-if="editShow">
                  <div class="article-editor" :class="this.$theme">
                    <ckeditor v-model="formState.article.arti_content" :editor="editor" :config="articleEditor.Config" />
                  </div>
                </template>
                <template v-else>
                  <h4><div v-html="article.arti_content"></div></h4>
                </template>
              </div>
              <a-divider style="height: 1px; background-color: #adadad" />
              <div class="article-category">
                <template v-if="editShow">
                  <CategoriesTreeSelect size="large" ref="CategoriesTreeSelect"
                    placeholder="選擇分類"
                    :dropdownMatchSelectWidth="false" style="width: 100%"
                    v-model:value="formState.article.cate_id"
                    :defaultValue="article.cate_id"
                    :treeDefaultExpandedKeys="[article.cate_id]"
                    @change="handleCategoriesSelectChange"
                  />
                </template>
                <template v-else>
                  <template v-if="article.cate_name !=null && article.cate_name != ''">
                    主題分類：<span class="span-category">{{ article.cate_name }}</span>
                  </template>
                  <template v-else>
                    主題分類：<span>暫無</span>
                  </template>
                </template>
              </div>
              <div class="article-tag">
              <template v-if="editShow">
                <TagsTreeSelect
                    size="large"
                    ref="TagsTreeSelect"
                    placeholder="添加標籤"
                    style="width: 100%"
                    v-model:value="formState.article.articles_tags.array"
                    :treeDefaultExpandedKeys="formState.article.articles_tags.array"
                    @change="handleTagsSelectChange"
                    multiple
                    />
              </template>
              <template v-else>
                <template v-for="(item, index) in article.articles_tags.values"  :key="item.ts_id">
                  <a-tag color="blue" style="font-size: 18px;"> {{ item.ts_name }} </a-tag>
                  <template v-if="index != article.articles_tags.values.length && (index/5) == 1">
                    <br>
                  </template>
                </template>
              </template>
              </div>
            </div>
            <!-- button -->
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
import { ref, reactive, onMounted } from 'vue'
import { mapActions, mapState, mapGetters } from 'vuex'
import { message } from 'ant-design-vue'
import { EditOutlined } from '@ant-design/icons-vue'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import CategoriesTreeSelect from '@/components/tree-select/CategoriesTreeSelect.vue'
import TagsTreeSelect from '@/components/tree-select/TagsTreeSelect.vue'

export default {
  name: 'ArticlesContentView',
  components: {
    EditOutlined,
    CategoriesTreeSelect,
    TagsTreeSelect
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
    handleCategoriesSelectChange (value) {
      this.formState.article.cate_id = typeof value !== 'undefined' ? value : null
    },
    handleTagsSelectChange (value) {
      this.formState.article.articles_tags.array = typeof value !== 'undefined' ? value : []
    },
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
    const editShow = ref(false)
    const formRef = ref()
    const formState = reactive({
      article: {}
    })
    const { articleForm } = mapGetters('ArticlesStore', ['articleForm'])

    onMounted(() => {
      formState.article = { ...articleForm }
      formState.article.articles_tags = { array: [], values: [] }
    })

    const articleEditor = reactive({
      Config: {
        autoGrow: true,
        placeholder: '尚無內容',
        toolbar: {
          items: ['heading', '|', 'bold', 'italic', 'link', 'undo', 'redo']
        }
      }
    })

    return {
      Ready,
      editShow,
      formRef,
      formState,
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
.article-category{
  padding-left: 12px;
  padding-right: 12px;
  padding-bottom: 12px;
}

.article-category span{
  font-size:18px;
}

.article-title{
  padding-left: 12px;
}
.article-content{
  padding-left: 12px;
  padding-right: 12px;
}

.article-tag{
  padding-left: 12px;
  padding-right: 12px;
  padding-bottom: 12px;
}

.ant-input{
  font-size:24px
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
