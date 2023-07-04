<template>
  <template v-if="Ready">
      <a-back-top />
      <div class="descriptions-theme" :class="this.$theme">
          <h5><router-link :to="{ name: 'wordsGrid' }" @click="setGridState()"> Back </router-link>
            {{ word.ws_name }}
          </h5>
          <div class="d-flex justify-content-end">
            <EditOutlined class="button-edit " :class="this.$theme" @click="onEdit()"/>
          </div>
          <p></p>
          <a-descriptions
              bordered
              :column="{ xxl: 1, xl: 1, lg: 1, md: 1, sm: 1, xs: 1 }"
              :layout="descriptionsLayout"
              class="table-container"
          >
            <a-descriptions-item label="單字名稱">
              <template v-if="editShow">
                <div class="input-theme" :class="this.$theme">
                <a-input
                  v-model:value="formState.word.ws_name"
                  allow-clear />
                </div>
              </template>
              <template v-else>
                <div class="d-flex justify-content-between align-items-center">
                  <span>
                    {{ word.ws_name }}
                  </span>
                  <span class="copy-icon">
                    <a-typography-paragraph :copyable="{ text: word.ws_name }"></a-typography-paragraph>
                  </span>
                </div>
              </template>
            </a-descriptions-item>
            <a-descriptions-item label="假名 / 發音">
              <template v-if="editShow">
                <div class="input-theme" :class="this.$theme">
                <a-input
                  v-model:value="formState.word.ws_pronunciation"
                  allow-clear />
                </div>
              </template>
              <template v-else>
                <template v-if="word.ws_pronunciation == null || word.ws_pronunciation == ''">
                  {{ word.ws_pronunciation }}
                </template>
                <template v-else>
                  <div class="d-flex justify-content-between align-items-center">
                    <span>
                      {{ word.ws_pronunciation }}
                    </span>
                    <span class="copy-icon">
                      <a-typography-paragraph :copyable="{ text: word.ws_pronunciation }"></a-typography-paragraph>
                    </span>
                  </div>
                </template>
              </template>

            </a-descriptions-item>
            <a-descriptions-item label="中文定義">
              <template v-if="editShow">
                <div class="input-theme" :class="this.$theme">
                <a-input
                  v-model:value="formState.word.ws_definition"
                  allow-clear />
                </div>
              </template>
              <template v-else>
                {{ word.ws_definition }}
              </template>
            </a-descriptions-item>
            <a-descriptions-item label="主題分類">
              <template v-if="editShow">
                <CategoriesTreeSelect size="small" ref="CategoriesTreeSelect"
                  placeholder="選擇分類"
                  :dropdownMatchSelectWidth="false" style="width: 100%"
                  v-model:value="formState.word.cate_id"
                  :defaultValue="word.cate_id"
                  :treeDefaultExpandedKeys="[word.cate_id]"
                  @change="handleCategoriesSelectChange"
                 />
              </template>
              <template v-else>
                {{ word.cate_name }}
              </template>
            </a-descriptions-item>
            <a-descriptions-item label="簡易註解">
              <template v-if="editShow">
                <div class="input-theme" :class="this.$theme">
                <a-input
                  v-model:value="formState.word.ws_slogan"
                  allow-clear />
                </div>
              </template>
              <template v-else>
                {{ word.ws_slogan }}
              </template>
            </a-descriptions-item>
            <a-descriptions-item label="例句說明">
              <template v-if="editShow">
                <div class="article-editor" :class="this.$theme">
                  <ckeditor v-model="formState.word.ws_description" :editor="editor" :config="wordEditor.Config" />
                </div>
              </template>
              <template v-else>
                <div v-html="word.ws_description"></div>
              </template>
            </a-descriptions-item>
            <a-descriptions-item label="標籤">
              <template v-if="editShow">
                <TagsTreeSelect
                    size="large"
                    ref="TagsTreeSelect"
                    placeholder="添加標籤"
                    style="width: 100%"
                    v-model:value="formState.word.words_tags.array"
                    :treeDefaultExpandedKeys="formState.word.words_tags.array"
                    @change="handleTagsSelectChange"
                    multiple
                    />
              </template>
              <template v-else>
                <template v-for="(item, index) in word.words_tags.values"  :key="item.ts_id">
                  <a-tag color="pink"> {{ item.ts_name }} </a-tag>
                  <template v-if="index != word.words_tags.values.length && (index/5) == 1">
                    <br>
                  </template>
                </template>
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
import CategoriesTreeSelect from '@/components/tree-select/CategoriesTreeSelect.vue'
import TagsTreeSelect from '@/components/tree-select/TagsTreeSelect.vue'

export default {
  name: 'WordDetailsView',
  components: {
    EditOutlined,
    CategoriesTreeSelect,
    TagsTreeSelect
  },
  computed: {
    ...mapGetters('WordsStore', ['wordById']),
    ...mapState('Views', ['$WordsGrid']),
    ...mapState('Theme', ['$theme']),
    ...mapState('Screen', ['$mobile']),
    ...mapState('Screen', ['$tablet']),
    wordId () {
      return this.$route.params.id
    },
    word () {
      return this.wordById(this.wordId)
    }
  },
  watch: {
    $mobile: function (val) {
      this.changeDescriptionsLayout(val)
    },
    $tablet: function (val) {
      this.changeDescriptionsLayout(val)
    }
  },
  methods: {
    ...mapActions('WordsStore', ['fetch']),
    ...mapActions('WordsStore', {
      updateWord: 'update'
    }),
    ...mapActions('Views', ['updateWordsGrid']),
    onEdit () {
      this.editShow = !this.editShow
      this.formState.word = Object.assign({}, this.formState.word, this.word)
    },
    async onEditFinish () {
      try {
        message.loading({ content: 'Loading..', duration: 1 })
        await new Promise(resolve => setTimeout(resolve, 1000))
        await this.updateWord({ id: this.formState.word.id, data: this.formState.word })
        await this.fetch()
        this.editDataSource = this.wordsArray
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
      this.formState.word.cate_id = typeof value !== 'undefined' ? value : null
    },
    handleTagsSelectChange (value) {
      this.formState.word.words_tags.array = typeof value !== 'undefined' ? value : []
    },
    changeDescriptionsLayout (isScreenSmall) {
      if (isScreenSmall) {
        this.descriptionsLayout = 'vertical'
      } else {
        this.descriptionsLayout = 'horizontal'
      }
    },
    setGridState () {
      this.updateWordsGrid({ variable: 'jumpPage', data: true })
      this.updateWordsGrid({ variable: 'jumpScroll', data: true })
    }
  },
  async created () {
    try {
      window.scrollTo({ top: 120, behavior: 'auto' })
      await this.fetch()
      this.Ready = true
    } catch (error) {}
  },
  setup () {
    const Ready = ref(false)
    const descriptionsLayout = ref('horizontal')
    const editShow = ref(false)
    const formRef = ref()
    const formState = reactive({
      word: {}
    })
    const { wordForm } = mapGetters('WordsStore', ['wordForm'])

    onMounted(() => {
      formState.word = { ...wordForm }
    })

    const wordEditor = reactive({
      Config: {
        autoGrow: true,
        placeholder: '請輸入說明例句...'
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
      wordEditor,
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

.copy-icon{
  padding-top: 5px;
}
.descriptions-theme{
  :deep(.ant-descriptions-item-content){
    width:80%;
  }
  :deep(.ant-descriptions-bordered .ant-descriptions-item-label){
    width:20%;
  }
}

</style>
