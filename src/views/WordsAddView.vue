<template>
  <template v-if="Ready">
    <div class="section-title">
      <h4>新增單字</h4>
    </div>
    <p></p>
    <a-form
      ref="formRef"
      :model="formState"
      v-bind="layout"
      :validate-messages="validateMsg"
      name="wordform"
      @finish="onFinish"
    >
      <a-form-item :name="['word', 'cate_id']">
        <CategoriesTreeSelect
          placeholder="詞語主題分類"
          size="large"
          ref="CategoriesTreeSelect"
          v-model:value="formState.word.cate_id"
          @change="handleCategoriesSelectChange"
        />
      </a-form-item>
      <p></p>
      <a-form-item
        class="input-theme"
        :class="$theme"
        :name="['word', 'ws_name']"
        :rules="[{ required: true }]"
      >
        <a-textarea
          v-model:value="formState.word.ws_name"
          placeholder="輸入單字"
          :auto-size="{ minRows: 3 }"
          allow-clear
        />
      </a-form-item>
      <p></p>
      <a-form-item
        class="input-theme"
        :class="$theme"
        :name="['word', 'ws_pronunciation']"
      >
        <a-textarea
          v-model:value="formState.word.ws_pronunciation"
          placeholder="假名 / 發音"
          :auto-size="{ minRows: 2 }"
          allow-clear
        />
      </a-form-item>
      <p></p>
      <a-form-item
        class="input-theme"
        :class="$theme"
        :name="['word', 'ws_definition']"
      >
        <a-textarea
          v-model:value="formState.word.ws_definition"
          placeholder="中文定義"
          :auto-size="{ minRows: 3 }"
          allow-clear
        />
      </a-form-item>
      <p></p>
      <a-form-item
        class="input-theme"
        :class="$theme"
        :name="['word', 'ws_slogan']"
      >
        <a-textarea
          v-model:value="formState.word.ws_slogan"
          placeholder="標誌性短句"
          :auto-size="{ minRows: 2 }"
          allow-clear
        />
      </a-form-item>
      <p></p>
      <a-form-item>
        <TagsTreeSelect
          placeholder="添加標籤"
          size="large"
          ref="TagsTreeSelect"
          multiple
          v-model:value="formState.word.words_tags.array"
          @change="handleTagsSelectChange"
          :field-names="{
            children: 'children',
            label: 'ts_name',
            value: 'id',
            key: 'id'
          }"
        />
      </a-form-item>
      <p></p>
      <a-form-item>
        <a-button
          class="btn btn-primary btn-outline-light btn-sm"
          html-type="submit"
          >儲存</a-button
        >
        <a-button
          class="btn btn-danger btn-outline-light btn-sm float-end"
          @click="resetForm"
          >重置</a-button
        >
      </a-form-item>
    </a-form>
  </template>
</template>

<script lang="ts">
import { reactive, ref, onMounted, defineComponent } from 'vue'
import { mapActions, mapState } from 'vuex'
import { message } from 'ant-design-vue'
import CategoriesTreeSelect from '@/components/tree-select/CategoriesTreeSelect.vue'
import TagsTreeSelect from '@/components/tree-select/TagsTreeSelect.vue'
import { WordForm } from '@/interfaces/Words.ts'

export default defineComponent({
  name: 'WordsAddView',
  components: {
    CategoriesTreeSelect,
    TagsTreeSelect
  },
  computed: {
    ...mapState('Theme', ['$theme'])
  },
  methods: {
    ...mapActions('WordsStore', ['add']),
    async onFinish() {
      try {
        message.loading({ content: 'Loading..', duration: 1 })
        await new Promise((resolve) => setTimeout(resolve, 1000))
        await this.add(this.formState.word)
        this.resetForm()
        window.scrollTo({ top: 100, behavior: 'smooth' })
      } catch (error) {
        //
      }
    },
    handleCategoriesSelectChange(value: number) {
      this.formState.word.cate_id = typeof value !== 'undefined' ? value : null
    },
    handleTagsSelectChange(value: number[]) {
      this.formState.word.words_tags.array =
        typeof value !== 'undefined' ? value : []
    },
    resetForm() {
      this.formState.word.cate_id = null
      this.formState.word.words_tags.array = []
      this.formRef.resetFields()
    }
  },
  setup() {
    const Ready = ref(false)
    const formRef = ref()
    const formState = reactive({
      word: {} as WordForm
    })

    onMounted(() => {
      formState.word = {
        ...formState.word,
        words_tags: { array: [], values: [] }
      }
      Ready.value = true
    })

    const validateMsg = {
      required: 'required'
    }

    const layout = {
      labelCol: {
        span: 8
      },
      wrapperCol: {
        span: 24
      }
    }

    return {
      Ready,
      formRef,
      formState,
      validateMsg,
      layout
    }
  }
})
</script>
<style lang="scss" scoped>
@import '@/assets/scss/main.scss';

.section-title {
  margin-bottom: 8px;
}

.section-title h4:after {
  position: absolute;
  left: 0;
  bottom: -4px;
  height: 2px;
  width: 70px;
  background: #17b0f7;
  content: '';
}
</style>
