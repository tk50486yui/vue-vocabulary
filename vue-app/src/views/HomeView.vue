<template>
    <div>
      <a-back-top />
      <a-form
        ref="formRef"
        :model="formState"
        v-bind="layout"
        :validate-messages="validateMsg"
        name="wordform"
        @finish="onFinish">
        <a-form-item :name="['word', 'cate_id']">
          <CategoriesTreeSelect v-model="formState.word.cate_id" ref="treeSelect" @update:modelValue="handleTreeSelectChange"/>
        </a-form-item>
        <p></p>
        <a-form-item :name="['word', 'ws_name']" :rules="[{ required: true }]">
          <a-textarea  v-model:value="formState.word.ws_name"  placeholder="輸入單字" :auto-size="{ minRows: 3}" allow-clear />
        </a-form-item>
        <p></p>
        <a-form-item :name="['word', 'ws_pronunciation']" >
          <a-textarea v-model:value="formState.word.ws_pronunciation" placeholder="假名 / 發音" :auto-size="{ minRows: 2}" allow-clear />
        </a-form-item>
        <p></p>
        <a-form-item :name="['word', 'ws_definition']">
          <a-textarea v-model:value="formState.word.ws_definition" placeholder="中文定義" :auto-size="{ minRows: 3}" allow-clear />
        </a-form-item>
        <p></p>
        <a-form-item :name="['word', 'ws_description']">
          <a-textarea v-model:value="formState.word.ws_description" placeholder="註解說明.." :auto-size="{ minRows: 4}" allow-clear />
        </a-form-item>
        <a-form-item>
          <a-button type="primary" html-type="submit">Submit</a-button>
          <a-button style="margin-left: 10px" @click="resetForm" danger>Clear</a-button>
        </a-form-item>

      </a-form>
    </div>
</template>

<script>
import { reactive, ref } from 'vue'
import { mapActions } from 'vuex'
import { message } from 'ant-design-vue'
import CategoriesTreeSelect from '@/components/tree-select/CategoriesTreeSelect.vue'

const formState = reactive({
  word: {
    ws_name: '',
    ws_definition: '',
    ws_pronunciation: '',
    ws_description: '',
    ws_slogan: '',
    ws_is_important: '',
    ws_is_common: '',
    ws_forget_count: '',
    ws_display_order: '',
    cate_id: ''
  }
})

const validateMsg = {
  required: 'required'
}

const layout = {
  labelCol: {
    span: 8
  },
  wrapperCol: {
    span: 16
  }
}

export default {
  name: 'HomeView',
  components: {
    CategoriesTreeSelect
  },
  methods: {
    ...mapActions('WordsStore', {
      addWord: 'add'
    }),
    async onFinish (values) {
      try {
        console.log(values.word)
        message.loading({ content: 'Loading..', duration: 1 })
        await new Promise(resolve => setTimeout(resolve, 1000))
        await this.addWord(values.word)
        this.resetForm()
        window.scrollTo({ top: 100, behavior: 'smooth' })
      } catch (error) {
        console.log(error.response.status)
      }
    },
    handleTreeSelectChange (value) {
      this.formState.word.cate_id = typeof value !== 'undefined' ? value : ''
      console.log(this.formState.word.cate_id + ' TreeValueChange')
    },
    resetForm () {
      this.$refs.treeSelect.handleClear()
      this.formRef.resetFields()
    }
  },
  setup () {
    const formRef = ref()
    return {
      formRef,
      formState,
      validateMsg,
      layout
    }
  }
}
</script>
