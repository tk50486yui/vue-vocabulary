<template>
  <a-form
    ref="formRef"
    :model="formState"
    :validate-messages="validateMsg"
    name="articlesform"
    @finish="onFinish"
  >
    <a-form-item :name="['article', 'cate_id']">
      <CategoriesTreeSelect
        ref="categoriesTreeSelectRef"
        placeholder="文章主題分類"
        size="large"
        v-model:value="formState.article.cate_id"
      />
    </a-form-item>
    <p></p>
    <a-form-item
      class="input-theme"
      :class="$theme"
      :name="['article', 'arti_title']"
      :rules="[{ required: true }]"
    >
      <a-input v-model:value="formState.article.arti_title" placeholder="輸入標題" allow-clear />
    </a-form-item>
    <p></p>
    <a-form-item :name="['article', 'arti_content']">
      <div class="article-editor" :class="$theme">
        <ckeditor
          v-model="formState.article.arti_content"
          :editor="ClassicEditor"
          :config="articleEditor.Config"
        />
      </div>
    </a-form-item>
    <p></p>
    <a-form-item>
      <TagsTreeSelect
        ref="tagsTreeSelectRef"
        placeholder="添加標籤..."
        size="large"
        multiple
        v-model:value="formState.article.articles_tags.array"
      />
    </a-form-item>
    <p></p>
    <a-form-item>
      <a-button class="btn btn-primary btn-outline-light btn-sm" html-type="submit">儲存</a-button>
    </a-form-item>
  </a-form>
</template>
<script setup lang="ts">
import { ref, reactive, toRefs, onBeforeMount } from 'vue'
import { useStore } from 'vuex'
import { message } from 'ant-design-vue'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import { ArticleForm } from '@/interfaces/Articles'
import CategoriesTreeSelect from '@/components/tree-select/CategoriesTreeSelect.vue'
import TagsTreeSelect from '@/components/tree-select/TagsTreeSelect.vue'

const store = useStore()
const { $theme } = toRefs(store.state.Theme)

const categoriesTreeSelectRef = ref()
const tagsTreeSelectRef = ref()
const formRef = ref()
const formState = reactive({
  article: {} as ArticleForm
})

const onFinish = async (): Promise<void> => {
  try {
    message.loading({ content: 'Loading..', duration: 1 })
    await new Promise((resolve) => setTimeout(resolve, 1000))
    await store.dispatch('ArticlesStore/add', formState.article)
    resetForm()
  } catch (e) {
    //
  }
}

const resetForm = (): void => {
  categoriesTreeSelectRef.value.clearValue()
  tagsTreeSelectRef.value.clearValue('multiple')
  formRef.value.resetFields()
}

onBeforeMount(() => {
  formState.article = { ...formState.article, articles_tags: { array: [], values: [] } }
})

const articleEditor = reactive({
  id: '',
  arti_title: '',
  arti_content: '',
  Config: {
    autoGrow: true,
    placeholder: '請輸入文章內容...'
  }
})

const validateMsg = {
  required: ''
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/main.scss';
</style>
