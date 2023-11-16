<template>
    <template v-if="Ready">
        <a-back-top />
        <span class="back-link-theme" :class="$theme">
          <router-link :to="{ name: 'articles' }" @click="setGridState()">
            返回
          </router-link>
          <span class="link-separator h5">
            <font-awesome-icon :icon="['fas', 'chevron-right']" size="xs"/>
          </span>
          <span class="h4">
            {{ article.arti_title }}
          </span>
        </span>
        <div class="descriptions-theme" :class="$theme">
            <div class="d-flex justify-content-end">
              <EditOutlined class="button-edit " :class="$theme" @click="onEdit()"/>
            </div>
            <p></p>
            <div class="article-theme">
              <br>
              <!-- title -->
              <div class="article-title">
                <template v-if="editShow">
                  <div class="input-theme" :class="$theme">
                      <a-input
                          v-model:value="formState.article.arti_title"
                          size="large"
                          style="width: 450px; background-color:transparent"
                          :bordered="false"
                      />
                  </div>
                </template>
                <template v-else>
                  <div>
                    <span>{{ article.arti_title }}</span>
                  </div>
                </template>
              </div>
              <p></p>
              <a-divider style="height: 1px; background-color: #3f3e3e" />
              <p></p>
              <!-- content -->
              <div class="article-content">
                <template v-if="editShow">
                  <div class="article-editor" :class="this.$theme">
                    <ckeditor v-model="formState.article.arti_content" :editor="editor" :config="articleEditor.Config" />
                  </div>
                </template>
                <template v-else>
                  <div v-html="article.arti_content"></div>
                </template>
              </div>

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
                    主題分類：<span class="span-category">暫無</span>
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
                      :field-names="{
                        children: 'children',
                        label: 'ts_name',
                        value: 'id',
                        key: 'id'}"
                      multiple
                      />
                </template>
                <template v-else>
                  <template v-for="(item, index) in article.articles_tags.values"  :key="item.ts_id">
                    <template v-if="item.tc_color && item.tc_background && item.tc_border">
                      <a-tag class="tag-align" :style="
                            'background:' + item.tc_background
                            + ';color:'+ item.tc_color
                            +';border-color:'+ item.tc_border">
                        {{ item.ts_name }}
                      </a-tag>
                    </template>
                    <template v-else>
                      <a-tag class="tag-align" color="default">
                        {{ item.ts_name }}
                      </a-tag>
                    </template>
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
                <a-button class="btn btn-primary btn-outline-light btn-sm" @click="onEditFinish()">儲存</a-button>
                <a-button class="btn btn-danger btn-outline-light btn-sm" style="margin-left: 10px" @click="onEditCancel()">取消</a-button>
              </div>
            </template>
            <template v-else>
              <DeleteBtn @confirm="onDelete(this.articleId)"/>
            </template>
        </div>
    </template>
  </template>

<script>
import { ref, reactive, onMounted } from 'vue'
import { mapActions, mapState, mapGetters } from 'vuex'
import { message } from 'ant-design-vue'
import { EditOutlined } from '@ant-design/icons-vue'
import { DeleteBtn } from '@/components/button'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import CategoriesTreeSelect from '@/components/tree-select/CategoriesTreeSelect.vue'
import TagsTreeSelect from '@/components/tree-select/TagsTreeSelect.vue'

export default {
  name: 'ArticlesContentView',
  components: {
    EditOutlined,
    DeleteBtn,
    CategoriesTreeSelect,
    TagsTreeSelect
  },
  computed: {
    articleId () {
      return this.$route.params.id
    },
    article () {
      return this.articleById(this.articleId)
    },
    ...mapGetters('ArticlesStore', ['articleById']),
    ...mapState('Theme', ['$theme']),
    ...mapState('Screen', ['$tablet', '$mobile'])
  },
  methods: {
    ...mapActions('ArticlesStore', ['fetch', 'update', 'deleteById']),
    ...mapActions('Views', ['updateArticlesView']),
    async onEditFinish () {
      try {
        message.loading({ content: 'Loading..', duration: 1 })
        await new Promise(resolve => setTimeout(resolve, 1000))
        await this.update({ id: this.formState.article.id, data: this.formState.article })
        await this.fetch()
        this.onEditCancel()
      } catch (error) {}
    },
    async onDelete (id) {
      try {
        message.loading({ content: 'Loading..', duration: 1 })
        await new Promise(resolve => setTimeout(resolve, 1000))
        await this.deleteById(id)
        await this.fetch()
        this.$router.push({ name: 'articles' })
      } catch (error) {}
    },
    onEdit () {
      this.editShow = !this.editShow
      this.formState.article = Object.assign({}, this.formState.article, this.article)
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
        placeholder: '尚無內容'
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
.article-title span{
  font-size: 24px;
  font-weight:bolder;
}
.article-content{
  padding-left: 12px;
  padding-right: 12px;
  padding-bottom: 24px;
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

.button-delete{
  color:rgb(231, 121, 121);
  padding-left: 12px;
}

</style>
