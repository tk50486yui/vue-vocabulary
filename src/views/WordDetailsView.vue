<template>
  <template v-if="Ready && word">
    <span class="back-link-theme" :class="$theme">
      <router-link :to="{ name: 'wordsGrid' }" @click="setGridState()">
        返回
      </router-link>
      <span class="link-separator h5">
        <font-awesome-icon :icon="['fas', 'chevron-right']" size="xs" />
      </span>
      <span class="h4">
        {{ word.ws_name }}
      </span>
    </span>
    <div class="descriptions-theme" :class="$theme">
      <div class="d-flex justify-content-end">
        <EditOutlined class="button-edit" :class="$theme" @click="onEdit()" />
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
            <div class="input-theme" :class="$theme">
              <a-input v-model:value="formState.word.ws_name" allow-clear />
            </div>
          </template>
          <template v-else>
            <div class="d-flex justify-content-between align-items-center">
              <span>
                {{ word.ws_name }}
              </span>
              <span class="copy-icon">
                <a-typography-paragraph
                  :copyable="{ text: word.ws_name }"
                ></a-typography-paragraph>
              </span>
            </div>
          </template>
        </a-descriptions-item>
        <a-descriptions-item label="假名 / 發音">
          <template v-if="editShow">
            <div class="input-theme" :class="$theme">
              <a-input
                v-model:value="formState.word.ws_pronunciation"
                allow-clear
              />
            </div>
          </template>
          <template v-else>
            <template
              v-if="
                word.ws_pronunciation == null || word.ws_pronunciation == ''
              "
            >
              {{ word.ws_pronunciation }}
            </template>
            <template v-else>
              <div class="d-flex justify-content-between align-items-center">
                <span>
                  {{ word.ws_pronunciation }}
                </span>
                <span class="copy-icon">
                  <a-typography-paragraph
                    :copyable="{ text: word.ws_pronunciation }"
                  ></a-typography-paragraph>
                </span>
              </div>
            </template>
          </template>
        </a-descriptions-item>
        <a-descriptions-item label="中文定義">
          <template v-if="editShow">
            <div class="input-theme" :class="$theme">
              <a-input
                v-model:value="formState.word.ws_definition"
                allow-clear
              />
            </div>
          </template>
          <template v-else>
            {{ word.ws_definition }}
          </template>
        </a-descriptions-item>
        <a-descriptions-item label="主題分類">
          <template v-if="editShow">
            <CategoriesTreeSelect
              size="small"
              ref="CategoriesTreeSelect"
              placeholder="選擇分類"
              :dropdownMatchSelectWidth="false"
              style="width: 100%"
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
        <a-descriptions-item label="印象例句">
          <template v-if="editShow">
            <div class="input-theme" :class="$theme">
              <a-input v-model:value="formState.word.ws_slogan" allow-clear />
            </div>
          </template>
          <template v-else>
            {{ word.ws_slogan }}
          </template>
        </a-descriptions-item>
        <a-descriptions-item label="常用 / 重要性">
          <span class="icon-theme" :class="$theme">
            <template v-if="word.ws_is_common">
              <span class="icon-star">
                <a @click="onUpdateCommon(word.id, word)">
                  <StarFilled />
                </a>
              </span>
            </template>
            <template v-else>
              <span class="icon-star-false">
                <a @click="onUpdateCommon(word.id, word)">
                  <StarFilled />
                </a>
              </span>
            </template>
            <template v-if="word.ws_is_important">
              <span class="icon-heart">
                <a @click="onUpdateImportant(word.id, word)">
                  <HeartFilled />
                </a>
              </span>
            </template>
            <template v-else>
              <span class="icon-heart-false">
                <a @click="onUpdateImportant(word.id, word)">
                  <HeartFilled />
                </a>
              </span>
            </template>
          </span>
        </a-descriptions-item>
        <a-descriptions-item label="例句說明">
          <template v-if="editShow">
            <div class="article-editor" :class="$theme">
              <ckeditor
                v-model="ws_description"
                :editor="editor"
                :config="wordEditor.Config"
              />
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
              :field-names="{
                children: 'children',
                label: 'ts_name',
                value: 'id',
                key: 'id'
              }"
              multiple
            />
          </template>
          <template v-else>
            <template
              v-for="(item, index) in word.words_tags.values"
              :key="item.ts_id"
            >
              <template
                v-if="item.tc_color && item.tc_background && item.tc_border"
              >
                <a-tag
                  class="tag-align"
                  :style="
                    'background:' +
                    item.tc_background +
                    ';color:' +
                    item.tc_color +
                    ';border-color:' +
                    item.tc_border
                  "
                >
                  {{ item.ts_name }}
                </a-tag>
              </template>
              <template v-else>
                <a-tag class="tag-align" color="default" style="color: #fff">
                  {{ item.ts_name }}
                </a-tag>
              </template>
              <template
                v-if="index != word.words_tags.values.length && index / 5 == 1"
              >
                <br />
              </template>
            </template>
          </template>
        </a-descriptions-item>
      </a-descriptions>
      <p></p>
      <template v-if="editShow">
        <a-button
          class="btn btn-primary btn-outline-light btn-sm"
          @click="onEditFinish()"
          >儲存</a-button
        >
        <a-button
          class="btn btn-danger btn-outline-light btn-sm"
          style="margin-left: 10px"
          @click="onEditCancel()"
          >取消</a-button
        >
      </template>
      <template v-else>
        <DeleteBtn @confirm="onDelete(wordId)" />
      </template>
    </div>
    <a-back-top />
  </template>
</template>

<script lang="ts">
import { ref, reactive, onMounted, defineComponent } from 'vue'
import { mapActions, mapState, mapGetters } from 'vuex'
import { message } from 'ant-design-vue'
import { DeleteBtn } from '@/components/button'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import CategoriesTreeSelect from '@/components/tree-select/CategoriesTreeSelect.vue'
import TagsTreeSelect from '@/components/tree-select/TagsTreeSelect.vue'
import { Word, WordForm } from '@/interfaces/Words'

export default defineComponent({
  name: 'WordDetailsView',
  components: {
    DeleteBtn,
    CategoriesTreeSelect,
    TagsTreeSelect
  },
  computed: {
    wordId(): number {
      return Number(this.$route.params.id)
    },
    word() {
      return this.wordById(this.wordId) || null
    },
    ws_description: {
      get() {
        return this.formState.word.ws_description || ''
      },
      set(value: string) {
        this.formState.word.ws_description = value
      }
    },
    ...mapGetters('WordsStore', ['wordById']),
    ...mapState('Views', ['$WordsGrid']),
    ...mapState('Theme', ['$theme']),
    ...mapState('Screen', ['$tablet', '$mobile'])
  },
  methods: {
    ...mapActions('WordsStore', [
      'fetch',
      'update',
      'updateCommon',
      'updateImportant',
      'deleteById'
    ]),
    ...mapActions('Views', ['updateWordsGrid']),
    async onEditFinish(): Promise<void> {
      try {
        message.loading({ content: 'Loading..', duration: 1 })
        await new Promise((resolve) => setTimeout(resolve, 1000))
        await this.update({
          id: this.word.id,
          data: this.formState.word
        })
        this.onEditCancel()
      } catch (error) {
        //
      }
    },
    onEdit(): void {
      this.editShow = !this.editShow
      this.formState.word = Object.assign({}, this.formState.word, this.word)
    },
    onEditCancel(): void {
      if (this.editShow) {
        this.editShow = false
      }
      if (!this.editShow) {
        this.$nextTick(() => {
          window.scrollTo({ top: 160, behavior: 'auto' })
        })
      }
    },
    async onUpdateCommon(id: number, data: Word): Promise<void> {
      try {
        data.ws_is_common = !data.ws_is_common
        await this.updateCommon({ id: id, data: data })
      } catch (error) {
        //
      }
    },
    async onUpdateImportant(id: number, data: Word): Promise<void> {
      try {
        data.ws_is_important = !data.ws_is_important
        await this.updateImportant({ id: id, data: data })
      } catch (error) {
        //
      }
    },
    async onDelete(id: number): Promise<void> {
      try {
        message.loading({ content: 'Loading..', duration: 1 })
        await new Promise((resolve) => setTimeout(resolve, 1000))
        await this.deleteById(id)
        this.$router.push({ name: 'wordsGrid' })
      } catch (error) {
        //
      }
    },
    handleCategoriesSelectChange(value: number): void {
      this.formState.word.cate_id = typeof value !== 'undefined' ? value : null
    },
    handleTagsSelectChange(value: number[]): void {
      this.formState.word.words_tags.array =
        typeof value !== 'undefined' ? value : []
    },
    changeDescriptionsLayout(isScreenSmall: boolean): void {
      if (isScreenSmall) {
        this.descriptionsLayout = 'vertical'
      } else {
        this.descriptionsLayout = 'horizontal'
      }
    },
    setGridState(): void {
      this.updateWordsGrid({ variable: 'jumpPage', data: true })
      this.updateWordsGrid({ variable: 'jumpScroll', data: true })
    }
  },
  async created() {
    try {
      window.scrollTo({ top: 120, behavior: 'instant' })
      await this.fetch()
      this.Ready = true
    } catch (error) {
      //
    }
  },
  watch: {
    $mobile(val: boolean) {
      this.changeDescriptionsLayout(val)
    },
    $tablet(val: boolean) {
      this.changeDescriptionsLayout(val)
    }
  },
  setup() {
    const Ready = ref(false)
    const descriptionsLayout = ref('horizontal')
    const editShow = ref(false)
    const formRef = ref()
    const formState = reactive({
      word: {} as WordForm
    })

    onMounted(() => {
      formState.word = { ...formState.word }
    })

    const wordEditor = reactive({
      Config: {
        autoGrow: true,
        placeholder: '請為單字添加註釋或說明...'
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
})
</script>

<style lang="scss" scoped>
@import '@/assets/scss/main.scss';

.table-container {
  width: 100%;
  overflow-x: auto;
}

.button-edit {
  &.dark {
    color: var(--edit-icon);
  }

  &.light {
    color: var(--edit-icon);
  }
}

.copy-icon {
  padding-top: 5px;
}

.icon-star {
  padding-left: 2px;
  padding-right: 8px;
}

.icon-star-false {
  padding-left: 2px;
  padding-right: 8px;
}

.descriptions-theme {
  :deep(.ant-descriptions-item-content) {
    width: 80%;
  }

  :deep(.ant-descriptions-bordered .ant-descriptions-item-label) {
    width: 20%;
  }
}
</style>
