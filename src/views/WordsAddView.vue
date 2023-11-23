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
      <a-form-item class="input-theme" :class="$theme" :name="['word', 'ws_pronunciation']">
        <a-textarea
          v-model:value="formState.word.ws_pronunciation"
          placeholder="假名 / 發音"
          :auto-size="{ minRows: 2 }"
          allow-clear
        />
      </a-form-item>
      <p></p>
      <a-form-item class="input-theme" :class="$theme" :name="['word', 'ws_definition']">
        <a-textarea
          v-model:value="formState.word.ws_definition"
          placeholder="中文定義"
          :auto-size="{ minRows: 3 }"
          allow-clear
        />
      </a-form-item>
      <p></p>
      <a-form-item class="input-theme" :class="$theme" :name="['word', 'ws_slogan']">
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
        <a-button class="btn btn-primary btn-outline-light btn-sm" html-type="submit"
          >儲存</a-button
        >
        <a-button class="btn btn-danger btn-outline-light btn-sm float-end" @click="resetForm"
          >重置</a-button
        >
      </a-form-item>
    </a-form>
  </template>
</template>
<script lang="ts" setup>
import { ref, reactive, toRefs, onMounted, onBeforeMount } from 'vue'
import { useStore } from 'vuex'
import { message } from 'ant-design-vue'
import CategoriesTreeSelect from '@/components/tree-select/CategoriesTreeSelect.vue'
import TagsTreeSelect from '@/components/tree-select/TagsTreeSelect.vue'
import { WordForm } from '@/interfaces/Words'

const store = useStore()
const { $theme } = toRefs(store.state.Theme)

const Ready = ref<boolean>(false)
const formRef = ref()
const formState = reactive({
  word: {} as WordForm
})

const onFinish = async (): Promise<void> => {
  try {
    message.loading({ content: 'Loading..', duration: 1 })
    await new Promise((resolve) => setTimeout(resolve, 1000))
    await store.dispatch('WordsStore/add', formState.word)
    resetForm()
  } catch (error) {
    //
  }
}

const handleCategoriesSelectChange = (value: number): void => {
  formState.word.cate_id = typeof value !== 'undefined' ? value : null
}

const handleTagsSelectChange = (value: number[]): void => {
  formState.word.words_tags.array = typeof value !== 'undefined' ? value : []
}

const resetForm = (): void => {
  formState.word.cate_id = null
  formState.word.words_tags.array = []
  formRef.value.resetFields()
}

onBeforeMount(() => {
  formState.word = {
    ...formState.word,
    words_tags: { array: [], values: [] }
  }
})

onMounted(() => {
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
